/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServerConfig, Language } from '../types';
import { INBOUND_TEMPLATES, CLIENTS_LIST, XUiClientGuide, InboundConfigTemplate } from '../data/threeXUiGuideData';
import { TRANSLATIONS } from '../data/translations';
import { formatCommand } from '../utils/formatters';
import {
  Radio,
  Smartphone,
  Laptop,
  Apple,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Zap,
  Globe,
  HelpCircle,
  Share2,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ThreeXUiGuideViewProps {
  config: ServerConfig;
  onCopy: (text: string, title?: string) => void;
  lang: Language;
}

export const ThreeXUiGuideView: React.FC<ThreeXUiGuideViewProps> = ({ config, onCopy, lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'create-inbound' | 'clients' | 'faq-antidpi'>('create-inbound');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Все');
  const [activeTemplateIndex, setActiveTemplateIndex] = useState<number>(0);

  const t = TRANSLATIONS[lang];

  const platforms = lang === 'en'
    ? [
        { key: 'Все', label: 'All' },
        { key: 'Android', label: 'Android' },
        { key: 'iOS', label: 'iOS' },
        { key: 'Windows', label: 'Windows' },
        { key: 'Мультиплатформа', label: 'Cross-Platform' },
      ]
    : [
        { key: 'Все', label: 'Все' },
        { key: 'Android', label: 'Android' },
        { key: 'iOS', label: 'iOS' },
        { key: 'Windows', label: 'Windows' },
        { key: 'Мультиплатформа', label: 'Мультиплатформа' },
      ];

  const filteredClients = CLIENTS_LIST.filter(
    (c) => selectedPlatform === 'Все' || c.platform === selectedPlatform || c.platform === 'Мультиплатформа'
  );

  const currentTemplate: InboundConfigTemplate = INBOUND_TEMPLATES[activeTemplateIndex];

  // Пример ссылки vless для наглядности
  const mockVlessLink = `vless://e4d8f1a2-3b4c-4d5e-8f90-123456789abc@${config.serverIp}:443?type=tcp&security=reality&pbk=Jm9f8K2Lp4N1QwErTyUiOpAsDfGhJkLzXcVbNm12345&fp=chrome&sni=${config.realitySni}&sid=a1b2c3d4e5f6&spx=%2F#VLESS-REALITY-${config.username}`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Главный заголовок и навигация под-вкладок */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                {lang === 'en' ? '3X-UI v2.5+ Guide (MHSanaei)' : 'Руководство 3X-UI v2.5+ (MHSanaei)'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t.brandBadge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.threexuiHeaderTitle}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {t.threexuiHeaderDesc}
            </p>
          </div>

          {/* Быстрая ссылка на веб-панель */}
          <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-mono uppercase text-slate-400">
              {lang === 'en' ? '3X-UI Admin Dashboard URL:' : 'Вход в установленную панель:'}
            </span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                http://{config.serverIp}:{config.panelPort}
              </code>
              <button
                onClick={() => onCopy(`http://${config.serverIp}:${config.panelPort}`, lang === 'en' ? 'Panel URL copied' : 'URL панели скопирован')}
                className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 hover:text-white transition-colors"
                title={lang === 'en' ? 'Copy dashboard URL' : 'Скопировать адрес панели'}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Переключатель вкладок секции */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('create-inbound')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSubTab === 'create-inbound'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            {t.subtabInbound}
          </button>

          <button
            onClick={() => setActiveSubTab('clients')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSubTab === 'clients'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            {t.subtabClients}
          </button>

          <button
            onClick={() => setActiveSubTab('faq-antidpi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSubTab === 'faq-antidpi'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {t.subtabFaq}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ВКЛАДКА 1: ПОШАГОВОЕ СОЗДАНИЕ INBOUND И ПОЛЬЗОВАТЕЛЕЙ */}
      {/* ========================================================================= */}
      {activeSubTab === 'create-inbound' && (
        <div className="space-y-6">
          {/* Селектор протокола (Reality vs Shadowsocks-2022) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INBOUND_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.protocol}
                onClick={() => setActiveTemplateIndex(idx)}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  activeTemplateIndex === idx
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base">{tmpl.protocol}</h4>
                      <span className="text-xs text-slate-400">
                        {lang === 'en' ? `Port: ${tmpl.port} • Network: ${tmpl.network}` : `Порт: ${tmpl.port} • Сеть: ${tmpl.network}`}
                      </span>
                    </div>
                  </div>
                  {tmpl.recommended && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {t.recommendedBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {lang === 'en' && tmpl.descriptionEn ? tmpl.descriptionEn : tmpl.description}
                </p>
              </button>
            ))}
          </div>

          {/* Интерактивная карточка пошаговой настройки выбранного протокола */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{t.stepByStepTitle}</span>
                  <span className="text-cyan-400">{currentTemplate.protocol}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'en' && currentTemplate.descriptionEn ? currentTemplate.descriptionEn : currentTemplate.description}
                </p>
              </div>

              {/* Пример vless:// ссылки */}
              {currentTemplate.protocol === 'VLESS (Reality)' && (
                <button
                  onClick={() => onCopy(mockVlessLink, t.vlessCopiedToast)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700 transition-colors shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyVlessExample}</span>
                </button>
              )}
            </div>

            {/* Защита от цензуры */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {t.antiDpiTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {(lang === 'en' && currentTemplate.antiDpiFeaturesEn ? currentTemplate.antiDpiFeaturesEn : currentTemplate.antiDpiFeatures).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Шаги настройки */}
            <div className="space-y-4 pt-2">
              {currentTemplate.stepByStepSetup.map((step, idx) => {
                const title = lang === 'en' && step.titleEn ? step.titleEn : step.title;
                const desc = lang === 'en' && step.descEn ? step.descEn : step.desc;

                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{title}</h4>
                    </div>

                    <p className="text-xs text-slate-300 pl-8 leading-relaxed">{desc}</p>

                    {/* Поля формы для наглядности */}
                    {step.inputValues && (
                      <div className="pl-8 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                          {Object.entries(step.inputValues).map(([key, val]) => (
                            <div key={key} className="flex flex-col gap-0.5">
                              <span className="text-[11px] text-slate-400 font-mono">{key}</span>
                              <span className="font-mono text-cyan-300 font-medium truncate">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ВКЛАДКА 2: КЛИЕНТЫ ДЛЯ УСТРОЙСТВ */}
      {/* ========================================================================= */}
      {activeSubTab === 'clients' && (
        <div className="space-y-6">
          {/* Фильтр по платформе */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">{t.platformFilterLabel}</span>
            {platforms.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPlatform(p.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedPlatform === p.key
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Список карточек клиентов */}
          <div className="grid grid-cols-1 gap-6">
            {filteredClients.map((client) => {
              const rec = lang === 'en' && client.recommendedForEn ? client.recommendedForEn : client.recommendedFor;
              const pros = lang === 'en' && client.prosEn ? client.prosEn : client.pros;
              const cons = lang === 'en' && client.consEn ? client.consEn : client.cons;
              const importM = lang === 'en' && client.importMethodEn ? client.importMethodEn : client.importMethod;
              const steps = lang === 'en' && client.setupInstructionsEn ? client.setupInstructionsEn : client.setupInstructions;
              const dLabel = lang === 'en' && client.downloadLabelEn ? client.downloadLabelEn : client.downloadLabel;

              return (
                <div
                  key={client.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-slate-700/80 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{client.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {lang === 'en' && client.platformEn ? client.platformEn : client.platform}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-slate-400">
                          {client.core}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{rec}</p>
                    </div>

                    <a
                      href={client.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 shrink-0 self-start sm:self-auto"
                    >
                      <span>{t.downloadAppBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Плюсы */}
                    <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.prosTitle}
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Минусы / Особенности */}
                    <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {t.consTitle}
                      </span>
                      {cons && cons.length > 0 ? (
                        <ul className="space-y-1.5 text-slate-300">
                          {cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400">{lang === 'en' ? 'No known issues.' : 'Существенных минусов не обнаружено.'}</span>
                      )}

                      {/* Способ импорта */}
                      <div className="pt-2 border-t border-slate-800/80 mt-2">
                        <span className="text-[11px] text-cyan-400 font-semibold block mb-0.5">
                          {t.importMethodTitle}
                        </span>
                        <span className="text-slate-300">{importM}</span>
                      </div>
                    </div>
                  </div>

                  {/* Пошаговая инструкция первого запуска */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t.setupInstructionsTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {steps.map((inst, iIdx) => (
                        <div
                          key={iIdx}
                          className="bg-slate-950 p-3 rounded-xl border border-slate-800/70 flex flex-col gap-1.5 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {iIdx + 1}
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{inst}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ВКЛАДКА 3: ЗАЩИТА ОТ БЛОКИРОВОК ТСПУ И ЧАСТЫЕ ВОПРОСЫ */}
      {/* ========================================================================= */}
      {activeSubTab === 'faq-antidpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Тонкости VLESS Reality */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Why Reality in 2026?' : 'Почему именно Reality в 2026 году?'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Mechanics against DPI & SNI whitelist filters' : 'Принцип работы против DPI и белых списков'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Legacy VPN protocols (OpenVPN, WireGuard, plain Shadowsocks) have distinct packet signatures easily blocked by DPI filters.'
                  : 'Старые протоколы (OpenVPN, WireGuard, обычный Shadowsocks) имеют узнаваемый заголовок пакетов и легко глушатся системами ТСПУ.'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-semibold">VLESS Reality</strong>{' '}
                {lang === 'en'
                  ? 'completely resolves this: it borrows the TLS certificate of an authoritative site (e.g. dl.google.com). Direct censor probes receive the authentic masqueraded site, making your node indistinguishable from a major CDN.'
                  : 'полностью устраняет эту уязвимость: он крадет TLS-сертификат реального сайта (например, dl.google.com). Если цензор попытается отправить зонд на ваш сервер по HTTPS в браузере, ваш сервер перенаправит его на официальный сервер Google.'}
              </p>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-amber-400 font-bold block">
                  {lang === 'en' ? 'SNI Selection Rule:' : 'Правило выбора SNI:'}
                </span>
                <span className="text-slate-300">
                  {lang === 'en'
                    ? 'Always choose high-availability foreign CDNs with clean TLS 1.3 and H2 (HTTP/2). Never use domains with 301/302 redirects.'
                    : 'Выбирайте зарубежные CDN с чистым TLS 1.3 и поддержкой протокола H2 (HTTP/2). Не используйте vk.com, yandex.ru или сайты с 301/302 редиректом.'}
                </span>
              </div>
            </div>

            {/* Специальная карточка: Hiddify тайм-аут и диагностика */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Hiddify Timeout Troubleshooting' : 'Почему в Hiddify таймаут, хотя другой клиент работает?'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Top causes of connection failure in Hiddify & Sing-box' : 'Главные причины сбоя подключения в Hiddify и Sing-box'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-cyan-300 block">
                    {lang === 'en' ? '1. Disable MUX (Multiplexing):' : '1. Выключите MUX (Мультиплексирование):'}
                  </span>
                  <p className="text-slate-400">
                    {lang === 'en'
                      ? 'VLESS Reality prohibits MUX. In Hiddify profile settings, ensure MUX is OFF. MUX alters TLS stream packet sizes, causing instant server disconnects.'
                      : 'Reality не поддерживает MUX! В настройках профиля Hiddify переведите MUX в положение "Выключено" (Disable). MUX ломает структуру TLS потока.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-amber-300 block">
                    {lang === 'en' ? '2. Turn OFF TLS Fragment:' : '2. Отключите TLS Fragment:'}
                  </span>
                  <p className="text-slate-400">
                    {lang === 'en'
                      ? 'Fragmenting packets interferes with the Reality server handshake. Disable TLS Fragment in client settings.'
                      : 'Фрагментация пакетов TLS ломает проверку ключа Reality на сервере. Выключите Fragment в настройках Hiddify.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="font-bold text-emerald-300 block">
                    {lang === 'en' ? '3. Run as Admin & Check TUN Adapter:' : '3. Запуск от имени Администратора:'}
                  </span>
                  <p className="text-slate-400">
                    {lang === 'en'
                      ? 'In Windows, TUN mode requires administrator privileges to bind the Wintun adapter. If missing, switch to System Proxy mode.'
                      : 'В Windows режим TUN требует создания виртуального адаптера Wintun. Запустите Hiddify от имени Администратора или переключитесь в режим "Системный прокси".'}
                  </p>
                </div>
              </div>
            </div>

            {/* Настройка ссылок подписки (Subscription) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Dynamic Subscription Feeds' : 'Подписки для автоматического обновления'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Effortless client config updates' : 'Удобная раздача десяткам пользователей'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Rather than manually distributing new keys when rotating ports or domains, 3X-UI includes an embedded subscription server.'
                  : 'Вместо того чтобы вручную пересылать пользователям новые ключи при смене сервера или порта, в 3X-UI есть встроенный сервер подписок.'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Give users a persistent subscription URL once. Client apps (v2rayNG, Happ, Karing) auto-fetch updated nodes every 12–24 hours.'
                  : 'Пользователь получает постоянную ссылку один раз, и его приложение автоматически скачивает свежие конфигурации.'}
              </p>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-emerald-400 font-bold block">
                  {lang === 'en' ? 'How to enable in panel:' : 'Как включить в панели:'}
                </span>
                <span className="text-slate-300">
                  {lang === 'en'
                    ? `Panel Settings -> Subscription Settings -> Enable Sub Server on port ${config.subscriptionPort} with path /sub/.`
                    : `Настройки панели (Panel Settings) -> Subscription Settings -> включите Sub Enable, порт ${config.subscriptionPort} и задайте Sub URI (например, /sub/).`}
                </span>
              </div>
            </div>

            {/* Блокировка торрентов в Xray */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Mandatory: BitTorrent Protocol Blocking' : 'Обязательно: блокировка BitTorrent'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' ? 'Protect VPS against DMCA copyright complaints' : 'Защита VPS от жалоб правообладателей (DMCA)'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'If a client downloads torrents over your server, your hosting provider will receive DMCA notices and may terminate the VPS without refunds.'
                  : 'Если кто-то из пользователей запустит торрент через ваш сервер, хостинг-провайдер получит абузу и может заблокировать сервер без возврата средств.'}
              </p>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-cyan-400 font-bold block">
                  {lang === 'en' ? 'Enforce blocking in 3X-UI:' : 'Как запретить торренты в 3X-UI:'}
                </span>
                <span className="text-slate-300 font-mono">
                  Xray Settings -&gt; Routing Rules -&gt; protocol: bittorrent -&gt; block
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
