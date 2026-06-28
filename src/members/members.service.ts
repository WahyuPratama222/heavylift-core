import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  // ambil profile member sendiri
  async getProfile(userId: string) {
    const member = await this.prisma.member.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  // update profile member sendiri
  async updateProfile(userId: string, dto: UpdateMemberDto) {
    const member = await this.prisma.member.findFirst({
      where: { user_id: userId, deleted_at: null },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return this.prisma.member.update({
      where: { id: member.id },
      data: {
        ...dto,
        date_of_birth: dto.date_of_birth
          ? new Date(dto.date_of_birth)
          : undefined,
      },
    });
  }

  // update foto profile
  async updatePhoto(userId: string, dto: UpdatePhotoDto) {
    const member = await this.prisma.member.findFirst({
      where: { user_id: userId, deleted_at: null },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return this.prisma.member.update({
      where: { id: member.id },
      data: { photo_url: dto.photo_url },
    });
  }

  // owner - list semua member
  async findAll(search?: string, status?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.MemberWhereInput = {
      deleted_at: null,
    };

    // filter search
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // filter status
    if (status === 'active') {
      where.member_packages = {
        some: { status: 'active' },
      };
    } else if (status === 'expired') {
      where.member_packages = {
        every: { status: 'expired' },
        some: {},
      };
    } else if (status === 'no_package') {
      where.member_packages = {
        none: {},
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.member.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          phone: true,
          photo_url: true,
          gender: true,
          created_at: true,
          user: {
            select: { email: true },
          },
          member_packages: {
            where: { status: 'active' },
            select: {
              status: true,
              end_date: true,
              package: {
                select: { name: true },
              },
            },
            take: 1,
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.member.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // owner - detail 1 member
  async findOne(id: string) {
    const member = await this.prisma.member.findFirst({
      where: { id, deleted_at: null },
      include: {
        user: {
          select: { email: true, role: true },
        },
        member_packages: {
          include: {
            package: true,
            payments: true,
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  // owner - soft delete member
  async remove(id: string) {
    const member = await this.prisma.member.findFirst({
      where: { id, deleted_at: null },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return this.prisma.member.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
