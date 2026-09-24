# Полное руководство по настройке VPS-сервера и панели 3X-UI

> **Сервер:** <IP_ВАШЕГО_СЕРВЕРА>  
> **Пользователь:** <ВАШ_ПОЛЬЗОВАТЕЛЬ>  
> **SSH порт:** 22 (рекомендуемый скрытый: 6011)  
> **Порт панели 3X-UI:** 2053  
> **SNI маскировка Reality:** dl.google.com  

---

## ⚠️ Золотое правило безопасности
> **Никогда не закрывайте текущую сессию root**, пока не проверите вход во **втором отдельном окне терминала** по SSH-ключу!

---

## 📋 Содержание
1. [Создание пользователя и настройка sudo](#этап-1)
2. [Настройка входа по SSH-ключам](#этап-2)
3. [Безопасность SSH (отключение паролей и root)](#этап-3)
4. [Настройка фаервола UFW](#этап-4)
5. [Установка и настройка Fail2ban](#этап-5)
6. [Установка панели 3X-UI и Reality](#этап-6)
7. [Настройка BBR и оптимизация сети](#этап-7)
8. [Клиентские приложения и подключение](#этап-8)

---

## Этап 1: Создание пользователя и sudo <a id="этап-1"></a>
```bash
# 1. Создание пользователя (замените adminuser на желаемое имя)
adduser adminuser

# 2. Добавление в группу sudo
usermod -aG sudo adminuser

# 3. Проверка прав sudo
su - adminuser -c "sudo whoami"
# Должно вернуть: root
```

---

## Этап 2: Настройка SSH-ключей <a id="этап-2"></a>
На вашем домашнем компьютере (MobaXterm / PowerShell):
```bash
# Генерация современного ключа Ed25519 (если еще нет)
ssh-keygen -t ed25519 -C "admin@vps"
```

На сервере под root настраиваем права для пользователя:
```bash
mkdir -p /home/adminuser/.ssh
chmod 700 /home/adminuser/.ssh

# Добавьте ваш ПУБЛИЧНЫЙ ключ (содержимое id_ed25519.pub):
nano /home/adminuser/.ssh/authorized_keys

# Установите строгие права (КРИТИЧЕСКИ ВАЖНО):
chmod 600 /home/adminuser/.ssh/authorized_keys
chown -R adminuser:adminuser /home/adminuser/.ssh
```

---

## Этап 3: Безопасность SSH <a id="этап-3"></a>
Создаем отдельный файл конфигурации с наивысшим приоритетом:
```bash
cat << 'EOF' | sudo tee /etc/ssh/sshd_config.d/99-custom-hardening.conf
Port 22
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
EOF

# Проверка синтаксиса перед перезапуском:
sshd -t

# Перезапуск службы SSH:
sudo systemctl restart ssh || sudo systemctl restart sshd

# Проверка действующих настроек:
sshd -T | grep -E -i 'permitrootlogin|passwordauthentication|pubkeyauthentication'
# Должно быть:
# permitrootlogin no
# pubkeyauthentication yes
# passwordauthentication no
```

---

## Этап 4: Настройка фаервола UFW <a id="этап-4"></a>
```bash
# 1. Базовые правила
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 2. Разрешаем SSH (порт 22 или ваш измененный порт)
sudo ufw allow 22/tcp comment 'SSH Port'

# 3. Разрешаем панель 3X-UI
sudo ufw allow 2053/tcp comment '3X-UI Web Panel'

# 4. Разрешаем входящий трафик VLESS/Reality
sudo ufw allow 443/tcp comment 'Reality HTTPS'
sudo ufw allow 443/udp comment 'Reality UDP'

# 5. Включение UFW
sudo ufw enable

# Проверка статуса:
sudo ufw status verbose
```

---

## Этап 5: Установка и настройка Fail2ban <a id="этап-5"></a>
```bash
sudo apt update && sudo apt install -y fail2ban

cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
banaction = ufw

[sshd]
enabled = true
port = 22
backend = systemd
maxretry = 3
bantime = 24h
EOF

sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

---

## Этап 6: Установка панели 3X-UI <a id="этап-6"></a>
Официальный актуальный скрипт от автора mhsanaei:
```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```
1. Задайте логин и пароль администратора.
2. Укажите порт панели (по умолчанию `2053`).
3. В браузере перейдите: `http://<IP_ВАШЕГО_СЕРВЕРА>:2053`

### Рекомендуемые параметры VLESS Reality в панели:
- **Протокол:** `VLESS`
- **Порт:** `443`
- **Транспорт:** `TCP`
- **Security:** `Reality`
- **Target / SNI:** `dl.google.com:443`
- **ShortId:** сгенерируйте в панели (например `6ba8c533`)

---

## Этап 7: Ускорение сети TCP BBR <a id="этап-7"></a>
```bash
cat << 'EOF' | sudo tee /etc/sysctl.d/99-bbr.conf
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
EOF

sudo sysctl --system

# Проверка активации BBR:
sysctl net.ipv4.tcp_congestion_control
# Должно вернуть: net.ipv4.tcp_congestion_control = bbr
```

---

## Этап 8: Клиентские приложения для ПК и телефонов
- **Windows:** v2rayN, Nekoray, Hiddify
- **Android:** v2rayNG, Happ, NekoBox
- **iOS:** Streisand, FoXray, V2Box, Sing-box
- **macOS:** V2rayU, FoXray, Nekoray
