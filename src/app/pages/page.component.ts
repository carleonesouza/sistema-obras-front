import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
    FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseNavigationItem, FuseVerticalNavigationPosition,
    FuseNavigationService, FuseVerticalNavigationComponent
} from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PagesService } from './pages.service';
import { Usuario } from 'app/models/usuario';
import { Perfil } from 'app/models/perfil';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() appearance: FuseVerticalNavigationAppearance;
    @Input() autoCollapse: boolean;
    @Input() inner: boolean;
    @Input() mode: FuseVerticalNavigationMode;
    @Input() name: string;
    @Input() navigation: FuseNavigationItem[];
    @Input() isScreenSmall: boolean;
    @Input() position: FuseVerticalNavigationPosition;
    @Input() transparentOverlay: boolean;
    user: Usuario;
    loginStatus$: Observable<boolean>;
    isAuth = false;
    private navigationData: FuseNavigationItem[] = [
        {
            id: 'home',
            title: 'Início',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/inicio'
        },
        
        {
            id: 'admin',
            title: 'Administrativo',
            subtitle: '',
            type: 'collapsable',
            icon: 'mat_outline:settings',
            children: [
                {
                    id: 'account',
                    title: 'Conta',
                    type: 'basic',
                    icon: 'mat_outline:manage_accounts',
                    link: 'admin/conta/lista'
                },
                {
                    id: 'roles',
                    title: 'Perfis',
                    type: 'basic',
                    icon: 'mat_outline:supervisor_account',
                    link: 'admin/perfil/lista'
                },
                {
                    id: 'setors',
                    title: 'Setores',
                    type: 'basic',
                    icon: 'mat_solid:admin_panel_settings',
                    link: 'admin/setores/lista'
                }                
            ]
        },
        {
            id: 'empreendimento',
            title: 'Empreendimento',
            type: 'basic',
            icon: 'mat_outline:storefront',
            link: 'admin/empreendimentos/lista'
        },
        {
            id: 'iniciativa',
            title: 'Iniciativa',
            type: 'basic',
            icon: 'mat_outline:add_moderator',
            link: 'admin/iniciativas/lista'
        },

    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    /**
     * Constructor
     */
    constructor(private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService, private _router: Router, private _pagesService: PagesService) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {
        this.loginStatus$ = this._authService.isLoggedIn$;

        this.loginStatus$.subscribe((auth) => {
            if (auth) {
                this.user = new Usuario(JSON.parse(localStorage.getItem('user')));

                //Set menu for specific role
                this.navigationData.map((item) => {
                  
                    // const profile = new Perfil(this.user);
                    // if (profile.role.toLowerCase().localeCompare(String('Admin').toLowerCase()) === 1 && item.id === 'admin') {
                    //     item.hidden = () => true;
                    // }

                });
            }
        });


    }

    ngAfterViewInit(): void {


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        window.location.reload();
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }


    getNavItem(itemId, navigationName): FuseNavigationItem | null {
        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(navigationName);

        // Return if the navigation component does not exist
        if (!navComponent) {
            return null;
        }

        // Get the navigation item
        const navigation = navComponent.navigation;
        const item = this._fuseNavigationService.getItem(itemId, navigation);
        return item;
    }

    toAuth(): boolean {
        return this.isAuth;
    }

    updateUserStatus(status: string): void {

    }

    profile(): void {
        this._router.navigate(['/profile']);
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
