import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  // currentUser$: Observable<User>;
  constructor(public accountService: AccountService, private router: Router,
    private toastr: ToastrService) {
    // this.currentUser$ = this.accountService.currentUser$;
    // console.log(this.currentUser$);
  }

  ngOnInit(): void {
  }
  login() {
    this.accountService.login(this.model)
      .subscribe(reponse => { this.router.navigateByUrl('/member') }, error => {
       // this.toastr.error(error.error);
        console.log(error);
      });
  }


  logout() {

    this.accountService.logOut();
    this.router.navigateByUrl('/')
  }
  // getCurrentUser() {
  //   this.accountService.currentUser$.subscribe(reponse => {
  //     console.log(reponse);
  //   }, error => {
  //     console.log(console.error());
  //   })
  // }

}
