import { Component, inject, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { WidgetSlot, SidebarBehavior } from '../../../../core/models/layout.model';
import { LayoutService } from '../../../../core/services/layout.service';
import { ThemePickerComponent } from '../../../components/theme-picker/theme-picker';
import {
  LogoWidget, NavLinksWidget, UserMenuWidget,
  SpacerWidget, LayoutPickerWidget,
} from '../../widgets/widgets';

@Component({
  selector: 'shell-sidebar',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ThemePickerComponent, LogoWidget, NavLinksWidget,
    UserMenuWidget, SpacerWidget, LayoutPickerWidget,
  ],
  template: `
    @if (behavior === 'overlay' && !collapsed) {
      <div class="sidebar-backdrop" (click)="layoutService.collapseSidebar(true)"></div>
    }

    <aside
      class="sidebar"
      [class.collapsed]="collapsed"
      [class.icon-rail]="behavior === 'icon-rail'"
      [class.overlay]="behavior === 'overlay'"
      [class.collapsible]="behavior === 'collapsible'"
      [style.width.px]="currentWidth"
    >
      @if (behavior === 'collapsible' || behavior === 'overlay') {
        <button class="collapse-btn" (click)="layoutService.toggleSidebar()" [title]="collapsed ? 'Expandir' : 'Recolher'">
          <svg viewBox="0 0 16 16" fill="none">
            <path [attr.d]="collapsed ? 'M6 4l4 4-4 4' : 'M10 4L6 8l4 4'"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      }

      <div class="sidebar-body">
        @for (w of widgets; track w.id + w.position) {
          <ng-container *ngTemplateOutlet="widgetTpl; context: { w }"></ng-container>
        }
      </div>
    </aside>

    <ng-template #widgetTpl let-w="w">
      @switch (w.id) {
        @case ('logo')          { <w-logo [compact]="isCompact" /> }
        @case ('nav-links')     { <w-nav-links [vertical]="true" [compact]="isCompact" /> }
        @case ('theme-picker')  { <app-theme-picker /> }
        @case ('layout-picker') { <w-layout-picker /> }
        @case ('user-menu')     { <w-user-menu [compact]="isCompact" /> }
        @case ('spacer')        { <w-spacer /> }
      }
    </ng-template>`,
  styles: [`
    :host { display: contents; }

    .sidebar-backdrop {
      position:fixed; inset:0; background:rgba(0,0,0,.35);
      z-index:149; animation: fadeIn .2s;
    }
    @keyframes fadeIn { from { opacity:0; } }

    .sidebar {
      display:flex; flex-direction:column;
      background:var(--color-surface);
      border-right:1px solid var(--color-border);
      transition: width .25s cubic-bezier(.4,0,.2,1);
      overflow:hidden;
      view-transition-name: shell-sidebar;
      z-index:150;
      height:100%;
    }
    .sidebar.overlay {
      position:fixed; top:0; bottom:0; left:0;
      box-shadow: 4px 0 24px rgba(0,0,0,.15);
    }
    .sidebar.collapsed { width: var(--icon-width, 64px) !important; }

    .collapse-btn {
      align-self:flex-end; margin:8px 8px 0;
      background:none; border:none; cursor:pointer;
      color:var(--color-text-muted); padding:6px; border-radius:6px;
      display:flex; align-items:center;
      transition:color .15s, background .15s; flex-shrink:0;
    }
    .collapse-btn:hover { color:var(--color-primary); background:var(--color-surface-alt); }
    .collapse-btn svg { width:16px; height:16px; }

    .sidebar-body {
      flex:1; display:flex; flex-direction:column;
      overflow:hidden; padding-top:8px;
    }
  `],
})
export class SidebarRegion {
  readonly layoutService = inject(LayoutService);

  @Input() widgets: WidgetSlot[]   = [];
  @Input() behavior: SidebarBehavior = 'fixed';
  @Input() width     = 240;
  @Input() iconWidth = 64;

  get collapsed()    { return this.layoutService.sidebarCollapsed(); }
  get isCompact()    { return this.behavior === 'icon-rail' || (this.behavior === 'collapsible' && this.collapsed); }
  get currentWidth() {
    if (this.behavior === 'icon-rail')                                  return this.iconWidth;
    if (this.behavior === 'collapsible' && this.collapsed)              return this.iconWidth;
    return this.width;
  }
}
