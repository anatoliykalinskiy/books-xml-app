import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { dashboardRoutes } from './dashboard.routes';
import { Dashboard } from './dashboard';

describe('App Routing', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        // Предоставляем ваши standalone маршруты
        provideRouter(dashboardRoutes),
        // Предоставляем моки для работы с Location (URL)
        provideLocationMocks()
      ]
    });

    // Создаем тестовую утилиту для маршрутизации
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('должен перенаправлять с "" на "/dashboard"', async () => {
    // Начинаем симуляцию перехода на пустой роут
    await harness.navigateByUrl('');

    // Проверяем, что локация изменилась на /dashboard
    expect(location.path()).toBe('/dashboard');
  });

  it('должен загружать DashboardComponent по пути "/dashboard"', async () => {
    // Переходим на /dashboard и получаем инстанс созданного компонента
    const component = await harness.navigateByUrl('/dashboard', Dashboard);

    // Проверяем, что компонент успешно инициализирован
    expect(component).toBeTruthy();
    expect(location.path()).toBe('/dashboard');
  });
});
