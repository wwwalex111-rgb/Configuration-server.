/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, ServerConfig, Language } from './types';
import { DEFAULT_CONFIG, STEP_GUIDES } from './data/serverData';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { ConfigDrawer } from './components/ConfigDrawer';
import { StepGuideView } from './components/StepGuideView';
import { ThreeXUiGuideView } from './components/ThreeXUiGuideView';
import { SoftwareHandbook } from './components/SoftwareHandbook';
import { QuickCheatSheet } from './components/QuickCheatSheet';
import { Toast } from './components/Toast';
import { copyToClipboard, generateFullBashScript } from './utils/formatters';
import { Download, ShieldCheck, Copy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Язык интерфейса: RU / EN
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('vps_guide_lang');
      return saved === 'en' || saved === 'ru' ? saved : 'ru';
    } catch {
      return 'ru';
    }
  });

  const t = TRANSLATIONS[lang];

  // Конфигурация сервера из localStorage
  const [config, setConfig] = useState<ServerConfig>(() => {
    try {
      const saved = localStorage.getItem('vps_server_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Отмеченные шаги чеклиста
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('vps_completed_steps');
      return saved ? JSON.parse(saved) : [1, 2, 4, 5, 6];
    } catch {
      return [1, 2, 4, 5, 6];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vps_guide_lang', lang);
    } catch (e) {
      console.error(e);
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('vps_server_config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('vps_completed_steps', JSON.stringify(completedSteps));
    } catch (e) {
      console.error(e);
    }
  }, [completedSteps]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ru' ? 'en' : 'ru'));
  };

  const handleCopy = async (text: string, title?: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setToastMessage(title || text.slice(0, 45) + (text.length > 45 ? '...' : ''));
      setTimeout(() => {
        setToastMessage(null);
      }, 2500);
    }
  };

  const handleToggleStepComplete = (stepId: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleDownloadScript = () => {
    const script = generateFullBashScript(config);
    const blob = new Blob([script], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setup-server-${config.username}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    handleCopy(script, t.scriptDownloadedToast);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Верхняя панель навигации */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        config={config}
        onOpenConfig={() => setIsConfigOpen(true)}
        completedStepsCount={completedSteps.length}
        totalStepsCount={STEP_GUIDES.length}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Основной контент */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Информационный баннер */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {t.envTitle} {config.username}@{config.serverIp}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {t.envDesc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleCopy(generateFullBashScript(config), t.fullScriptToast)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-xs font-medium text-slate-200 border border-slate-700/80 transition-all shadow-sm"
              title={t.copyScriptBtn}
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              {t.copyScriptBtn}
            </button>

            <button
              onClick={handleDownloadScript}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20"
              title={t.downloadScriptBtn}
            >
              <Download className="w-3.5 h-3.5" />
              {t.downloadScriptBtn}
            </button>
          </div>
        </div>

        {/* Виджет вкладок */}
        {activeTab === 'guide' && (
          <StepGuideView
            config={config}
            completedSteps={completedSteps}
            onToggleStepComplete={handleToggleStepComplete}
            onCopy={handleCopy}
            lang={lang}
          />
        )}

        {activeTab === 'threexui' && (
          <ThreeXUiGuideView config={config} onCopy={handleCopy} lang={lang} />
        )}

        {activeTab === 'software' && (
          <SoftwareHandbook config={config} onCopy={handleCopy} lang={lang} />
        )}

        {activeTab === 'cheatsheet' && (
          <QuickCheatSheet config={config} onCopy={handleCopy} lang={lang} />
        )}
      </main>

      {/* Подвал */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.footerVerified}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{lang === 'en' ? 'Zero Cache' : 'Без кэша'}</span>
            <span>•</span>
            <span>{t.footerVless}</span>
            <span>•</span>
            <span>{t.footerNode}</span>
          </div>
        </div>
      </footer>

      {/* Модальное окно конфигурации параметров */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onChange={setConfig}
        lang={lang}
      />

      {/* Всплывающее уведомление о копировании */}
      <Toast message={toastMessage} lang={lang} />
    </div>
  );
}
