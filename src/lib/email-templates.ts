const emailLayout = (content: string) => `
<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial, sans-serif">
  <table width="100%" style="background:#f4f6fb;padding:40px 0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow: 0 4px 10px rgba(0,0,0,0.05)">
          
          <tr>
            <td style="padding:30px;text-align:center;">
              <img src="https://tatilinidevret.com/images/logo.png" width="180" alt="Tatilini Devret" style="display:inline-block; border:0;">
            </td>
          </tr>

          <tr>
            <td>
              <img src="https://tatilinidevret.com/images/ad-wide.jpg" width="600" alt="Tatilini Devret İlan" style="width:100%; max-width:600px; display:block; border:0;">
            </td>
          </tr>

          <tr>
            <td style="padding:40px">
              ${content}
              <br>
              <p style="color:#888;font-size:14px;margin-top:20px">Keyifli tatiller dileriz,<br><strong>Tatilini Devret Ekibi</strong></p>
            </td>
          </tr>

          <tr>
            <td style="background:#f3f6fa;padding:20px;text-align:center;font-size:12px;color:#999">
              Bu e-posta ilan durumunuz hakkında bilgilendirme amacıyla gönderilmiştir.<br>
              © ${new Date().getFullYear()} TatiliniDevret.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getStatusTemplate = (status: "approved" | "rejected", title: string, id: string) => {
  if (status === "approved") {
    return emailLayout(`
      <h2 style="margin-top:0;color:#2e7d32;font-size:24px">🎉 İlanınız Yayına Alındı</h2>
      <p style="font-size:16px;color:#444;line-height:1.6">
        <strong>${title}</strong> başlıklı ilanınız incelendi ve onaylandı. Artık binlerce kullanıcı ilanınızı görüntüleyebilir.
      </p>
      <div style="text-align:center;margin:35px 0">
        <a href="https://tatilinidevret.com/ilan/${id}" style="background:#1f6feb;color:#ffffff;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">İlanı Hemen Görüntüle</a>
      </div>
    `);
  }

  return emailLayout(`
    <h2 style="margin-top:0;color:#d32f2f;font-size:24px">⚠️ İlanınız Onaylanmadı</h2>
    <p style="font-size:16px;color:#444;line-height:1.6">
        <strong>${title}</strong> başlıklı ilanınız maalesef kriterlerimize uygun bulunmadığı için reddedilmiştir.
    </p>
    <p style="font-size:15px;color:#666">Hataları düzelterek ilanınızı tekrar gönderebilirsiniz.</p>
    <div style="text-align:center;margin:35px 0">
      <a href="https://tatilinidevret.com/hesabim" style="background:#e53935;color:#ffffff;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">İlanlarımı Düzenle</a>
    </div>
  `);
};