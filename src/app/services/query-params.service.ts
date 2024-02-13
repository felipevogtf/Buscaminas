import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  constructor(private location: Location, private route: ActivatedRoute) {}

  setQueryParam(key: string, param: string): void {
    const encodedCode = encodeURIComponent(param);
    const data = btoa(encodedCode);
    const currentUrl = this.location.path();

    const urlSearchParams = new URLSearchParams(
      this.location.path().split('?')[1]
    );

    if (urlSearchParams.has(key)) {
      urlSearchParams.set(key, data);
    } else {
      urlSearchParams.append(key, data);
    }

    const newUrl = `${currentUrl.split('?')[0]}?${urlSearchParams.toString()}`;

    this.location.go(newUrl);
  }

  getQueryParams(key: string): Observable<string> {
    return this.route.queryParams.pipe(
      map((params) => {
        const data = params[key];
        if (data) {
          const decodedData = atob(data);
          const decodedCode = decodeURIComponent(decodedData);
          return decodedCode;
        } else {
          return '';
        }
      })
    );
  }
}
