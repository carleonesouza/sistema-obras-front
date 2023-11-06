import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'landing-home',
    templateUrl  : './landing.component.html',
    styleUrls    : ['./landing.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit{


    @ViewChild('signatureNgForm') signatureNgForm: NgForm;
    apiToken;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    loading: boolean = false;
    signatureForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signatureForm = this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                apikey: [{value: '', disabled: true}]
            }
        );

    }


    obterKey(): void
    {
        // Do nothing if the form is invalid
        if ( this.signatureForm.invalid )
        {
            return;
        }

      // Disable the form
      this.signatureForm.disable();

      // Hide the alert
      this.showAlert = false;
      this.loading = true;

      // Sign up
      this._authService.obterSignature(this.signatureForm.value)
          .subscribe(
              (response) => {


                this.signatureForm.patchValue({
                    apikey: response.public_api_key
                });
                this.apiToken = response.public_api_key;
                this.loading = false;

              },
              (response) => {
                console.log('Error ', response);

                  // Re-enable the form
                  this.signatureForm.enable();


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
}


