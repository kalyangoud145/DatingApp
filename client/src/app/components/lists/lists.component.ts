import { Component, OnInit } from '@angular/core';
import { LikesParams } from 'src/app/_models/likesParams';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate = 'liked';
  likeParams:LikesParams;
  pagination:Pagination;
  constructor(private memberService: MembersService) { 
    this.likeParams = new LikesParams();
  }

  ngOnInit(): void {
    this.loadLikes();
  }
  loadLikes() {
    this.memberService.getLikes(this.predicate,this.likeParams).subscribe(response => {
      this.members = response.result;
      console.log(this.members);
      this.pagination =response.Pagination
    })
  }
  pageChanged(event: any) {
    this.likeParams.pageNumber = event.page;
    this.loadLikes();
  }
}
