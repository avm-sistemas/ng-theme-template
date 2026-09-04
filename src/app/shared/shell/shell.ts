import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { TopbarRegion } from './regions/topbar/topbar';
import { SidebarRegion } from './regions/sidebar/sidebar';
import { BottombarRegion } from './regions/bottombar/bottombar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TopbarRegion, SidebarRegion, BottombarRegion],
  template: `
    <div class="app-shell" [style]="shellVars()">

      @if (ls.hasTopbar()) {
        <shell-topbar
          [widgets]="ls.layout().topbar.widgets"
          [height]="ls.layout().topbar.height"
          [behavior]="ls.layout().topbar.behavior"
        />
      }

      <div class="shell-body">
        @if (ls.hasSidebar()) {
          <shell-sidebar
            [widgets]="ls.layout().sidebar.widgets"
            [behavior]="ls.layout().sidebar.behavior"
            [width]="ls.layout().sidebar.width"
            [iconWidth]="ls.layout().sidebar.iconWidth"
          />
        }

        <main class="main-content" [style.margin-left.px]="sidebarPush()">
          <div class="content-inner">
            <router-outlet />
          </div>
        </main>
      </div>

      @if (ls.hasBottombar()) {
        <shell-bottombar
          [widgets]="ls.layout().bottombar.widgets"
          [height]="ls.layout().bottombar.height"
          [behavior]="ls.layout().bottombar.behavior"
        />
      }
    </div>`,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: var(--color-bg);
      display: flex;
      flex-direction: column;
    }

    .shell-body {
      flex: 1;
      display: flex;
      position: relative;
    }

    .main-content {
      flex: 1;
      transition: margin-left .25s cubic-bezier(.4,0,.2,1);
      min-width: 0;
    }

    .content-inner {
      padding: 76px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `],
})
export class ShellComponent {
  readonly ls = inject(LayoutService);

  readonly shellVars = computed(() => {
    const l = this.ls.layout();
    const parts: string[] = [];
    if (l.topbar.visible && l.topbar.behavior === 'fixed') {
      parts.push(`--topbar-height: ${l.topbar.height}px`);
    }
    if (l.bottombar.visible && l.bottombar.behavior === 'fixed') {
      parts.push(`--bottombar-height: ${l.bottombar.height}px`);
    }
    return parts.join('; ');
  });

  readonly sidebarPush = computed(() => {
    const s = this.ls.layout().sidebar;
    if (!s.visible || s.behavior === 'overlay') return 0;
    return this.ls.sidebarWidth();
  });
}
