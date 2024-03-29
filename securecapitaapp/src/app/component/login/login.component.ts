import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/DataState.enum';
import { Key } from 'src/app/enum/key.enum';
import { LoginState } from 'src/app/interface/appstates';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  closeAlert = false;
  readonly DataState = DataState;
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  constructor(private router: Router, private userService: UserService) {


  }

  login(loginForm: NgForm): void {
    this.closeAlert = false;
    console.log("consoler ", loginForm, loginForm.value.password)
    this.loginState$ = this.userService.login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map(res => {

          if (res.data?.user?.mfaEnabled) {
            console.log("entered here")
            this.phoneSubject.next(res.data.user.phone)
            this.emailSubject.next(res.data.user.email)
            return {
              dataState: DataState.LOADED, isUsingMFA: true, loginSucess: false,
              phone: res.data.user.phone.substring(res.data.user.phone.length - 4)
            }
          }
          else {
            localStorage.setItem(Key.ACCESS_TOKEN, res?.data?.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, res.data.refresh_token);
            this.router.navigate(['/']);
            return { dataState: DataState.LOADED, isUsingMFA: false, loginSucess: true }

          }

        }),
        startWith({ dataState: DataState.LOADING, isUsingMFA: false }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, isUsingMFA: false, loginSucess: false, error })
        })
      )
  }


  verifyCode(verifyCodeForm: NgForm): void {
    this.closeAlert=false;
    // console.log("consoler ", loginForm, loginForm.value.password)
    this.loginState$ = this.userService.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map(res => {
          localStorage.setItem(Key.ACCESS_TOKEN, res?.data?.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, res.data.refresh_token);
          this.router.navigate(['/']);
          return { dataState: DataState.LOADED, isUsingMFA: false, loginSucess: true }

          
        }),
        startWith({
          dataState: DataState.LOADED, isUsingMFA: true, loginSucess: false,
          phone: this.phoneSubject.value.substring(this.phoneSubject.value.length - 4)
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, isUsingMFA: true, loginSucess: false, error 
          , phone: this.phoneSubject.value.substring(this.phoneSubject.value.length - 4)})
        })
      )
  }

  loginPage() {
    this.loginState$ = of({ dataState: DataState.LOADED })
  }

  closeError() {
    this.closeAlert = true

  }

}
