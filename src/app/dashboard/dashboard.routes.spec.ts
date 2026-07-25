import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { dashboardRoutes } from './dashboard.routes';
import { Dashboard } from './dashboard';

describe('App Routing', () => {
  let harness: RouterTestingHarness;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(dashboardRoutes),
        provideLocationMocks()
      ]
    });

    harness = await RouterTestingHarness.create();
    location = TestBed.inject(Location);
  });

  it('must navigate from "" to "/dashboard"', async () => {
    await harness.navigateByUrl('');

    expect(location.path()).toBe('/dashboard');
  });

  it('must load DashboardComponent at path "/dashboard"', async () => {
    const component = await harness.navigateByUrl('/dashboard', Dashboard);

    expect(component).toBeTruthy();
    expect(location.path()).toBe('/dashboard');
  });
});
