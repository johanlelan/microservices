import { ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimeExcutionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const stack = `${context.getClass().name}/${context.getHandler().name}`;
    Logger.log(`Before ${stack}...`);
    const now = Date.now();
    return call$.pipe(
      tap(() => Logger.log(`After ${stack}... ${Date.now() - now}ms`)),
    );
  }
}
