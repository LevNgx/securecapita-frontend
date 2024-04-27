import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/DataState.enum';
import { CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  closeAlert = false;
  readonly DataState = DataState;
  private datasubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<Boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  isRoleUser = false;
  isAdminRole = false;
  isLoading = false;

  ngOnInit(): void {
    this.closeAlert = false;
    this.isLoading$.subscribe()
    this.profileState$= this.userService.profile$()
      .pipe(
        map(res => {
            
            this.datasubject.next(res)
            this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
            this.isAdminRole = res?.data?.user?.roleName === "ROLE_ADMIN" || res?.data?.user?.roleName === "ROLE_SYSADMIN" ? true : false;
            return {
              dataState: DataState.LOADED, appData: res}
        }),
        startWith({ dataState: DataState.LOADING}),
        catchError((error: string) => {
          console.log("error", error)
          return of({ dataState: DataState.ERROR, appData:this.datasubject.value, error})
        })
      )
  }

  constructor(private router: Router, private userService: UserService) {
   
  }

  updateProfile(profileForm: NgForm){
    this.isLoadingSubject.next(true)
    this.profileState$= this.userService.update$(profileForm.value)
      .pipe(
        map(res => {
            
            this.datasubject.next({...res, data: res.data})
            this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
            this.isLoadingSubject.next(false)
            return {
              dataState: DataState.LOADED, appData: this.datasubject.value}
        }),
        startWith({dataState: DataState.LOADED, appData: this.datasubject.value}),
        catchError((error: string) => {
          this.isLoadingSubject.next(false)
          console.log("error", error)
          return of({dataState: DataState.LOADED, appData: this.datasubject.value})
        })
      )
  }


  updatePassword(passwordForm: NgForm) {
    this.isLoadingSubject.next(true)
    if(passwordForm.value.newPassword === passwordForm.value.confirmNewPassword){
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(res => {
            console.log(res,"repsonse")
            this.isLoadingSubject.next(false)
            passwordForm.reset(); 
            return {
              dataState: DataState.LOADED, appData: this.datasubject.value
            }
          }),
          startWith({ dataState: DataState.LOADED, appData: this.datasubject.value }),
          catchError((error: string) => {
            passwordForm.reset(); 
            this.isLoadingSubject.next(false)
            console.log("error", error)
            return of({ dataState: DataState.LOADED, appData: this.datasubject.value })
          })
        )
    }
    else{
     passwordForm.reset(); 
     this.isLoadingSubject.next(false)
    }
    
  }

  updateRole(roleForm: NgForm) {
    this.isLoadingSubject.next(true)
    console.log(roleForm)
    this.profileState$ = this.userService.updateRoles$(roleForm.value.roleName)
      .pipe(
        map(res => {

          this.datasubject.next({ ...res, data: res.data })
          this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
          this.isLoadingSubject.next(false)
          return {
            dataState: DataState.LOADED, appData: this.datasubject.value
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.datasubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false)
          console.log("error", error)
          return of({ dataState: DataState.LOADED, appData: this.datasubject.value })
        })
      )

  }

  updateAccountSettings(settingsForm: NgForm) {
    this.isLoadingSubject.next(true)
    console.log(settingsForm)
    this.profileState$ = this.userService.updateAccountSettings$(settingsForm.value)
      .pipe(
        map(res => {

          this.datasubject.next({ ...res, data: res.data })
          this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
          this.isLoadingSubject.next(false)
          return {
            dataState: DataState.LOADED, appData: this.datasubject.value
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.datasubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false)
          console.log("error", error)
          return of({ dataState: DataState.LOADED, appData: this.datasubject.value })
        })
      )

  }

  toggleMfa() {
    this.isLoadingSubject.next(true)
    this.profileState$ = this.userService.toggleMfa$()
      .pipe(
        map(res => {

          this.datasubject.next({ ...res, data: res.data })
          this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
          this.isLoadingSubject.next(false)
          return {
            dataState: DataState.LOADED, appData: this.datasubject.value
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.datasubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false)
          console.log("error", error)
          return of({ dataState: DataState.LOADED, appData: this.datasubject.value })
        })
      )

  }

  updatePicture(image:File) {
    if(image){
      this.isLoadingSubject.next(true)
    this.profileState$ = this.userService.updateImage$(this.getFormData(image))
      .pipe(
        map(res => {

          this.datasubject.next({ ...res, data: {...res.data, user:{...res.data.user, imageUrl: `${res.data.user.imageUrl}?time=${new Date().getTime()}`}} })
          this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
          this.isLoadingSubject.next(false)
          return {
            dataState: DataState.LOADED, appData: this.datasubject.value
          }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.datasubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false)
          console.log("error", error)
          return of({ dataState: DataState.LOADED, appData: this.datasubject.value })
        })
      )
    }

  }
  getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append("image", image)
    return formData
  }
  
  isLoadingFunc(){
    this.isLoading$.subscribe(
      (value)=>{
        // console.log("value retrieved LoadingFunc", value)
        this.isLoading = value.valueOf()
      }
    )
    return this.isLoading
  }

  

}
