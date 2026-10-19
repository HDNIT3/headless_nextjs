import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, GMAIL_CONFIG } from '@/lib/utils/email';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const companyName = (formData.get('companyName') as string)?.trim();
    const customerName = (formData.get('customerName') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const message = ((formData.get('message') as string) || '').trim();
    const file = formData.get('file') as File | null;

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên cơ sở hoặc doanh nghiệp.' },
        { status: 400 }
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên của bạn.' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập số điện thoại liên hệ.' },
        { status: 400 }
      );
    }

    let fileData: {
      filename: string;
      content: Buffer;
      contentType?: string;
    } | null = null;

    if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
      const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Tệp đính kèm không được vượt quá 15MB.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      fileData = {
        filename: file.name,
        content: Buffer.from(arrayBuffer),
        contentType: file.type || 'application/octet-stream',
      };
    }

    // Kiểm tra cấu hình mật khẩu ứng dụng Gmail
    if (!GMAIL_CONFIG.pass) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Chưa cấu hình Mật khẩu ứng dụng Gmail (GMAIL_APP_PASSWORD trong .env.local hoặc utils/email.ts). Vui lòng thêm mật khẩu ứng dụng 16 ký tự để gửi mail.',
          configured: false,
        },
        { status: 500 }
      );
    }

    await sendContactEmail({
      companyName,
      customerName,
      phone,
      message,
      file: fileData,
    });

    return NextResponse.json({
      success: true,
      message:
        'Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.',
    });
  } catch (error: any) {
    console.error('Lỗi khi xử lý form liên hệ:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.',
      },
      { status: 500 }
    );
  }
}
