import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { AuthstateService } from '../../services/auth-state.service';
import { Permission , PERMISSIONS} from '../../constants/permissions';
interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  permission?: Permission;
}
@Component({
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  readonly authStateService = inject(AuthstateService);
  
    readonly navigationItems: NavigationItem[] = [
  
      {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard'
      },
  
      {
        label: 'Tickets',
        icon: 'confirmation_number',
        route: '/tickets',
        permission: PERMISSIONS.TICKET_VIEW
      },
  
      {
        label: 'Users',
        icon: 'people',
        route: '/admin/users',
        permission: PERMISSIONS.USER_VIEW 
      }
  
    ];
  
    hasPermission(permission?: Permission): boolean {
  
      if (!permission) {
        return true;
      }
  
      return this.authStateService.hasPermission(permission);
    }
}
