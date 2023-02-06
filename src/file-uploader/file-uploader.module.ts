import { Global, Module } from '@nestjs/common';
import { FileUploaderService } from 'file-uploader/file-uploader.service';

@Global()
@Module({
  providers: [FileUploaderService],
  exports: [FileUploaderService],
})
export class FileUploaderModule {}
