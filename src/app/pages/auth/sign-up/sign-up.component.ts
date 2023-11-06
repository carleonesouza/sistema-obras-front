import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Loja } from 'app/models/loja';
import { Usuario } from 'app/models/usuario';
import { cpfValida } from 'app/utils/validaCpf';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit, AfterViewInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    apiToken: any;
    obter= true;
    isLinear = false;
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
            store: this._formBuilder.group({
                name: ['', Validators.required],
                cnpj: [''],
                apiKey: ['', Validators.required],
                phone: ['', Validators.required],
                owner: ['', Validators.compose([Validators.required, Validators.email])],
                status: [true]
            }),
            user: this._formBuilder.group({
                fullName: ['', [Validators.required]],
                cpf: ['', Validators.compose([Validators.required, this.validateCPF])],
                phone: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                apiKey: [''],
                password: [{ value: '', disabled: false }, [Validators.required]],
                agreements: ['', Validators.required],
            }),
            signature: this._formBuilder.group({
                email: ['', Validators.required],
                apiKey: [{ value: '', disabled: true }]
            })
        });
    }


    ngAfterViewInit(): void { }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    validateCPF(control: AbstractControl): { [key: string]: any } | null {
        if (control !== null) {
            return cpfValida(control);
        }
    }

    getPublicKey(): void{
         // Do nothing if the form is invalid
         if ( this.signature.invalid )
         {
             return;
         }
 
       // Disable the form
       this.signature.disable();
 
       // Hide the alert
       this.showAlert = false;
       this.loading = true;
 
       // Sign up
       this._authService.obterSignature(this.signature.value)
           .subscribe(
               (response) => {
 
 
                 this.signature.patchValue({
                    apiKey: response.public_api_key
                 });

                 this.apiToken = response.public_api_key;
                 this.obter = false;
                 this.loading = false;

                 //set storeForm with informations received
                 this.store.patchValue({
                    apiKey: response.public_api_key,
                    owner: this.signature.get('email').value
                 }); 

               },
               (response) => {
                 console.log('Error: ', response);
                 this.obter = true;
                   // Re-enable the form
                   this.signature.enable();
                  
 
                   // Set the alert
                   this.alert = {
                       type   : 'error',
                       message: response.error.message
                   };
 
                   // Show the alert
                   this.showAlert = true;
               }
           );
 
    }

    registerStore(): void{
           // Do nothing if the form is invalid
           if ( this.signature.invalid )
           {
               return;
           }
   
         // Disable the form
         this.signature.disable();
   
         // Hide the alert
         this.showAlert = false;
         this.loading = true;

         const store = new Loja(this.store.value);
    
         this._authService.registerStoreApp(store)
         .subscribe(
            (response) => {
               
                localStorage.setItem('store', JSON.stringify(response));
                this._snackBar.open('Loja Salva com Sucesso!', 'Fechar', {
                    duration: 3000
                  });
                this.loading = false;

                this.user.patchValue({
                    email: this.store.get('owner').value,
                    apiKey:this.store.get('apiKey').value
                 }); 

              },
              (response) => {
                console.log('Error: ', response);

                  // Re-enable the form
                  this.signature.enable();
                  this.obter = true;

                  // Set the alert
                  this.alert = {
                      type   : 'error',
                      message: response.error.message
                  };

                  // Show the alert
                  this.showAlert = true;
              }
         )
    }


    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        const user = new Usuario(this.signUpForm.value);
        const { _id, apiKey } = new Loja(JSON.parse(localStorage.getItem('store')));
        user.apiKey = apiKey;

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(user, _id)
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

    get store(): FormGroup {
        return this.signUpForm.get('store') as FormGroup;
    }

    get signature(): FormGroup {
        return this.signUpForm.get('signature') as FormGroup;
    }

    get user(): FormGroup {
        return this.signUpForm.get('user') as FormGroup;
    }

    //Store
    get name(): any {
        return this.store.get('name');
    }

    get cnpj(): any {
        return this.store.get('cnpj');
    }

    get apiKey(): any {
        return this.store.get('apiKey');
    }

    get phone(): any {
        return this.store.get('phone');
    }

    get owner(): any {
        return this.store.get('owner');
    }

    //Signature
    get emailS(): any {
        return this.signature.get('email');
    }

    get apyKeyS(): any {
        return this.signature.get('apyKey');
    }

    //user
    get fullName(): any {
        return this.user.get('fullName');
    }

    get cpf(): any {
        return this.user.get('cpf');
    }

    get password(): any {
        return this.user.get('password');
    }

    get phoneUser(): any {
        return this.user.get('phone');
    }

    get emailUser(): any {
        return this.user.get('email');
    }

    get agreements(): any {
        return this.user.get('agreements');
    }
}
