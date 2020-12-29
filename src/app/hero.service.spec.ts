import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { asyncError } from './async-observable-helpers.ts';
import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy; put: jasmine.Spy };
let heroService: HeroService;
const expectedHeroes: Hero[] = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
];

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
  heroService = new HeroService(httpClientSpy as any, new MessageService());
});

it('should return hero with given ID', () => {
  httpClientSpy.get.and.returnValue(of(expectedHeroes[0]));

  heroService
    .getHero(2)
    .subscribe(
      (hero) => expect(hero).toEqual({ id: 1, name: 'A' }, 'expected heroes'),
      fail
    );
  expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
});

it('should return hero with given ID or undefined when not found', () => {
  httpClientSpy.get.and.returnValue(of([expectedHeroes[0]]));

  heroService
    .getHeroNo404(1)
    .subscribe((hero) =>
      expect(hero).toEqual({ id: 1, name: 'A' }, 'expected heroes')
    );

  httpClientSpy.get.and.returnValue(of(new Error()));

  heroService
    .getHeroNo404(999)
    .subscribe((hero) => expect(hero).not.toBeDefined('expected heroes'), fail);

  expect(httpClientSpy.get.calls.count()).toBe(2, 'two calls');
});

it('should delete hero', () => {
  httpClientSpy.put.and.returnValue(of(expectedHeroes[0]));

  heroService
    .updateHero(expectedHeroes[0])
    .subscribe(
      (hero) => expect(hero).toEqual(expectedHeroes[0], 'created hero'),
      fail
    );
  expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
});

it('should return expected heroes (HttpClient called once)', () => {
  httpClientSpy.get.and.returnValue(of(expectedHeroes));

  heroService
    .getHeroes()
    .subscribe(
      (heroes) => expect(heroes).toEqual(expectedHeroes, 'expected heroes'),
      fail
    );
  expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
});

it('should return an error when the server returns a 404', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'test 404 error',
    status: 404,
    statusText: 'Not Found',
  });

  httpClientSpy.get.and.returnValue(asyncError(errorResponse));

  heroService.getHeroes().subscribe(
    (heroes) => fail('expected an error, not heroes'),
    (error) => expect(error.message).toContain('test 404 error')
  );
});
