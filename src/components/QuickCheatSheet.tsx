/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServerConfig, Language } from '../types';
import { formatCommand } from '../utils/formatters';
import { TRANSLATIONS } from '../data/translations';
import { Terminal, Copy, Search } from 'lucide-react';

interface QuickCheatSheetProps {
  config: ServerConfig;
  onCopy: (text: string, title?: string) => void;
  lang: Language;
}

interface CheatCommand {
  category: 'Мониторинг' | 'Безопасность' | 'VPN 3X-UI' | 'Сеть & Фаервол' | 'Управление';
  command: string;
  description: string;
  descriptionEn?: string;
  isDanger?: boolean;
}

export const QuickCheatSheet: React.FC<QuickCheatSheetProps> = ({ config, onCopy, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const t = TRANSLATIONS[lang];

  const cheatCommands: CheatCommand[] = [
    // VPN 3X-UI
    {
      category: 'VPN 3X-UI',
      command: 'x-ui status',
      description: 'Проверить статус службы 3X-UI и ядра Xray',
      descriptionEn: 'Check active status of 3X-UI service and Xray core',
    },
    {
      category: 'VPN 3X-UI',
      command: 'x-ui log',
      description: 'Смотреть живой лог подключений и ошибок ядра в реальном времени',
      descriptionEn: 'Stream live real-time connection telemetry and core errors',
    },
    {
      category: 'VPN 3X-UI',
      command: 'x-ui restart',
      description: 'Перезапустить службу панели и ядро Xray',
      descriptionEn: 'Restart 3X-UI web service and Xray core daemon',
    },
    {
      category: 'VPN 3X-UI',
      command: 'x-ui resetSettings',
      description: 'Сбросить порт и пароль веб-панели через терминал',
      descriptionEn: 'Reset panel port and administrative credentials via CLI',
      isDanger: true,
    },
    {
      category: 'VPN 3X-UI',
      command: 'tail -n 100 /var/log/xray-access.log',
      description: 'Посмотреть последние 100 подключений клиентов к Reality',
      descriptionEn: 'Inspect last 100 client connections to Reality inbound',
    },

    // Безопасность
    {
      category: 'Безопасность',
      command: 'sudo fail2ban-client status',
      description: 'Показать все активные тюрьмы (sshd, 3x-ui)',
      descriptionEn: 'Display all active Fail2ban jails (sshd, 3x-ui)',
    },
    {
      category: 'Безопасность',
      command: 'sudo fail2ban-client status sshd',
      description: 'Список забаненных хакеров на порту SSH',
      descriptionEn: 'List banned brute-force IPs on the SSH port',
    },
    {
      category: 'Безопасность',
      command: 'sudo fail2ban-client status 3x-ui',
      description: 'Список забаненных взломщиков веб-панели 3X-UI',
      descriptionEn: 'List banned attackers on 3X-UI administrative web portal',
    },
    {
      category: 'Безопасность',
      command: 'sudo fail2ban-client set sshd unbanip 1.2.3.4',
      description: 'Разбанить указанный IP в тюрьме SSH',
      descriptionEn: 'Manually unban specified IP in the sshd jail',
    },
    {
      category: 'Безопасность',
      command: 'sudo tail -f /var/log/fail2ban.log',
      description: 'Лог блокировок Fail2ban в реальном времени',
      descriptionEn: 'Live tail of active Fail2ban ban and unban events',
    },
    {
      category: 'Безопасность',
      command: 'passwd {username}',
      description: 'Сменить пароль пользователя {username}',
      descriptionEn: 'Update system password for user {username}',
    },

    // Сеть & Фаервол
    {
      category: 'Сеть & Фаервол',
      command: 'sudo ufw status verbose',
      description: 'Полный статус фаервола и список всех разрешенных портов',
      descriptionEn: 'Full firewall status and allowed ingress ports report',
    },
    {
      category: 'Сеть & Фаервол',
      command: 'sudo ufw allow 80/tcp comment "Web HTTP"',
      description: 'Открыть порт 80 строго по TCP',
      descriptionEn: 'Allow ingress port 80 strictly via TCP',
    },
    {
      category: 'Сеть & Фаервол',
      command: 'sudo ufw allow 443 comment "VPN Reality (TCP+UDP)"',
      description: 'Открыть 443 порт для комбинированного трафика (TCP и UDP)',
      descriptionEn: 'Allow ingress port 443 for dual TCP and UDP traffic (Reality + QUIC)',
    },
    {
      category: 'Сеть & Фаервол',
      command: 'sysctl net.ipv4.tcp_congestion_control',
      description: 'Проверить включение алгоритма Google BBR',
      descriptionEn: 'Verify active TCP congestion control algorithm (Google BBR)',
    },
    {
      category: 'Сеть & Фаервол',
      command: 'sudo ss -tulpn',
      description: 'Показать все прослушиваемые порты и процессы на сервере',
      descriptionEn: 'List all listening sockets and their parent processes',
    },

    // Мониторинг
    {
      category: 'Мониторинг',
      command: 'htop',
      description: 'Интерактивный диспетчер процессов, CPU и оперативной памяти',
      descriptionEn: 'Interactive terminal process and system memory monitor',
    },
    {
      category: 'Мониторинг',
      command: 'sudo nethogs',
      description: 'Сетевой монитор: какой процесс или VPN-клиент жрет трафик',
      descriptionEn: 'Network monitor: bandwidth breakdown by running process',
    },
    {
      category: 'Мониторинг',
      command: 'sudo ncdu /',
      description: 'Визуальный сканер занятого места на диске',
      descriptionEn: 'Interactive terminal disk space usage explorer',
    },
    {
      category: 'Мониторинг',
      command: 'grep -r "" /sys/module/zswap/parameters/',
      description: 'Проверить работу Zswap сжатия оперативной памяти (zstd)',
      descriptionEn: 'Inspect runtime status of Zswap in-memory RAM compression (zstd)',
    },
    {
      category: 'Мониторинг',
      command: 'sudo journalctl --vacuum-size=200M',
      description: 'Безопасно очистить системный журнал systemd до 200 МБ',
      descriptionEn: 'Safely vacuum systemd journal storage down to 200 MB max',
    },

    // Управление
    {
      category: 'Управление',
      command: 'pm2 status',
      description: 'Список и состояние запущенных Telegram-ботов на Node.js',
      descriptionEn: 'Process dashboard of active Node.js Telegram bots and scripts',
    },
    {
      category: 'Управление',
      command: 'pm2 logs',
      description: 'Смотреть вывод консоли всех ботов в режиме реального времени',
      descriptionEn: 'Stream aggregate real-time stdout and stderr logs of all bots',
    },
    {
      category: 'Управление',
      command: 'sudo reboot',
      description: 'Перезагрузить сервер VPS',
      descriptionEn: 'Safely reboot the VPS host operating system',
      isDanger: true,
    },
  ];

  const categories = lang === 'en'
    ? [
        { id: 'ALL', label: 'All' },
        { id: 'VPN 3X-UI', label: 'VPN 3X-UI' },
        { id: 'Безопасность', label: 'Security' },
        { id: 'Сеть & Фаервол', label: 'Network & Firewall' },
        { id: 'Мониторинг', label: 'Monitoring' },
        { id: 'Управление', label: 'Control & Ops' },
      ]
    : [
        { id: 'ALL', label: 'Все' },
        { id: 'VPN 3X-UI', label: 'VPN 3X-UI' },
        { id: 'Безопасность', label: 'Безопасность' },
        { id: 'Сеть & Фаервол', label: 'Сеть & Фаервол' },
        { id: 'Мониторинг', label: 'Мониторинг' },
        { id: 'Управление', label: 'Управление' },
      ];

  const filteredCommands = cheatCommands.filter((item) => {
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      item.command.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(term));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            {t.cheatTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.cheatDesc}
          </p>
        </div>

        {/* Поиск */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCheatPlaceholder}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Категории */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Список команд сеткой */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredCommands.map((item, idx) => {
          const formatted = formatCommand(item.command, config);
          const desc = lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;

          return (
            <div
              key={idx}
              className={`p-3.5 bg-slate-900 rounded-xl border transition-all flex flex-col justify-between gap-2.5 hover:border-slate-700 ${
                item.isDanger
                  ? 'border-rose-950 bg-slate-900/90'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.category}
                    </span>
                    {item.isDanger && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        {t.dangerBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{desc}</p>
                </div>

                <button
                  onClick={() => onCopy(formatted, desc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-all shrink-0"
                  title={t.copyCmd}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {t.copyCmd}
                </button>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 overflow-x-auto">
                <code className="text-xs font-mono text-cyan-300 whitespace-nowrap">
                  {formatted}
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
