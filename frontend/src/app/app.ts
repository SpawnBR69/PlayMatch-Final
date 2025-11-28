import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { MatchmakingComponent } from './features/matchmaking/matchmaking';
import { ChatSidebarComponent } from './features/chat-sidebar/chat-sidebar';
import { GroupsComponent } from './features/groups/groups';
import { ProfileComponent } from './features/profile/profile';
import { ToastComponent } from './components/toast/toast';
import { ConfirmationModalComponent } from './components/confirmation/confirmation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent,
    ToastComponent,
    ChatSidebarComponent,
    MatchmakingComponent,
    ConfirmationModalComponent, 
    GroupsComponent, 
    ProfileComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      <app-navbar 
        [currentView]="view()" 
        (viewChange)="view.set($event)">
      </app-navbar>

      <!-- Componentes Globais -->
      <app-chat-sidebar></app-chat-sidebar>
      <app-toast></app-toast>
      <app-confirmation-modal></app-confirmation-modal>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        <ng-container [ngSwitch]="view()">
          <app-matchmaking *ngSwitchCase="'home'"></app-matchmaking>
          <app-groups *ngSwitchCase="'groups'"></app-groups>
          <app-profile *ngSwitchCase="'profile'"></app-profile>
        </ng-container>
      </main>

    </div>
  `
})
export class AppComponent {
  view = signal<string>('home');
}