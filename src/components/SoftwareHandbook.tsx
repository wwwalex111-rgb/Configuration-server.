/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SoftwareTool, ServerConfig, Language } from '../types';
import { SOFTWARE_TOOLS } from '../data/serverData';
import { TRANSLATIONS } from '../data/translations';
import { formatCommand } from '../utils/formatters';
import {
  Shield,
  Radio,
  Zap,
  Cpu,
  Lock,
  Boxes,
  Activity,
  Copy,
  Search,
  CheckCircle,
  FileText,
  Settings,
  FolderTree,
} from 'lucide-react';

interface SoftwareHandbookProps {
  config: ServerConfig;
  onCopy: (text: string, title?: string) => void;
  lang: Language;
}

export const SoftwareHandbook: React.FC<SoftwareHandbookProps> = ({ config, onCopy, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const t = TRANSLATIONS[lang];

  const categories = lang === 'en'
    ? [
        { id: 'ALL', label: 'All' },
        { id: 'VPN & Сеть', label: 'VPN & Network' },
        { id: 'Безопасность', label: 'Security' },
        { id: 'Производительность', label: 'Performance' },
        { id: 'Среда исполнения', label: 'Runtime' },
        { id: 'Мониторинг', label: 'Monitoring' },
        { id: 'Утилиты', label: 'Utilities' },
      ]
    : [
        { id: 'ALL', label: 'Все' },
        { id: 'VPN & Сеть', label: 'VPN & Сеть' },
        { id: 'Безопасность', label: 'Безопасность' },
        { id: 'Производительность', label: 'Производительность' },
        { id: 'Среда исполнения', label: 'Среда исполнения' },
        { id: 'Мониторинг', label: 'Мониторинг' },
        { id: 'Утилиты', label: 'Утилиты' },
      ];

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-5 h-5 text-orange-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-indigo-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-teal-400" />;
      default:
        return <Settings className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredTools = SOFTWARE_TOOLS.filter((tool) => {
    const matchCategory = selectedCategory === 'ALL' || tool.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      tool.name.toLowerCase().includes(term) ||
      tool.description.toLowerCase().includes(term) ||
      (tool.descriptionEn && tool.descriptionEn.toLowerCase().includes(term)) ||
      tool.keyCommands.some(
        (c) =>
          c.cmd.toLowerCase().includes(term) ||
          c.desc.toLowerCase().includes(term) ||
          (c.descEn && c.descEn.toLowerCase().includes(term))
      );
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Верхняя плашка поиска и описания */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.softwareTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.softwareDesc}
            </p>
          </div>

          {/* Строка поиска */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchSoftwarePlaceholder}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Карточки программ */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTools.map((tool) => {
          const toolDesc = lang === 'en' && tool.descriptionEn ? tool.descriptionEn : tool.description;
          const toolWhy = lang === 'en' && tool.whyUsedEn ? tool.whyUsedEn : tool.whyUsed;
          const toolCat = lang === 'en' && tool.categoryEn ? tool.categoryEn : tool.category;

          return (
            <div
              key={tool.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5 hover:border-slate-700/80 transition-all"
            >
              {/* Шапка программы */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getToolIcon(tool.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{tool.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                        {tool.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{toolDesc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50">
                    {toolCat}
                  </span>
                </div>
              </div>

              {/* Зачем используется и метаданные */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 md:col-span-2">
                  <span className="text-slate-400 font-semibold block mb-1">{t.whyUsedLabel}</span>
                  <p className="text-slate-200 leading-relaxed">{toolWhy}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 font-mono">
                  {tool.configLocation && (
                    <div className="truncate text-slate-300" title={tool.configLocation}>
                      <span className="text-slate-500">{lang === 'en' ? 'Config: ' : 'Конфиг: '}</span>
                      <span className="text-purple-400">{tool.configLocation}</span>
                    </div>
                  )}
                  {tool.serviceName && (
                    <div className="truncate text-slate-300">
                      <span className="text-slate-500">{lang === 'en' ? 'Service: ' : 'Служба: '}</span>
                      <span className="text-emerald-400">{formatCommand(tool.serviceName, config)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Команда установки программы */}
              {tool.installCommand && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      {t.installLabel}
                    </span>
                    <button
                      onClick={() => onCopy(formatCommand(tool.installCommand!, config), `${t.installLabel} ${tool.name}`)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-200 text-xs font-medium transition-colors border border-indigo-500/30"
                      title={t.copyCmd}
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.copyCmd}</span>
                    </button>
                  </div>
                  <code className="text-xs font-mono text-cyan-300 block bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 break-all select-all">
                    {formatCommand(tool.installCommand, config)}
                  </code>
                </div>
              )}

              {/* Таблица основных команд */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.keyCommandsLabel}
                </h4>

                <div className="space-y-2">
                  {tool.keyCommands.map((item, idx) => {
                    const formatted = formatCommand(item.cmd, config);
                    const desc = lang === 'en' && item.descEn ? item.descEn : item.desc;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-colors"
                      >
                        <div className="space-y-0.5 overflow-hidden">
                          <code className="text-xs font-mono text-cyan-300 font-semibold block truncate">
                            {formatted}
                          </code>
                          <span className="text-xs text-slate-400">{desc}</span>
                        </div>

                        <button
                          onClick={() => onCopy(formatted, desc)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-all shrink-0 self-end sm:self-auto border border-slate-700/60"
                          title={t.copyCmd}
                        >
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t.copyCmd}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
