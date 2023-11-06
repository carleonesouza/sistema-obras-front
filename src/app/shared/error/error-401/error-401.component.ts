import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector       : 'error-403',
    templateUrl    : './error-401.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error401Component implements OnInit
{
    private state$: Observable<any>;

    constructor(public activatedRoute: ActivatedRoute) { }
      ngOnInit() {
        this.state$ = this.activatedRoute.paramMap
        .pipe(map(() => window.history.state));
    }
}
