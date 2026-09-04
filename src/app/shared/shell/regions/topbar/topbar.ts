import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { WidgetSlot } from '../../../../core/models/layout.model';
import { ThemePickerComponent } from '../../../components/theme-picker/theme-picker';
import {
  LogoWidget, NavLinksWidget, UserMenuWidget,
  SpacerWidget, LayoutPickerWidget,
} from '../../widgets/widgets';

@Component({
  selector: 'shell-topbar',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ThemePickerComponent, LogoWidget, NavLinksWidget,
    UserMenuWidget, SpacerWidget, LayoutPickerWidget,
  ],
  template: `
    <header class="topbar" [style.height.px]="height" [class]="'topbar ' + behavior">
      <div class="topbar-start">
        @for (w of start; track w.id + w.position) {
          <ng-container *ngTemplateOutlet="widgetTpl; context: { w }"></ng-container>
        }
      </div>
      <div class="topbar-center">
        @for (w of center; track w.id + w.position) {
          <ng-container *ngTemplateOutlet="widgetTpl; context: { w }"></ng-container>
        }
      </div>
      <div class="topbar-end">
        @for (w of end; track w.id + w.position) {
          <ng-container *ngTemplateOutlet="widgetTpl; context: { w }"></ng-container>
        }
      </div>
    </header>

    <ng-template #widgetTpl let-w="w">
      @switch (w.id) {
        @case ('logo')          { <w-logo /> }
        @case ('nav-links')     { <w-nav-links /> }
        @case ('theme-picker')  { <app-theme-picker /> }
        @case ('layout-picker') { <w-layout-picker /> }
        @case ('user-menu')     { <w-user-menu /> }
        @case ('spacer')        { <w-spacer /> }
      }
    </ng-template>`,
  styles: [`
    :host { display: contents; }
    .topbar {
      display:flex; align-items:center; padding:0 16px; gap:8px;
      background:var(--color-surface); border-bottom:1px solid var(--color-border);
      z-index:100; view-transition-name: shell-topbar;
    }
    .topbar.fixed  { position:fixed; top:0; left:0; right:0; }
    .topbar.sticky { position:sticky; top:0; }
    .topbar.static { position:static; }
    .topbar-start  { display:flex; align-items:center; gap:8px; }
    .topbar-center { display:flex; align-items:center; gap:4px; flex:1; justify-content:center; }
    .topbar-end    { display:flex; align-items:center; gap:8px; margin-left:auto; }
  `],
})
export class TopbarRegion {
  @Input() widgets: WidgetSlot[] = [];
  @Input() height = 56;
  @Input() behavior = 'fixed';

  get start()  { return this.widgets.filter(w => w.position === 'start');  }
  get center() { return this.widgets.filter(w => w.position === 'center'); }
  get end()    { return this.widgets.filter(w => w.position === 'end');    }
}
