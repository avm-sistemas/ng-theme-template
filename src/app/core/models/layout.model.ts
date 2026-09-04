export type WidgetType =
  | 'logo'
  | 'nav-links'
  | 'theme-picker'
  | 'layout-picker'
  | 'user-menu'
  | 'search'
  | 'breadcrumbs'
  | 'spacer';

export type WidgetPosition = 'start' | 'center' | 'end';

export interface WidgetSlot {
  id: WidgetType;
  position: WidgetPosition;
  /** label shown in builder */
  label: string;
}

export type SidebarBehavior = 'fixed' | 'collapsible' | 'icon-rail' | 'overlay';
export type TopbarBehavior  = 'fixed' | 'sticky' | 'static';
export type BottombarBehavior = 'fixed' | 'static';

export interface TopbarConfig {
  visible: boolean;
  behavior: TopbarBehavior;
  height: number; // px
  widgets: WidgetSlot[];
}

export interface SidebarConfig {
  visible: boolean;
  side: 'left' | 'right';
  behavior: SidebarBehavior;
  width: number;       // px when expanded
  iconWidth: number;   // px when collapsed to icons
  widgets: WidgetSlot[];
}

export interface BottombarConfig {
  visible: boolean;
  behavior: BottombarBehavior;
  height: number;
  widgets: WidgetSlot[];
}

export interface ShellLayout {
  id: string;
  name: string;
  description: string;
  icon: string;
  topbar: TopbarConfig;
  sidebar: SidebarConfig;
  bottombar: BottombarConfig;
}

export interface UserLayoutPreference {
  /** active preset id, or 'custom' */
  presetId: string;
  layout: ShellLayout;
  /** sidebar collapsed state — runtime, not persisted deeply */
  sidebarCollapsed: boolean;
}
