// server/src/config/env.ts
type Exp = number | `${number}${'ms'|'s'|'m'|'h'|'d'}`;

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'change_me',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? '5m') as Exp
};
