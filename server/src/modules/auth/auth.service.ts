import { prisma } from '../../db/prisma';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export async function login({ username, password }: { username: string; password: string }) {
  const user = await prisma.users.findUnique({ where: { username } });
  if (!user || !user.password) throw { status: 401, message: 'Invalid credentials' };

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };

  const payload = { sub: String(user.id), username: user.username, role: user.role };
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN };

  const token = jwt.sign(payload, secret, options);
  return { token };
}
