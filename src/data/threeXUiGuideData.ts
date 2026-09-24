/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface XUiClientGuide {
  id: string;
  name: string;
  platform: 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux' | 'Мультиплатформа';
  platformEn?: string;
  core: string;
  recommendedFor: string;
  recommendedForEn?: string;
  pros: string[];
  prosEn?: string[];
  cons?: string[];
  consEn?: string[];
  downloadUrl: string;
  downloadLabel: string;
  downloadLabelEn?: string;
  importMethod: string;
  importMethodEn?: string;
  setupInstructions: string[];
  setupInstructionsEn?: string[];
  rating: number; // 1-5
}

export interface InboundConfigTemplate {
  protocol: 'VLESS (Reality)' | 'Shadowsocks (2022)' | 'Trojan' | 'VLESS (gRPC / WS)';
  recommended: boolean;
  port: number | string;
  security: string;
  network: string;
  sniRecommendations: string[];
  description: string;
  descriptionEn?: string;
  antiDpiFeatures: string[];
  antiDpiFeaturesEn?: string[];
  stepByStepSetup: {
    title: string;
    titleEn?: string;
    desc: string;
    descEn?: string;
    inputValues?: Record<string, string>;
  }[];
}

export const INBOUND_TEMPLATES: InboundConfigTemplate[] = [
  {
    protocol: 'VLESS (Reality)',
    recommended: true,
    port: 443,
    security: 'Reality',
    network: 'TCP',
    sniRecommendations: [
      'dl.google.com:443 (Google CDN, reliable across all ISPs)',
      'gateway.icloud.com:443 (Apple iCloud CDN, clean TLS 1.3)',
      'swdist.apple.com:443 (Apple Software Distribution CDN)',
      'www.microsoft.com:443 (Microsoft official portal)',
      'ajax.microsoft.com:443 (Microsoft CDN)',
    ],
    description:
      'Золотой стандарт обхода блокировок ТСПУ и DPI в 2026 году. Не требует покупки домена и сертификатов — маскирует трафик под реальный TLS-хендшейк авторитетного сайта.',
    descriptionEn:
      'The gold standard for bypassing modern DPI and deep packet inspection in 2026. Requires no custom domain or certificates — masquerades traffic as a legitimate TLS 1.3 handshake to an authoritative CDN.',
    antiDpiFeatures: [
      'uTLS Fingerprint: Chrome / Firefox (полная копия отпечатка браузера)',
      'Short IDs: случайный 16-значный шестнадцатеричный ключ (hex)',
      'SpiderX: путь для краулера при несовпадении ключа (например, /)',
      'Fallback: при прямом переходе цензора в браузере отдается реальный сайт маскировки',
    ],
    antiDpiFeaturesEn: [
      'uTLS Fingerprint: Chrome / Firefox (full browser TLS client hello clone)',
      'Short IDs: random 16-character hexadecimal token (hex)',
      'SpiderX: crawler path when handshake key does not match (e.g. /)',
      'Fallback: censors browsing the IP directly receive the genuine masqueraded site',
    ],
    stepByStepSetup: [
      {
        title: '1. Перейдите в раздел "Inbounds" (Подключения)',
        titleEn: '1. Navigate to "Inbounds"',
        desc: 'В левом боковом меню панели 3X-UI нажмите "Inbounds" и нажмите синюю кнопку "+ Add Inbound" (Добавить подключение).',
        descEn: 'In 3X-UI sidebar, select "Inbounds" and click the blue "+ Add Inbound" button.',
      },
      {
        title: '2. Базовые параметры протокола',
        titleEn: '2. Basic Protocol Parameters',
        desc: 'Заполните поля подключения:',
        descEn: 'Fill in the basic inbound fields:',
        inputValues: {
          'Remark (Name)': 'VLESS-REALITY-TCP-443',
          'Protocol': 'vless',
          'Listening IP': '0.0.0.0',
          'Port': '443 (HTTPS default)',
        },
      },
      {
        title: '3. Включение и генерация Reality',
        titleEn: '3. Enable & Generate Reality Settings',
        desc: 'В блоке безопасности выберите Reality и сгенерируйте ключи:',
        descEn: 'Under security section, select Reality and generate keypairs:',
        inputValues: {
          'Transmission (Network)': 'tcp',
          'Security': 'reality',
          'uTLS': 'chrome',
          'Dest (Target Host)': 'dl.google.com:443',
          'SNI (Server Name)': 'dl.google.com',
          'SpiderX': '/',
          'Short IDs': 'Click "Get New" to generate random 16-hex ID',
          'Private/Public Key': 'Click "Get New Key" — generates x25519 keypair',
        },
      },
      {
        title: '4. Добавление клиента',
        titleEn: '4. Add Client Profile',
        desc: 'В поле "Client" нажмите "+ Add Client". Укажите Email (например, client-phone), лимит трафика (0 для безлимита) и срок действия.',
        descEn: 'Click "+ Add Client". Specify an identifier (e.g., client-phone), traffic quota (0 for unlimited) and expiration date.',
      },
      {
        title: '5. Сохранение и экспорт',
        titleEn: '5. Save and Export',
        desc: 'Нажмите "Create" (Создать). В таблице появится подключение со значком QR-кода и кнопки копирования vless:// ссылки.',
        descEn: 'Click "Create". Your inbound is active with instant QR code generation and one-click vless:// link copying.',
      },
    ],
  },
  {
    protocol: 'Shadowsocks (2022)',
    recommended: false,
    port: 8443,
    security: 'None (AEAD 2022)',
    network: 'TCP + UDP',
    sniRecommendations: ['Не требуется (симметричное шифрование блоками) / Not required (symmetric AEAD)'],
    description:
      'Обновленный протокол Shadowsocks-2022 (2022-blake3-aes-128-gcm). Отлично подходит для роутеров Keenetic / OpenWrt и гейминга с низким пингом.',
    descriptionEn:
      'Updated Shadowsocks-2022 AEAD protocol. Excellent for OpenWrt/Keenetic home routers and low-latency gaming, with native hardware acceleration.',
    antiDpiFeatures: [
      'Защита от активного зондирования (replay attacks)',
      'Минимальный оверхед по заголовкам пакетов',
      'Нативная аппаратная поддержка AES-NI на роутерах',
    ],
    antiDpiFeaturesEn: [
      'Hardened against active probing and replay attacks',
      'Minimal packet header overhead for low latency',
      'Native hardware AES-NI / ChaCha acceleration',
    ],
    stepByStepSetup: [
      {
        title: '1. Создание Inbound Shadowsocks',
        titleEn: '1. Create Shadowsocks Inbound',
        desc: 'Нажмите "+ Add Inbound", Protocol: shadowsocks, Port: 8443 (откройте порт в UFW!).',
        descEn: 'Click "+ Add Inbound", Protocol: shadowsocks, Port: 8443 (ensure port is open in UFW!).',
      },
      {
        title: '2. Выбор шифрования и генерация ключа',
        titleEn: '2. Select Cipher & Keypair',
        desc: 'Encryption: 2022-blake3-aes-128-gcm. Нажмите генерацию случайного Base64 пароля (16 байт).',
        descEn: 'Select 2022-blake3-aes-128-gcm and generate a valid 16-byte Base64 key.',
      },
    ],
  },
];

export const CLIENTS_LIST: XUiClientGuide[] = [
  {
    id: 'client-hiddify',
    name: 'Hiddify (Desktop & Mobile)',
    platform: 'Мультиплатформа',
    platformEn: 'Cross-Platform',
    core: 'Sing-box core v1.11+',
    recommendedFor: 'Windows, macOS, Linux, Android, iOS. Универсальный клиент с открытым исходным кодом.',
    recommendedForEn: 'Windows, macOS, Linux, Android, iOS. Clean open-source modern cross-platform client.',
    pros: [
      'Единый удобный интерфейс на русском и английском языках',
      'Поддержка режима TUN (системный прокси для игр и всех приложений)',
      'Автоматический выбор наилучшего маршрута и пинга',
      'Поддержка прямых ссылок подписок 3X-UI',
    ],
    prosEn: [
      'Intuitive unified interface on desktop and mobile',
      'System-wide TUN mode for full OS interception & gaming',
      'Auto-routing and latency testing',
      'Native support for 3X-UI subscription feeds',
    ],
    cons: [
      'ВАЖНО ДЛЯ REALITY: В настройках соединения выключите MUX (мультиплексирование) и Fragment — Reality их не поддерживает!',
      'В Windows требуется запускать от имени администратора для работы TUN-драйвера',
    ],
    consEn: [
      'IMPORTANT FOR REALITY: Disable MUX (multiplexing) and TLS Fragment in profile settings — Reality requires 1:1 TLS streams!',
      'On Windows, run as Administrator for TUN adapter binding',
    ],
    downloadUrl: 'https://github.com/hiddify/hiddify-next/releases/latest',
    downloadLabel: 'Скачать Hiddify (GitHub Releases)',
    downloadLabelEn: 'Download Hiddify (GitHub)',
    importMethod: 'Нажмите "+" -> "Добавить из буфера обмена" (Ctrl+V)',
    importMethodEn: 'Click "+" -> "Add from Clipboard" (or press Ctrl+V)',
    setupInstructions: [
      'Установите Hiddify и запустите его (на Windows — от имени Администратора).',
      'Скопируйте ссылку vless:// или ссылку подписки из 3X-UI.',
      'В приложении нажмите "+" -> "Добавить из буфера обмена".',
      'Откройте настройки добавленного профиля: убедитесь, что MUX = OFF, Fragment = OFF, Security = Reality.',
      'Нажмите большую круглую кнопку подключения в центре экрана.',
    ],
    setupInstructionsEn: [
      'Install and launch Hiddify (on Windows: Run as Administrator).',
      'Copy your vless:// link or subscription URL from 3X-UI.',
      'Click "+" -> "Add from Clipboard".',
      'Review profile config: verify MUX = OFF and Fragment = OFF for Reality.',
      'Click the central circular button to connect.',
    ],
    rating: 5,
  },
  {
    id: 'client-v2rayng',
    name: 'v2rayNG',
    platform: 'Android',
    platformEn: 'Android',
    core: 'Xray-core v24+ / Sing-box',
    recommendedFor: 'Основной и самый стабильный клиент для всех Android-смартфонов и ТВ-приставок.',
    recommendedForEn: 'The benchmark client for all Android devices, tablets, and Android TV boxes.',
    pros: [
      'Полная нативная поддержка всех фич VLESS Reality и подписок',
      'Раздельное туннелирование по приложениям (Split Tunneling)',
      'Низкое энергопотребление и работа без выгрузки системой',
      'Автоматическое обновление GeoIP и GeoSite',
    ],
    prosEn: [
      'Flawless native support for VLESS Reality & subscriptions',
      'Per-app proxy (Split tunneling) for local banking & services',
      'Exceptional battery optimization and background reliability',
      'Built-in GeoIP/GeoSite routing rules',
    ],
    cons: ['Не доступен в российском Google Play (скачивать через GitHub или F-Droid)'],
    consEn: ['Download APK directly via GitHub or F-Droid'],
    downloadUrl: 'https://github.com/2dust/v2rayNG/releases/latest',
    downloadLabel: 'Скачать с GitHub (v2rayNG APK)',
    downloadLabelEn: 'Download from GitHub (APK)',
    importMethod: 'Сканирование QR-кода или импорт из буфера (значок +)',
    importMethodEn: 'Scan QR code with camera or import from clipboard (+ icon)',
    setupInstructions: [
      'Установите APK-файл v2rayNG с официального GitHub репозитория.',
      'В панели 3X-UI откройте QR-код пользователя или скопируйте vless://.',
      'В приложении нажмите "+" в правом верхнем углу -> "Импорт из буфера обмена".',
      'Нажмите на профиль, затем круглую кнопку с буквой V внизу.',
      'Включите "Режим раздельного проксирования", чтобы локальные сервисы работали напрямую.',
    ],
    setupInstructionsEn: [
      'Install APK from the official 2dust/v2rayNG GitHub releases.',
      'In 3X-UI, display the QR code or copy the vless:// URI.',
      'In v2rayNG, tap "+" at top right -> "Import config from clipboard".',
      'Select the imported profile and tap the circular V button at bottom.',
      'Optionally enable per-app proxy for local banking applications.',
    ],
    rating: 5,
  },
  {
    id: 'client-happ',
    name: 'Happ Proxy (V2Box / FoXray / Streisand)',
    platform: 'iOS',
    platformEn: 'iOS / iPadOS',
    core: 'Xray-core / Sing-box',
    recommendedFor: 'iPhone, iPad и Apple Silicon Mac. Топовое решение в App Store.',
    recommendedForEn: 'iPhone, iPad, and macOS (Apple Silicon). Top-rated App Store solution.',
    pros: [
      'Официально доступен в Apple App Store (установка в 1 клик)',
      'Поддержка VLESS Reality с uTLS и автоматической генерацией',
      'Поддержка прямых ссылок подписки (Subscription Link)',
      'Красивый интерфейс с виджетами iOS',
    ],
    prosEn: [
      'Direct 1-click install from Apple App Store',
      'Full VLESS Reality uTLS & flow support',
      'Auto-updating subscription URL integration',
      'Modern iOS design with lock screen widgets',
    ],
    cons: ['Требуется iOS 15.0 или новее'],
    consEn: ['Requires iOS 15.0 or newer'],
    downloadUrl: 'https://apps.apple.com/app/v2box-vless-reality-client/id6446814690',
    downloadLabel: 'Открыть в App Store (V2Box / Happ)',
    downloadLabelEn: 'Open in App Store (V2Box / Happ)',
    importMethod: 'Кнопка "Scan QR" или "Add from Clipboard" в нижнем меню',
    importMethodEn: '"Scan QR" or "Add from Clipboard" in bottom tab bar',
    setupInstructions: [
      'Установите V2Box или Happ из официального Apple App Store.',
      'Скопируйте vless:// ключ из панели 3X-UI на телефоне.',
      'Откройте приложение -> выберите вкладку "Configs" -> нажмите "+" вверху.',
      'Выберите "Import V2ray URL from Clipboard" или отсканируйте QR.',
      'Нажмите "Slide to Connect" на главном экране.',
    ],
    setupInstructionsEn: [
      'Install V2Box or Happ from Apple App Store.',
      'Copy the vless:// link from 3X-UI.',
      'Open app -> go to "Configs" tab -> tap "+" at top right.',
      'Choose "Import from Clipboard" or scan the QR code.',
      'Slide to Connect on the dashboard.',
    ],
    rating: 5,
  },
  {
    id: 'client-v2rayn-win',
    name: 'v2rayN (Windows)',
    platform: 'Windows',
    platformEn: 'Windows',
    core: 'Xray-core official',
    recommendedFor: 'Windows 10/11 для продвинутых пользователей и системных администраторов.',
    recommendedForEn: 'Windows 10/11 power users and system administrators.',
    pros: [
      'Эталонная реализация на чистом официальном Xray-core от 2dust',
      'Минимальное потребление ОЗУ (менее 30 МБ в трее)',
      'Встроенные тесты пинга и проверка Google/YouTube',
      'Гибкая настройка правил PAC и системного прокси',
    ],
    prosEn: [
      'Reference official implementation with upstream Xray-core',
      'Ultra-lightweight memory footprint (<30 MB RAM)',
      'Real-delay ping diagnostics and speed testing',
      'Advanced PAC rules, routing table & system proxy management',
    ],
    cons: ['Требует установленного Microsoft .NET 8.0 Desktop Runtime'],
    consEn: ['Requires Microsoft .NET 8.0 Desktop Runtime'],
    downloadUrl: 'https://github.com/2dust/v2rayN/releases/latest',
    downloadLabel: 'Скачать v2rayN-With-Core.zip (GitHub)',
    downloadLabelEn: 'Download v2rayN-With-Core.zip (GitHub)',
    importMethod: 'Ctrl+V в главном окне программы',
    importMethodEn: 'Press Ctrl+V in the main application window',
    setupInstructions: [
      'Скачайте архив "v2rayN-With-Core.zip".',
      'Распакуйте в удобную папку (например, C:\\Tools\\v2rayN) и запустите v2rayN.exe.',
      'Скопируйте ключ подключения vless:// из веб-панели.',
      'В окне программы нажмите "Серверы" -> "Импортировать из буфера" (или Ctrl+V).',
      'Внизу окна переключите системный прокси или включите галочку "Включить TUN".',
    ],
    setupInstructionsEn: [
      'Download and extract "v2rayN-With-Core.zip".',
      'Run v2rayN.exe.',
      'Copy your vless:// URL from the 3X-UI panel.',
      'In v2rayN, press Ctrl+V to import the server.',
      'At bottom bar, select "Set System Proxy" or toggle "Enable TUN".',
    ],
    rating: 5,
  },
  {
    id: 'client-karing',
    name: 'Karing (Cross-Platform)',
    platform: 'Мультиплатформа',
    platformEn: 'Cross-Platform',
    core: 'Xray / Sing-box / Clash-compatible',
    recommendedFor: 'iOS, Android, Windows, macOS, Apple TV. Самый красивый клиент 2026 года.',
    recommendedForEn: 'iOS, Android, Windows, macOS, Apple TV. Sleek modern client with presets.',
    pros: [
      'Современный интерфейс на Flutter, русская и английская локализация',
      'Доступен в Apple App Store и Google Play',
      'Встроенные предустановленные правила обхода (Bypass RU / Direct)',
      'Поддержка Apple TV (tvOS) для 4K YouTube на телевизоре',
    ],
    prosEn: [
      'Polished modern Flutter UI with full multilingual support',
      'Available directly in Apple App Store and Google Play',
      'Built-in presets for bypassing local domains and government portals',
      'Apple TV (tvOS) support for 4K video playback',
    ],
    cons: ['Новый активный проект, регулярные обновления'],
    consEn: ['Rapidly evolving project with frequent updates'],
    downloadUrl: 'https://karing.app/',
    downloadLabel: 'Официальный сайт Karing (karing.app)',
    downloadLabelEn: 'Official Karing Website (karing.app)',
    importMethod: 'Нажать "+" -> "Импортировать из буфера обмена"',
    importMethodEn: 'Click "+" -> "Import from Clipboard"',
    setupInstructions: [
      'Установите Karing из магазина приложений или сайта karing.app.',
      'Скопируйте ссылку подписки или vless:// ключ из 3X-UI.',
      'В приложении откройте "Профили" -> "+" -> "Импорт из буфера".',
      'Выберите пресет маршрутизации "Обход сайтов РФ".',
      'Нажмите переключатель "Подключиться".',
    ],
    setupInstructionsEn: [
      'Install Karing from your app store or karing.app.',
      'Copy your vless:// link from 3X-UI.',
      'In Karing, go to Profiles -> "+" -> "Import from Clipboard".',
      'Select your preferred routing preset (e.g. Bypass Local).',
      'Toggle Connect.',
    ],
    rating: 5,
  },
];
