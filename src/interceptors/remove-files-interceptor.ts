import * as fs from 'fs';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RemoveFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const file = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(body => body.image && fs.unlinkSync(body.image.path)),
      catchError(err => {
        file.image && fs.unlinkSync(file.image.path);
        return throwError(() => err);
      }),
    );
  }
}
