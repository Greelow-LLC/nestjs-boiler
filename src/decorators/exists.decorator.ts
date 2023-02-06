import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer T}` //eslint-disable-line
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

interface Property<T extends object | void = void> {
  model: PrismaModelName;
  fieldToValidate?: keyof T;
}

const validateModel = (
  model: PrismaModelName,
  validateField: string,
  field: string,
  prisma: PrismaService,
) => {
  return prisma[model as string].findFirst({
    where: { [validateField]: field },
  });
};

@ValidatorConstraint({ async: true })
@Injectable()
export class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(field: any, args: ValidationArguments) {
    const [{ model, fieldToValidate }] = args.constraints;
    const validateField = fieldToValidate ?? args.property;

    const itemExists = await validateModel(
      model,
      validateField,
      field,
      this.prisma,
    );

    if (itemExists) return false;
    return true;
  }
}

export function IsAlreadyExist<T extends object | void = void>(
  property: Property<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAlreadyExistConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNotExistConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(field: any, args: ValidationArguments) {
    const [{ model, fieldToValidate }] = args.constraints;
    const validateField = fieldToValidate ?? args.property;

    return validateModel(model, validateField, field, this.prisma);
  }
}

export function IsNotExist<T extends object | void = void>(
  property: Property<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNotExistConstraint,
    });
  };
}
