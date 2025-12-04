import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt";
import { signAccessToken } from "../utils/jwt";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

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

  async register(email: string, password: string, role: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, role }
    });

    return user;
  }
}

export const authService = new AuthService();
