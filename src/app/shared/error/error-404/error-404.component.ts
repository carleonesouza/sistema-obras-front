import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector       : 'error-404',
    templateUrl    : './error-404.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error404Component implements OnInit
{
    private state$: Observable<any>;

    constructor(public activatedRoute: ActivatedRoute) { }
      ngOnInit() {
        this.state$ = this.activatedRoute.paramMap
        .pipe(map(() => window.history.state));
    }
}
