/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandBadge: string;
  brandDesc: string;
  tabGuide: string;
  tabThreeXUi: string;
  tabSoftware: string;
  tabCheatSheet: string;
  configButtonTooltip: string;
  langToggleTitle: string;

  // Banner
  envTitle: string;
  envDesc: string;
  copyScriptBtn: string;
  downloadScriptBtn: string;
  fullScriptToast: string;
  scriptDownloadedToast: string;
  copiedToast: string;

  // Config Modal
  configModalTitle: string;
  configModalDesc: string;
  usernameLabel: string;
  usernameHint: string;
  sshPortLabel: string;
  sshPortHint: string;
  panelPortLabel: string;
  panelPortHint: string;
  subPortLabel: string;
  subPortHint: string;
  serverIpLabel: string;
  serverIpHint: string;
  sniLabel: string;
  sniHint: string;
  resetBtn: string;
  closeBtn: string;
  localSaveNote: string;

  // Step Guide
  checklistTitle: string;
  checklistDesc: string;
  completedProgress: string;
  expandAll: string;
  collapseAll: string;
  copyCmd: string;
  copiedCmd: string;
  stepCompleted: string;
  stepMarkComplete: string;
  tipsTitle: string;
  warningTitle: string;
  scriptGenTitle: string;
  scriptGenDesc: string;
  tabDeployScript: string;
  tabCheckScript: string;
  tabWindowsScript: string;
  previewScript: string;
  hidePreview: string;

  // 3X-UI View
  threexuiHeaderTitle: string;
  threexuiHeaderDesc: string;
  subtabInbound: string;
  subtabClients: string;
  subtabFaq: string;
  copyVlessExample: string;
  vlessCopiedToast: string;
  openAdminPanel: string;
  platformFilterLabel: string;
  allFilter: string;
  recommendedBadge: string;
  antiDpiTitle: string;
  stepByStepTitle: string;
  prosTitle: string;
  consTitle: string;
  importMethodTitle: string;
  setupInstructionsTitle: string;
  downloadAppBtn: string;
  ratingTitle: string;

  // Software Handbook
  softwareTitle: string;
  softwareDesc: string;
  searchSoftwarePlaceholder: string;
  installLabel: string;
  whyUsedLabel: string;
  configPathLabel: string;
  keyCommandsLabel: string;

  // CheatSheet
  cheatTitle: string;
  cheatDesc: string;
  searchCheatPlaceholder: string;
  dangerBadge: string;

  // Footer
  footerVerified: string;
  footerVless: string;
  footerNode: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: {
    brandTitle: 'VPS Hardening & 3X-UI Suite',
    brandBadge: 'Стандарты 2026',
    brandDesc: 'Пошаговое руководство развертывания, настройка 3X-UI VLESS Reality, клиенты и справочник софта',
    tabGuide: 'Пошаговая инструкция',
    tabThreeXUi: '3X-UI: Подключения & Клиенты',
    tabSoftware: 'Справочник программ & Команды',
    tabCheatSheet: 'Быстрый читшит (Все команды)',
    configButtonTooltip: 'Нажмите, чтобы настроить параметры команд',
    langToggleTitle: 'Switch to English / Переключить на английский',

    envTitle: 'Рабочее окружение:',
    envDesc: 'Команды синхронизированы с вашим архивом конфигурации. Вы можете изменить IP и порты под любой сервер.',
    copyScriptBtn: 'Копировать скрипт .sh',
    downloadScriptBtn: 'Скачать setup.sh',
    fullScriptToast: 'Полный Bash-скрипт скопирован',
    scriptDownloadedToast: 'Скрипт setup-server.sh скачан и скопирован в буфер',
    copiedToast: 'Скопировано в буфер!',

    configModalTitle: 'Параметры вашего сервера',
    configModalDesc: 'Все команды в инструкции динамически адаптируются под эти значения',
    usernameLabel: 'Пользователь (Sudo)',
    usernameHint: 'Не root, для безопасного входа',
    sshPortLabel: 'SSH Порт',
    sshPortHint: 'Порт для удалённого входа по SSH',
    panelPortLabel: 'Порт панели 3X-UI',
    panelPortHint: 'Веб-интерфейс администратора',
    subPortLabel: 'Порт подписок',
    subPortHint: 'Для автообновления клиентов',
    serverIpLabel: 'IP адрес VPS',
    serverIpHint: 'Публичный IPv4 адрес вашего сервера',
    sniLabel: 'Reality Маскировка (SNI)',
    sniHint: 'Домен с чистым TLS 1.3 без редиректов',
    resetBtn: 'Сбросить по умолчанию',
    closeBtn: 'Готово',
    localSaveNote: 'Все параметры сохраняются локально в вашем браузере (localStorage) и не передаются в сеть.',

    checklistTitle: 'Интерактивный чеклист развертывания',
    checklistDesc: 'Отмечайте выполненные пункты галочками. Все команды автоматически содержат ваши параметры.',
    completedProgress: 'Выполнено шагов:',
    expandAll: 'Развернуть все шаги',
    collapseAll: 'Свернуть все',
    copyCmd: 'Копировать',
    copiedCmd: 'Скопировано!',
    stepCompleted: 'Выполнен',
    stepMarkComplete: 'Отметить как выполненный',
    tipsTitle: 'Советы и рекомендации:',
    warningTitle: 'Важное предостережение:',
    scriptGenTitle: 'Генератор автоматических скриптов развертывания',
    scriptGenDesc: 'Готовые монолитные скрипты с проверками синтаксиса и защитой от потери доступа',
    tabDeployScript: '1. Авто-скрипт развертывания (Bash)',
    tabCheckScript: '2. Скрипт проверки и аудита',
    tabWindowsScript: '3. Команды для Windows (PowerShell / SSH)',
    previewScript: 'Показать код скрипта',
    hidePreview: 'Скрыть код скрипта',

    threexuiHeaderTitle: '3X-UI: VLESS Reality, Настройка & Клиенты',
    threexuiHeaderDesc: 'Полная конфигурация маскировки под TLS 1.3, генерация ключей и клиенты для всех платформ',
    subtabInbound: '1. Создание подключения (Inbound)',
    subtabClients: '2. Клиентские приложения (Windows, Android, iOS, Mac)',
    subtabFaq: '3. Диагностика & Anti-DPI (Hiddify, тайм-ауты, ошибки)',
    copyVlessExample: 'Копировать пример vless:// ссылки',
    vlessCopiedToast: 'Пример ссылки VLESS Reality скопирован',
    openAdminPanel: 'Открыть веб-панель 3X-UI',
    platformFilterLabel: 'Платформа:',
    allFilter: 'Все',
    recommendedBadge: 'Рекомендуется',
    antiDpiTitle: 'Механизмы обхода блокировок (Anti-DPI):',
    stepByStepTitle: 'Пошаговый процесс добавления в веб-панели:',
    prosTitle: 'Преимущества:',
    consTitle: 'Особенности и нюансы:',
    importMethodTitle: 'Способ импорта конфигурации:',
    setupInstructionsTitle: 'Порядок настройки:',
    downloadAppBtn: 'Скачать клиент',
    ratingTitle: 'Надежность:',

    softwareTitle: 'Справочник рекомендуемого ПО & Команды управления',
    softwareDesc: 'Полный стек сервисов сервера: фаервол, защита от атак, системный аудит и сетевой тюнинг',
    searchSoftwarePlaceholder: 'Поиск утилиты, команды или описания...',
    installLabel: 'Команда установки:',
    whyUsedLabel: 'Зачем используется:',
    configPathLabel: 'Конфигурация / Расположение:',
    keyCommandsLabel: 'Ключевые команды управления:',

    cheatTitle: 'Быстрый справочник команд (CheatSheet)',
    cheatDesc: 'Все необходимые консольные команды администрирования VPS и 3X-UI в одном месте',
    searchCheatPlaceholder: 'Поиск команды (напр. fail2ban, bbr, journalctl, x-ui)...',
    dangerBadge: 'Внимание',

    footerVerified: 'Проверено по актуальным спецификациям Linux Kernel, OpenSSH, UFW, Fail2ban и 3X-UI (2026)',
    footerVless: 'VLESS Reality + BBR + Zswap',
    footerNode: 'Node.js 22 LTS',
  },
  en: {
    brandTitle: 'VPS Hardening & 3X-UI Suite',
    brandBadge: '2026 Standards',
    brandDesc: 'Step-by-step VPS hardening guide, 3X-UI VLESS Reality setup, client configs & software reference',
    tabGuide: 'Step-by-Step Guide',
    tabThreeXUi: '3X-UI: Inbounds & Clients',
    tabSoftware: 'Software Handbook & Commands',
    tabCheatSheet: 'Quick CheatSheet (All Commands)',
    configButtonTooltip: 'Click to customize server parameters',
    langToggleTitle: 'Переключить на русский / Switch to Russian',

    envTitle: 'Target Environment:',
    envDesc: 'Commands are dynamically synced with your parameters. Change IP and ports for any server anytime.',
    copyScriptBtn: 'Copy .sh script',
    downloadScriptBtn: 'Download setup.sh',
    fullScriptToast: 'Full Bash script copied to clipboard',
    scriptDownloadedToast: 'setup-server.sh downloaded and copied to clipboard',
    copiedToast: 'Copied to clipboard!',

    configModalTitle: 'Your Server Parameters',
    configModalDesc: 'All commands and scripts dynamically adapt to these custom values',
    usernameLabel: 'Sudo Username',
    usernameHint: 'Non-root user for secure SSH login',
    sshPortLabel: 'SSH Port',
    sshPortHint: 'Port for remote SSH access',
    panelPortLabel: '3X-UI Panel Port',
    panelPortHint: 'Admin web dashboard port',
    subPortLabel: 'Subscription Port',
    subPortHint: 'Port for client subscription feeds',
    serverIpLabel: 'VPS IP Address',
    serverIpHint: 'Public IPv4 address of your server',
    sniLabel: 'Reality Masquerade (SNI)',
    sniHint: 'Legitimate domain with TLS 1.3 & no redirects',
    resetBtn: 'Reset to Defaults',
    closeBtn: 'Done',
    localSaveNote: 'All parameters are stored locally in your browser (localStorage) and never transmitted.',

    checklistTitle: 'Interactive Hardening Checklist',
    checklistDesc: 'Check off steps as you complete them. All commands automatically include your server values.',
    completedProgress: 'Completed steps:',
    expandAll: 'Expand all steps',
    collapseAll: 'Collapse all',
    copyCmd: 'Copy',
    copiedCmd: 'Copied!',
    stepCompleted: 'Completed',
    stepMarkComplete: 'Mark as completed',
    tipsTitle: 'Pro Tips & Best Practices:',
    warningTitle: 'Critical Warning:',
    scriptGenTitle: 'Automated Deployment Script Generator',
    scriptGenDesc: 'Production-ready monolithic scripts with syntax validation and lockout protection',
    tabDeployScript: '1. Automated Deployment Script (Bash)',
    tabCheckScript: '2. Pre-flight & Audit Script',
    tabWindowsScript: '3. Windows Commands (PowerShell / SSH)',
    previewScript: 'View script source',
    hidePreview: 'Hide script source',

    threexuiHeaderTitle: '3X-UI: VLESS Reality, Setup & Client Apps',
    threexuiHeaderDesc: 'Complete TLS 1.3 masquerade configuration, keypair generation and multi-platform clients',
    subtabInbound: '1. Create Inbound (VLESS Reality)',
    subtabClients: '2. Client Applications (Windows, Android, iOS, Mac)',
    subtabFaq: '3. Diagnostics & Anti-DPI FAQ (Hiddify, Timeouts, MUX)',
    copyVlessExample: 'Copy sample vless:// link',
    vlessCopiedToast: 'Sample VLESS Reality link copied',
    openAdminPanel: 'Open 3X-UI Web Dashboard',
    platformFilterLabel: 'Platform:',
    allFilter: 'All',
    recommendedBadge: 'Recommended',
    antiDpiTitle: 'Anti-DPI & Censorship Resistance Features:',
    stepByStepTitle: 'Step-by-step 3X-UI Inbound setup:',
    prosTitle: 'Advantages:',
    consTitle: 'Key details & notes:',
    importMethodTitle: 'Config Import Method:',
    setupInstructionsTitle: 'Setup Instructions:',
    downloadAppBtn: 'Download Client',
    ratingTitle: 'Reliability:',

    softwareTitle: 'Recommended Software Handbook & Commands',
    softwareDesc: 'Complete server stack: firewall, intrusion prevention, system telemetry, and network tuning',
    searchSoftwarePlaceholder: 'Search tools, commands, or descriptions...',
    installLabel: 'Installation Command:',
    whyUsedLabel: 'Why it is used:',
    configPathLabel: 'Config / File Path:',
    keyCommandsLabel: 'Key Management Commands:',

    cheatTitle: 'Quick Command CheatSheet',
    cheatDesc: 'All essential VPS hardening and 3X-UI administration commands at your fingertips',
    searchCheatPlaceholder: 'Search command (e.g. fail2ban, bbr, journalctl, x-ui)...',
    dangerBadge: 'Caution',

    footerVerified: 'Verified against Linux Kernel, OpenSSH, UFW, Fail2ban and 3X-UI specifications (2026)',
    footerVless: 'VLESS Reality + BBR + Zswap',
    footerNode: 'Node.js 22 LTS',
  },
};
