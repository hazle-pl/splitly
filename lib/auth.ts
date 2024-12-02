import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export async function getUserFromToken(token: string): Promise<IUser | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}
