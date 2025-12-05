import bcrypt from "bcrypt";
import { signAccessToken } from "../utils/jwt";
import { prisma } from '../db/seed';

class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    // token
    const token = signAccessToken({ userId: user.id, email: user.email, role: user.role });

    return { token, user };
  }

  async register(
    firstname: string,
    lastname: string,
    birth_date: string,
    email: string, 
    password: string, 
    role: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstname, lastname, birth_date, email, password: hashed, role }
    });

    return user;
  }
}

export const authService = new AuthService();
