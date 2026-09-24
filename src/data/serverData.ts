/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StepItem, AuditFinding, SoftwareTool, ServerConfig } from '../types';

export const DEFAULT_CONFIG: ServerConfig = {
  username: 'adminuser',
  sshPort: 22,
  panelPort: 2053,
  subscriptionPort: 2096,
  serverIp: 'YOUR_SERVER_IP',
  realitySni: 'dl.google.com',
};

export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: 'audit-1',
    title: 'Критически поврежденный URL репозитория 3X-UI',
    titleEn: 'Severely Broken 3X-UI Repository URL',
    severity: 'critical',
    category: 'Скрипты и ссылки',
    originalSnippet: 'bash <(curl -Ls https://githubusercontent.com)',
    fixedSnippet: 'bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)',
    problemDescription:
      'В исходном скрипте URL оборван на домене githubusercontent.com без указания репозитория автора mhsanaei и файла install.sh. При запуске bash падает с ошибкой 404/SSL или возвращает пустой вывод.',
    problemDescriptionEn:
      'The original script URL was truncated at githubusercontent.com without the repository path or install.sh. Invoking bash resulted in 404/SSL errors or empty output.',
    whyItMatters:
      'Панель 3X-UI вообще не установится, процесс развертывания сервера прервется.',
    whyItMattersEn:
      'The 3X-UI panel will not install at all, halting the entire server deployment.',
    sources2026:
      'Official GitHub mhsanaei/3x-ui (active master branch) and upstream releases.',
  },
  {
    id: 'audit-2',
    title: 'Высокий риск блокировки доступа по SSH (Lockout)',
    titleEn: 'Severe Risk of Permanent SSH Lockout',
    severity: 'critical',
    category: 'Безопасность',
    originalSnippet: `nano /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
systemctl restart ssh`,
    fixedSnippet: `# ВНИМАНИЕ: Не закрывайте текущую root-консоль!
sshd -t
sudo systemctl restart ssh || sudo systemctl restart sshd
ssh -i ~/.ssh/id_ed25519 {username}@{serverIp} -p {sshPort}`,
    problemDescription:
      'Отключение паролей и root-доступа сразу перезапуском службы без предварительного теста входа во второй сессии. Если в SSH-ключе пользователя допущена опечатка или неверные права, доступ к серверу будет потерян навсегда.',
    problemDescriptionEn:
      'Disabling password and root access without prior login testing in a secondary session. Any typo or improper permissions on ~/.ssh causes total loss of SSH access.',
    whyItMatters:
      'Главная причина потери контроля над VPS у начинающих и даже опытных администраторов.',
    whyItMattersEn:
      'The #1 cause of losing access to VPS instances among administrators.',
    sources2026:
      'DevOps security standards, CIS Linux Benchmark, OpenSSH community best practices.',
  },
  {
    id: 'audit-3',
    title: 'Fail2ban: устаревший logpath auth.log вместо backend = systemd',
    titleEn: 'Fail2ban: Legacy auth.log logpath instead of backend = systemd',
    severity: 'high',
    category: 'Безопасность',
    originalSnippet: `nano /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3`,
    fixedSnippet: `sudo tee /etc/fail2ban/jail.d/custom.local > /dev/null << 'EOF'
[sshd]
enabled = true
backend = systemd
port = {sshPort}
maxretry = 3
findtime = 10m
bantime = 1d
EOF`,
    problemDescription:
      'В Ubuntu 22.04 и 24.04 LTS классический rsyslog часто не устанавливается по умолчанию, и файл /var/log/auth.log просто отсутствует. При logpath = /var/log/auth.log Fail2ban выдает ошибку и служба аварийно отключается.',
    problemDescriptionEn:
      'In Ubuntu 22.04/24.04 LTS, rsyslog is not installed by default and /var/log/auth.log is missing. Fail2ban fails to start with "Failed to initialize any backend".',
    whyItMatters:
      'Сервер остается беззащитным перед брутфорсом паролей на порту SSH.',
    whyItMattersEn:
      'Leaves the server completely exposed to automated SSH brute-force botnets.',
    sources2026:
      'Fail2ban 1.0+ documentation, Ubuntu Launchpad bug tracker, journald migration guides.',
  },
  {
    id: 'audit-4',
    title: 'Фаервол UFW: блокировка UDP на порту 443 для Reality',
    titleEn: 'UFW Firewall: UDP Blocking on Port 443 for Reality',
    severity: 'high',
    category: 'Сетевой стек',
    originalSnippet: 'ufw allow 443/tcp comment \'Web HTTPS / VPN Reality\'',
    fixedSnippet: 'sudo ufw allow 443 comment \'Web HTTPS / VPN Reality (TCP+UDP)\'',
    problemDescription:
      'Указание /tcp жестко блокирует входящие UDP-пакеты на порту 443. Современные клиенты Reality, HTTP/3, QUIC для стабильности соединения используют параллельные запросы. Блокировка UDP вызывает подвисания сессий.',
    problemDescriptionEn:
      'Restricting port 443 to /tcp drops UDP packets, breaking HTTP/3, QUIC, and mobile roaming fallbacks.',
    whyItMatters:
      'Частые обрывы VPN на смартфонах при переключении между сотовыми вышками и Wi-Fi.',
    whyItMattersEn:
      'Frequent VPN disconnections on mobile devices during LTE/Wi-Fi handover.',
    sources2026:
      'V2Ray/Xray community forums, non-telegram networking analysis.',
  },
];

export const STEP_GUIDES: StepItem[] = [
  {
    id: 1,
    slug: 'user-ssh',
    title: 'Создание пользователя и сверхбезопасный SSH',
    titleEn: 'User Creation & Hardened SSH Access',
    subtitle: 'Защита от взлома по словарю, вход строго по Ed25519 ключам без паролей',
    subtitleEn: 'Dictionary brute-force immunity, key-only Ed25519 login with passwords disabled',
    badge: 'Основа безопасности',
    badgeEn: 'Security Core',
    iconName: 'ShieldAlert',
    warning:
      'ВНИМАНИЕ: Не закрывайте окно root-терминала, пока успешно не подключитесь под новым пользователем во втором независимом окне!',
    warningEn:
      'CRITICAL: Do not close your active root session until you have successfully tested logging in with your new user in a secondary terminal window!',
    tips: [
      'Используйте ключи Ed25519 (ssh-keygen -t ed25519) вместо устаревших RSA 2048.',
      'Команда sshd -t проверяет конфигурацию перед перезапуском, спасая от синтаксических ошибок.',
    ],
    tipsEn: [
      'Use modern Ed25519 elliptic keys (ssh-keygen -t ed25519) instead of legacy RSA 2048.',
      'The "sshd -t" command validates syntax before reloading, protecting against syntax-induced lockout.',
    ],
    commands: [
      {
        id: 'step1-1',
        command: 'apt update && apt upgrade -y',
        description: 'Обновление списков пакетов и всех системных библиотек операционной системы до последних версий.',
        descriptionEn: 'Update system package indexes and upgrade all libraries to latest releases.',
      },
      {
        id: 'step1-2',
        command: 'adduser {username}',
        description: 'Создание нового непривилегированного пользователя. Задайте надежный пароль (потребуется для sudo).',
        descriptionEn: 'Create a non-root user. Enter a secure password (required for sudo elevation).',
      },
      {
        id: 'step1-3',
        command: 'usermod -aG sudo {username} && echo "{username} ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/99-{username} && sudo chmod 440 /etc/sudoers.d/99-{username}',
        description: 'Добавление пользователя в группу sudo и настройка прав без риска блокировки из-за отсутствия пароля.',
        descriptionEn: 'Add user to sudo group and grant passwordless sudo to prevent lockout.',
      },
      {
        id: 'step1-4',
        command: `if [ ! -s ~/.ssh/authorized_keys ]; then echo "❌ Ошибка: нет ключа ~/.ssh/authorized_keys!"; exit 1; fi && mkdir -p /home/{username}/.ssh && cp ~/.ssh/authorized_keys /home/{username}/.ssh/ && chown -R {username}:{username} /home/{username}/.ssh && chmod 700 /home/{username}/.ssh && chmod 600 /home/{username}/.ssh/authorized_keys`,
        description: 'Проверка наличия ключа root и его безопасное копирование новому пользователю с правами 700/600.',
        descriptionEn: 'Verify root authorized_keys and safely copy to new user home with 700/600 permissions.',
      },
      {
        id: 'step1-5',
        command: `sudo tee /etc/ssh/sshd_config.d/99-hardened.conf > /dev/null << 'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
EOF`,
        description: 'Создание отдельного модульного файла защищенной конфигурации SSH (стандарт Ubuntu 22.04/24.04).',
        descriptionEn: 'Create modular hardened SSH configuration file (Ubuntu standard).',
        filePath: '/etc/ssh/sshd_config.d/99-hardened.conf',
      },
      {
        id: 'step1-6',
        command: 'sshd -t && sudo systemctl restart ssh',
        description: 'Проверка синтаксиса конфигурационного файла SSH без прерывания текущей сессии и перезапуск демона.',
        descriptionEn: 'Test SSH config syntax safely and reload the SSH daemon without closing active sessions.',
      },
      {
        id: 'step1-7',
        command: 'apt install -y unattended-upgrades apt-listchanges && sudo dpkg-reconfigure -plow unattended-upgrades',
        description: 'Включение автоматической установки критических заплаток безопасности ядра и дистрибутива.',
        descriptionEn: 'Enable automatic background installation of critical security patches.',
      },
    ],
  },
  {
    id: 2,
    slug: 'network-bbr',
    title: 'Тюнинг ядра Linux, TCP BBR и системные лимиты',
    titleEn: 'Linux Kernel Tuning, TCP BBR & System Limits',
    subtitle: 'Увеличение пропускной способности VPN-туннеля до 35% и снятие ограничений на сокеты',
    subtitleEn: 'Increase VPN throughput up to 35% and remove socket connection bottlenecks',
    badge: 'Сетевой стек',
    badgeEn: 'Network Stack',
    iconName: 'Zap',
    tips: [
      'Алгоритм Google BBR рассчитывает узкие места канала без ожидания потерь пакетов, уменьшая пинг.',
      'nofile 65535 предотвращает крах ядра Xray при одновременном обращении 100+ сокетов.',
    ],
    tipsEn: [
      'Google BBR estimates real-time link capacity without waiting for packet drops, cutting latency.',
      'nofile 65535 prevents Xray core crashes under concurrent traffic spikes.',
    ],
    commands: [
      {
        id: 'step2-1',
        command: `sudo tee -a /etc/sysctl.d/99-network-tuning.conf > /dev/null << 'EOF'
vm.swappiness = 10
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.core.somaxconn = 8192
net.ipv4.tcp_max_syn_backlog = 8192
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
EOF`,
        description: 'Запись оптимизированных сетевых параметров ядра в системный каталог sysctl.d.',
        descriptionEn: 'Write tuned kernel network buffers and BBR congestion control into sysctl.d.',
        filePath: '/etc/sysctl.d/99-network-tuning.conf',
      },
      {
        id: 'step2-2',
        command: 'sudo sysctl --system',
        description: 'Мгновенное применение всех параметров sysctl без перезагрузки сервера.',
        descriptionEn: 'Apply all sysctl tuning parameters immediately without rebooting.',
      },
      {
        id: 'step2-3',
        command: `sudo tee -a /etc/security/limits.d/99-xray-limits.conf > /dev/null << 'EOF'
* soft nofile 65535
* hard nofile 65535
root soft nofile 65535
root hard nofile 65535
{username} soft nofile 65535
{username} hard nofile 65535
EOF
sudo sed -i '/^DefaultLimitNOFILE=/d' /etc/systemd/system.conf
echo "DefaultLimitNOFILE=1048576" | sudo tee -a /etc/systemd/system.conf
echo "DefaultLimitNPROC=512000" | sudo tee -a /etc/systemd/system.conf
sudo systemctl daemon-reexec`,
        description: 'Снятие ограничений на дескрипторы сокетов как для сессий, так и для фоновых служб Xray в systemd.',
        descriptionEn: 'Raise file descriptor limits (nofile) for shell sessions and systemd services.',
        filePath: '/etc/security/limits.d/99-xray-limits.conf',
      },
      {
        id: 'step2-4',
        command: 'sysctl net.ipv4.tcp_congestion_control',
        description: 'Проверка активного алгоритма TCP: вывод должен содержать "bbr".',
        descriptionEn: 'Verify active TCP congestion control algorithm: output must state "bbr".',
      },
    ],
  },
  {
    id: 3,
    slug: 'zswap-ram',
    title: 'Оптимизация оперативной памяти (Zswap + Zstd)',
    titleEn: 'RAM Optimization (Zswap + Zstd)',
    subtitle: 'Аппаратное сжатие данных в RAM в 2 раза: VPS на 1-2 ГБ работает как 3-4 ГБ без свопа на SSD',
    subtitleEn: 'Hardware in-memory compression: 1-2 GB VPS acts like 3-4 GB without SSD swap latency',
    badge: 'Производительность',
    badgeEn: 'Performance',
    iconName: 'Cpu',
    tips: [
      'Zswap перехватывает страницы до сброса в swap-файл и молниеносно сжимает алгоритмом zstd.',
      'Аллокатор zsmalloc предотвращает фрагментацию памяти при высоких нагрузках.',
    ],
    tipsEn: [
      'Zswap intercepts evicted pages before SSD write and compresses them with zstd.',
      'The zsmalloc memory allocator prevents memory fragmentation under heavy loads.',
    ],
    commands: [
      {
        id: 'step3-1',
        command: `sudo sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="\\(.*\\)"/GRUB_CMDLINE_LINUX_DEFAULT="\\1 zswap.enabled=1 zswap.compressor=zstd zswap.zpool=zsmalloc zswap.max_pool_percent=25"/' /etc/default/grub`,
        description: 'Внедрение параметров Zswap (zstd компрессор, zsmalloc пул, лимит 25% RAM) в конфиг загрузчика GRUB.',
        descriptionEn: 'Inject Zswap parameters (zstd compressor, zsmalloc pool, 25% RAM cap) into GRUB config.',
      },
      {
        id: 'step3-2',
        command: 'sudo update-grub',
        description: 'Сборка нового загрузочного образа GRUB с новыми параметрами ядра.',
        descriptionEn: 'Compile and update GRUB bootloader configuration image.',
      },
      {
        id: 'step3-3',
        command: 'grep -r "" /sys/module/zswap/parameters/',
        description: 'Диагностическая команда: проверка текущего состояния Zswap (enabled=Y, compressor=zstd).',
        descriptionEn: 'Diagnostic inspection: verify Zswap runtime parameters (enabled=Y, compressor=zstd).',
      },
    ],
  },
  {
    id: 4,
    slug: 'fail2ban-shield',
    title: 'Fail2ban: Двойная защита (SSH + Панель 3X-UI)',
    titleEn: 'Fail2ban: Dual Shield (SSH + 3X-UI Admin Web)',
    subtitle: 'Автоматическая блокировка ботнетов через нативный systemd журнал (без auth.log)',
    subtitleEn: 'Automated botnet IP banning via native systemd journald (no auth.log dependency)',
    badge: 'Безопасность',
    badgeEn: 'Security',
    iconName: 'Lock',
    tips: [
      'В современных дистрибутивах Ubuntu backend=systemd читает журнал со скоростью C-библиотек.',
      'Тюрьма 3x-ui блокирует хакеров, которые перебирают пароли к админке 3X-UI в браузере.',
    ],
    tipsEn: [
      'In modern Ubuntu, backend=systemd reads directly from journald with native C library speed.',
      'The 3x-ui jail automatically bans hackers brute-forcing 3X-UI login credentials.',
    ],
    commands: [
      {
        id: 'step4-1',
        command: 'sudo apt install -y fail2ban',
        description: 'Установка службы защиты от сетевого брутфорса Fail2ban.',
        descriptionEn: 'Install the Fail2ban intrusion prevention framework.',
      },
      {
        id: 'step4-2',
        command: `sudo tee /etc/fail2ban/jail.d/ssh-systemd.local > /dev/null << 'EOF'
[sshd]
enabled = true
backend = systemd
port = {sshPort}
maxretry = 3
findtime = 10m
bantime = 1d
EOF`,
        description: 'Создание локального конфига защиты SSH с использованием systemd журнала.',
        descriptionEn: 'Create hardened Fail2ban jail for SSH using systemd journal backend.',
        filePath: '/etc/fail2ban/jail.d/ssh-systemd.local',
      },
      {
        id: 'step4-3',
        command: `sudo tee /etc/fail2ban/filter.d/3x-ui.conf > /dev/null << 'EOF'
[Definition]
failregex = ^.*login IP: <HOST> .* password error.*$
            ^.*\[LOGIN\].*from <HOST> failed.*$
            ^.*username: .* from <HOST> failed.*$
            ^.*failed login attempt from <HOST>.*$
ignoreregex =
EOF`,
        description: 'Создание регулярных выражений для отлова попыток несанкционированного входа в панель 3X-UI.',
        descriptionEn: 'Create regex patterns to capture unauthorized login attempts in 3X-UI.',
        filePath: '/etc/fail2ban/filter.d/3x-ui.conf',
      },
      {
        id: 'step4-4',
        command: `sudo tee /etc/fail2ban/jail.d/3x-ui.local > /dev/null << 'EOF'
[3x-ui]
enabled = true
filter = 3x-ui
backend = systemd
journalmatch = _SYSTEMD_UNIT=x-ui.service
maxretry = 3
findtime = 10m
bantime = 1d
port = {panelPort}
EOF`,
        description: 'Подключение правила бана взломщиков админки на порту {panelPort} на 24 часа через systemd journal.',
        descriptionEn: 'Configure 24-hour IP ban jail for 3X-UI web portal port {panelPort}.',
        filePath: '/etc/fail2ban/jail.d/3x-ui.local',
      },
      {
        id: 'step4-5',
        command: 'sudo systemctl enable fail2ban && sudo systemctl restart fail2ban && sudo fail2ban-client status',
        description: 'Включение автозапуска, перезапуск Fail2ban и вывод статуса активных тюрем.',
        descriptionEn: 'Enable service, restart Fail2ban, and inspect active jail status.',
      },
    ],
  },
  {
    id: 5,
    slug: 'ufw-firewall',
    title: 'Фаервол UFW: Точечные правила доступа',
    titleEn: 'UFW Firewall: Granular Port Rules',
    subtitle: 'Разрешение TCP/UDP для Reality и предотвращение зависаний на мобильных операторах',
    subtitleEn: 'Allowing TCP/UDP for Reality to ensure seamless mobile roaming connectivity',
    badge: 'Фаервол',
    badgeEn: 'Firewall',
    iconName: 'Flame',
    tips: [
      'Всегда разрешайте порт SSH ДО выполнения команды "ufw enable"!',
      'Для порта 443 обязательно пропускайте оба протокола (TCP и UDP) ради QUIC и устойчивости.',
    ],
    tipsEn: [
      'Always allow your SSH port BEFORE running "ufw enable"!',
      'For port 443, allow both TCP and UDP for QUIC/HTTP3 protocol stability.',
    ],
    commands: [
      {
        id: 'step5-1',
        command: 'sudo ufw default deny incoming && sudo ufw default allow outgoing',
        description: 'Установка базовой политики: блокировать весь входящий трафик, разрешать исходящий.',
        descriptionEn: 'Set baseline policy: drop all incoming traffic, permit all outbound connections.',
      },
      {
        id: 'step5-2',
        command: 'sudo ufw allow {sshPort}/tcp comment "Secure SSH Console"',
        description: 'Открытие порта SSH строго по протоколу TCP.',
        descriptionEn: 'Allow incoming SSH port strictly via TCP.',
      },
      {
        id: 'step5-3',
        command: 'sudo ufw allow 80/tcp comment "Web HTTP & Telegram Webhooks"',
        description: 'Открытие 80 порта для HTTP/Certbot и вебхуков Node.js ботов.',
        descriptionEn: 'Allow port 80 for HTTP certificates and bot webhooks.',
      },
      {
        id: 'step5-4',
        command: 'sudo ufw allow 443 comment "VPN Reality & Web HTTPS (TCP+UDP)"',
        description: 'Открытие порта 443 для VPN Reality: пропускает TCP и UDP для мобильных сетей.',
        descriptionEn: 'Allow port 443 (both TCP & UDP) for VLESS Reality & HTTP/3.',
      },
      {
        id: 'step5-5',
        command: 'sudo ufw allow {panelPort}/tcp comment "3X-UI Admin Web Panel"',
        description: 'Открытие порта веб-панели управления 3X-UI.',
        descriptionEn: 'Allow port {panelPort} for 3X-UI administrative dashboard.',
      },
      {
        id: 'step5-6',
        command: 'sudo ufw allow {subscriptionPort}/tcp comment "3X-UI Subscriptions Port"',
        description: 'Открытие порта персональных ссылок подписок клиентов (2096).',
        descriptionEn: 'Allow subscription port {subscriptionPort} for client auto-updates.',
      },
      {
        id: 'step5-7',
        command: 'sudo ufw --force enable && sudo ufw status verbose',
        description: 'Включение фаервола в автозагрузку и детальный отчет по всем открытым портам.',
        descriptionEn: 'Enable UFW at boot and display complete port rule status.',
      },
    ],
  },
  {
    id: 6,
    slug: '3x-ui-install',
    title: 'Установка 3X-UI (MHSanaei) и настройка VLESS Reality',
    titleEn: 'Install 3X-UI (MHSanaei) & Configure VLESS Reality',
    subtitle: 'Установка актуальной версии панели и защита от блокировок РКН/ТСПУ',
    subtitleEn: 'Deploying latest panel release and configuring TLS 1.3 masquerade against DPI filters',
    badge: 'VPN Ядро',
    badgeEn: 'VPN Core',
    iconName: 'Server',
    tips: [
      'Используйте оригинальный скрипт MHSanaei без кэша.',
      'В Reality выбирайте SNI dl.google.com или gateway.icloud.com с uTLS chrome.',
      'Обязательно включите блокировку BitTorrent в правилах маршрутизации Xray.',
    ],
    tipsEn: [
      'Use upstream MHSanaei repository script directly without caching.',
      'For Reality SNI, select dl.google.com or gateway.icloud.com with uTLS chrome.',
      'Enable BitTorrent blocking in Xray routing rules to protect the VPS from DMCA notices.',
    ],
    commands: [
      {
        id: 'step6-1',
        command: 'sudo apt update && sudo apt install -y curl tar jq openssl systemd-timesyncd && sudo timedatectl set-ntp true && timedatectl status',
        description: 'Установка зависимостей и синхронизация системного времени через NTP (критично для VLESS Reality: рассинхрон более 90 сек блокирует вход).',
        descriptionEn: 'Install essentials and enable NTP time synchronization (critical for Reality handshakes).',
      },
      {
        id: 'step6-2',
        command: 'bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)',
        description: 'Запуск официального интерактивного установщика актуальной версии 3X-UI (форк MHSanaei без кэша).',
        descriptionEn: 'Launch the official interactive installer for latest 3X-UI (MHSanaei).',
      },
      {
        id: 'step6-3',
        command: 'x-ui status',
        description: 'Проверка рабочего состояния системной службы панели x-ui.',
        descriptionEn: 'Verify operational status of the x-ui systemd daemon.',
      },
      {
        id: 'step6-4',
        command: 'x-ui log',
        description: 'Просмотр логов в реальном времени для проверки запуска Xray-core.',
        descriptionEn: 'Inspect real-time service logs to confirm Xray core initialization.',
      },
    ],
  },
  {
    id: 7,
    slug: 'nodejs-pm2',
    title: 'Среда для Telegram-ботов (Node.js 22 LTS + PM2)',
    titleEn: 'Telegram Bot Runtime (Node.js 22 LTS + PM2)',
    subtitle: 'Отказоустойчивый запуск скриптов, ботов и вебхуков с автоматическим перезапуском при сбоях',
    subtitleEn: 'Fault-tolerant bot & webhook execution with auto-restart on system reboot',
    badge: 'Среда разработки',
    badgeEn: 'Runtime',
    iconName: 'Boxes',
    tips: [
      'Node.js 22 — актуальная LTS ветка со встроенным fetch, WebSocket и поддержкой ESM.',
      'PM2 автоматически перезапустит бота при падении или перезагрузке VPS.',
    ],
    tipsEn: [
      'Node.js 22 is the active LTS release with native fetch, WebSockets, and ESM.',
      'PM2 automatically resurrects bots upon process crashes or host reboots.',
    ],
    commands: [
      {
        id: 'step7-1',
        command: 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -',
        description: 'Добавление официального репозитория NodeSource с ключами GPG (Node.js 22 LTS).',
        descriptionEn: 'Add official NodeSource repository with GPG keys for Node.js 22 LTS.',
      },
      {
        id: 'step7-2',
        command: 'sudo apt-get install -y nodejs && node -v && npm -v',
        description: 'Установка Node.js, npm и проверка корректности версий.',
        descriptionEn: 'Install Node.js and npm packages, verifying runtime versions.',
      },
      {
        id: 'step7-3',
        command: 'sudo npm install -g pm2',
        description: 'Глобальная установка менеджера процессов PM2.',
        descriptionEn: 'Install PM2 production process manager globally.',
      },
      {
        id: 'step7-4',
        command: 'pm2 startup systemd -u {username} --hp /home/{username}',
        description: 'Генерация хука автозапуска PM2 в systemd под созданного пользователя {username}.',
        descriptionEn: 'Generate PM2 systemd boot hook for user {username}.',
      },
      {
        id: 'step7-5',
        command: 'pm2 status',
        description: 'Проверка табличного монитора запущенных ботов и микросервисов.',
        descriptionEn: 'Check process dashboard for active microservices and bots.',
      },
    ],
  },
  {
    id: 8,
    slug: 'monitoring-logs',
    title: 'Профессиональный мониторинг и умная ротация логов',
    titleEn: 'Telemetry Monitoring & Smart Journal Rotation',
    subtitle: 'Контроль нагрузки на процессор, сеть и безопасное ограничение журнала systemd',
    subtitleEn: 'Resource telemetry and safe systemd journal size constraints',
    badge: 'Обслуживание',
    badgeEn: 'Operations',
    iconName: 'Activity',
    tips: [
      'Никогда не используйте "rm -rf /var/log/*" или "find -delete" в cron.',
      'journalctl --vacuum-size автоматически удаляет только устаревшие ротированные индексы.',
    ],
    tipsEn: [
      'Never run "rm -rf /var/log/*" in cron — this corrupts file descriptor handles.',
      'journalctl --vacuum-size safely purges only expired rotated logs.',
    ],
    commands: [
      {
        id: 'step8-1',
        command: 'sudo apt install -y htop nethogs ncdu btop iotop',
        description: 'Установка полного пакета системных анализаторов (CPU, RAM, диск, трафик по процессам).',
        descriptionEn: 'Install complete terminal telemetry suite (CPU, RAM, disk, per-process traffic).',
      },
      {
        id: 'step8-2',
        command: `sudo mkdir -p /etc/systemd/journald.conf.d && sudo tee /etc/systemd/journald.conf.d/size.conf > /dev/null << 'EOF'
[Journal]
SystemMaxUse=200M
MaxRetentionSec=14day
EOF`,
        description: 'Лимитирование общего размера системного журнала 200 МБ и хранением не более 14 дней.',
        descriptionEn: 'Cap total systemd journal storage at 200 MB with 14-day retention.',
        filePath: '/etc/systemd/journald.conf.d/size.conf',
      },
      {
        id: 'step8-3',
        command: 'sudo systemctl restart systemd-journald && sudo journalctl --vacuum-size=200M',
        description: 'Применение лимитов журнала и мгновенная безопасная очистка старых записей.',
        descriptionEn: 'Apply journal constraints and perform immediate vacuuming.',
      },
    ],
  },
];

export const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: 'tool-3x-ui',
    name: '3X-UI (Xray Core Panel by MHSanaei)',
    version: 'v2.5.0+ (Latest 2026)',
    category: 'VPN & Сеть',
    categoryEn: 'VPN & Network',
    icon: 'Radio',
    description: 'Ведущая веб-панель управления пользователями и ядром Xray. Поддерживает VLESS Reality, Trojan, Shadowsocks-2022, WireGuard и ссылки динамических подписок.',
    descriptionEn: 'Premier web panel for managing Xray core, client accounts, VLESS Reality, Trojan, Shadowsocks-2022 and dynamic auto-updating subscription feeds.',
    whyUsed: 'Позволяет генерировать подключения пользователей, задавать лимиты трафика/скорости и маскировать трафик от цензуры DPI/ТСПУ.',
    whyUsedEn: 'Allows generating user profiles, enforcing bandwidth quotas, and evading aggressive DPI censorship.',
    installCommand: 'bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)',
    configLocation: '/etc/x-ui/x-ui.db',
    serviceName: 'x-ui.service',
    keyCommands: [
      { cmd: 'x-ui', desc: 'Вызов главного консольного меню управления сервером', descEn: 'Open interactive CLI management menu' },
      { cmd: 'x-ui status', desc: 'Проверить статус службы панели и ядра Xray', descEn: 'Check status of x-ui service and Xray core' },
      { cmd: 'x-ui restart', desc: 'Перезапустить панель и перечитать базу конфигураций', descEn: 'Restart panel and reload database' },
      { cmd: 'x-ui log', desc: 'Вывести живой журнал подключений и ошибок Xray-core', descEn: 'Stream live connections and core logs' },
      { cmd: 'x-ui update', desc: 'Обновить 3X-UI до последней версии с GitHub', descEn: 'Update 3X-UI to latest release' },
      { cmd: 'x-ui resetSettings', desc: 'Сбросить порт, имя пользователя и пароль админа в консоли', descEn: 'Reset panel port and credentials in console' },
    ],
  },
  {
    id: 'tool-ufw',
    name: 'UFW (Uncomplicated Firewall)',
    version: 'v0.36+',
    category: 'Безопасность',
    categoryEn: 'Security',
    icon: 'Shield',
    description: 'Интуитивный сетевой экран для ядра Linux. Фильтрует входящие пакеты и закрывает неиспользуемые порты.',
    descriptionEn: 'Straightforward Linux netfilter firewall interface. Enforces ingress packet filtering.',
    whyUsed: 'Блокирует сканирование сервера ботнетами, оставляя открытыми только SSH, панель 3X-UI и Reality-порт 443.',
    whyUsedEn: 'Shields VPS from automated vulnerability probes, exposing only hardened ports.',
    installCommand: 'sudo apt install -y ufw',
    configLocation: '/etc/ufw/ufw.conf',
    serviceName: 'ufw.service',
    keyCommands: [
      { cmd: 'sudo ufw status verbose', desc: 'Детальный статус фаервола, открытые порты и правила', descEn: 'Verbose firewall rules and status' },
      { cmd: 'sudo ufw status numbered', desc: 'Вывести правила с номерами (для точечного удаления)', descEn: 'List numbered rules for targeted deletion' },
      { cmd: 'sudo ufw delete [номер]', desc: 'Удалить конкретное правило по его номеру', descEn: 'Delete rule by index number' },
      { cmd: 'sudo ufw allow [порт]/tcp comment "описание"', desc: 'Открыть определенный TCP-порт', descEn: 'Allow specific TCP port with comment' },
      { cmd: 'sudo ufw allow [порт] comment "описание"', desc: 'Открыть порт для комбинированного TCP+UDP трафика', descEn: 'Allow dual TCP+UDP port' },
      { cmd: 'sudo ufw reload', desc: 'Мгновенно применить изменения без сброса активных сессий', descEn: 'Reload rules without dropping active sessions' },
    ],
  },
  {
    id: 'tool-fail2ban',
    name: 'Fail2ban',
    version: 'v1.0.2+',
    category: 'Безопасность',
    categoryEn: 'Security',
    icon: 'Lock',
    description: 'Демон проактивной защиты. Анализирует журналы systemd и блокирует IP-адреса злоумышленников через iptables.',
    descriptionEn: 'Automated intrusion prevention daemon. Scans systemd journald logs and bans offending IPs.',
    whyUsed: 'Отражает брутфорс-атаки на порт SSH и веб-панель 3X-UI, отправляя сканеров в суточный бан.',
    whyUsedEn: 'Neutralizes dictionary attacks against SSH and the 3X-UI web dashboard.',
    installCommand: 'sudo apt install -y fail2ban',
    configLocation: '/etc/fail2ban/jail.d/',
    serviceName: 'fail2ban.service',
    keyCommands: [
      { cmd: 'sudo fail2ban-client status', desc: 'Список всех активных джейлов (фильтров)', descEn: 'List all active jails' },
      { cmd: 'sudo fail2ban-client status sshd', desc: 'Посмотреть заблокированные IP-адреса на SSH', descEn: 'Inspect banned IPs in sshd jail' },
      { cmd: 'sudo fail2ban-client status 3x-ui', desc: 'Посмотреть заблокированных взломщиков веб-панели', descEn: 'Inspect banned IPs in 3X-UI jail' },
      { cmd: 'sudo fail2ban-client set [тюрьма] unbanip [IP]', desc: 'Разбанить указанный IP-адрес', descEn: 'Manually unban specified IP' },
      { cmd: 'sudo systemctl restart fail2ban', desc: 'Перезапустить службу Fail2ban', descEn: 'Restart Fail2ban service' },
      { cmd: 'tail -f /var/log/fail2ban.log', desc: 'Мониторинг журнала блокировок в реальном времени', descEn: 'Live tail of ban activity logs' },
    ],
  },
  {
    id: 'tool-bbr',
    name: 'Google TCP BBR (Congestion Control)',
    version: 'Kernel Module',
    category: 'Производительность',
    categoryEn: 'Performance',
    icon: 'Zap',
    description: 'Современный алгоритм контроля сетевых перегрузок от инженеров Google. Заменяет устаревший CUBIC.',
    descriptionEn: 'Bottleneck Bandwidth and Round-trip propagation time algorithm by Google.',
    whyUsed: 'Увеличивает скорость и стабильность туннелей на мобильных сетях и линиях с высоким пингом/потерями пакетов.',
    whyUsedEn: 'Significantly improves speeds and minimizes packet loss over cellular connections.',
    installCommand: 'echo "net.core.default_qdisc = fq" | sudo tee -a /etc/sysctl.d/99-bbr.conf && echo "net.ipv4.tcp_congestion_control = bbr" | sudo tee -a /etc/sysctl.d/99-bbr.conf && sudo sysctl --system',
    configLocation: '/etc/sysctl.d/99-network-tuning.conf',
    serviceName: 'kernel module',
    keyCommands: [
      { cmd: 'sysctl net.ipv4.tcp_congestion_control', desc: 'Проверить активный алгоритм (должно быть: bbr)', descEn: 'Check congestion control (output: bbr)' },
      { cmd: 'sysctl net.core.default_qdisc', desc: 'Проверить дисциплину планировщика (должно быть: fq)', descEn: 'Check qdisc scheduler (output: fq)' },
      { cmd: 'lsmod | grep bbr', desc: 'Убедиться, что модуль ядра bbr успешно загружен', descEn: 'Verify bbr kernel module is loaded' },
      { cmd: 'sudo sysctl --system', desc: 'Применить все конфигурационные файлы ядра', descEn: 'Apply all sysctl parameters' },
    ],
  },
  {
    id: 'tool-zswap',
    name: 'Zswap (RAM Compression)',
    version: 'Kernel 6.x module',
    category: 'Производительность',
    categoryEn: 'Performance',
    icon: 'Cpu',
    description: 'Встроенный в ядро пул сжатой оперативной памяти алгоритмом Zstandard (zstd).',
    descriptionEn: 'Linux kernel in-memory compressed write-back cache using zstd.',
    whyUsed: 'Эффективно удваивает доступную оперативную память на недорогих VPS (1–2 ГБ), исключая зависания диска при свопе.',
    whyUsedEn: 'Effectively doubles usable RAM on budget 1-2 GB instances without slow SSD paging.',
    installCommand: 'sudo sed -i \'s/GRUB_CMDLINE_LINUX_DEFAULT="/&zswap.enabled=1 zswap.compressor=zstd zswap.max_pool_percent=25 /\' /etc/default/grub && sudo update-grub',
    configLocation: '/etc/default/grub',
    serviceName: 'kernel zswap',
    keyCommands: [
      { cmd: 'grep -r "" /sys/module/zswap/parameters/', desc: 'Показать все текущие параметры работы Zswap', descEn: 'Display all runtime Zswap parameters' },
      { cmd: 'cat /sys/kernel/debug/zswap/stored_pages', desc: 'Количество сжатых страниц, находящихся в RAM', descEn: 'Number of compressed pages in RAM' },
      { cmd: 'cat /sys/kernel/debug/zswap/pool_total_size', desc: 'Общий размер сжатого пула в байтах', descEn: 'Total compressed pool size in bytes' },
    ],
  },
  {
    id: 'tool-pm2',
    name: 'Node.js 22 LTS & PM2',
    version: 'Node v22.x / PM2 v5.4+',
    category: 'Среда исполнения',
    categoryEn: 'Runtime',
    icon: 'Boxes',
    description: 'Современная платформа Node.js и продакшн менеджер процессов с авторестартом, балансировкой и логами.',
    descriptionEn: 'Node.js 22 LTS runtime paired with PM2 production process manager.',
    whyUsed: 'Позволяет держать включенными Telegram-ботов (уведомления об оплате, выдача ключей, саппорт) 24/7/365.',
    whyUsedEn: 'Maintains 24/7/365 uptime for Telegram bots, webhooks and management scripts.',
    installCommand: 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs && sudo npm install -g pm2',
    configLocation: '~/.pm2/',
    serviceName: 'pm2-{username}.service',
    keyCommands: [
      { cmd: 'pm2 status', desc: 'Список запущенных процессов и их статус', descEn: 'List active processes and status' },
      { cmd: 'pm2 start bot.js --name "tg-bot"', desc: 'Запустить скрипт с именем и авторестартом', descEn: 'Start script with process name & auto-restart' },
      { cmd: 'pm2 logs [имя]', desc: 'Просмотр логов консоли в реальном времени', descEn: 'Stream application console logs' },
      { cmd: 'pm2 restart [имя]', desc: 'Перезапустить процесс бота', descEn: 'Restart specific process' },
      { cmd: 'pm2 save', desc: 'Сохранить список процессов для автозапуска при ребуте VPS', descEn: 'Save process list for boot auto-resurrection' },
      { cmd: 'pm2 monit', desc: 'Интерактивный дашборд нагрузки на процессор и память', descEn: 'Interactive CPU/RAM monitor dashboard' },
    ],
  },
  {
    id: 'tool-monitoring',
    name: 'Набор системного аудита (htop / nethogs / ncdu / btop)',
    version: 'Latest CLI Pack',
    category: 'Мониторинг',
    categoryEn: 'Monitoring',
    icon: 'Activity',
    description: 'Комплект высокоинформативных терминальных утилит для мониторинга ресурсов сервера.',
    descriptionEn: 'Suite of real-time terminal telemetry utilities (CPU, RAM, per-process bandwidth, disk).',
    whyUsed: 'Позволяет моментально локализовать пиковую нагрузку на CPU, утечку RAM, активный трафик юзеров и заполнение SSD.',
    whyUsedEn: 'Quickly isolates CPU spikes, memory leaks, client traffic hogs, and disk exhaustion.',
    installCommand: 'sudo apt install -y htop nethogs ncdu btop iotop',
    configLocation: 'CLI tools',
    serviceName: 'interactive',
    keyCommands: [
      { cmd: 'htop', desc: 'Классический диспетчер задач процессов и памяти', descEn: 'Interactive process & memory viewer' },
      { cmd: 'btop', desc: 'Ультрасовременный дашборд с графиками CPU, RAM, дисков и сетевого трафика', descEn: 'Modern terminal dashboard with graphs' },
      { cmd: 'sudo nethogs', desc: 'Сетевой монитор: показывает трафик с разбивкой по процессам (kb/s)', descEn: 'Bandwidth monitor by process' },
      { cmd: 'sudo ncdu /', desc: 'Интерактивный сканер дискового пространства (навигация стрелками)', descEn: 'Interactive disk usage analyzer' },
      { cmd: 'sudo journalctl -u x-ui -n 100 -f', desc: 'Смотреть последние 100 строк логов 3X-UI', descEn: 'Follow last 100 log lines of 3X-UI' },
      { cmd: 'sudo journalctl --vacuum-size=200M', desc: 'Очистить журнал логов, оставив максимум 200 МБ', descEn: 'Vacuum journald logs to 200 MB max' },
    ],
  },
  {
    id: 'tool-speedtest',
    name: 'Speedtest CLI (Ookla Official)',
    version: 'v1.2.0+',
    category: 'Утилиты',
    categoryEn: 'Utilities',
    icon: 'Zap',
    description: 'Официальная консольная утилита Ookla для тестирования реальной скорости интернет-канала VPS.',
    descriptionEn: 'Official Ookla CLI for benchmarking VPS uplink/downlink throughput and latency.',
    whyUsed: 'Проверяет честность хостинга (соответствие заявленному 1 Гбит/с порту) и пинг до мировых узлов.',
    whyUsedEn: 'Verifies hosting bandwidth compliance and ping to target global backbones.',
    installCommand: 'curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash && sudo apt install -y speedtest',
    configLocation: '~/.config/ookla/',
    keyCommands: [
      { cmd: 'speedtest', desc: 'Запуск быстрого автотеста входящей/исходящей скорости и задержки', descEn: 'Run automatic throughput and latency benchmark' },
      { cmd: 'speedtest -L', desc: 'Список ближайших тестовых серверов с их ID', descEn: 'List nearby benchmark servers with IDs' },
      { cmd: 'speedtest -s [server_id]', desc: 'Тестирование скорости до конкретного целевого сервера', descEn: 'Test bandwidth to specific server ID' },
    ],
  },
];
