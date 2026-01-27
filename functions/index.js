const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const smtpConfig = functions.config().smtp;

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: Number(smtpConfig.port),
  secure: Number(smtpConfig.port) === 465,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.pass,
  },
});

from: `"Tatilini Devret" <${smtpConfig.from}>`,

function buildMailTemplate({ title, subtitle, body, buttonText, buttonLink }) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f6f6f6;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
      
      <div style="padding:18px 22px;background:#111827;color:#fff;">
        <h2 style="margin:0;font-size:18px;font-weight:700;">Tatilini Devret</h2>
        <p style="margin:6px 0 0;font-size:13px;color:#d1d5db;">${subtitle || ""}</p>
      </div>

      <div style="padding:22px;">
        <h3 style="margin:0 0 10px;font-size:18px;color:#111827;">${title}</h3>
        <div style="font-size:14px;color:#374151;line-height:1.5;">
          ${body}
        </div>

        ${
          buttonLink
            ? `<div style="margin-top:18px;">
                <a href="${buttonLink}"
                  style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:700;font-size:14px;">
                  ${buttonText || "İlanı Gör"}
                </a>
              </div>`
            : ""
        }

        <div style="margin-top:20px;font-size:12px;color:#6b7280;">
          Bu mail otomatik olarak gönderilmiştir.
        </div>
      </div>

      <div style="padding:14px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
        © ${new Date().getFullYear()} tatilinidevret.com
      </div>
    </div>
  </div>
  `;
}

/* ---------------- EMAIL HELPER ---------------- */
async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Tatilini Devret" <info@tatilinidevret.com>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
  }
}

/* ---------------- DATE HELPERS ---------------- */
function parseDateSafe(dateVal) {
  // Firestore Timestamp ise
  if (dateVal && typeof dateVal.toDate === "function") {
    return dateVal.toDate();
  }

  // string ise "2026-04-19"
  if (typeof dateVal === "string") {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;
  }

  // normal Date ise
  if (dateVal instanceof Date) return dateVal;

  return null;
}

function getDiffDays(endDate) {
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/* ============================================================
   ✅ 1) OTOMATİK KULLANICI ROLÜ
============================================================ */
exports.assignUserRole = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role: "user" });
    await admin.firestore().collection("users").doc(user.uid).update({
      role: "user",
    });
    console.log("✔ Role set:", user.uid);
  } catch (err) {
    console.error("❌ Role set error:", err);
  }
});

/* ============================================================
   ✅ 2) YENİ KULLANICI MAİL BİLDİRİMİ
============================================================ */
exports.sendNewUserMail = functions.auth.user().onCreate(async (user) => {
  await sendMail(
    "info@tatilinidevret.com",
    "Yeni Kullanıcı Kaydı",
    `
      <h2>Yeni kullanıcı kaydı yapıldı</h2>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>UID:</b> ${user.uid}</p>
    `
  );
});

/* ============================================================
   ✅ 3) İLAN OLUŞTURULDU (ADMIN BİLDİRİMİ)
  
============================================================ */
exports.notifyAdminNewListing = functions.firestore
  .document("ilanlar/{id}")
  .onCreate(async (snap) => {
    const ilan = snap.data();

    await sendMail(
      "info@tatilinidevret.com",
      "Yeni İlan Oluşturuldu",
      buildMailTemplate({
        title: "Yeni ilan oluşturuldu",
        subtitle: "Admin Bildirimi",
        body: `
          <p><b>Başlık:</b> ${ilan.baslik}</p>
          <p><b>Sahibi:</b> ${ilan.sahipEmail}</p>
        `,
        buttonText: "İlanı Gör",
        buttonLink: `https://tatilinidevret.com/ilan/${snap.id}`,
      })
    );
  });

/* ============================================================
   ✅ 4) İLAN ONAYLANDI (SAHİBE BİLDİRİM)
   
============================================================ */
exports.notifyListingApproved = functions.firestore
  .document("ilanlar/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "approved" && after.status === "approved") {
      await sendMail(
        after.sahipEmail,
        "İlanınız Yayına Alındı 🎉",
        buildMailTemplate({
          title: "İlanınız Yayında 🎉",
          subtitle: "Tebrikler",
          body: `
            <p><b>${after.baslik}</b> başlıklı ilanınız yayına alındı.</p>
            <p>Artık ilanınız ziyaretçiler tarafından görüntülenebilir.</p>
          `,
          buttonText: "İlanı Gör",
          buttonLink: `https://tatilinidevret.com/ilan/${change.after.id}`,
        })
      );
    }
  });

/* ============================================================
   ✅ 5) MESAJ BİLDİRİMİ
============================================================ */
exports.notifyNewMessage = functions.firestore
  .document("messages/{roomId}/messages/{msgId}")
  .onCreate(async (snap) => {
    const msg = snap.data();
    if (!msg.receiverEmail) return;

    await sendMail(
      msg.receiverEmail,
      "Yeni Mesajınız Var!",
      `
        <h2>Mesaj Geldi 📩</h2>
        <p><b>Gönderen:</b> ${msg.senderName}</p>
        <p><b>Mesaj:</b> ${msg.text}</p>
      `
    );
  });

/* ============================================================
   ✅ 6) YENİ TEKLİF BİLDİRİMİ
============================================================ */
exports.notifyNewOffer = functions.firestore
  .document("offers/{id}")
  .onCreate(async (snap) => {
    const offer = snap.data();
    await sendMail(
      offer.sellerEmail,
      "İlanınıza Yeni Teklif Geldi",
      `
        <h2>Yeni teklif!</h2>
        <p><b>İlan:</b> ${offer.listingTitle}</p>
        <p><b>Teklif veren:</b> ${offer.buyerEmail}</p>
        <p><b>Teklif:</b> ${offer.amount}</p>
      `
    );
  });

/* ============================================================
   ✅ 7) TEKLİF KABUL EDİLDİ
============================================================ */
exports.notifyOfferAccepted = functions.firestore
  .document("offers/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "accepted" && after.status === "accepted") {
      await sendMail(
        after.buyerEmail,
        "Teklifiniz Kabul Edildi",
        `
          <h2>Tebrikler 🎉</h2>
          <p>Teklifiniz kabul edildi.</p>
        `
      );
    }
  });
            /* ============================================================
   ✅  DESTEK MESAJINA YANIT BİLDİRİMİ
============================================================ */

  exports.notifySupportReply = functions.firestore
  .document("messages/{id}")
  .onCreate(async (snap) => {
    const msg = snap.data();

    if (msg.from === "admin" && msg.toEmail) {
      await sendMail(
        msg.toEmail,
        "Destek Mesajınıza Yanıt Var 💬",
        buildMailTemplate({
          title: "Destek Ekibimiz Yanıtladı",
          body: `
            <p>Destek mesajınıza cevap verdik:</p>
            <p><i>${msg.text}</i></p>
          `,
          buttonText: "Mesajları Gör",
          buttonLink: "https://tatilinidevret.com/mesajlar",
        })
      );
    }
  });

/* ============================================================
   ✅  FAVORİLERE EKLİ İLAN İNDİRİME GİRDİĞİNDE BİLDİRİM
============================================================ */

  exports.notifyFavoriteDiscount = functions.firestore
  .document("ilanlar/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (
      before.ucret === after.ucret ||
      after.ucret >= before.ucret
    ) return;

    const db = admin.firestore();
    const ilanId = change.after.id;

    const usersSnap = await db.collection("users").get();

    for (const userDoc of usersSnap.docs) {
      const favDoc = await db
        .collection("favoriler")
        .doc(userDoc.id)
        .collection("items")
        .doc(ilanId)
        .get();

      if (favDoc.exists && userDoc.data().email) {
        await sendMail(
          userDoc.data().email,
          "Favorilediğiniz İlan İndirime Girdi 💸",
          buildMailTemplate({
            title: "İndirim Var 💸",
            body: `
              <p>Favorilediğiniz <b>${after.baslik}</b> ilanı indirime girdi.</p>
            `,
            buttonText: "İlanı Gör",
            buttonLink: `https://tatilinidevret.com/ilan/${ilanId}`,
          })
        );
      }
    }
  });

/* ============================================================
   ✅  ÖDEME BAŞARILI BİLDİRİMİ
============================================================ */
  
exports.notifyPaymentSuccess = functions.firestore
  .document("payments/{id}")
  .onCreate(async (snap) => {
    const p = snap.data();

    await sendMail(
      p.userEmail,
      "Ödemeniz Alındı 🧾",
      buildMailTemplate({
        title: "Ödeme Başarılı",
        body: `
          <p><b>Tutar:</b> ${p.amount} ₺</p>
          <p><b>İlan:</b> ${p.ilanBaslik}</p>
        `,
      })
    );
  });





/* ============================================================
   ✅ 8) TEKLİF REDDEDİLDİ
============================================================ */
exports.notifyOfferRejected = functions.firestore
  .document("offers/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "rejected" && after.status === "rejected") {
      await sendMail(
        after.buyerEmail,
        "Teklifiniz Reddedildi",
        `
          <h2>Bilgilendirme</h2>
          <p>Teklifiniz reddedildi.</p>
        `
      );
    }
  });

/* ============================================================
   ✅ 9) İLAN SÜRESİ BİTİŞ HATIRLATICI (15 / 7 / 3 GÜN)
   - ilan sahibine mail
   - favoriye ekleyenlere mail
   - tekrar tekrar mail atmamak için flag basar
============================================================ */
exports.notifyListingExpiry = functions.pubsub
  .schedule("every day 10:00")
  .timeZone("Europe/Istanbul")
  .onRun(async () => {
    try {
      const db = admin.firestore();

      // 🔥 approved ilanları çek
      const snap = await db
        .collection("ilanlar")
        .where("status", "==", "approved")
        .get();

      console.log("Toplam ilan sayısı:", snap.size);

      for (const docSnap of snap.docs) {
        const ilan = docSnap.data();
        const ilanId = docSnap.id;

        const endDate = parseDateSafe(ilan.cikisTarihi);
        if (!endDate) continue;

        const kalanGun = getDiffDays(endDate);

        // süresi geçmiş ilanlara mail yok
        if (kalanGun <= 0) continue;

        const sahipEmail = ilan.sahipEmail;
        const baslik = ilan.baslik || "İlanınız";

        /* ============================================================
           ✅ Favoriye ekleyen kullanıcıları bul (DOĞRU YAPI)
           favoriler/{uid}/items/{ilanId}
        ============================================================ */
        const favoriEmailler = [];

        const usersSnap = await db.collection("users").get();

        for (const userDoc of usersSnap.docs) {
          const uid = userDoc.id;
          const userData = userDoc.data();

          const favDoc = await db
            .collection("favoriler")
            .doc(uid)
            .collection("items")
            .doc(ilanId)
            .get();

          if (favDoc.exists) {
            const email = userData?.email || userData?.userEmail;
            if (email) favoriEmailler.push(email);
          }
        }

        // aynı mail 2 kere gitmesin
        const uniqueFavoriMails = [...new Set(favoriEmailler)];

        /* ---------------- 15 GÜN ---------------- */
        if (kalanGun <= 15 && kalanGun > 7 && !ilan.mail15Sent) {
          // sahibine
          if (sahipEmail) {
            await sendMail(
              sahipEmail,
              "İlanınızın bitmesine 15 gün kaldı ⏳",
              buildMailTemplate({
                title: "İlanınız bitmek üzere ⏳",
                subtitle: "15 Gün Hatırlatma",
                body: `
                  <p><b>${baslik}</b> ilanınızın bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanınızı uzatmak veya güncellemek için kontrol edebilirsiniz.</p>
                `,
                buttonText: "Panele Git",
                buttonLink: `https://tatilinidevret.com/panel`,
              })
            );
          }

          // favoriye ekleyenlere (15 gün istersen açık bırakıyorum)
          for (const mail of uniqueFavoriMails) {
            await sendMail(
              mail,
              "Favorilediğiniz ilan bitmek üzere ⭐",
              buildMailTemplate({
                title: "Favorilediğiniz ilan bitmek üzere ⭐",
                subtitle: "15 Gün Hatırlatma",
                body: `
                  <p>Favorilediğiniz <b>${baslik}</b> ilanının bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanı kaçırmamak için inceleyebilirsiniz.</p>
                `,
                buttonText: "İlanı İncele",
                buttonLink: `https://tatilinidevret.com/ilan/${ilanId}`,
              })
            );
          }

          await db.collection("ilanlar").doc(ilanId).update({
            mail15Sent: true,
          });

          console.log("15 gün mail gönderildi:", ilanId);
        }

        /* ---------------- 7 GÜN ---------------- */
        if (kalanGun <= 7 && kalanGun > 3 && !ilan.mail7Sent) {
          // sahibine
          if (sahipEmail) {
            await sendMail(
              sahipEmail,
              "İlanınızın bitmesine 7 gün kaldı ⏳",
              buildMailTemplate({
                title: "İlanınız bitmek üzere ⏳",
                subtitle: "7 Gün Hatırlatma",
                body: `
                  <p><b>${baslik}</b> ilanınızın bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanınızı uzatmak veya güncellemek için giriş yapabilirsiniz.</p>
                `,
                buttonText: "Panele Git",
                buttonLink: `https://tatilinidevret.com/panel`,
              })
            );
          }

          // favoriye ekleyenlere
          for (const mail of uniqueFavoriMails) {
            await sendMail(
              mail,
              "Favorilediğiniz ilan bitmek üzere ⭐",
              buildMailTemplate({
                title: "Favorilediğiniz ilan bitmek üzere ⭐",
                subtitle: "7 Gün Hatırlatma",
                body: `
                  <p>Favorilediğiniz <b>${baslik}</b> ilanının bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanı kaçırmamak için hemen inceleyebilirsiniz.</p>
                `,
                buttonText: "İlanı İncele",
                buttonLink: `https://tatilinidevret.com/ilan/${ilanId}`,
              })
            );
          }

          await db.collection("ilanlar").doc(ilanId).update({
            mail7Sent: true,
          });

          console.log("7 gün mail gönderildi:", ilanId);
        }

        /* ---------------- 3 GÜN ---------------- */
        if (kalanGun <= 3 && kalanGun > 0 && !ilan.mail3Sent) {
          // sahibine
          if (sahipEmail) {
            await sendMail(
              sahipEmail,
              "İlanınızın bitmesine 3 gün kaldı! ⚠️",
              buildMailTemplate({
                title: "Son Günler! ⚠️",
                subtitle: "3 Gün Hatırlatma",
                body: `
                  <p><b>${baslik}</b> ilanınızın bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanınızı uzatmak için hemen giriş yapabilirsiniz.</p>
                `,
                buttonText: "Panele Git",
                buttonLink: `https://tatilinidevret.com/panel`,
              })
            );
          }

          // favoriye ekleyenlere
          for (const mail of uniqueFavoriMails) {
            await sendMail(
              mail,
              "Favorilediğiniz ilan için son günler! ⚠️",
              buildMailTemplate({
                title: "Son Günler ⚠️",
                subtitle: "3 Gün Hatırlatma",
                body: `
                  <p>Favorilediğiniz <b>${baslik}</b> ilanının bitmesine <b>${kalanGun} gün</b> kaldı.</p>
                  <p>İlanı kaçırmamak için hemen inceleyin.</p>
                `,
                buttonText: "İlanı İncele",
                buttonLink: `https://tatilinidevret.com/ilan/${ilanId}`,
              })
            );
          }

          await db.collection("ilanlar").doc(ilanId).update({
            mail3Sent: true,
          });

          console.log("3 gün mail gönderildi:", ilanId);
        }
      }

      return null;
    } catch (err) {
      console.error("❌ notifyListingExpiry error:", err);
      return null;
    }
  });