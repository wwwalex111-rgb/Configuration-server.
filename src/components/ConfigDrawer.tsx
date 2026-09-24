/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ServerConfig, Language } from '../types';
import { Settings, RefreshCw, X, Shield, Globe, Terminal } from 'lucide-react';
import { DEFAULT_CONFIG } from '../data/serverData';
import { TRANSLATIONS } from '../data/translations';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig;
  onChange: (newConfig: ServerConfig) => void;
  lang: Language;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  lang,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  const handleChange = (field: keyof ServerConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_CONFIG });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/70 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">{t.configModalTitle}</h3>
              <p className="text-xs text-slate-400">{t.configModalDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              {t.usernameLabel}
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="adminuser"
            />
            <span className="text-[11px] text-slate-500 block">{t.usernameHint}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              {t.serverIpLabel}
            </label>
            <input
              type="text"
              value={config.serverIp}
              onChange={(e) => handleChange('serverIp', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="192.0.2.1"
            />
            <span className="text-[11px] text-slate-500 block">{t.serverIpHint}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              {t.sshPortLabel}
            </label>
            <input
              type="number"
              value={config.sshPort}
              onChange={(e) => handleChange('sshPort', Number(e.target.value) || 22)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="22"
            />
            <span className="text-[11px] text-slate-500 block">{t.sshPortHint}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              {t.panelPortLabel}
            </label>
            <input
              type="number"
              value={config.panelPort}
              onChange={(e) => handleChange('panelPort', Number(e.target.value) || 2053)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
              placeholder="2053"
            />
            <span className="text-[11px] text-slate-500 block">{t.panelPortHint}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.subPortLabel}
            </label>
            <input
              type="number"
              value={config.subscriptionPort}
              onChange={(e) => handleChange('subscriptionPort', Number(e.target.value) || 2096)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="2096"
            />
            <span className="text-[11px] text-slate-500 block">{t.subPortHint}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.sniLabel}
            </label>
            <input
              type="text"
              value={config.realitySni}
              onChange={(e) => handleChange('realitySni', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
              placeholder="dl.google.com"
            />
            <span className="text-[11px] text-slate-500 block">{t.sniHint}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{t.localSaveNote}</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.resetBtn}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
