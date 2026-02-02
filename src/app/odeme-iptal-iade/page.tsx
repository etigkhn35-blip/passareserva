export default function OdemeIptalIadePage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        İptal ve İade Koşulları
      </h1>

      <div className="prose prose-gray max-w-none">
        {/* 1 */}
        <section className="mb-10 pb-8 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">
            1. Hizmetin Mahiyeti
          </h2>
          <p>
            <strong>tatilinidevret.com</strong>, 6563 sayılı Elektronik Ticaretin
            Düzenlenmesi Hakkında Kanun kapsamında bir{" "}
            <strong>Aracı Hizmet Sağlayıcı</strong>dır. Platformumuz, kullanıcıların
            (Satıcı) ellerinde bulunan devredilebilir haklarını (otel rezervasyonu,
            konser bileti vb.) üçüncü kişilere (Alıcı) duyurmalarına imkân tanıyan
            bir <strong>İlan Platformu</strong>dur.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-10 pb-8 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">
            2. Ödeme ve İşlem Sınırı
          </h2>
          <p>
            Platform üzerinden tahsil edilen bedeller, yalnızca{" "}
            <strong>İlan Yayınlama Hizmet Bedeli</strong> veya{" "}
            <strong>Doping / Öne Çıkarma Hizmetleri</strong>’ne ilişkindir.
            tatilinidevret.com; rezervasyon bedeli, bilet ücreti veya devir bedeli
            gibi asıl hizmet tutarlarının tahsilatını yapmaz, bu ödemelere aracılık
            etmez ve bu bedeller üzerinden komisyon almaz.
          </p>
        </section>

        {/* 3 */}
        <section className="mb-10 pb-8 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">
            3. İptal ve İade Şartları
          </h2>
          <ul className="list-disc pl-5">
            <li>
              <strong>Anında İfa Edilen Hizmetler:</strong> Mesafeli Sözleşmeler
              Yönetmeliği’nin 15. maddesinin (ğ) bendi uyarınca; elektronik ortamda
              anında ifa edilen hizmetler veya tüketiciye anında teslim edilen
              gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.
            </li>
            <li>
              İlan yayınlama işlemi, ödeme yapıldığı anda elektronik ortamda
              gerçekleşen bir hizmet olduğundan, ilan yayına alındıktan sonra{" "}
              <strong>ücret iadesi veya iptali mümkün değildir</strong>.
            </li>
            <li>
              Hatalı ödeme veya mükerrer (üst üste) ödeme durumlarında, kullanıcının
              talebi üzerine gerekli incelemeler yapılarak{" "}
              <strong>7 iş günü</strong> içerisinde iade işlemi başlatılır.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section className="mb-10 pb-8 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">
            4. Tarafların Sorumluluğu
          </h2>
          <ul className="list-disc pl-5">
            <li>
              İlan içeriğinde yer alan bilgilerin doğruluğu, devrin yasal uygunluğu
              ve otel / organizatör nezdindeki geçerliliği tamamen{" "}
              <strong>Satıcı</strong>’nın sorumluluğundadır.
            </li>
            <li>
              Alıcı ve Satıcı arasında platform dışı gerçekleşen para transferi,
              isim değişikliği, rezervasyon devri veya fiziksel bilet teslimi
              süreçlerinden <strong>tatilinidevret.com</strong> hiçbir şekilde
              sorumlu tutulamaz.
            </li>
            <li>
              Platformumuz, yaşanabilecek uyuşmazlıklarda bir taraf, hakem veya
              aracı değildir.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="font-bold text-lg text-gray-900">
            5. İletişim
          </h2>
          <p>
            İptal, iade veya ilan süreçlerine dair her türlü sorunuz için{" "}
            <a href="mailto:info@tatilinidevret.com">
              info@tatilinidevret.com
            </a>{" "}
            adresi üzerinden müşteri hizmetlerimize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
