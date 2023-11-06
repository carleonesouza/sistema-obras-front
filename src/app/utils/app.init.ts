import { environment } from 'environments/environment';
import { KeycloakService } from 'keycloak-angular';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
      keycloak.init({
        config: {
          //url: environment.production ? 'https://idp-homolog.eusaude.com.br/auth' : 'https://idp-homolog.eusaude.com.br/auth',
          realm: 'evo_api',
          clientId: 'web_app',
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
          flow: 'standard'
        },
        bearerExcludedUrls: [
          '/assets',
        ],
      });
  }



