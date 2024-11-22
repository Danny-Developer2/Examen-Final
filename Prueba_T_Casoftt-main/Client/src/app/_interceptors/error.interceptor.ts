import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { BadRequest } from 'src/app/_models/badRequest';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
 
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            const item = new BadRequest(error);
            toastr.error(error.error.message, error.status.toString())
            if (item.validationErrors && item.validationErrors.length > 0) {
            }
            throw item;
          case 401:
            const unauthorizedError = new BadRequest(error);
            throw unauthorizedError;
          case 404:
            const navigationExtras404: NavigationExtras = {state: {error: error.error}};
            router.navigateByUrl('404',navigationExtras404);
            const notFoundError = new BadRequest(error);
            throw notFoundError;
          case 500:
            const navigationExtras: NavigationExtras = {state: {error: error.error}};
            router.navigateByUrl('/server-error', navigationExtras);
            throw new BadRequest(error);
          default:
            const defaultError = new BadRequest(error);
            throw defaultError;
        }
      }
      throw error;
    })
  )
};
