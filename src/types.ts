/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ru' | 'en';

export type TabType = 'guide' | 'threexui' | 'software' | 'cheatsheet';

export interface CommandItem {
  id: string;
  command: string;
  description: string;
  descriptionEn?: string;
  danger?: boolean;
  notes?: string;
  notesEn?: string;
  isConfigTemplate?: boolean;
  filePath?: string;
  fileContent?: string;
}

export interface StepItem {
  id: number;
  slug: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  badge: string;
  badgeEn?: string;
  iconName: string;
  commands: CommandItem[];
  tips?: string[];
  tipsEn?: string[];
  warning?: string;
  warningEn?: string;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'info';

export interface AuditFinding {
  id: string;
  title: string;
  titleEn?: string;
  severity: SeverityLevel;
  category: 'Безопасность' | 'Сетевой стек' | 'Скрипты и ссылки' | 'Система и логи' | 'VPN & Сеть';
  originalSnippet: string;
  fixedSnippet: string;
  problemDescription: string;
  problemDescriptionEn?: string;
  whyItMatters: string;
  whyItMattersEn?: string;
  sources2026: string;
}

export interface SoftwareCommand {
  cmd: string;
  desc: string;
  descEn?: string;
  category?: string;
}

export interface SoftwareTool {
  id: string;
  name: string;
  version: string;
  category: 'Безопасность' | 'VPN & Сеть' | 'Производительность' | 'Среда исполнения' | 'Мониторинг' | 'Утилиты';
  categoryEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  whyUsed: string;
  whyUsedEn?: string;
  installCommand?: string;
  configLocation?: string;
  serviceName?: string;
  keyCommands: SoftwareCommand[];
}

export interface ServerConfig {
  username: string;
  sshPort: number;
  panelPort: number;
  subscriptionPort: number;
  serverIp: string;
  realitySni: string;
}

