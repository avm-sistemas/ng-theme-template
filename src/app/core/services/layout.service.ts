import { Injectable, signal, computed, effect, inject, DOCUMENT } from '@angular/core';
import { ShellLayout, UserLayoutPreference, SidebarBehavior } from '../models/layout.model';
import { LAYOUT_PRESETS, DEFAULT_LAYOUT_ID } from '../models/layouts.catalog';

const STORAGE_KEY = 'app_layout_preference';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly document = inject(DOCUMENT);

  readonly presets = LAYOUT_PRESETS;

  // ── State ─────────────────────────────────────────────────────────────────
  private readonly _pref = signal<UserLayoutPreference>(this.loadPreference());
  readonly preference    = this._pref.asReadonly();

  readonly layout           = computed(() => this._pref().layout);
  readonly presetId         = computed(() => this._pref().presetId);
  readonly sidebarCollapsed = computed(() => this._pref().sidebarCollapsed);

  readonly hasSidebar    = computed(() => this.layout().sidebar.visible);
  readonly hasTopbar     = computed(() => this.layout().topbar.visible);
  readonly hasBottombar  = computed(() => this.layout().bottombar.visible);

  readonly sidebarWidth = computed(() => {
    const s = this.layout().sidebar;
    const behavior = s.behavior as SidebarBehavior;
    if (!s.visible) return 0;
    if (behavior === 'icon-rail') return s.iconWidth;
    if (behavior === 'collapsible') return this.sidebarCollapsed() ? s.iconWidth : s.width;
    if (behavior === 'overlay')    return 0; // doesn't push content
    return s.width;
  });

  constructor() {
    effect(() => this.savePreference(this._pref()));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  applyPreset(id: string): void {
    const preset = this.presets.find(p => p.id === id);
    if (!preset) return;
    this._pref.update(p => ({ ...p, presetId: id, layout: structuredClone(preset) }));
  }

  updateLayout(layout: ShellLayout): void {
    this._pref.update(p => ({ ...p, presetId: 'custom', layout: structuredClone(layout) }));
  }

  toggleSidebar(): void {
    this._pref.update(p => ({ ...p, sidebarCollapsed: !p.sidebarCollapsed }));
  }

  collapseSidebar(collapsed: boolean): void {
    this._pref.update(p => ({ ...p, sidebarCollapsed: collapsed }));
  }

  /** Returns a layout object ready to be serialised and sent to an API */
  toApiPayload(): UserLayoutPreference {
    return this._pref();
  }

  /** Called when the API returns the user's saved layout */
  fromApiResponse(pref: UserLayoutPreference): void {
    this._pref.set(pref);
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  private loadPreference(): UserLayoutPreference {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as UserLayoutPreference;
    } catch { /* ignore */ }

    const preset = LAYOUT_PRESETS.find(p => p.id === DEFAULT_LAYOUT_ID)!;
    return { presetId: DEFAULT_LAYOUT_ID, layout: structuredClone(preset), sidebarCollapsed: false };
  }

  private savePreference(pref: UserLayoutPreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
    } catch { /* ignore */ }
  }
}
