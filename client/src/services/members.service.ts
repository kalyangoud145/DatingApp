import { HttpClient, HttpParams } from '@angular/common/http';
import { partitionArray } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LikesParams } from 'src/app/_models/likesParams';
import { Member } from 'src/app/_models/member';
import { PaginationResult } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  likeParams: LikesParams;
  paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>();
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
      this.likeParams = new LikesParams();
    })
  }
  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    // if (response) {
    //   console.log(response)
    //   return of(response);
    // }
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy);
    params = params.append('gender', userParams.gender);
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'user', params)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }));
  }
  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }
  getLikes(predicate: string, likesParams: LikesParams) {
    console.log(this.likeParams);
    let params = this.getPaginationHeaders(likesParams.pageNumber, likesParams.pageSize)
    params = params.append('predicate', predicate);
    //return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate)
    return this.getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params)
  }
  getUserParams() {
    return this.userParams;
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }
  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  getMember(userName: String) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === userName)
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
}
