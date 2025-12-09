import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabaseService';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { userId, action } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const supabaseAdmin = createServiceSupabase();

    // Ensure bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error('Storage List Error:', listError);
      throw new Error(`Storage Error: ${listError.message}`);
    }

    const bucketName = 'admin-temp-storage';
    const bucketExists = buckets?.find(b => b.name === bucketName);

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 1024, // 1KB is enough
      });
      if (createError && !createError.message.includes('already exists')) {
         console.error('Create Bucket Error:', createError);
         throw new Error(`Create Bucket Error: ${createError.message}`);
      }
    }

    // Store OTP in a file named `otp_{userId}.json`
    const fileContent = JSON.stringify({ otp, expiresAt });
    const fileName = `otp_${userId}.json`;

    // Remove existing if any
    await supabaseAdmin.storage.from(bucketName).remove([fileName]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, fileContent, {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error('Failed to store OTP:', uploadError);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    // Send Email
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return NextResponse.json({ error: 'SMTP configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const targetEmail = 'deepthi@cognitaxes.com';

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Cognitaxes Admin" <info@cognitaxes.com>',
      to: targetEmail,
      subject: 'Admin Action Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Admin Action Verification</h2>
          <p>An admin is attempting to update a password for user ID: ${userId}.</p>
          <p>Please use the following OTP to verify this action:</p>
          <h1 style="color: #006666; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: `OTP sent to ${targetEmail}` });

  } catch (error: any) {
    console.error('OTP Error Full:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      details: error.toString()
    }, { status: 500 });
  }
}
