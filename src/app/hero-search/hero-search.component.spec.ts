import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeroSearchComponent } from './hero-search.component';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;
  let heroService;
  let getHeroesSpy;

  beforeEach(
    waitForAsync(() => {
      heroService = jasmine.createSpyObj('HeroService', [
        'getHeroes',
        'searchHeroes',
      ]);
      getHeroesSpy = heroService.getHeroes.and.returnValue(of(HEROES));
      TestBed.configureTestingModule({
        declarations: [HeroSearchComponent],
        imports: [RouterTestingModule.withRoutes([])],
        providers: [{ provide: HeroService, useValue: heroService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Hero Search" as headline', () => {
    expect(fixture.nativeElement.querySelector('h4').textContent).toEqual(
      'Hero Search'
    );
  });

  it('should fire #search on input', () => {
    spyOn(component, 'search');
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('input');

    nameInput.value = 'A';

    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.search).toHaveBeenCalled();
  });

  it('should add link with searched hero name', () => {
    component.search('A');

    component.heroes$.subscribe(() => {
      let link = fixture.nativeElement.querySelector('ul li a');
      expect(link.innerText).toMatch('A');
    });
  });
});
