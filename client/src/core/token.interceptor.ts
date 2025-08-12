import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  const router = inject(Router);

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        localStorage.removeItem('token');
        router.navigateByUrl('/login');
      }
      return throwError(() => err);
    })
  );
};
