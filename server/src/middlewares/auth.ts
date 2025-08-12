import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

type AppJwtPayload = JwtPayload & { username: string; role: string };

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AppJwtPayload | string;
    if (typeof decoded === 'string') return res.status(401).json({ message: 'Invalid token payload' });

    const subNum = decoded.sub ? parseInt(decoded.sub, 10) : undefined;
    (req as any).user = { sub: subNum, username: decoded.username, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
