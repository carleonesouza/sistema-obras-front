import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseNavigationItem, FuseVerticalNavigationPosition,
    FuseNavigationService, FuseVerticalNavigationComponent
} from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { PagesService } from './pages.service';
import { User } from 'app/models/user';


@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

    @Input() appearance: FuseVerticalNavigationAppearance;
    @Input() autoCollapse: boolean;
    @Input() inner: boolean;
    @Input() mode: FuseVerticalNavigationMode;
    @Input() name: string;
    @Input() navigation: FuseNavigationItem[];
    @Input() isScreenSmall: boolean;
    @Input() position: FuseVerticalNavigationPosition;
    @Input() transparentOverlay: boolean;
    user: User;
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
                // {
                //     id: 'controllers',
                //     title: 'Controle',
                //     type: 'basic',
                //     icon: 'mat_solid:content_paste_off',
                //     link: 'admin/paginas/controller'
                // },
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
                },
                {
                    id: 'tipoInfra',
                    title: 'Tipo Infraestrutura',
                    type: 'basic',
                    icon: 'mat_solid:business',
                    link: 'admin/empreendimentos/tipo-infraestrutura/lista'
                },
                {
                    id: 'intervencao',
                    title: 'Intervenção',
                    type: 'basic',
                    icon: 'mat_solid:ballot',
                    link: 'admin/empreendimentos/intervencoes/lista'
                },
                {
                    id: 'logs',
                    title: 'Logs',
                    type: 'basic',
                    icon: 'mat_solid:text_snippet',
                    link: 'admin/logs'
                }
            ]
        },
        {
            id: 'empreendimento',
            title: 'Empreendimento',
            subtitle: '',
            type: 'basic',
            icon: 'mat_outline:storefront',
            link: 'admin/empreendimentos/lista',
            
        },
        {
            id: 'obra',
            title: 'Obras',
            subtitle: '',
            type: 'basic',
            icon: 'mat_outline:construction',
            link: 'admin/obras/lista',
            // children: [
            //     {
            //         id: 'empreendimento',
            //         title: 'Empreendimento',
            //         type: 'basic',
            //         //icon: 'mat_solid:admin_panel_settings',
            //         link: 'admin/empreendimentos/lista',
            //     }
            //     ,
            //     {
            //         id: 'obras',
            //         title: 'Cadastrar Obra',
            //         type: 'basic',
            //         //icon: 'mat_solid:admin_panel_settings',
            //         link: 'admin/empreendimentos/cadastrar-obras'
            //     },
            //     {
            //         id: 'lista-obras',
            //         title: 'Listar Obras',
            //         type: 'basic',
            //         //icon: 'mat_solid:admin_panel_settings',
            //         link: 'admin/empreendimentos/todas-obras'
            //     },
               
            // ]
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
            this.user = new User(JSON.parse(localStorage.getItem('user')));
            if (auth !== undefined && auth !== null && this.user) {
                //Set menu for specific role
                this.navigationData.map((item) => {
                    if (this.user?.tipo_usuario?.descricao.toLowerCase() !== 'admin' && item.id === 'admin') {
                        item.hidden = () => true;
                    }
                });
            }
        });


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
        const id = this.user.id;
        this._router.navigate([`/profile/${id}`]);
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
