import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendEmail, getPasswordResetEmailTemplate } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gerekli" },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Güvenlik için kullanıcı bulunamasa bile başarılı mesajı döndür
    // Bu, e-posta adresinin sistemde kayıtlı olup olmadığının anlaşılmasını engeller
    if (!user) {
      return NextResponse.json({
        message: "Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderilecektir."
      })
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 600000) // 10 dakika geçerli

    // Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`

    // E-posta gönder
    if (process.env.RESEND_API_KEY) {
      console.log("Sending email to:", user.email)
      const emailResult = await sendEmail({
        to: user.email,
        subject: "Şifre Sıfırlama - Aydınlar İnşaat",
        html: getPasswordResetEmailTemplate(resetUrl),
      })

      console.log("Email result:", JSON.stringify(emailResult, null, 2))

      if (!emailResult.success) {
        console.error("Email send failed:", emailResult.error)
        // E-posta gönderilemese bile kullanıcıya hata gösterme (güvenlik)
      }

      // Geliştirme için reset URL'i de yazdır
      console.log("=================================")
      console.log("ŞİFRE SIFIRLAMA BAĞLANTISI:")
      console.log(resetUrl)
      console.log("=================================")
    } else {
      // Geliştirme ortamında console'a yazdır
      console.log("=================================")
      console.log("ŞİFRE SIFIRLAMA BAĞLANTISI:")
      console.log(resetUrl)
      console.log("=================================")
    }

    return NextResponse.json({
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
