import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.closeAlert = false;
    this.isLoading$.subscribe()
    this.profileState$= this.userService.profile$()
      .pipe(
        map(res => {
            
            this.datasubject.next(res)
            this.isRoleUser = res?.data?.user?.roleName === "ROLE_USER" ? true : false;
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

  

}
