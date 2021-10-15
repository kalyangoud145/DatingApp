import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  loggedIn: boolean = false;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  login() {
    this.accountService.login(this.model)
      .subscribe(reponse => { console.log(reponse); this.loggedIn = true }, error => {
        console.log(error)
      });
  }

  
  logout() {
    this.accountService.logOut();
    this.loggedIn = false;
  }
  getCurrentUser(){
    this.accountService.currentUser$.subscribe(reponse=>{
      console.log(reponse);
      this.loggedIn = !!reponse;
    },error=>{
      console.log(console.error());
    })
  }

}
