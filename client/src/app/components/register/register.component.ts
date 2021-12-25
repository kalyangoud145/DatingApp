import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  registerForm: FormGroup;
  maxDate:Date;
  validationErrors:[]=[];
  constructor(private accountService: AccountService,
    private toastr: ToastrService, private fb: FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.intializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18)
  }
  // intializeForm() {
  //   this.registerForm = new FormGroup({
  //     username: new FormControl('', Validators.required),
  //     password: new FormControl('', [Validators.required,
  //     Validators.minLength(4), Validators.maxLength(8)]),
  //     confirmPassword: new FormControl('', [Validators.required,
  //     this.matchValues('password')])
  //   })
  //   this.registerForm.controls.password.valueChanges.subscribe(() => {
  //     this.registerForm.controls.confirmPassword.updateValueAndValidity();
  //   })
  // }
  intializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  register() {
    this.accountService.register(this.registerForm.value).
    subscribe(data => { this.router.navigateByUrl('/member'),console.log(data),this.cancel(); },
      error => {
        this.validationErrors=error;
      })
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value == control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }
  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
