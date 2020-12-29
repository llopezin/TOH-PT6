import { of } from 'rxjs';
import { Hero } from './hero';
import { HeroService } from './hero.service';

let httpClientSpy: { get: jasmine.Spy };
let messageServiceSpy: { get: jasmine.Spy };
let heroService: HeroService;
const expectedHeroes: Hero[] = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
];

beforeEach(() => {
  // TODO: spy on other methods too
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  messageServiceSpy = jasmine.createSpyObj('messageService', ['add']);
  heroService = new HeroService(httpClientSpy as any, messageServiceSpy as any);
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

/* it('should return an error when the server returns a 404', () => {
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
}); */
