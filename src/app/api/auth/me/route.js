import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id'); // ดึง ID จาก Header หรือ Session Cookie

    if (!userId) {
      return NextResponse.json({ success: false, isLoggedIn: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        taxId: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, isLoggedIn: false }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}