import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Key } from '../enum/key.enum';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server = 'http://localhost:8080';

  constructor(private http: HttpClient) {

  }

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.post<CustomHttpResponse<Profile>>(`${this.server}/user/login`, { email, password })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>(`${this.server}/user/verify/code/${email}/${code}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>(`${this.server}/user/profile`, {headers: new HttpHeaders({'Authorization': `Bearer ${localStorage.getItem(Key.ACCESS_TOKEN)}`})} )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )
 
  // loginNew$ = (email: string, password: string): Observable<CustomHttpResponse<Profile>> => {
  //   return this.http.post<CustomHttpResponse<Profile>>(`${this.server}/user/login`, { email, password })
  //     .pipe(
  //       tap(console.log),
  //       catchError(this.handleError)
  //     )
  // }

  //  arrowString = (name:string) => {
  //    let a =5;

  //   //  return name+a;
  //   <string> name+a;
  //   };


  // printMsg(){

  //   console.log(this.arrowString("hello"))
  // }



  handleError(handleError: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (handleError.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${handleError.error.message} `
    }
    else {
      if (handleError.error.reason) {
        errorMessage = handleError.error.reason;
      }
      else {
        errorMessage = `An error occured - Error code ${handleError.status}`
      }
    }
    return throwError(() => errorMessage);
  }
}
