import { BadRequestException } from '@nestjs/common';
import {
  FileTypeValidator as DefaultFileTypeValidator,
  FileTypeValidatorOptions,
} from '@nestjs/common';
import * as fs from 'fs';

export class FileTypeValidator extends DefaultFileTypeValidator {
  constructor(
    validationOptions: FileTypeValidatorOptions,
    private message: string,
  ) {
    super(validationOptions);
  }

  isValid(fileOrFiles: Express.Multer.File | Express.Multer.File[]): boolean {
    const isArray = Array.isArray(fileOrFiles);

    const isValid = isArray
      ? fileOrFiles.every((file) => super.isValid(file))
      : super.isValid(fileOrFiles);

    if (isArray) {
      if (!fileOrFiles.length)
        throw this.invalidateFile(fileOrFiles, 'File is required');

      if (isValid) return true;
      throw this.invalidateFile(fileOrFiles);
    } else {
      if (isValid) return true;
      throw this.invalidateFile(fileOrFiles);
    }
  }

  private invalidateFile(
    fileOrFiles: Express.Multer.File | Express.Multer.File[],
    customMessage?: string,
  ) {
    const isArray = Array.isArray(fileOrFiles);

    isArray
      ? fileOrFiles.map((file) => fs.unlinkSync(file.path))
      : fs.unlinkSync(fileOrFiles.path);

    throw new BadRequestException(customMessage ?? this.message);
  }
}
