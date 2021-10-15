import { HttpClient } from '@angular/common/http';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  users: any;
  constructor(private http: HttpClient, private accountService: AccountService) { }
  ngOnInit() {
    this.setCurrentUser();
    //  this.http.get('https://localhost:5001/api/user').subscribe(data=>{this.users=data;console.log(data)},error=>{console.log(error)});
  }
  setCurrentUser() {
    const currentUser =(localStorage.getItem('user') ); 
    const user: User = JSON.parse(currentUser !=null? currentUser :'{}');
    this.accountService.serCurrentUser(user);
  }
}
