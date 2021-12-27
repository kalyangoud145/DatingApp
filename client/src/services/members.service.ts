import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { PaginationResult } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>();
  constructor(private http: HttpClient) { }
  getMembers(userParams: UserParams) {
    // if(this.members.length>0) return of(this.members);

    // return this.http.get<Member[]>(this.baseUrl + 'user').pipe(
    //   map((members: Member[]) => {
    //     this.members = members;
    //     return members;
    //   })
    // );
    console.log(userParams);
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);
    params = params.append('gender', userParams.gender);
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'user', params);
  }
  private getPaginatedResult<T>(url, params: HttpParams) {
    const paginatedResult: PaginationResult<T> = new PaginationResult<T>();
    return this.http.get<Member[]>(url, { observe: 'response', params }).pipe(
      map((response) => {
        this.paginationResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginationResult.Pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginationResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }
  getMember(userName: String) {
    const member = this.members.find(x => x.userName == userName);
    if (member != undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'user/' + userName);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'user', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId, {});
  }
}
