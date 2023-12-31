import { Component, OnInit } from '@angular/core';
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

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginService.getEmitter().subscribe(x => {
      if (x === "login") {
        // Redirect based on user role
        this.redirectBasedOnRole();
      }
      if (x === "logout") {
        // Handle logout logic if needed
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
  }

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
}
