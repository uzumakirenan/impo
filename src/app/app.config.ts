import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoHttpRequestModule } from '@po-ui/ng-components';
import { loginInterceptor } from './login.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'

registerLocaleData(localePt)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loginInterceptor])
    ),
    importProvidersFrom([BrowserAnimationsModule, PoHttpRequestModule]),
    { provide: LOCALE_ID, useValue: 'pt-BR'}
  ],
  
};