import { ShellLayout, WidgetSlot } from './layout.model';

// ── Shared widget pools ──────────────────────────────────────────────────────

const logoStart:        WidgetSlot = { id: 'logo',         position: 'start',  label: 'Logo' };
const navLinksCenter:   WidgetSlot = { id: 'nav-links',    position: 'center', label: 'Navegação' };
const navLinksStart:    WidgetSlot = { id: 'nav-links',    position: 'start',  label: 'Navegação' };
const themePickerEnd:   WidgetSlot = { id: 'theme-picker', position: 'end',    label: 'Tema' };
const layoutPickerEnd:  WidgetSlot = { id: 'layout-picker',position: 'end',    label: 'Layout' };
const userMenuEnd:      WidgetSlot = { id: 'user-menu',    position: 'end',    label: 'Usuário' };
const spacerCenter:     WidgetSlot = { id: 'spacer',       position: 'center', label: 'Espaçador' };

// ── Presets ──────────────────────────────────────────────────────────────────

export const LAYOUT_PRESETS: ShellLayout[] = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Menu horizontal fixo no topo',
    icon: '▬',
    topbar: {
      visible: true, behavior: 'fixed', height: 56,
      widgets: [logoStart, navLinksCenter, themePickerEnd, layoutPickerEnd, userMenuEnd],
    },
    sidebar:    { visible: false, side: 'left', behavior: 'fixed', width: 240, iconWidth: 64, widgets: [] },
    bottombar:  { visible: false, behavior: 'fixed', height: 56, widgets: [] },
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Navegação lateral colapsável',
    icon: '▌',
    topbar: {
      visible: true, behavior: 'fixed', height: 56,
      widgets: [logoStart, spacerCenter, themePickerEnd, layoutPickerEnd, userMenuEnd],
    },
    sidebar: {
      visible: true, side: 'left', behavior: 'collapsible', width: 240, iconWidth: 64,
      widgets: [navLinksStart],
    },
    bottombar: { visible: false, behavior: 'fixed', height: 56, widgets: [] },
  },
  {
    id: 'icon-rail',
    name: 'Icon Rail',
    description: 'Sidebar compacta só com ícones',
    icon: '║',
    topbar: {
      visible: true, behavior: 'fixed', height: 56,
      widgets: [logoStart, spacerCenter, themePickerEnd, layoutPickerEnd, userMenuEnd],
    },
    sidebar: {
      visible: true, side: 'left', behavior: 'icon-rail', width: 240, iconWidth: 64,
      widgets: [navLinksStart],
    },
    bottombar: { visible: false, behavior: 'fixed', height: 56, widgets: [] },
  },
  {
    id: 'bottombar',
    name: 'Mobile-first',
    description: 'Navegação na barra inferior',
    icon: '▬',
    topbar: {
      visible: true, behavior: 'fixed', height: 56,
      widgets: [logoStart, spacerCenter, themePickerEnd, userMenuEnd],
    },
    sidebar: { visible: false, side: 'left', behavior: 'fixed', width: 240, iconWidth: 64, widgets: [] },
    bottombar: {
      visible: true, behavior: 'fixed', height: 60,
      widgets: [navLinksCenter],
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Só o essencial visível',
    icon: '·',
    topbar: {
      visible: true, behavior: 'sticky', height: 48,
      widgets: [logoStart, spacerCenter, userMenuEnd],
    },
    sidebar: {
      visible: true, side: 'left', behavior: 'overlay', width: 280, iconWidth: 64,
      widgets: [navLinksStart, themePickerEnd, layoutPickerEnd],
    },
    bottombar: { visible: false, behavior: 'fixed', height: 56, widgets: [] },
  },
];

export const DEFAULT_LAYOUT_ID = 'classic';
