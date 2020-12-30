import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Hero } from '../hero';

import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';

import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroService;
  let getHeroesSpy;
  let updateHeroSpy;
  let updatedHero: Hero = { id: 1, name: 'updated name' };

  beforeEach(
    waitForAsync(() => {
      heroService = jasmine.createSpyObj('HeroService', [
        'getHeroes',
        'getHero',
        'updateHero',
      ]);
      getHeroesSpy = heroService.getHeroes.and.returnValue(of(HEROES));
      getHeroesSpy = heroService.getHero.and.returnValue(of(HEROES[0]));
      updateHeroSpy = heroService.updateHero.and.returnValue(of(updatedHero));
      TestBed.configureTestingModule({
        declarations: [HeroDetailComponent],
        imports: [RouterTestingModule.withRoutes([])],
        providers: [{ provide: HeroService, useValue: heroService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display hero name in header', () => {
    waitForAsync(() => {
      expect(fixture.nativeElement.querySelector('h2').innerText).toContain(
        HEROES[0].name
      );
    });
  });

  it(
    'should call heroService',
    waitForAsync(() => {
      expect(getHeroesSpy.calls.any()).toBe(true);
    })
  );

  it(
    'save button should call #save',
    waitForAsync(() => {
      spyOn(component, 'save');

      let button = fixture.debugElement.nativeElement.querySelector('.save');
      button.click();

      fixture.whenStable().then(() => {
        expect(component.save).toHaveBeenCalled();
      });
    })
  );

  it(
    'should call hero service to update hero',
    waitForAsync(() => {
      component.save();

      expect(updateHeroSpy.calls.any()).toBe(true);
    })
  );

  it(
    '#save should go back after saving hero',
    waitForAsync(() => {
      spyOn(component, 'goBack');
      component.save();

      expect(component.goBack).toHaveBeenCalled();
    })
  );

  it(
    'go back button should call #goBack',
    waitForAsync(() => {
      spyOn(component, 'goBack');

      let button = fixture.debugElement.nativeElement.querySelector('.go-back');
      button.click();

      fixture.whenStable().then(() => {
        expect(component.goBack).toHaveBeenCalled();
      });
    })
  );

  it(
    'should display 2 buttons',
    waitForAsync(() => {
      expect(fixture.nativeElement.querySelectorAll('button').length).toEqual(
        2
      );
    })
  );
});
