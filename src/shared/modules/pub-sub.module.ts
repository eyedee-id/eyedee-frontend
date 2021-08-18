import {ModuleWithProviders, NgModule} from "@angular/core";
import {PubSubService} from "../services/pub-sub.service";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: []
})
export class PubSubModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: PubSubModule,
      providers: [PubSubService]
    };
  }
}
