import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class FileUploaderService {
  constructor(private readonly config: ConfigService) {}
  private readonly bucketName = this.config.get('AWS_BUCKET_NAME');
  private s3 = new S3();

  uploadFiles(files: Express.Multer.File[]) {
    if (!files || !files.length)
      throw new BadRequestException('File is required');

    return Promise.all(
      files.map((file) =>
        this.s3
          .upload({
            Bucket: this.bucketName,
            Body: fs.createReadStream(file.path),
            Key: `${uuid()}-${file.filename}`,
          })
          .promise(),
      ),
    );
  }

  deleteFiles(keys: S3.PutObjectRequest['Key'][]) {
    if (!keys || !keys.length)
      throw new BadRequestException('A key is required');

    return Promise.all(
      keys.map((key) =>
        this.s3
          .deleteObject({
            Bucket: this.bucketName,
            Key: key,
          })
          .promise(),
      ),
    );
  }
}
