import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST() {
  try {
    const demoUser = {
      id: 14,
      name: 'Demo',
      email: 'demo@company.com',
      role: 'admin'
    }

    const token = jwt.sign(
      { userId: demoUser.id, email: demoUser.email, role: demoUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    const response = NextResponse.json({
      success: true,
      user: demoUser
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Demo error:', error)
    return NextResponse.json({ error: 'Demo giriş hatası' }, { status: 500 })
  }
}