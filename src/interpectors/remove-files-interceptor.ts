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
    const files = context.switchToHttp().getRequest().files;

    return next.handle().pipe(
      tap(({ images }) =>
        images.map((file: Express.Multer.File) => fs.unlinkSync(file.path)),
      ),
      catchError(err => {
        files.map((file: Express.Multer.File) => fs.unlinkSync(file.path));
        return throwError(() => err);
      }),
    );
  }
}
