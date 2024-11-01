import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private resizeSubject: Subject<{
    breakpoint: string;
    minSize: number;
    maxSize: number;
  }> = new Subject();

  private screenSizes: {
    breakpoint: string;
    minSize: number;
    maxSize: number;
  }[] = [
    { breakpoint: 'sm', minSize: 0, maxSize: 640 },
    { breakpoint: 'md', minSize: 640, maxSize: 768 },
    { breakpoint: 'lg', minSize: 768, maxSize: 1024 },
    { breakpoint: 'xl', minSize: 1024, maxSize: 1280 },
    { breakpoint: '2xl', minSize: 1280, maxSize: 10000 },
  ];

  constructor(private httpClient: HttpClient) {
    this.resizeSubject.next(this.screenSizes[2]);
  }

  get onResize$(): Observable<string> {
    return this.resizeSubject.asObservable().pipe(
      switchMap(
        (screenSize: {
          breakpoint: string;
          minSize: number;
          maxSize: number;
        }) => {
          return of(screenSize.breakpoint);
        },
      ),
    );
  }

  onResize(size: number) {
    // console.log(size);
    const newScreenSize = this.screenSizes.find(
      (screenSize: { breakpoint: string; minSize: number; maxSize: number }) =>
        size >= screenSize.minSize && size < screenSize.maxSize,
    );

    if (!newScreenSize) {
      return;
    }

    this.resizeSubject.next(newScreenSize);
  }
}
