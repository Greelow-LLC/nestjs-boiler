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
    const file = context.switchToHttp().getRequest().image;

    return next.handle().pipe(
      tap(({ image: file }) => fs.unlinkSync(file.path)),
      catchError(err => {
        fs.unlinkSync(file.path);
        return throwError(() => err);
      }),
    );
  }
}
