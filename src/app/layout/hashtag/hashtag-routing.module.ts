import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HashtagComponent} from './hashtag.component';

const routes: Routes = [
  {
    path: '',
    component: HashtagComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HashtagRoutingModule { }
