import { Injectable } from '@angular/core';
import { User } from 'src/app/models/authentication/user-model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: User | null;
  constructor(private loginService: LoginService) {
    this.load();
    this.loginService.getEmitter()
    .subscribe(x=>{
      if (x === "login") {
        //console.log("login");
        this.load();
      }
      if (x === "logout") {
        this.user =null;
      }
    })
  }
  load() {
    this.user = this.loginService.getCurrentUser();
    //console.log(this.user)
  }
  logout(){
    this.loginService.logout();
  }
  isLoggedIn() {
    //console.log(this.user)
    return this.user != null;
  }
  get userName() {
    return this.user?.username ?? '';
  }
  get token() {
    return this.user?.token ?? '';
  }
  get roles() {
    return this.user?.roles;
  }
  roleMatch(allowedRoles: string[]) {
    //console.log(allowedRoles);
    let isMatch = false;
    for (const r of allowedRoles) {
      
      let i = this.roles?.indexOf(r);
      //console.log(i);
      if (i !=undefined && i>=0) {
        isMatch = true;
        break;
      }
    }
    //console.log(`$Match: ${isMatch}`);
    return isMatch;
  }
}
