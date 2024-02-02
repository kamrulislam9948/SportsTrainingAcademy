declare var google:any;

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import NgForm
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/common/notify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  data: any = {};
  @ViewChild('registerForm') registerForm!: NgForm; // Use non-null assertion operator

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private router: Router
  ) {}
  ngOnInit(): void {
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
  }
 
  register(): void {
    this.authService.register(this.data)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.notifyService.message('User created successfully.');
          this.registerForm.resetForm(); 
        },
        (error) => {
          console.error('Registration failed', error);
          this.notifyService.message('User registration failed.', 'Close');
        }
      );
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
