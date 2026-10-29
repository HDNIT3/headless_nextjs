import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

export const GMAIL_CONFIG = {
  user: process.env.GMAIL_USER || 'ungthithuyhuong1978@gmail.com',
  pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '',

  receiver:
    process.env.GMAIL_RECEIVER ||
    process.env.GMAIL_USER ||
    'ungthithuyhuong1978@gmail.com',
};

export interface ContactEmailPayload {
  companyName: string;
  customerName: string;
  phone: string;
  message?: string;
  file?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  } | null;
}

export function getMailTransporter() {
  const user = GMAIL_CONFIG.user?.trim();
  const pass = GMAIL_CONFIG.pass?.trim();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const { companyName, customerName, phone, message, file } = payload;

  const user = GMAIL_CONFIG.user?.trim();
  const pass = GMAIL_CONFIG.pass?.trim();
  const receiver = GMAIL_CONFIG.receiver?.trim();

  if (!pass) {
    console.warn(
      '[GMAIL UTILS WARNING] Chưa cấu hình GMAIL_APP_PASSWORD trong .env.local hoặc GMAIL_CONFIG.pass trong src/lib/utils/email.ts.'
    );
    throw new Error(
      'Hệ thống chưa cấu hình mật khẩu ứng dụng Gmail (GMAIL_APP_PASSWORD). Vui lòng cấu hình trong file .env.local hoặc package utils.'
    );
  }

  const transporter = getMailTransporter();

  const sentTime = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date());

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Yêu Cầu Báo Giá Mới - Bao Bì Đức Trọng</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0c5c36 0%, #15803d 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 24px; }
        .alert-badge { display: inline-block; background-color: #fff7ed; border: 1px solid #ffedd5; color: #c2410c; padding: 6px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .info-table th, .info-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .info-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 600; }
        .info-table td { color: #0f172a; font-weight: 500; }
        .message-box { background-color: #f8fafc; border-left: 4px solid #0c5c36; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; color: #1e293b; margin-top: 8px; white-space: pre-wrap; }
        .footer { background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bao Bì Đức Trọng</h1>
          <p>Yêu Cầu Báo Giá & Tư Vấn Mới</p>
        </div>
        <div class="content">
          <span class="alert-badge">🔔 Có 1 yêu cầu báo giá mới từ Website</span>
          <table class="info-table">
            <tr>
              <th>Cơ sở / Doanh nghiệp</th>
              <td><strong>${escapeHtml(companyName)}</strong></td>
            </tr>
            <tr>
              <th>Người liên hệ</th>
              <td>${escapeHtml(customerName)}</td>
            </tr>
            <tr>
              <th>Số điện thoại</th>
              <td><a href="tel:${escapeHtml(phone)}" style="color: #0c5c36; font-weight: bold; text-decoration: none;">${escapeHtml(phone)}</a></td>
            </tr>
            <tr>
              <th>Thời gian gửi</th>
              <td>${sentTime}</td>
            </tr>
            <tr>
              <th>Tệp đính kèm</th>
              <td>${file ? `📎 ${escapeHtml(file.filename)}` : 'Không có'}</td>
            </tr>
          </table>

          <div style="margin-top: 16px;">
            <strong style="font-size: 14px; color: #334155;">Nội dung yêu cầu / Ghi chú:</strong>
            <div class="message-box">
              ${message ? escapeHtml(message) : '<em>(Không có nội dung thêm)</em>'}
            </div>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 4px 0;">Hệ thống thông báo tự động từ website <strong>baobihuongquang.com</strong></p>
          <p style="margin: 0;">Bao Bì Đức Trọng - Giải pháp bao bì toàn diện cho nông sản</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions: SendMailOptions = {
    from: `"Website Bao Bì Đức Trọng" <${user}>`,
    to: receiver,
    replyTo: user,
    subject: `[BÁO GIÁ] Yêu cầu mới từ ${companyName} (${customerName} - ${phone})`,
    text: `
YÊU CẦU BÁO GIÁ MỚI - BAO BÌ ĐỨC TRỌNG
--------------------------------------------------
Tên cơ sở/ doanh nghiệp: ${companyName}
Người liên hệ: ${customerName}
Số điện thoại: ${phone}
Thời gian: ${sentTime}
Tệp đính kèm: ${file ? file.filename : 'Không có'}

Nội dung yêu cầu:
${message || '(Không có)'}
--------------------------------------------------
    `,
    html: htmlContent,
  };

  if (file && file.content && file.filename) {
    mailOptions.attachments = [
      {
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      },
    ];
  }

  const result = await transporter.sendMail(mailOptions);
  return result;
}

function escapeHtml(text: string) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
