import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { HelpCenterFaqsComponent } from './faqs/faqs.component';
import { HelpCenterGuidesCategoryComponent } from './guides/category/category.component';
import { HelpCenterGuidesGuideComponent } from './guides/guide/guide.component';
import { HelpCenterGuidesComponent } from './guides/guides.component';
import { HelpCenterComponent } from './help-center.component';
import { helpCenterRoutes } from './help-center.routing';
import { HelpCenterSupportComponent } from './support/support.component';

@NgModule({
    declarations: [
        HelpCenterComponent,
        HelpCenterFaqsComponent,
        HelpCenterGuidesComponent,
        HelpCenterGuidesCategoryComponent,
        HelpCenterGuidesGuideComponent,
        HelpCenterSupportComponent
    ],
    imports     : [
        RouterModule.forChild(helpCenterRoutes),
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class HelpCenterModule
{
}
