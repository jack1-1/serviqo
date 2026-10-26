
import {
  Component,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { AuthstateService } from '../../services/auth-state.service';
import {
  Permission,
  PERMISSIONS
} from '../../constants/permissions';

interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  permission?: Permission;
  children?: NavigationItem[];
}

@Component({
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatExpansionModule
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
      permission: PERMISSIONS.VIEW_TICKET,
      children: [
        {
          label: 'Create Ticket',
          icon: 'add_circle_outline',
          route: '/tickets/create',
          permission: PERMISSIONS.CREATE_TICKET
        },
        {
          label: 'View Tickets',
          icon: 'list_alt',
          route: '/tickets/list',
          permission: PERMISSIONS.VIEW_TICKET
        }
      ]
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
