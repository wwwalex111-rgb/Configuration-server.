/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditFinding, ServerConfig, SeverityLevel } from '../types';
import { AUDIT_FINDINGS } from '../data/serverData';
import { formatCommand } from '../utils/formatters';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Info,
  ShieldCheck,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface AuditViewProps {
  config: ServerConfig;
  onCopy: (text: string, title?: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ config, onCopy }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('Все');

  const categories = ['Все', 'Скрипты и ссылки', 'Безопасность', 'Сетевой стек', 'Система и логи', 'VPN & Сеть'];
  const severities = ['Все', 'critical', 'high', 'medium'];

  const filteredFindings = AUDIT_FINDINGS.filter((finding) => {
    const matchCat = selectedCategory === 'Все' || finding.category === selectedCategory;
    const matchSev = selectedSeverity === 'Все' || finding.severity === selectedSeverity;
    return matchCat && matchSev;
  });

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'critical':
        return {
          label: 'Критическая ошибка',
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      case 'high':
        return {
          label: 'Высокий риск',
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      case 'medium':
        return {
          label: 'Оптимизация / Неточность',
          bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
          icon: <Info className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: 'Рекомендация',
          bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Сводный обзор аудита */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Результаты технического аудита команд из файла
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Обнаружено 8 критических и архитектурных неточностей
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              В исходном файле присутствовали оборванные curl-ссылки, риск потери SSH-доступа, блокировка мобильного UDP фаерволом, устаревший logpath для Fail2ban и 3 лишних перезагрузки при настройке Zswap. Ниже приведен детальный разбор каждой ошибки и исправленные варианты по стандартам 2026 года.
            </p>
          </div>

          {/* Карточки метрик */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-950/80 border border-rose-500/30 p-3.5 rounded-xl text-center">
              <div className="text-2xl font-bold text-rose-400">2</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Критических сбоя</div>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl text-center">
              <div className="text-2xl font-bold text-amber-400">3</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Высоких риска</div>
            </div>
            <div className="bg-slate-950/80 border border-yellow-500/30 p-3.5 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-400">3</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Неоптимальности</div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5" /> Категория:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Список ошибок с diff сравнением */}
      <div className="space-y-4">
        {filteredFindings.map((item, index) => {
          const badge = getSeverityBadge(item.severity);
          const formattedFixed = formatCommand(item.fixedSnippet, config);

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                  <h3 className="font-semibold text-base text-white">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                    {item.category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md border flex items-center gap-1 font-medium ${badge.bg}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Описание проблемы */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Было в исходном файле */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> В исходном файле (с ошибкой):
                    </span>
                  </div>
                  <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3.5 font-mono text-xs text-rose-200 overflow-x-auto whitespace-pre leading-relaxed">
                    {item.originalSnippet}
                  </div>
                </div>

                {/* Исправлено нами */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Как правильно (Стандарты 2026):
                    </span>
                    <button
                      onClick={() => onCopy(formattedFixed, item.title)}
                      className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 px-2 py-0.5 rounded-md transition-all"
                    >
                      <Copy className="w-3 h-3" />
                      Копировать
                    </button>
                  </div>
                  <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3.5 font-mono text-xs text-emerald-200 overflow-x-auto whitespace-pre leading-relaxed">
                    {formattedFixed}
                  </div>
                </div>
              </div>

              {/* Анализ и источник */}
              <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">В чем суть проблемы и риски:</span>
                  <p className="text-slate-300 leading-relaxed">{item.problemDescription}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">
                    Почему это критично & Источники 2026:
                  </span>
                  <p className="text-slate-300 leading-relaxed mb-1.5">{item.whyItMatters}</p>
                  <p className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {item.sources2026}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Дополнительные практические рекомендации 2026 */}
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Дополнительные рекомендации по безопасности (2026)</h3>
            <p className="text-xs text-slate-400">Форумы 4PDA, NTC и каналы сетевых инженеров</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-cyan-300">1. Маскировка Reality (Anti-GFW)</h4>
            <p className="text-slate-300 leading-relaxed">
              Не используйте в качестве SNI российские домены или заблокированные ресурсы. Выбирайте зарубежные CDN с чистым TLS 1.3: <code className="text-amber-300">dl.google.com</code>, <code className="text-amber-300">gateway.icloud.com</code>, <code className="text-amber-300">swdist.apple.com</code>.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-cyan-300">2. Блокировка BitTorrent</h4>
            <p className="text-slate-300 leading-relaxed">
              Обязательно оставляйте правило блокировки протокола <code className="text-rose-300">bittorrent</code> в роутинге Xray на сервере. Хостинг Aeza и зарубежные площадки моментально присылают абузы за P2P-трафик вплоть до блокировки IP.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-cyan-300">3. Автобэкап базы 3X-UI</h4>
            <p className="text-slate-300 leading-relaxed">
              База ключей пользователей хранится в файле <code className="text-purple-300">/etc/x-ui/x-ui.db</code>. Рекомендуется настроить отправку резервной копии этого sqlite-файла в приватный Telegram-чат раз в неделю.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
