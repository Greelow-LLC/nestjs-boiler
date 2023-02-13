import { PrismaClient } from '@prisma/client';

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer T}` //eslint-disable-line
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;
