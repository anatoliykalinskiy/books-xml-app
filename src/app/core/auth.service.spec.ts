import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest'; // Импорты из Vitest
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter = {
    navigate: vi.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, {provide: Router, useValue: mockRouter}],
    });

    service = TestBed.inject(AuthService);
  });

  it('must be initialised with signals default values', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.isReadOnly()).toBe(false);
  });

  it('on login() must save user and navigate to /dashboard', () => {
    service.login();

    expect(service.currentUser()).toEqual({
      username: 'Test User',
      isAdmin: true
    });
    expect(service.isAuthenticated()).toBe(true);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('on logout() must clear data and navigate to /login', () => {
    service.login();
    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
