import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DocsComponent } from './docs.component';
import { docsRoutes } from './docs.routing';
import { PagesService } from '../pages.service';



@NgModule({
    declarations: [
        DocsComponent
    ],
    imports     : [
        RouterModule.forChild(docsRoutes),
        SharedModule
    ],
    providers:[ PagesService]
})
export class DocsModule
{
}
