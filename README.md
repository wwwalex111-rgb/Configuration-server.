# VPS Hardening & 3X-UI Suite (VLESS Reality 2026)

[English](#english-overview) | [Русский](#описание-на-русском)

---

<a name="english-overview"></a>
## 🌐 English Overview

**VPS Hardening & 3X-UI Suite** is a production-grade, interactive web application and deployment toolkit for securing Linux servers (Ubuntu 22.04 / 24.04 LTS), configuring the 3X-UI panel, and deploying censorship-resistant **VLESS Reality** (XTLS Vision) inbounds with high-performance networking (TCP BBR + Zswap).

### 🚀 Key Capabilities

- **Dynamic Command & Script Generation**: Enter your server IP, sudo username, and custom ports — all terminal commands, configuration files, and bash deployment scripts update in real-time.
- **Multilingual Support (RU / EN)**: Instant one-click toggle in the top header switches the entire interface, checklists, software descriptions, and troubleshooting guides between English and Russian.
- **8-Step Production Hardening Checklist**:
  1. **User & SSH Hardening**: Non-root sudo user, Ed25519 elliptic keys, passwordless sudo, syntax pre-validation (`sshd -t`) to eliminate lockout risks.
  2. **Kernel Network Tuning & Limits**: Google TCP BBR v1/v2, network buffers, socket limits (`nofile 65535`, systemd `DefaultLimitNOFILE=1048576`).
  3. **In-Memory RAM Compression (Zswap + Zstd)**: Doubles usable memory on 1–2 GB VPS instances without slow SSD paging.
  4. **Fail2ban Dual Shield**: Native `backend = systemd` reading (no legacy `auth.log` crashes), 24h ban jail for SSH and 3X-UI login attempts.
  5. **UFW Firewall**: Granular ingress rules, allowing dual TCP & UDP on port 443 for QUIC/HTTP3 mobile carrier resilience.
  6. **3X-UI & Reality Setup**: Upstream installer (MHSanaei), NTP clock synchronization, and BitTorrent blocking.
  7. **Node.js 22 LTS & PM2**: Production runtime environment for Telegram bots and microservices with boot hooks.
  8. **Telemetry & Log Management**: `btop`, `nethogs`, `ncdu`, safe `journalctl --vacuum-size` log rotation.
- **3X-UI Inbounds & Multi-Platform Clients**:
  - Ready-to-copy VLESS Reality inbound templates with validated CDN masquerade SNIs (`dl.google.com`, `gateway.icloud.com`).
  - Client setup guides: **Hiddify** (Desktop/Mobile), **v2rayNG** (Android), **Happ / V2Box** (iOS/macOS), **v2rayN** (Windows), and **Karing**.
  - Diagnostics FAQ: Fixes for Hiddify timeouts (disabling MUX and TLS Fragment, TUN permissions, NTP clock sync).
- **Software Reference & CheatSheet**:
  - Full handbook of all installed server tools with paths and administration commands.
  - Searchable 1-click command cheatsheet.

---

### 📤 How to Publish / Export to GitHub

#### Option 1: Direct Export in Google AI Studio (Recommended — No Terminal Required)
You do **not** need to type git commands in a terminal if you are working within Google AI Studio:
1. In the **top-right menu bar** of the AI Studio interface, click the **«Export»** button (or the GitHub icon).
2. Select **«Export to GitHub»**.
3. Authorize your GitHub account (if prompted) and choose to create a new repository or update an existing one.
4. AI Studio will automatically push all project files, clean configurations, and commits directly to your GitHub repository in one click!

#### Option 2: Local Git CLI (Only if working on your computer)
If you downloaded the code as a ZIP archive to your local computer and want to push from your terminal:
```bash
# Initialize repository
git init -b main

# Stage all files (.gitignore automatically protects sensitive files)
git add .

# Create initial commit
git commit -m "feat: initial commit of VPS hardening & 3X-UI guide suite"

# Link your remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Push to GitHub
git push -u origin main
```

---

### 💻 Quick Start (Local Run)

#### With Node.js / Bun:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Windows 1-Click:
Double-click `start_windows.bat` in the project root. It will verify Node.js, install dependencies, and launch the browser automatically.

---

<a name="описание-на-русском"></a>
## 🇷🇺 Описание на русском

Интерактивное руководство и инструментарий для безопасной настройки VPS-сервера на базе Ubuntu/Debian, развертывания панели 3X-UI и настройки протокола **VLESS Reality** (XTLS Vision).

### 🚀 Основные возможности

- **Динамическая адаптация команд**: укажите ваш IP, пользователя и порты — все команды, скрипты и конфигурации автоматически обновятся под ваши параметры.
- **Двуязычный интерфейс (RU / EN)**: переключение языка в шапке в один клик.
- **8 этапов серверного харденинга**:
  - Создание непривилегированного пользователя с sudo.
  - Настройка входа по современным SSH-ключам (Ed25519) и защита от случайного lockout.
  - Полное отключение парольной аутентификации и прямого входа под `root`.
  - Межсетевой экран **UFW** с разграничением портов (TCP + UDP на 443 порту).
  - Защита от брутфорса **Fail2ban** с интеграцией в native systemd journald.
  - Ускорение сети **TCP BBR** и оптимизация сетевого стека Linux.
  - Сжатие памяти **Zswap (zstd)** для недорогих VPS на 1-2 ГБ.
- **Развертывание 3X-UI & VLESS Reality**:
  - Официальный установщик MHSanaei без кэша.
  - Рекомендованные параметры маскировки Reality (SNI: dl.google.com, gateway.icloud.com).
  - Руководство по подключению клиентов (Hiddify, v2rayNG, Happ/V2Box, v2rayN, Karing).
  - Диагностика таймаутов в Hiddify (отключение MUX и Fragment, запуск от администратора для TUN).
- **Справочник ПО и быстрый читшит**:
  - Полный перечень системных утилит с командами управления.
  - Готовые генераторы bash-скриптов для автоматизации настройки (`deploy.sh`) и аудита (`check_server.sh`).

---

### 🔒 Безопасность и приватность

- В репозитории **отсутствуют** приватные ключи, токены, реальные IP-адреса и учетные данные.
- Все параметры сервера хранятся исключительно в `localStorage` вашего браузера и никогда не передаются на сторонние серверы.
- Файл `.gitignore` настроен для предотвращения случайного коммита `.env`, SSH-ключей (`id_rsa`, `id_ed25519`) и временных логов.

---

### 📄 Лицензия

Распространяется под лицензией [Apache-2.0](LICENSE).
