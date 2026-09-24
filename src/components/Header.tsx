/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType, ServerConfig, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Server,
  ShieldCheck,
  Radio,
  Terminal,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  config: ServerConfig;
  onOpenConfig: () => void;
  completedStepsCount: number;
  totalStepsCount: number;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  config,
  onOpenConfig,
  completedStepsCount,
  totalStepsCount,
  lang,
  onToggleLang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Бренд и статус */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  {t.brandTitle}
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3" />
                  {t.brandBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.brandDesc}
              </p>
            </div>
          </div>

          {/* Кнопка смены языка, быстрого бейджа сервера и настроек */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* Переключатель языка RU / EN */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/50 shadow-sm"
              title={t.langToggleTitle}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="tracking-wide">{lang === 'ru' ? 'EN' : 'RU'}</span>
            </button>

            {/* Быстрый бейдж сервера */}
            <button
              onClick={onOpenConfig}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300 transition-all group"
              title={t.configButtonTooltip}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-cyan-300 group-hover:text-cyan-200">{config.username}</span>
              <span className="text-slate-500">@</span>
              <span className="text-slate-200">{config.serverIp}</span>
              <span className="text-slate-500">:{config.sshPort}</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-1 transition-colors" />
            </button>
          </div>
        </div>

        {/* Навигационные вкладки */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          <button
            onClick={() => onSelectTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'guide'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.tabGuide}
            <span className="px-1.5 py-0.2 rounded text-[11px] bg-slate-800 text-slate-300 font-mono">
              {completedStepsCount}/{totalStepsCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('threexui')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'threexui'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-400" />
            {t.tabThreeXUi}
            <span className="px-1.5 py-0.2 rounded text-[11px] bg-purple-500/20 text-purple-300 font-semibold">
              VLESS Reality
            </span>
          </button>

          <button
            onClick={() => onSelectTab('software')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'software'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {t.tabSoftware}
          </button>

          <button
            onClick={() => onSelectTab('cheatsheet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'cheatsheet'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            {t.tabCheatSheet}
          </button>
        </div>
      </div>
    </header>
  );
};
