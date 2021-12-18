import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members:Member[]=[];
  constructor(private http: HttpClient) { }
  getMembers() {
    if(this.members.length>0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'user').pipe(
      map((members: Member[])=>{
        this.members= members;
        return members;
      })
    );
  }
  getMember(userName: String) {
    const member = this.members.find(x=>x.userName==userName);
    if(member !=undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'user/' + userName);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'user', member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index]= member;
      })
    );
  }
}
