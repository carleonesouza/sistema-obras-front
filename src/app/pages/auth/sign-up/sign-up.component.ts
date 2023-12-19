import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Perfil } from 'app/models/perfil';
import { User } from 'app/models/user';
import { RolesService } from 'app/pages/admin/settings/roles/roles.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    obter = true;
    hide = true;
    isLinear = false;
    hide_confirm = true;
    perfis$: Observable<any>;
    perfil: Perfil;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    loading: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _perfilService: RolesService,
        public _snackBar: MatSnackBar
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Create all forms
        this.signUpForm = this._formBuilder.group({
            id: new FormControl(''),
            nome: new FormControl('', Validators.required),
            instituicao_setor: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            telefone: new FormControl(''),
            senha: new FormControl(''),
            senha_confirmation: new FormControl(''),
            tipo_usuario: new FormControl('')
        });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get userControlsForm(): { [key: string]: AbstractControl } {
        return this.signUpForm.controls;
    }


    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        this.perfis$ = this._perfilService.getPerfil();
        const user = new User(this.signUpForm.value);

        this.perfis$.subscribe((result) => {
            if (result) {
                this.perfil = new Perfil(result.data.find(item => item?.descricao.toLowerCase() === String('EDITOR').toLowerCase()));
                user.tipo_usuario = this.perfil?.id;
            }
        })

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(user)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/inicio');
                },
                (response) => {
                    console.log('Error ', response);

                    // Re-enable the form
                    this.signUpForm.enable();
                    this.obter = true;


                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );

    }
}
