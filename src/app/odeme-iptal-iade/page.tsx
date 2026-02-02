export default function OdemeIptalIadePage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Ödeme İptali ve Ödeme İadesi Politikası
      </h1>

      <div className="prose prose-gray max-w-none">
        <p>
          TatiliniDevret, kullanıcıların kullanılmayan tatil, rezervasyon ve
          etkinlik haklarını devrederek değerlendirebilmelerini sağlayan bir ilan
          ve aracılık platformudur. Bu kapsamda ödeme iptali ve iade süreçleri
          aşağıdaki esaslara göre yürütülür.
        </p>

        <h2>1. Ödeme Süreci Hakkında</h2>
        <ul>
          <li>
            TatiliniDevret üzerinden yapılan ödemeler, ilan sahibine ait bir
            hakkın devri amacıyla alınır.
          </li>
          <li>
            Platform, satılan tatil, rezervasyon veya etkinliğin doğrudan
            sağlayıcısı değildir.
          </li>
          <li>
            Ödeme, ilan için devrin tamamlanmasıyla birlikte kesinleşir.
          </li>
        </ul>

        <h2>2. Ödeme İptali</h2>
        <ul>
          <li>
            Ödeme işlemi tamamlanmadan önce kullanıcı işlemi dilediği zaman iptal
            edebilir.
          </li>
          <li>
            Ödeme başarıyla tamamlandıktan sonra tek taraflı ödeme iptali mümkün
            değildir.
          </li>
          <li>
            Sistemsel hata nedeniyle tamamlanmayan işlemler için kullanıcıdan
            bedel tahsil edilmez.
          </li>
        </ul>

        <h2>3. Ödeme İadesi</h2>
        <ul>
          <li>
            Devri tamamlanmış ilanlar için TatiliniDevret tarafından ödeme iadesi
            yapılmaz.
          </li>
          <li>
            Yapılan ödemeler ikinci el / devren satış niteliğinde olduğu için
            cayma hakkı kapsamına girmez.
          </li>
          <li>
            Aşağıdaki istisnai durumlarda ödeme iadesi değerlendirilebilir:
            <ul>
              <li>Teknik hata nedeniyle ödemenin mükerrer alınması</li>
              <li>
                İlanın gerçeğe aykırı bilgiler içerdiğinin açıkça tespit edilmesi
              </li>
            </ul>
          </li>
        </ul>

        <h2>4. Hizmet Sağlayıcı Kaynaklı İptaller</h2>
        <p>
          Otel, tur firması, etkinlik organizatörü veya bilet sağlayıcının iptali
          durumunda iade koşulları ilgili hizmet sağlayıcının kendi kurallarına
          tabidir. Kullanıcı, iade talebini doğrudan hizmet sağlayıcıya
          iletmelidir.
        </p>

        <h2>5. Kullanıcı Sorumluluğu</h2>
        <p>
          Kullanıcılar ödeme yapmadan önce ilan detaylarını incelemek, tarih ve
          kullanım koşullarını kontrol etmekle yükümlüdür.
        </p>

        <h2>6. Anlaşmazlık ve Destek</h2>
        <p>
          Taraflar arasında yaşanabilecek ödeme anlaşmazlıklarında TatiliniDevret
          iyi niyetli çözüm için destek sağlayabilir. Ancak platform, bedel
          iadesi veya ödeme iptali konusunda nihai karar mercii değildir.
        </p>

        <h2>7. Değişiklik Hakkı</h2>
        <p>
          TatiliniDevret, işbu ödeme iptali ve iade politikasını önceden haber
          vermeksizin güncelleme hakkını saklı tutar.
        </p>

        <p className="mt-6">
          <strong>İletişim:</strong>{" "}
          <a href="mailto:info@tatilinidevret.com">
            info@tatilinidevret.com
          </a>
        </p>
      </div>
    </main>
  );
}
