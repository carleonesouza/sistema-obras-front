import { Route } from '@angular/router';
import { HelpCenterFaqsComponent } from './faqs/faqs.component';
import { HelpCenterGuidesCategoryComponent } from './guides/category/category.component';
import { HelpCenterGuidesGuideComponent } from './guides/guide/guide.component';
import { HelpCenterGuidesComponent } from './guides/guides.component';
import { HelpCenterComponent } from './help-center.component';
import { HelpCenterMostAskedFaqsResolver, HelpCenterFaqsResolver, HelpCenterGuidesResolver, HelpCenterGuidesCategoryResolver, HelpCenterGuidesGuideResolver } from './help-center.resolvers';
import { HelpCenterSupportComponent } from './support/support.component';

export const helpCenterRoutes: Route[] = [
    {
        path     : '',
        component: HelpCenterComponent,

    },
    {
        path     : 'faqs',
        component: HelpCenterFaqsComponent,
    },
    {
        path     : 'support',
        component: HelpCenterSupportComponent
    }
];
