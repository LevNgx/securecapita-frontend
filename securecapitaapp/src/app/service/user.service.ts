import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Key } from '../enum/key.enum';
import { User } from '../interface/user';
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
    this.http.get<CustomHttpResponse<Profile>>(`${this.server}/user/profile` )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )
  
  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/update`, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )


  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>(`${this.server}/user/refresh/token`, {headers :{'Authorization' : `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}` }})
      .pipe(
        tap(res => {
          console.log("response", res)
          localStorage.removeItem(Key.ACCESS_TOKEN)
          localStorage.removeItem(Key.REFRESH_TOKEN)
          localStorage.setItem(Key.ACCESS_TOKEN, res.data.access_token)
          localStorage.setItem(Key.REFRESH_TOKEN, res.data.refresh_token)

        }),
        catchError(this.handleError)
        
      )

  updatePassword$ = (form: {currentPassword:string, newPassword:string, confirmNewPassword:string}) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/update/password`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)

      ) 

  updateRoles$ = (roleName:string) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/update/role/${roleName}`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)

      ) 

  updateAccountSettings$ = (settings: {enabled:boolean, nonLocked:boolean}) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/update/settings`, settings)
      .pipe(
        tap(console.log),
        catchError(this.handleError)

      ) 

  toggleMfa$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/togglemfa`, {})
      .pipe(
        tap(console.log),
        catchError(this.handleError)

      ) 

  updateImage$ = (formData: FormData ) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>(`${this.server}/user/update/image`, formData)
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

  // ser$ = (name:string) => <string> name+"hello"




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
