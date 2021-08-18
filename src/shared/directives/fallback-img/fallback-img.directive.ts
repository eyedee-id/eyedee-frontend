import {Directive, Input, HostBinding, HostListener} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[fallback]'
})
export class FallbackImgDirective {
  @Input()
  @HostBinding('src')
  src: string | SafeUrl | undefined;

  @Input() fallback: string = '';

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  @HostListener('error')
  onError() {
    this.src = this.sanitizer.bypassSecurityTrustUrl(this.fallback);
  }
}
