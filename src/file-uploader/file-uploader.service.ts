import * as fs from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploaderService {
  constructor(private readonly config: ConfigService) {}
  private readonly bucketName = this.config.get('AWS_BUCKET_NAME');
  private s3 = new S3({
    region: this.config.get('AWS_REGION'),
    accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    signatureVersion: this.config.get('AWS_SIGNATURE_VERSION'),
  });

  uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    return this.s3Operation(file);
  }

  deleteFile(key: S3.PutObjectRequest['Key']) {
    if (!key) throw new BadRequestException('A key is required');

    return this.s3Operation(null, 'deleteObject', key);
  }

  uploadFiles(files: Express.Multer.File[]) {
    if (!files || !files.length)
      throw new BadRequestException('File is required');

    return Promise.all(files.map(file => this.s3Operation(file)));
  }

  deleteFiles(keys: S3.PutObjectRequest['Key'][]) {
    if (!keys || !keys.length)
      throw new BadRequestException('A key is required');

    return Promise.all(
      keys.map(async key => await this.s3Operation(null, 'deleteObject', key)),
    );
  }

  private async s3Operation(
    file: Express.Multer.File = null,
    type: 'upload' | 'deleteObject' = 'upload',
    key?: string,
  ) {
    return this.s3[type as keyof typeof type]({
      Bucket: this.bucketName,
      ...(type === 'upload' && { Body: fs.createReadStream(file.path) }),
      Key: type === 'upload' ? `${uuid()}-${file.filename}` : key,
    }).promise();
  }
}
