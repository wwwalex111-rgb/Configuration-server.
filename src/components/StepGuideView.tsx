/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StepItem, ServerConfig, Language } from '../types';
import { STEP_GUIDES } from '../data/serverData';
import { TRANSLATIONS } from '../data/translations';
import { formatCommand, generateFullBashScript, generateCheckScript } from '../utils/formatters';
import {
  CheckCircle,
  Copy,
  Terminal,
  FileCode,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Cpu,
  Lock,
  Flame,
  Server,
  Boxes,
  Activity,
  Layers,
  Code,
  Sparkles,
  ShieldCheck,
  Laptop,
} from 'lucide-react';

interface StepGuideViewProps {
  config: ServerConfig;
  completedSteps: number[];
  onToggleStepComplete: (stepId: number) => void;
  onCopy: (text: string, title?: string) => void;
  lang: Language;
}

export const StepGuideView: React.FC<StepGuideViewProps> = ({
  config,
  completedSteps,
  onToggleStepComplete,
  onCopy,
  lang,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [activeScriptTab, setActiveScriptTab] = useState<'deploy' | 'check' | 'windows'>('deploy');
  const [showScriptPreview, setShowScriptPreview] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];
  const fullBashScript = generateFullBashScript(config);
  const checkServerScript = generateCheckScript(config);

  const toggleExpand = (stepId: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <Shield className="w-5 h-5 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-indigo-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-teal-400" />;
      default:
        return <Terminal className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleCopyAllStepCommands = (step: StepItem) => {
    const fullText = step.commands
      .map((cmd) => {
        const desc = lang === 'en' && cmd.descriptionEn ? cmd.descriptionEn : cmd.description;
        return `# ${desc}\n${formatCommand(cmd.command, config)}`;
      })
      .join('\n\n');
    const stepTitle = lang === 'en' && step.titleEn ? step.titleEn : step.title;
    onCopy(fullText, `${lang === 'en' ? 'All commands:' : 'Все команды:'} ${stepTitle}`);
  };

  const progressPercent = Math.round((completedSteps.length / STEP_GUIDES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Прогресс развертывания */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{t.checklistTitle}</h3>
            <p className="text-xs text-slate-400">
              {t.completedProgress} {completedSteps.length} / {STEP_GUIDES.length} ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="w-full md:w-72 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedSteps([1, 2, 3, 4, 5, 6, 7, 8])}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {t.expandAll}
          </button>
          <button
            onClick={() => setExpandedSteps([])}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {t.collapseAll}
          </button>
        </div>
      </div>

      {/* Быстрое авторазвертывание, скрипт проверки и запуск на Windows */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-4">
        {/* Переключатель вкладок скриптов */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveScriptTab('deploy'); setShowScriptPreview(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeScriptTab === 'deploy'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.tabDeployScript}
            </button>

            <button
              onClick={() => { setActiveScriptTab('check'); setShowScriptPreview(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeScriptTab === 'check'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.tabCheckScript}
            </button>

            <button
              onClick={() => { setActiveScriptTab('windows'); setShowScriptPreview(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeScriptTab === 'windows'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              {t.tabWindowsScript}
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {activeScriptTab === 'deploy' && (lang === 'en' ? 'Automated Deployment' : 'Автоматическая установка')}
            {activeScriptTab === 'check' && (lang === 'en' ? 'Audit & Diagnostics' : 'Аудит и самодиагностика')}
            {activeScriptTab === 'windows' && (lang === 'en' ? 'Local 1-Click Launch' : 'Локальный запуск в 1 клик')}
          </span>
        </div>

        {/* Контент вкладки: DEPLOY.SH */}
        {activeScriptTab === 'deploy' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{lang === 'en' ? 'Monolithic Automated Deployment Script (deploy.sh)' : 'Единый скрипт автоматической установки (deploy.sh)'}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    {lang === 'en' ? 'Verified • Zero Syntax Errors' : 'Проверено • Без ошибок'}
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === 'en'
                    ? `Deploys complete server stack: Hardened SSH, passwordless sudo for ${config.username}, BBR, Fail2ban with native journald, UFW, and 3X-UI.`
                    : `Разворачивает сервер целиком: SSH-безопасность, беспарольный sudo для ${config.username}, BBR, Fail2ban с native journald, UFW и 3X-UI.`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowScriptPreview(!showScriptPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Code className="w-4 h-4 text-slate-400" />
                  <span>{showScriptPreview ? t.hidePreview : t.previewScript}</span>
                </button>
                <button
                  onClick={() => onCopy(fullBashScript, lang === 'en' ? 'Full Deployment Script (deploy.sh)' : 'Полный скрипт развертывания (deploy.sh)')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                >
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Copy deploy.sh' : 'Скопировать deploy.sh'}</span>
                </button>
              </div>
            </div>

            {showScriptPreview && (
              <div className="space-y-2 pt-3 border-t border-slate-800/80 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{lang === 'en' ? 'Server command: nano deploy.sh -> bash deploy.sh' : 'Запуск на сервере: nano deploy.sh -> bash deploy.sh'}</span>
                  <span className="text-indigo-300">{fullBashScript.split('\n').length} lines</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-80 select-all leading-relaxed">
                  {fullBashScript}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Контент вкладки: CHECK_SERVER.SH */}
        {activeScriptTab === 'check' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{lang === 'en' ? 'Server Pre-flight & Audit Script (check_server.sh)' : 'Скрипт проверки и аудита сервера (check_server.sh)'}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {lang === 'en' ? '8 Tests • Color Coded' : '8 тестов • Цветной вывод'}
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === 'en'
                    ? `Verifies: 3X-UI process, ports 443 & ${config.panelPort}, NTP clock sync, Fail2ban jails, TCP BBR, and systemd limits.`
                    : `Проверяет: активность 3X-UI, порты 443 и ${config.panelPort}, синхронизацию NTP, статус Fail2ban ([sshd] и [3x-ui]), BBR и лимиты systemd.`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowScriptPreview(!showScriptPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Code className="w-4 h-4 text-slate-400" />
                  <span>{showScriptPreview ? t.hidePreview : t.previewScript}</span>
                </button>
                <button
                  onClick={() => onCopy(checkServerScript, lang === 'en' ? 'Verification script (check_server.sh)' : 'Скрипт проверки (check_server.sh)')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Copy check_server.sh' : 'Скопировать check_server.sh'}</span>
                </button>
              </div>
            </div>

            {/* Команда запуска в одну строку */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">{lang === 'en' ? 'Run on server in 1 line:' : 'Быстрый запуск на сервере в 1 команду:'}</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  nano check.sh &amp;&amp; bash check.sh
                </code>
                <button
                  onClick={() => onCopy('nano check.sh && bash check.sh', lang === 'en' ? 'Launch command' : 'Команда запуска')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Копировать"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {showScriptPreview && (
              <div className="space-y-2 pt-3 border-t border-slate-800/80 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{lang === 'en' ? 'Output: Colored [✔ OK], [✘ ERROR], [⚠ WARNING]' : 'Вывод: цветные статусы [✔ OK], [✘ ОШИБКА], [⚠ ВНИМАНИЕ]'}</span>
                  <span className="text-emerald-400">{checkServerScript.split('\n').length} lines</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-80 select-all leading-relaxed">
                  {checkServerScript}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Контент вкладки: WINDOWS LAUNCHER */}
        {activeScriptTab === 'windows' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{lang === 'en' ? 'How to launch this interactive app on Windows' : 'Как запустить эту интерактивную страницу на Windows'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  {lang === 'en' ? 'No Terminal Needed • 1-Click' : 'Без терминала • В 1 клик'}
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'en'
                  ? 'A ready-to-run start_windows.bat file is included in the project root. Follow these 3 steps:'
                  : 'В проект уже добавлен готовый файл start_windows.bat. Выполните 3 простых шага:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h5 className="text-xs font-bold text-white">{lang === 'en' ? 'Download Project ZIP' : 'Скачайте архив проекта'}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'In the top right menu, click "Export" -> "Download as ZIP" or clone from GitHub. Extract the archive.'
                    : 'В правом верхнем меню выберите «Export to ZIP» или скачайте с GitHub. Распакуйте архив.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h5 className="text-xs font-bold text-white">{lang === 'en' ? 'Install Node.js (Once)' : 'Установите Node.js (1 раз)'}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Download the official LTS installer from nodejs.org if not already installed.'
                    : 'Если Node.js еще не установлен, скачайте официальный установщик LTS с сайта nodejs.org.'}
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h5 className="text-xs font-bold text-white">{lang === 'en' ? 'Click start_windows.bat' : 'Кликните start_windows.bat'}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'en'
                    ? 'Double-click start_windows.bat. It will auto-install dependencies and open the browser.'
                    : 'Дважды кликните по start_windows.bat. Он сам установит библиотеки и откроет страницу в браузере!'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-300">
                {lang === 'en'
                  ? 'start_windows.bat is located in the project root directory.'
                  : 'Файл start_windows.bat уже находится в корневой папке проекта.'}
              </span>
              <button
                onClick={() => onCopy(`@echo off\ncd /d "%~dp0"\ntitle Server Setup and 3X-UI Guide\n\nif not exist "node_modules\\vite\\" (\n    echo [INFO] Installing libraries...\n    call npm.cmd install --legacy-peer-deps\n)\n\nstart "" http://localhost:3000\nif exist "%~dp0node_modules\\vite\\bin\\vite.js" (\n    node "%~dp0node_modules\\vite\\bin\\vite.js" --port=3000 --host=0.0.0.0\n) else (\n    call npm.cmd run dev\n)\npause`, lang === 'en' ? 'start_windows.bat content' : 'Содержимое start_windows.bat')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600/70 text-purple-200 text-xs font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Copy .bat code' : 'Скопировать код .bat'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Список этапов */}
      <div className="space-y-5">
        {STEP_GUIDES.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isExpanded = expandedSteps.includes(step.id);
          const stepTitle = lang === 'en' && step.titleEn ? step.titleEn : step.title;
          const stepSubtitle = lang === 'en' && step.subtitleEn ? step.subtitleEn : step.subtitle;
          const stepBadge = lang === 'en' && step.badgeEn ? step.badgeEn : step.badge;
          const stepWarning = lang === 'en' && step.warningEn ? step.warningEn : step.warning;
          const stepTips = lang === 'en' && step.tipsEn ? step.tipsEn : step.tips;

          return (
            <div
              key={step.id}
              className={`bg-slate-900 border rounded-2xl transition-all shadow-md overflow-hidden ${
                isCompleted
                  ? 'border-emerald-500/30 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700/80'
              }`}
            >
              {/* Заголовок этапа */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/70 bg-slate-900/50">
                <div className="flex items-start md:items-center gap-3.5">
                  <button
                    onClick={() => onToggleStepComplete(step.id)}
                    className={`mt-0.5 md:mt-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                        : 'border-slate-700 hover:border-cyan-400 bg-slate-950 text-transparent'
                    }`}
                    title={isCompleted ? t.stepCompleted : t.stepMarkComplete}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getStepIcon(step.iconName)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                        {lang === 'en' ? `STEP ${step.id}` : `ЭТАП ${step.id}`}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50">
                        {stepBadge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-1">
                      {stepTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{stepSubtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleCopyAllStepCommands(step)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700/60 transition-all"
                    title={lang === 'en' ? 'Copy all commands in this step' : 'Скопировать все команды этого шага разом'}
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'en' ? 'Copy whole step' : 'Скопировать весь этап'}
                  </button>

                  <button
                    onClick={() => toggleExpand(step.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Тело этапа */}
              {isExpanded && (
                <div className="p-5 space-y-4">
                  {/* Предупреждение (если есть) */}
                  {stepWarning && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-rose-300 block mb-0.5">{t.warningTitle}</span>
                        {stepWarning}
                      </div>
                    </div>
                  )}

                  {/* Советы */}
                  {stepTips && stepTips.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                        <Lightbulb className="w-3.5 h-3.5" /> {t.tipsTitle}
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {stepTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Список команд этапа */}
                  <div className="space-y-3 pt-2">
                    {step.commands.map((cmd, idx) => {
                      const formattedCmd = formatCommand(cmd.command, config);
                      const cmdDescription = lang === 'en' && cmd.descriptionEn ? cmd.descriptionEn : cmd.description;

                      return (
                        <div
                          key={cmd.id}
                          className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-cyan-400/80 font-semibold">
                                #{idx + 1}
                              </span>
                              <span className="text-xs text-slate-300 font-medium">
                                {cmdDescription}
                              </span>
                            </div>
                            <button
                              onClick={() => onCopy(formattedCmd, cmdDescription)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-all shrink-0"
                            >
                              <Copy className="w-3 h-3" />
                              {t.copyCmd}
                            </button>
                          </div>

                          {/* Путь к файлу если применимо */}
                          {cmd.filePath && (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                              <FileCode className="w-3 h-3 text-purple-400" />
                              <span>{lang === 'en' ? 'Config file:' : 'Файл конфигурации:'}</span>
                              <span className="text-purple-300">{cmd.filePath}</span>
                            </div>
                          )}

                          {/* Терминальная команда */}
                          <div className="relative group">
                            <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800/60 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
                              {formattedCmd}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
