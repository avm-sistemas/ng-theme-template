import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../core/services/layout.service';
import {
  ShellLayout, WidgetSlot, WidgetType, WidgetPosition,
  TopbarBehavior, SidebarBehavior, BottombarBehavior,
} from '../../../core/models/layout.model';

const AVAILABLE_WIDGETS: { id: WidgetType; label: string; icon: string }[] = [
  { id: 'logo',          label: 'Logo',          icon: '◈' },
  { id: 'nav-links',     label: 'Navegação',      icon: '≡' },
  { id: 'theme-picker',  label: 'Tema',           icon: '🎨' },
  { id: 'layout-picker', label: 'Layout',         icon: '⊟' },
  { id: 'user-menu',     label: 'Usuário',        icon: '👤' },
  { id: 'spacer',        label: 'Espaçador',      icon: '↔' },
];

@Component({
  selector: 'app-layout-builder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './layout-builder.html',
  styleUrl:    './layout-builder.scss',
})
export class LayoutBuilderComponent {
  readonly ls = inject(LayoutService);

  readonly saved = signal(false);

  // Working copy — mutated by builder, applied on save
  draft = signal<ShellLayout>(structuredClone(this.ls.layout()));

  // Helpers exposed to template
  readonly availableWidgets = AVAILABLE_WIDGETS;
  readonly positions: WidgetPosition[] = ['start', 'center', 'end'];
  readonly positionLabel: Record<WidgetPosition, string> = {
    start: 'Início', center: 'Centro', end: 'Fim',
  };

  readonly topbarBehaviors:    { v: TopbarBehavior;    l: string }[] = [
    { v: 'fixed',  l: 'Fixo no topo' },
    { v: 'sticky', l: 'Sticky' },
    { v: 'static', l: 'Estático' },
  ];
  readonly sidebarBehaviors:   { v: SidebarBehavior;   l: string }[] = [
    { v: 'fixed',       l: 'Fixo' },
    { v: 'collapsible', l: 'Colapsável' },
    { v: 'icon-rail',   l: 'Icon Rail' },
    { v: 'overlay',     l: 'Overlay' },
  ];
  readonly bottombarBehaviors: { v: BottombarBehavior; l: string }[] = [
    { v: 'fixed',  l: 'Fixo' },
    { v: 'static', l: 'Estático' },
  ];

  // ── Preset application ─────────────────────────────────────────────────────
  applyPreset(id: string): void {
    const preset = this.ls.presets.find(p => p.id === id);
    if (preset) this.draft.set(structuredClone(preset));
  }

  // ── Widget management ──────────────────────────────────────────────────────
  widgetsFor(region: 'topbar' | 'sidebar' | 'bottombar', pos: WidgetPosition): WidgetSlot[] {
    return this.draft()[region].widgets.filter(w => w.position === pos);
  }

  addWidget(region: 'topbar' | 'sidebar' | 'bottombar', widgetId: WidgetType, pos: WidgetPosition): void {
    const label = this.availableWidgets.find(w => w.id === widgetId)?.label ?? widgetId;
    this.draft.update(d => {
      const clone = structuredClone(d);
      clone[region].widgets.push({ id: widgetId, position: pos, label });
      return clone;
    });
  }

  removeWidget(region: 'topbar' | 'sidebar' | 'bottombar', widgetId: WidgetType, pos: WidgetPosition): void {
    this.draft.update(d => {
      const clone = structuredClone(d);
      const idx = clone[region].widgets.findIndex(w => w.id === widgetId && w.position === pos);
      if (idx !== -1) clone[region].widgets.splice(idx, 1);
      return clone;
    });
  }

  hasWidget(region: 'topbar' | 'sidebar' | 'bottombar', widgetId: WidgetType, pos: WidgetPosition): boolean {
    return this.draft()[region].widgets.some(w => w.id === widgetId && w.position === pos);
  }

  // ── Region toggles ─────────────────────────────────────────────────────────
  toggleRegion(region: 'topbar' | 'sidebar' | 'bottombar'): void {
    this.draft.update(d => {
      const clone = structuredClone(d);
      clone[region].visible = !clone[region].visible;
      return clone;
    });
  }

  setTopbarBehavior(v: TopbarBehavior): void {
    this.draft.update(d => { const c = structuredClone(d); c.topbar.behavior = v; return c; });
  }
  setSidebarBehavior(v: SidebarBehavior): void {
    this.draft.update(d => { const c = structuredClone(d); c.sidebar.behavior = v; return c; });
  }
  setBottombarBehavior(v: BottombarBehavior): void {
    this.draft.update(d => { const c = structuredClone(d); c.bottombar.behavior = v; return c; });
  }

  setSidebarSide(side: 'left' | 'right'): void {
    this.draft.update(d => { const c = structuredClone(d); c.sidebar.side = side; return c; });
  }

  // ── Save / reset ───────────────────────────────────────────────────────────
  save(): void {
    document.startViewTransition?.(() => {
      this.ls.updateLayout(this.draft());
    }) ?? this.ls.updateLayout(this.draft());

    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  reset(): void {
    this.draft.set(structuredClone(this.ls.layout()));
  }

  resetToDefault(): void {
    this.applyPreset('classic');
    this.save();
  }
}
