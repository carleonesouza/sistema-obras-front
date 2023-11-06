import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector       : 'settings',
    templateUrl    : './settings.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit
{
    constructor(private _router: Router){ }

    ngOnInit(){

        if(this._router.routerState.snapshot.url === '/admin'){
            this._router.navigate(['/home']);
        }
    }

}
