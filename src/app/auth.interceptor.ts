import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access-token');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    const authReq = req.clone({
      setHeaders: {
        'access-token': accessToken || '',
        'client': client || '',
        'uid': uid || ''
      }
    });

    return next.handle(authReq);
  }
}
