import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ExistsByIdPipe implements PipeTransform<string> {
  constructor(private prisma: PrismaService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const validateField = metadata.data;
    const model = validateField.toLowerCase().split('id')[0];

    const exists = await this.prisma[model].findFirst({
      where: { id: value },
    });

    if (exists) return value;

    throw new BadRequestException(
      `${model.charAt(0).toUpperCase() + model.slice(1)} doesn't exist`,
    );
  }
}
