import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  users: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.getUsers();
  }
  registerToggle() {
    this.registerMode = true;
  }
  // getUsers(){
  //   this.http.get('https://localhost:5001/api/user').subscribe(data=>{this.users=data;console.log(data)},error=>{console.log(error)});
  // }
  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

}
