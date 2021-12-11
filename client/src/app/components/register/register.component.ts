import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() homeToRegister: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private accountService: AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  register() {
    this.accountService.register(this.model).subscribe(data => { console.log(data),this.cancel(); },
      error => {
        this.toastr.error(error.error);
        console.log(error);
      })
  }
  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
