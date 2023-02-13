// import {
//   ArgumentMetadata,
//   BadRequestException,
//   Injectable,
//   PipeTransform,
// } from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
// import { PrismaModelName } from 'prisma/types';

// @Injectable()
// export class ExistsPipe implements PipeTransform<string> {
//   constructor(private model: PrismaModelName, private prisma: PrismaService) {}

//   transform(value: string, metadata: ArgumentMetadata): string {
//     console.log(new metadata.metatype());

//     // this.prisma[this.model as string].findFirst({
//     //   where: { [validateField]: field },
//     // });

//     return value;

//     // if (ObjectId.isValid(value)) {
//     //   if (String(new ObjectId(value)) === value) return value;
//     //   throw new BadRequestException();
//     // }
//     throw new BadRequestException();
//   }
// }
