import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberDetailComponent } from './components/member/member-detail/member-detail.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { MessagesComponent } from './components/messages/messages.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'member', component: MemberListComponent },
  { path: 'member/:id', component: MemberDetailComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: '**', component: HomeComponent,pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }