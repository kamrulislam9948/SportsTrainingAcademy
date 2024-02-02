declare var google:any;

import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from 'src/app/models/authentication/login-model';
import { LoginService } from 'src/app/services/authentication/login.service';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data: LoginModel = {};
  returnUrl: string = "/navbar";
  private route = inject(Router);
  
  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginService.getEmitter().subscribe(x => {
      if (x === "login") {
        this.redirectBasedOnRole();
      }
      if (x === "logout") {
      }
    });
  }

  login(f: NgForm) {
    console.log(this.data);
    this.loginService.login(this.data);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      q => {
        this.returnUrl = q['returnUrl'] ?? '/dashboard';
      }
    );
    google.accounts.id.initialize({
      client_id:'647134436725-766v9rtb070ke3m99q7m3ani8mh55s7o.apps.googleusercontent.com',
      callback:(resp: any)=>
      this.handleLogin(resp)
    });
    google.accounts.id.renderButton(document.getElementById("google-btn"),{
      theme: 'filled_blue',
      size:'large',
      shape: 'rectangle',
      width: 350
    })   
  };

  private redirectBasedOnRole() {
    if (this.authService.roleMatch(['Admin'])) {
      this.router.navigateByUrl('/admin-dashboard');
    } else if (this.authService.roleMatch(['Staff'])) {
      this.router.navigateByUrl('/staff-dashboard');
    } else if (this.authService.roleMatch(['Players'])) {
      this.router.navigateByUrl('/player-dashboard');
    } else {
      this.router.navigateByUrl('/default-dashboard');
    }
  }
  handleLogin(response:any){
    if(response){
      //decode tocken
      const payload =this.decodeTocken(response.credential);
      //store in session
        sessionStorage.setItem("loggedInUser", JSON.stringify(payload));
      //nevigate to home/browse
      this.router.navigate(['/player-dashboard'])
    }
  }
  private decodeTocken(token:string){
    return JSON.parse(atob(token.split(".")[1]));
  }
}
