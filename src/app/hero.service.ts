import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'aplication/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; //URL to web api

  

  constructor(
    private http: HttpClient,
    private messageService:MessageService) { }

/*  getHeroes():Observable<Hero[]>{
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  getHero(id:number):Observable<Hero>{
    // TODO: sent teh message_after_fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }*/

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getheroes',[]))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?:T){
    return (error:any): Observable<T> =>{
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message:string){
    this.messageService.add(`HeroSerive: ${message}`);
  }

  /** PUT: update the hero on the server */
  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
}
