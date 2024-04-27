import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { Key } from '../enum/key.enum';
import { UserService } from '../service/user.service';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  private refreshTokenSubject : BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject(null);
  constructor(private userService: UserService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    if(request.url.includes("verify") || request.url.includes("login") || request.url.includes("register") 
      || request.url.includes("refresh") || request.url.includes("resetpassword"))
    {
      return next.handle(request);
    }
    console.log("came here", localStorage.getItem(Key.ACCESS_TOKEN))
    return next.handle(this.addAuthorizationTokenHeader(request, localStorage.getItem(Key.ACCESS_TOKEN)))
    .pipe(
      catchError((error: HttpErrorResponse)=>{
        console.log("error occurred", error)
        if(error instanceof HttpErrorResponse && error.status === 401 && error.error.reason.includes("expired")){
          return this.handleRefreshToken(request, next);
        }
        else{
          return throwError(()=>error);
        }
      })
    );
   
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) : Observable<HttpEvent<unknown>>{
    if(!this.isTokenRefreshing){
      console.log("Refreshing token now .....")
      this.isTokenRefreshing = true
      this.refreshTokenSubject.next(null)
      return this.userService.refreshToken$().pipe(
        switchMap(res => {
          console.log("Token refresh resonse", res)
          this.isTokenRefreshing = false
          this.refreshTokenSubject.next(res)
          console.log("sendiing original request", request)
          console.log("new token ", res.data.access_token)
          return next.handle(this.addAuthorizationTokenHeader(request, res.data.access_token))
        }),

        catchError((error:HttpErrorResponse)=>{
          // console.log("error ikkada ra", error, localStorage.getItem(Key.REFRESH_TOKEN), localStorage.getItem(Key.ACCESS_TOKEN) )
          this.router.navigate(["login"])
          return throwError(()=> error)
        })
      )
    }
    else{
      this.refreshTokenSubject.pipe(
        switchMap(res => {
          return next.handle(this.addAuthorizationTokenHeader(request, res.data.access_token))
        })
      )
    }
  }

  private addAuthorizationTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<any> {
    return request.clone({setHeaders: {Authorization: `Bearer ${token}`}})
  }
}
