import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExploreComponent} from './explore/explore.component';
import {TrendingComponent} from './trending/trending.component';
import {PagesComponent} from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'trending',
        component: TrendingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
