import { ParseFilePipe } from '@nestjs/common';
import { FileTypeValidator } from 'multer/pipes';

const allowedFiles = ['jpeg', 'jpg', 'JPG', 'JPEG', 'png'];

export const imageValidator = new ParseFilePipe({
  validators: [
    new FileTypeValidator(
      {
        fileType: new RegExp(
          '([a-zA-Z0-9s_\\.-:])+(' + allowedFiles.join('|') + ')$',
        ),
      },
      'Please, select a valid file type',
    ),
  ],
});
