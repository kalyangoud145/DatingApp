import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members$!: Observable<Member[]>;
  constructor(private memberService:MembersService,private spinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
   // this.loadMembers();
  }
  // loadMembers(){
  //   this.memberService.getMembers().subscribe(members=>{
  //     this.members = members;
  //   })
  // }

}
