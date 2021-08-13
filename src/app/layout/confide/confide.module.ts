import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfideRoutingModule } from './confide-routing.module';
import { ConfideComponent } from './confide.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CommentNewComponent } from './comment-new/comment-new.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import {ConfideService} from "../../../shared/services/confide.service";


@NgModule({
  declarations: [
    ConfideComponent,
    CommentNewComponent,
    CommentListComponent
  ],
  imports: [
    CommonModule,
    ConfideRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfideService,
  ],
})
export class ConfideModule { }
