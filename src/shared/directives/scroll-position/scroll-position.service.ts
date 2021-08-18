import {ElementRef, Inject, Injectable, Optional} from '@angular/core';
import {Router} from "@angular/router";
import {IScrollPositionServiceConfig, SW_SCROLL_POSITION_CONFIG,} from "./scroll-position.config";

const baseConfig: Required<IScrollPositionServiceConfig> = {
  urlSerializer: (url: string) => url,
};

@Injectable({providedIn: "root"})
export class ScrollPositionStore extends Map<string, number> {
}

@Injectable()
export class ScrollPositionService {
  private config: Required<IScrollPositionServiceConfig>;

  constructor(
    private store: ScrollPositionStore,
    private router: Router,
    @Optional()
    @Inject(SW_SCROLL_POSITION_CONFIG)
      config: IScrollPositionServiceConfig
  ) {
    this.config = {...baseConfig, ...config};
  }

  get(key: string | string[]) {
    return this.store.get(this.getPositionKey(key)) || 0;
  }

  save(
    key: string | string[],
    /**
     * If an `ElementRef` or `HTMLElement` is provided,
     * the `scrollTop` is extracted and saved with the provided key(s)
     */
    value: ElementRef<HTMLElement> | HTMLElement | number
  ) {
    const main = document.getElementsByTagName('main')[0];
    const _value =
      main instanceof ElementRef
        ? main.nativeElement.scrollTop
        : typeof value === "number"
          ? main
          : main.scrollTop;

    this.store.set(this.getPositionKey(key), _value || 0);
  }

  refresh(key: string | string[], el: ElementRef<HTMLElement> | HTMLElement) {
    // const _el = el instanceof ElementRef ? el.nativeElement : el;

    const main = document.getElementsByTagName('main')[0];
    main.scrollTop = this.get(key);
  }

  private getPositionKey(base: string | string[]) {
    if (Array.isArray(base)) {
      base = base.sort().join("::");
    }

    return `${base}::` + this.config.urlSerializer(this.router.url);
  }
}
