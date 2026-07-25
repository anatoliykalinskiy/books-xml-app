import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.authService.login();
  }
}
