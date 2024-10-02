import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  if(environment.env === 'dev'){
    req = req.clone({
      setHeaders:{
        Authorization: 'Basic ' + btoa("super:super")
      }
    })
  }  
  
  return next(req);
};
