import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const email = 'jamesprice98@gmail.com'
    const password = 'huerhuithui56&@we4'
    
    const admin = await prisma.admin.findUnique({
      where: { email },
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found', email }, { status: 404 })
    }
    
    const isValid = await bcrypt.compare(password, admin.password)
    
    return NextResponse.json({
      adminFound: true,
      email: admin.email,
      passwordValid: isValid,
      databaseConnected: true,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseConnected: false,
    }, { status: 500 })
  }
}



