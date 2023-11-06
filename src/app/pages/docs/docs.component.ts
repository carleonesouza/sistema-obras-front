/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import SwaggerUI from 'swagger-ui';

@Component({
    selector       : 'docs',
    templateUrl    : './docs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsComponent implements OnInit, OnDestroy{


    constructor(){}

    ngOnInit(): void {
        SwaggerUI({
            domNode: document.getElementById('swagger-ui-item'),
            url: environment.apiDocs+'api-docs'
          });
    }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }


}


