/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServerConfig } from '../types';

/**
 * Подставляет параметры конфигурации сервера в команду
 */
export function formatCommand(template: string, config: ServerConfig): string {
  return template
    .replaceAll('{username}', config.username)
    .replaceAll('{sshPort}', String(config.sshPort))
    .replaceAll('{panelPort}', String(config.panelPort))
    .replaceAll('{subscriptionPort}', String(config.subscriptionPort))
    .replaceAll('{serverIp}', config.serverIp)
    .replaceAll('{realitySni}', config.realitySni);
}

/**
 * Генерирует эталонный, полностью безопасный bash-скрипт автоматической установки (2026)
 */
export function generateFullBashScript(config: ServerConfig): string {
  return `#!/bin/bash
# ==============================================================================
# ЭТАЛОННЫЙ СКРИПТ РАЗВЕРТЫВАНИЯ 3X-UI & HARDENING LINUX (2026)
# Сгенерировано автоматически с вашими параметрами:
# Пользователь: ${config.username} | SSH порт: ${config.sshPort} | Порт панели: ${config.panelPort}
# ==============================================================================
set -euo pipefail

# 1. Проверка прав root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ошибка: Запустите скрипт с правами root: sudo -i"
  exit 1
fi

# 2. Проверка SSH ключей у root (критическая защита от lockout)
ROOT_KEYS="/root/.ssh/authorized_keys"
if [ ! -f "$ROOT_KEYS" ] || [ ! -s "$ROOT_KEYS" ]; then
  echo "❌ КРИТИЧЕСКАЯ ОШИБКА: Файл $ROOT_KEYS пуст или отсутствует!"
  echo "Сначала добавьте ваш публичный SSH-ключ для root в ~/.ssh/authorized_keys, иначе вы потеряете доступ."
  exit 1
fi

echo ">>> [1/8] Синхронизация системного времени (NTP, критично для Reality)..."
apt update && apt install -y systemd-timesyncd curl jq tar openssl
timedatectl set-ntp true
timedatectl status

echo ">>> [2/8] Настройка пользователя '${config.username}' и SSH..."
id -u ${config.username} &>/dev/null || adduser --gecos "" --disabled-password ${config.username}
usermod -aG sudo ${config.username}

# Беспарольный sudo (защита от потери доступа при входе без пароля)
echo "${config.username} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/99-${config.username}
chmod 440 /etc/sudoers.d/99-${config.username}

# Копирование SSH-ключа
mkdir -p /home/${config.username}/.ssh
cp "$ROOT_KEYS" /home/${config.username}/.ssh/authorized_keys
chown -R ${config.username}:${config.username} /home/${config.username}/.ssh
chmod 700 /home/${config.username}/.ssh
chmod 600 /home/${config.username}/.ssh/authorized_keys

# Защищенный конфиг SSH
tee /etc/ssh/sshd_config.d/99-hardened.conf > /dev/null << 'EOF'
Port ${config.sshPort}
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
EOF
sshd -t
systemctl restart ssh || systemctl restart sshd

echo ">>> [3/8] Тюнинг сетевого стека ядра (BBR + сокеты)..."
tee /etc/sysctl.d/99-network-tuning.conf > /dev/null << 'EOF'
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
EOF
sysctl --system

# Системные лимиты сокетов для systemd-сервисов (Xray core)
tee -a /etc/systemd/system.conf > /dev/null << 'EOF'
DefaultLimitNOFILE=1048576
DefaultLimitNPROC=512000
EOF
systemctl daemon-reexec

echo ">>> [4/8] Установка и настройка Fail2ban (Native Journald)..."
apt install -y fail2ban

# Защита SSH
tee /etc/fail2ban/jail.d/ssh-systemd.local > /dev/null << 'EOF'
[sshd]
enabled = true
backend = systemd
port = ${config.sshPort}
maxretry = 3
findtime = 10m
bantime = 1d
EOF

# Фильтр 3X-UI
tee /etc/fail2ban/filter.d/3x-ui.conf > /dev/null << 'EOF'
[Definition]
failregex = ^.*login IP: <HOST> .* password error.*$
            ^.*\[LOGIN\].*from <HOST> failed.*$
            ^.*username: .* from <HOST> failed.*$
ignoreregex =
EOF

# Тюрьма 3X-UI (чтение прямо из системного юнита x-ui)
tee /etc/fail2ban/jail.d/3x-ui.local > /dev/null << 'EOF'
[3x-ui]
enabled = true
backend = systemd
journalmatch = _SYSTEMD_UNIT=x-ui.service
filter = 3x-ui
port = ${config.panelPort}
maxretry = 3
findtime = 10m
bantime = 1d
EOF

systemctl enable fail2ban
systemctl restart fail2ban

echo ">>> [5/8] Настройка сетевого экрана UFW..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ${config.sshPort}/tcp comment 'Secure SSH'
ufw allow 80/tcp comment 'HTTP / Certbot'
ufw allow 443 comment 'Reality HTTPS (TCP+UDP)'
ufw allow ${config.panelPort}/tcp comment '3X-UI Panel'
ufw allow ${config.subscriptionPort}/tcp comment 'Subscriptions'
ufw --force enable

echo ">>> [6/8] Ограничение системных логов journald..."
apt install -y htop nethogs ncdu fastfetch
mkdir -p /etc/systemd/journald.conf.d
tee /etc/systemd/journald.conf.d/size.conf > /dev/null << 'EOF'
[Journal]
SystemMaxUse=200M
MaxRetentionSec=14day
EOF
systemctl restart systemd-journald
journalctl --vacuum-size=200M

echo ">>> [7/8] Установка веб-панели 3X-UI (MHSanaei)..."
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
systemctl restart fail2ban

# Определение внешнего IP
SERVER_IP=$(curl -s4 --max-time 3 icanhazip.com || curl -s4 --max-time 3 ifconfig.me || echo "${config.serverIp}")

echo "=========================================================="
echo "✅ НАСТРОЙКА УСПЕШНО ЗАВЕРШЕНА!"
echo "Веб-панель 3X-UI: http://\${SERVER_IP}:${config.panelPort}"
echo "Вход по SSH: ssh -p ${config.sshPort} ${config.username}@\${SERVER_IP}"
echo "=========================================================="
`;
}

/**
 * Генерирует интерактивный скрипт комплексной проверки и аудита состояния сервера (check_server.sh)
 */
export function generateCheckScript(config: ServerConfig): string {
  return `#!/bin/bash
# ==============================================================================
# СКРИПТ КОМПЛЕКСНОГО АУДИТА И ПРОВЕРКИ СЕРВЕРА 3X-UI (2026)
# Ожидаемые параметры:
# Пользователь: ${config.username} | SSH порт: ${config.sshPort} | Порт панели: ${config.panelPort}
# ==============================================================================

GREEN='\\033[0;32m'
RED='\\033[0;31m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
BOLD='\\033[1m'
NC='\\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
  echo -e "  [\${GREEN}✔ OK\${NC}] $1"
  ((PASSED++))
}

check_fail() {
  echo -e "  [\${RED}✘ ОШИБКА\${NC}] $1"
  ((FAILED++))
}

check_warn() {
  echo -e "  [\${YELLOW}⚠ ВНИМАНИЕ\${NC}] $1"
  ((WARNINGS++))
}

echo -e "\${CYAN}\${BOLD}==========================================================\${NC}"
echo -e "\${CYAN}\${BOLD}     ДИАГНОСТИКА И АУДИТ НАСТРОЙКИ СЕРВЕРА 3X-UI (2026)    \${NC}"
echo -e "\${CYAN}\${BOLD}==========================================================\${NC}"
echo ""

# 1. Проверка точного времени (NTP)
echo -e "\${BOLD}1. Синхронизация времени (NTP для VLESS Reality):\${NC}"
if timedatectl status | grep -E "NTP service: active|System clock synchronized: yes" >/dev/null; then
  check_pass "Синхронизация времени (NTP) активна"
else
  check_fail "NTP не синхронизирован! Reality может выдавать ошибку 'handshake expired'"
fi

# 2. Проверка пользователя и прав sudo
echo -e "\${BOLD}2. Пользователь и привилегии sudo:\${NC}"
if id -u "${config.username}" &>/dev/null; then
  check_pass "Пользователь '${config.username}' существует в системе"
  if groups "${config.username}" | grep -q "sudo"; then
    check_pass "Пользователь '${config.username}' состоит в группе sudo"
  else
    check_fail "Пользователь '${config.username}' НЕ добавлен в sudo"
  fi
  if sudo -l -U "${config.username}" 2>&1 | grep -q "NOPASSWD"; then
    check_pass "Беспарольный sudo для '${config.username}' настроен корректно"
  else
    check_warn "Беспарольный sudo не обнаружен (убедитесь, что у пользователя задан пароль)"
  fi
  if [ -s "/home/${config.username}/.ssh/authorized_keys" ]; then
    check_pass "SSH-ключ пользователя присутствует и не пуст"
  else
    check_fail "Файл /home/${config.username}/.ssh/authorized_keys пуст или отсутствует!"
  fi
else
  check_fail "Пользователь '${config.username}' не найден в системе"
fi

# 3. Безопасность SSH
echo -e "\${BOLD}3. Безопасность SSH демона:\${NC}"
SSH_PORT_DETECTED=$(ss -tulpn | grep -E 'sshd|ssh' | awk '{print $5}' | sed 's/.*://' | head -n1)
if [ "$SSH_PORT_DETECTED" == "${config.sshPort}" ]; then
  check_pass "Служба SSH слушает заданный порт: ${config.sshPort}"
elif [ "$SSH_PORT_DETECTED" == "22" ] && [ "${config.sshPort}" != "22" ]; then
  check_warn "SSH все еще слушает стандартный порт 22 вместо ${config.sshPort}"
else
  check_pass "SSH порт обнаружен: $SSH_PORT_DETECTED"
fi

if grep -rE "^\s*PermitRootLogin\s+no" /etc/ssh/ /etc/ssh/sshd_config.d/ 2>/dev/null | grep -q "no"; then
  check_pass "Вход по SSH под root запрещен (PermitRootLogin no)"
else
  check_warn "Вход под root по SSH не отключен явно"
fi

if grep -rE "^\s*PasswordAuthentication\s+no" /etc/ssh/ /etc/ssh/sshd_config.d/ 2>/dev/null | grep -q "no"; then
  check_pass "Вход по паролям отключен (PasswordAuthentication no)"
else
  check_warn "Вход по паролям все еще разрешен"
fi

# 4. Тюнинг BBR и ядра
echo -e "\${BOLD}4. Оптимизация сети и TCP BBR:\${NC}"
CURRENT_CC=$(sysctl -n net.ipv4.tcp_congestion_control 2>/dev/null)
CURRENT_QDISC=$(sysctl -n net.core.default_qdisc 2>/dev/null)
if [ "$CURRENT_CC" == "bbr" ]; then
  check_pass "Алгоритм контроля перегрузок BBR активен"
else
  check_fail "BBR не включен! Текущий алгоритм: $CURRENT_CC"
fi
if [ "$CURRENT_QDISC" == "fq" ]; then
  check_pass "Диспетчер очередей fq активен"
else
  check_warn "Диспетчер очередей: $CURRENT_QDISC (рекомендуется fq)"
fi

# 5. Лимиты сокетов в systemd
echo -e "\${BOLD}5. Системные лимиты дескрипторов (NOFILE):\${NC}"
if grep -q "DefaultLimitNOFILE=1048576" /etc/systemd/system.conf 2>/dev/null; then
  check_pass "Лимит открытых файлов в systemd установлен в 1048576"
else
  check_warn "Systemd DefaultLimitNOFILE не установлен в 1048576 (может вызвать 'too many open files')"
fi

# 6. Служба Fail2ban
echo -e "\${BOLD}6. Защита Fail2ban:\${NC}"
if systemctl is-active fail2ban >/dev/null 2>&1; then
  check_pass "Служба Fail2ban активна (active/running)"
  
  JAILS=$(fail2ban-client status 2>/dev/null | grep "Jail list" | sed 's/.*://')
  if echo "$JAILS" | grep -q "sshd"; then
    check_pass "Jail [sshd] активен"
  else
    check_warn "Jail [sshd] не активен в Fail2ban"
  fi
  
  if echo "$JAILS" | grep -q "3x-ui"; then
    check_pass "Jail [3x-ui] активен и защищает админ-панель"
  else
    check_warn "Jail [3x-ui] не найден среди активных фильтров Fail2ban"
  fi
else
  check_fail "Служба Fail2ban не запущена!"
fi

# 7. Фаервол UFW
echo -e "\${BOLD}7. Состояние фаервола UFW:\${NC}"
if ufw status | grep -q "Status: active"; then
  check_pass "Фаервол UFW включен и активен"
  
  ufw status | grep -q "${config.panelPort}" && check_pass "Порт панели ${config.panelPort} открыт в UFW" || check_fail "Порт панели ${config.panelPort} закрыт в UFW!"
  ufw status | grep -q "443" && check_pass "Порт 443 (Reality) открыт в UFW" || check_fail "Порт 443 закрыт в UFW!"
  ufw status | grep -q "${config.sshPort}" && check_pass "Порт SSH ${config.sshPort} открыт в UFW" || check_fail "Порт SSH ${config.sshPort} закрыт в UFW!"
else
  check_fail "Фаервол UFW отключен (Status: inactive)!"
fi

# 8. Панель 3X-UI и служба Xray
echo -e "\${BOLD}8. Служба веб-панели 3X-UI:\${NC}"
if systemctl is-active x-ui >/dev/null 2>&1; then
  check_pass "Служба x-ui активна в systemd"
else
  check_fail "Служба x-ui не запущена! Проверьте 'systemctl status x-ui'"
fi

if ss -tulpn | grep -q ":${config.panelPort}\b"; then
  check_pass "Порт ${config.panelPort} прослушивается процессом 3X-UI"
else
  check_warn "Порт ${config.panelPort} пока не прослушивается (возможно, панель настроена на другой порт)"
fi

# Итог проверки
echo ""
echo -e "\${CYAN}\${BOLD}==========================================================\${NC}"
echo -e "\${BOLD}ИТОГИ ПРОВЕРКИ СЕРВЕРА:\${NC}"
echo -e "  Успешно пройдено:   \${GREEN}\${BOLD}$PASSED\${NC}"
echo -e "  Критических ошибок: \${RED}\${BOLD}$FAILED\${NC}"
echo -e "  Предупреждений:     \${YELLOW}\${BOLD}$WARNINGS\${NC}"
echo -e "\${CYAN}\${BOLD}==========================================================\${NC}"

if [ "$FAILED" -eq 0 ]; then
  echo -e "\${GREEN}\${BOLD}🎉 Сервер настроен безупречно и готов к боевой эксплуатации!\${NC}"
else
  echo -e "\${RED}\${BOLD}⚠ Обнаружены критические ошибки. Устраните пункты, отмеченные [✘], перед раздачей ключей.\${NC}"
fi
echo ""
`;
}

/**
 * Безопасное копирование в буфер обмена с поддержкой iframe
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback для нестандартных контекстов / iframe
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Ошибка копирования в буфер обмена:', err);
    return false;
  }
}
