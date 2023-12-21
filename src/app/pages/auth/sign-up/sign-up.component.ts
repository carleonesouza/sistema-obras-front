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
import { environment } from 'environments/environment';


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
    loading: boolean = false;
    isLinear = false;
    hide_confirm = true;
    perfis$: Observable<any>;
    perfis: any;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    recaptcha: string | undefined;
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
        this.recaptcha = environment.recaptcha.siteKey;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {    
        this.createUserForm();

        this._perfilService.getPerfil()
        .subscribe((result: any) => {
            this.loading = true;
            if (result) {
                result?.data.map((item) =>{
                    
                    if(item?.descricao.toLowerCase() === String('EDITOR').toLowerCase()){                       
                        this.loading = false;
                        this.signUpForm.patchValue({
                            tipo_usuario : item
                        })
                    }
                })
           
               }
        })

        
    }

    compareFn(c1: any, c2: any): boolean {
     
        return c1 && c2 ? c1.descricao === c2 : c2 === c1.id;
      }
        
      itemDisplayFn(item: Perfil) {
        return item ? item.descricao : '';
      }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get userControlsForm(): { [key: string]: AbstractControl } {
        return this.signUpForm.controls;
    }

    createUserForm() {
        this.signUpForm = this._formBuilder.group({
          id: new FormControl(''),
          nome: new FormControl('', Validators.required),
          instituicao_setor: new FormControl('', Validators.required),
          email: new FormControl('', [Validators.required, Validators.email]),
          telefone: new FormControl(''),
          senha: new FormControl(''),
          recaptcha: new FormControl(['', Validators.required],),
          senha_confirmation: new FormControl(''),
          tipo_usuario: new FormControl('')
        });
      }


    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            for (const control of Object.keys(this.signUpForm.controls)) {
                this.signUpForm.controls[control].markAsTouched();
            }
            return;
        }

        const user = new User(this.signUpForm.value);
        const perfil =  new Perfil(this.signUpForm.get('tipo_usuario').value);
        user.tipo_usuario = perfil.id;
    
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
