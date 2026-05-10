import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { aiCredits: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    headline?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
    socialLinks?: Record<string, string>;
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const { passwordHash, mfaSecret, ...safe } = user;
    return {
      ...safe,
      fullName: `${safe.firstName} ${safe.lastName}`,
    };
  }
}
