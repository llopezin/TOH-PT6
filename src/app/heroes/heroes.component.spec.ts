import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService;
  let getHeroesSpy;

  beforeEach(
    waitForAsync(() => {
      heroService = jasmine.createSpyObj('HeroService', ['getHeroes']);
      getHeroesSpy = heroService.getHeroes.and.returnValue(of(HEROES));
      TestBed.configureTestingModule({
        declarations: [HeroesComponent],
        providers: [{ provide: HeroService, useValue: heroService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "My Heroes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual(
      'My Heroes'
    );
  });

  it('should call #add on button click', async () => {
    spyOn(component, 'add');

    let button = fixture.debugElement.nativeElement.querySelector('.add');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.add).toHaveBeenCalled();
    });
  });
});
