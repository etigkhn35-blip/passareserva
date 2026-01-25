export type BlogPost = {
  id: string;
  title: string;
  desc: string;
  img: string;
  content: string; // HTML string
  metaTitle: string;
  metaDescription: string;
  metaDescriptionAlt?: string;
};

function formatContent(raw: string) {
  // satır satır al
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // ? ile biten satırları kalın yap
  const html = lines
    .map((line) => {
      if (line.endsWith("?")) {
        return `<strong>${line}</strong>`;
      }

      // Liste gibi görünen satırlar için ( - ile başlıyorsa )
      if (line.startsWith("- ")) {
        return `• ${line.replace("- ", "")}`;
      }

      return line;
    })
    .join("<br/><br/>");

  return html;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Tatil Devri Nedir? Tatilimi İptal Edemiyorum, Ne Yapmalıyım?",
    desc: "Otel, tur, tekne ve etkinlik rezervasyonlarını devrederek paranızın yanmasını önleyin.",
    img: "/images/blog-1.jpg",
    metaTitle:
      "Tatil Devri Nedir? Tatilimi İptal Edemiyorum, Ne Yapmalıyım? | TatiliniDevret",
    metaDescription:
      "Tatiliniz iptal oldu ama para iadesi alamıyor musunuz? Otel, tur, tekne ve etkinlik rezervasyonlarını devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Tatilimi iptal edemiyorum diyorsanız çözüm burada. Kullanılmayan tatilleri güvenli şekilde devredin, paranız yanmasın.",
    content: formatContent(`
TATİLİNİDEVRET NEDİR? NASIL ÇALIŞIR?
KULLANILMAYAN TATİLLER NASIL PARAYA DÖNÜŞÜR?

Hayat her zaman planladığımız gibi ilerlemez. Aylar öncesinden satın aldığınız bir tatil, otel rezervasyonu, tur paketi ya da etkinlik; iş, sağlık, ailevi ya da tamamen beklenmedik sebeplerle iptal olmak zorunda kalabilir.

Bu noktada birçok kişinin Google’da yaptığı aramalar birbirine çok benzer:

Tatilim iptal oldu ne yapmalıyım?
Tatilimi iptal edemiyorum ne yapmalıyım?
Tur şirketi para iademi yapmıyor ne yapabilirim?
Otele para verdim ama gidemiyorum, param yanacak mı?

İşte tam bu soruların cevabı tatil devri kavramında yatıyor.

TATİL DEVRİ NEDİR?

Tatil devri, kullanamayacağınız bir tatilin veya etkinliğin, başka bir kullanıcıya belgeli ve kontrollü şekilde devredilmesi anlamına gelir.

Bu sayede:
- Tatiliniz tamamen yanmaz
- Ödediğiniz paranızı geri alabilirsiniz
- Tatili devralan kişi aynı hizmeti daha uygun fiyata kullanır

Tatil devri, hem tatilini kullanamayanlar hem de daha uygun fiyata tatil yapmak isteyenler için kazan-kazan modelidir.

TATİLİMİ İPTAL EDEMİYORUM, NE YAPMALIYIM?

Birçok otel, tur şirketi ve organizasyon iptal konusunda oldukça katıdır. Özellikle:
- İptal süresi geçmiş rezervasyonlar
- Erken rezervasyon ve kampanyalı tatiller
- İadesiz olarak satılan paketler

çoğu zaman para iadesi yapılmadan iptal edilir.

Bu durumda tatilinizi tamamen yakmak zorunda değilsiniz. Tatil devri, iptal edilemeyen tatiller için en mantıklı alternatiftir.

TATİL DEVRİ NASIL ÇALIŞIR?

1. Tatilinizi ilan verirsiniz.
Kullanamayacağınız tatil veya etkinlik için ilan oluşturursunuz. Otel, villa, tur, tekne tatili ya da etkinlik olabilir.

2. Satış fiyatını belirlersiniz.
Genellikle ödediğiniz fiyatın %20–40 altında bir fiyat belirlemek, alıcı bulmayı hızlandırır.

3. Alıcı ile görüşürsünüz.
TatiliniDevret.com, alıcı ve satıcıyı bir araya getiren aracı platformdur.

4. Tatil devredilir.
Rezervasyon bilgileri güncellenir ve tatil yeni sahibine geçer.

HANGİ TATİLLER DEVREDİLEBİLİR?

Belgesi olan birçok tatil türü devredilebilir. En yaygın olanlar:
- Otel rezervasyonları
- Her şey dahil tatiller
- Villa tatilleri
- Airbnb ve Booking rezervasyonları
- Mavi yolculuk ve tekne tatilleri
- Yurtiçi tur paketleri
- Konser, festival ve etkinlik biletleri

Özetle: Belgesi olan her tatil devre uygundur. (Uçak bileti hariç)

TUR ŞİRKETİ PARA İADEMİ YAPMIYORSA NE YAPMALIYIM?

Tur şirketleri çoğu zaman sözleşmeye dayanarak iade yapmaz veya yüksek kesinti uygular. Bu durumda turunuzu tamamen iptal etmek yerine başka bir kullanıcıya devrederek ödediğiniz paranın büyük bir kısmını kurtarabilirsiniz.

TATİLİN YANMASIN, DEVRET KAYBIN OLMASIN

Eğer tatilini iptal edemiyor, paran yanacak diye düşünüyorsan bil ki yalnız değilsin. Tatil devri sayesinde kullanılmayan tatiller çöpe gitmez, paraya dönüşür.

TatiliniDevret.com, kullanılmayan tatilleri güvenli ve şeffaf şekilde devretmen için kurulmuştur.
    `),
  },

  {
    id: "2",
    title: "Otel Rezervasyonu Devri Nasıl Yapılır? Bilmen Gereken Tüm Detaylar",
    desc: "Otel iptal etmiyorsa rezervasyonunu devrederek paranı kurtarabilirsin.",
    img: "/images/blog-2.jpg",
    metaTitle:
      "Otel Rezervasyonu Devri Nasıl Yapılır? Otel İptal Etmiyor mu? | TatiliniDevret",
    metaDescription:
      "Otele para verdiniz ama gidemiyor musunuz? Otel rezervasyonunuzu devrederek tatilinizi paraya dönüştürün. Tatiliniz yanmasın.",
    metaDescriptionAlt:
      "Otel rezervasyonu iptal edilemiyorsa çözüm burada. Tatilinizi güvenle devredin, paranızı kurtarın.",
    content: formatContent(`
OTEL REZERVASYONU DEVRİ NASIL YAPILIR?
BİLMEN GEREKEN TÜM DETAYLAR

Aylar öncesinden planladığınız bir otel tatili… Rezervasyon yapılmış, ödeme alınmış, belki erken rezervasyon indirimi bile yakalanmış olabilir. Ancak hayat her zaman planladığımız gibi ilerlemez.

Bu noktada birçok kişi Google’da şu soruları arar:

Otele para verdim ama gidemiyorum ne yapmalıyım?
Otel rezervasyonumu iptal edemiyorum.
Otel para iadesi yapmıyor, ne yapabilirim?
Param yanacak mı?

Eğer bu yazıyı okuyorsanız, bu durumla karşı karşıya olmanız çok muhtemeldir.

OTEL REZERVASYONU NEDEN İPTAL EDİLEMİYOR?

Birçok otel ve konaklama tesisi iptal konusunda oldukça katıdır. Özellikle:
- İptal süresi geçmiş rezervasyonlar
- Erken rezervasyon ve kampanyalı fiyatlar
- İadesiz (non-refundable) rezervasyonlar

çoğu zaman para iadesi yapılmadan iptal edilir.

Bu durumda tatilinizi tamamen yakmak zorunda değilsiniz. Otel rezervasyonu devri, iptal edilemeyen tatiller için en mantıklı çözümdür.

OTEL REZERVASYONU DEVRİ NEDİR?

Otel rezervasyonu devri, kullanamayacağınız bir konaklamayı başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Tatiliniz tamamen yanmaz
- Ödediğiniz paranın büyük bir kısmını kurtarabilirsiniz
- Tatili devralan kişi aynı otelde daha uygun fiyata konaklar

OTEL REZERVASYONU DEVRİ NASIL YAPILIR?

1. Rezervasyon bilgilerini hazırlayın.
Otel adı, konum, check-in ve check-out tarihleri, kişi sayısı ve ödediğiniz toplam tutar net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Rezervasyon detaylarını girerek ilan oluşturursunuz.

3. Satış fiyatını belirleyin.
Genellikle ödediğiniz fiyatın %20–40 altında bir fiyat alıcıyı hızla çeker.

4. Devri gerçekleştirin.
Alıcı bulunduğunda rezervasyon bilgileri güncellenir ve tatil devredilir.

HANGİ OTEL REZERVASYONLARI DEVREDİLEBİLİR?

Belgesi olan birçok otel rezervasyonu devredilebilir. En yaygın olanlar:
- Her şey dahil oteller
- Resort ve tatil köyleri
- Şehir otelleri
- Butik oteller
- Balayı otelleri
- Erken rezervasyon otelleri
-Etkinlikler, Konserler, Aktivite biletleri

OTEL PARA İADESİ YAPMIYORSA NE YAPMALIYIM?

Otel para iadesi yapmıyorsa seçenekleriniz sınırlıdır. Rezervasyonu yakmak yerine devrederek ödediğiniz paranın büyük kısmını kurtarabilirsiniz.

OTEL TATİLİNİ YAKMA, DEVRET

Otele gidemiyorsanız bu tatilin tamamen yanması gerektiği anlamına gelmez. Otel rezervasyonu devri sayesinde hem siz zarar etmezsiniz hem de başka biri uygun fiyata tatil yapar.

TatiliniDevret.com, otel rezervasyonlarını güvenli ve şeffaf şekilde devretmenizi sağlar.
    `),
  },

  {
    id: "3",
    title: "Tekne Tatili ve Mavi Yolculuk Devri Nedir? İptal Etme, Devret",
    desc: "Gulet, yat ve mavi yolculuk rezervasyonlarını devrederek paranı kurtar.",
    img: "/images/blog-3.jpg",
    metaTitle:
      "Tekne Tatili ve Mavi Yolculuk Devri Nedir? İptal Etme, Devret | TatiliniDevret",
    metaDescription:
      "Tekne tatiline gidemiyor musunuz? Mavi yolculuk ve gulet rezervasyonlarını devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Mavi yolculuk iptal edilemiyorsa çözüm burada. Tekne tatilinizi devredin, paranız yanmasın.",
    content: formatContent(`
TEKNE TATİLİ VE MAVİ YOLCULUK DEVRİ NEDİR?
İPTAL ETME, DEVRET – TATİLİN YANMASIN

Tekne tatili ve mavi yolculuklar genellikle aylar öncesinden planlanan, yüksek bütçeli ve iptali en zor tatillerin başında gelir. Gulet kiralama, yat tatili veya mavi yolculuk rezervasyonları son dakika iptal edildiğinde çoğu zaman para iadesi yapılmaz.

Bu nedenle birçok kişi Google’da şu soruları arar:

Mavi yolculuk iptal oldu ne yapmalıyım?
Tekne tatiline gidemiyorum param yanacak mı?
Gulet turu iptal edilemiyor.
Tekne rezervasyonu para iadesi yapmıyor.

Eğer bu yazıyı okuyorsanız, benzer bir durumla karşı karşıyasınız demektir.

TEKNE TATİLLERİ NEDEN İPTAL EDİLEMEZ?

Tekne ve mavi yolculuk tatilleri kişiye özel organize edilir. Yakıt, personel, rota ve liman planlamaları önceden yapılır. Bu nedenle özellikle son dakika iptallerinde çoğu tekne firması para iadesi yapmaz.

Gulet turları, özel yat kiralamaları ve haftalık mavi yolculuk paketleri iptali en zor tatiller arasındadır.

TEKNE TATİLİ VE MAVİ YOLCULUK DEVRİ NEDİR?

Tekne tatili devri, kullanamayacağınız gulet, yat veya mavi yolculuk rezervasyonunu başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Tatiliniz tamamen yanmaz
- Ödediğiniz paranın büyük bir kısmını kurtarabilirsiniz
- Tatili devralan kişi daha uygun fiyata mavi yolculuk yapar

HANGİ TEKNE TATİLLERİ DEVREDİLEBİLİR?

Belgesi olan birçok tekne tatili devredilebilir. En yaygın olanlar:
- Gulet mavi yolculukları
- Haftalık tekne kiralamaları
- Özel yat tatilleri
- Bodrum, Marmaris ve Göcek çıkışlı turlar
- Kabin kiralama mavi yolculukları

TEKNE TATİLİ DEVRİ NASIL YAPILIR?

1. Rezervasyon bilgilerini hazırlayın.
Tekne veya gulet adı, çıkış limanı, tarih, kişi sayısı ve ödediğiniz tutar net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Tekne tatili kategorisinden ilan oluşturun.

3. Satış fiyatını belirleyin.
Genellikle %20–35 indirim alıcı bulmayı hızlandırır.

4. Devri gerçekleştirin.
Alıcı bulunduğunda rezervasyon bilgileri güncellenir ve tatil devredilir.

MAVİ YOLCULUK DEVRİ YASAL MI?

Belgeli olduğu sürece tekne tatili ve mavi yolculuk devri yasal ve güvenlidir. TatiliniDevret.com alıcı ve satıcıyı buluşturan aracı platform olarak hizmet verir.

TEKNE TATİLİNİ YAKMA, DEVRET

Tekne tatiline gidemiyorsanız bu tatilin tamamen yanması gerekmez. Mavi yolculuk devri sayesinde hem siz zarar etmezsiniz hem de başka biri uygun fiyata tatil yapar.

TatiliniDevret.com, tekne tatili ve mavi yolculuk rezervasyonlarını güvenli şekilde devretmeniz için kurulmuştur.
    `),
  },

  {
    id: "4",
    title: "Villa, Airbnb ve Booking Rezervasyonu Devredilir mi? Gidemiyorsan Ne Yapmalısın?",
    desc: "Airbnb, Booking ve villa rezervasyonlarını devrederek tatilini paraya dönüştür.",
    img: "/images/blog-4.jpg",
    metaTitle: "Villa, Airbnb ve Booking Rezervasyonu Devredilir mi? | TatiliniDevret",
    metaDescription:
      "Airbnb, Booking veya villa tatiline gidemiyor musunuz? Rezervasyonunuzu devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Villa tatili iptal edilemiyorsa çözüm burada. Rezervasyonunuzu devredin, paranız yanmasın.",
    content: formatContent(`
VİLLA, AIRBNB VE BOOKING REZERVASYONU DEVREDİLİR Mİ?
GİDEMİYORSAN NE YAPMALISIN?

Villa tatilleri, Airbnb konaklamaları ve Booking üzerinden yapılan rezervasyonlar genellikle aylar öncesinden planlanır. Ancak beklenmedik bir durum ortaya çıktığında bu rezervasyonlara gidilemeyebilir.

Bu noktada birçok kişi Google’da şu soruları arar:

Airbnb rezervasyonuma gidemiyorum ne yapmalıyım?
Villa tatilimi iptal edemiyorum.
Booking para iadesi yapmıyor.
Airbnb iptal edilemiyor param yanacak mı?

Eğer bu sorulardan biri sana da tanıdık geliyorsa, yalnız değilsin.

VİLLA, AIRBNB VE BOOKING REZERVASYONLARI NEDEN İPTAL EDİLEMEZ?

Airbnb, Booking ve villa kiralama sistemlerinde iptal koşulları ev sahibine veya tesise göre değişir. Birçok ilanda iadesiz veya kısmi iade seçeneği bulunur. Özellikle son dakika iptallerinde para iadesi çoğu zaman yapılmaz.

Yaz sezonu, bayram tatilleri ve popüler bölgelerde yapılan rezervasyonlar iptal açısından en zor olanlardır.

VİLLA, AIRBNB VE BOOKING REZERVASYONU DEVRİ NEDİR?

Rezervasyon devri, kullanamayacağınız villa, Airbnb veya Booking rezervasyonunu başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Tatiliniz tamamen yanmaz
- Ödediğiniz paranın büyük bir kısmını kurtarabilirsiniz
- Tatili devralan kişi aynı konaklamayı daha uygun fiyata kullanır

AIRBNB REZERVASYONU DEVREDİLEBİLİR Mİ?

Airbnb rezervasyonlarında çoğu zaman misafir bilgileri güncellenebilir. Ev sahibi ile iletişim kurularak rezervasyon devri fiilen mümkündür.

BOOKING REZERVASYONU DEVREDİLEBİLİR Mİ?

Booking üzerinden yapılan rezervasyonlarda da misafir bilgileri değiştirilebilir.

VİLLA TATİLİ DEVRİ NASIL YAPILIR?

1. Rezervasyon bilgilerini hazırlayın.
Konum, tarih, kişi sayısı, platform bilgisi ve ödediğiniz tutar net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Villa / Airbnb / Booking kategorisini seçerek ilan oluşturun.

3. Satış fiyatını belirleyin.
Genellikle %20–40 indirim alıcı bulmayı hızlandırır.

4. Devri tamamlayın.
Misafir bilgileri güncellenir ve tatil devredilir.

VİLLA VE AIRBNB TATİLLERİ NEDEN HIZLI SATILIR?

Villa ve Airbnb tatillerinde talep yüksektir. Son dakika konaklama arayan aileler ve arkadaş grupları uygun fiyatlı fırsatları hızlıca değerlendirir.

AIRBNB’YE GİDEMİYORSAN TATİLİN YANMASIN

Airbnb, Booking veya villa tatiline gidemiyorsanız bu tatilin tamamen yanması gerekmez. Rezervasyon devri sayesinde paranızı kurtarabilirsiniz.

TatiliniDevret.com, villa, Airbnb ve Booking rezervasyonlarını güvenli ve şeffaf şekilde devretmeniz için kurulmuştur.
    `),
  },

  {
    id: "5",
    title: "Tur ve Gezi Paketleri Devri Nedir? Uçaklı ve Uçaksız Turlar Nasıl Satılır?",
    desc: "Tur şirketi iade yapmıyorsa tur paketini devrederek paranı kurtar.",
    img: "/images/blog-5.jpg",
    metaTitle: "Tur ve Gezi Paketleri Devri Nedir? Tur İptal Edilemiyorsa Ne Yapılır?",
    metaDescription:
      "Tur iptal oldu ama para iadesi alamıyor musunuz? Uçaksız tur paketlerini devrederek tatilinizi paraya dönüştürün.",
    metaDescriptionAlt:
      "Tur şirketi para iadesi yapmıyorsa çözüm burada. Tur paketini devret, paran yanmasın.",
    content: formatContent(`
TUR VE GEZİ PAKETLERİ DEVRİ NEDİR?
UÇAKLI VE UÇAKSIZ TURLAR NASIL SATILIR?

Bir tur satın aldınız. Belki aylar öncesinden, belki kampanyalı veya vizesiz bir yurtdışı turu… Ancak planlar değişti ve tura katılamıyorsunuz.

Bu noktada birçok kişinin Google’da yaptığı aramalar şunlardır:

Tur iptal oldu ne yapmalıyım?
Tur şirketi para iadesi yapmıyor.
Uçaklı tura gidemiyorum param yanacak mı?
Gezi paketini iptal edemiyorum.

Eğer bu sorular sana da tanıdık geliyorsa, doğru yerdesin.

TUR PAKETLERİ NEDEN İPTAL EDİLEMEZ?

Tur şirketleri uçak, otel ve rehberlik hizmetlerini önceden planladığı için son dakika iptallerinde genellikle para iadesi yapmaz. Birçok tur sözleşmesinde yüksek iptal kesintileri yer alır.

Özellikle uçaklı turlar, vizesiz yurtdışı turları, kayak ve kültür turları iptali en zor paketler arasındadır.

TUR VE GEZİ PAKETİ DEVRİ NEDİR?

Tur devri, kullanamayacağınız uçaksız tur paketini başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Tur tamamen yanmaz
- Ödediğiniz paranın büyük kısmını kurtarabilirsiniz
- Tur devralan kişi aynı programa daha uygun fiyata katılır

HANGİ TURLAR DEVREDİLEBİLİR?

Belgesi olan birçok tur devredilebilir. En yaygın olanlar:
- Vizesiz turlar
- Kayak turları
- Kültür turları
- GAP ve Karadeniz turları
- Hafta sonu ve günübirlik turlar

TUR VE GEZİ PAKETİ DEVRİ NASIL YAPILIR?

1. Tur bilgilerini hazırlayın.
Tur adı, tur şirketi, tarih, kişi sayısı ve ödediğiniz tutar net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Tur & Gezi Paketleri kategorisinden ilan oluşturun.

3. Satış fiyatını belirleyin.
Genellikle %20–35 indirim alıcı bulmayı hızlandırır.

4. Devri gerçekleştirin.
İsim değişikliği yapılarak tur yeni sahibine devredilir.

UÇAKLI TUR DEVRİ YAPILABİLİR Mİ?

Birçok uçaklı turda isim değişikliği mümkün değildir. Uçak bileti isme özel olup devredilemez.

TUR TATİLİNİ YAKMA, DEVRET

Tur iptal edilemiyorsa bu paranın tamamen yanacağı anlamına gelmez. Tur devri sayesinde zararınızı minimuma indirebilirsiniz.

TatiliniDevret.com, tur ve gezi paketlerini güvenli ve şeffaf şekilde devretmeniz için kurulmuştur.
    `),
  },

  {
    id: "6",
    title: "Konser, Festival ve Etkinlik Bileti Devri Nedir? Gidemiyorsan Biletin Yanmasın",
    desc: "Etkinlik biletini devrederek paranı kurtar, bilet boşa gitmesin.",
    img: "/images/blog-6.jpg",
    metaTitle: "Konser, Festival ve Etkinlik Bileti Devri Nedir? | TatiliniDevret",
    metaDescription:
      "Konser veya festival biletine gidemiyor musunuz? Etkinlik biletinizi devrederek paranızın yanmasını önleyin.",
    metaDescriptionAlt:
      "Etkinlik bileti iptal edilemiyorsa çözüm burada. Konser ve festival biletini devret, kaybetme.",
    content: formatContent(`
KONSER, FESTİVAL VE ETKİNLİK BİLETİ DEVRİ NEDİR?
GİDEMİYORSAN BİLETİN YANMASIN

Aylar öncesinden alınmış bir konser bileti, festival girişi veya özel bir etkinlik… Büyük bir heyecanla planlanır, ancak bazen planlar değişir ve etkinliğe katılmak mümkün olmaz.

Bu noktada birçok kişinin Google’da yaptığı aramalar şunlardır:

Konser biletine gidemiyorum ne yapmalıyım?
Festival bileti iptal edilemiyor.
Etkinlik bileti para iadesi yok mu?
Konser biletimi satabilir miyim?

Eğer bu sorular sana da tanıdık geliyorsa, yalnız değilsin.

ETKİNLİK BİLETLERİ NEDEN İPTAL EDİLEMEZ?

Konser, festival ve etkinlik biletlerinde organizasyon giderleri önceden yapılır. Bu nedenle çoğu organizatör iade veya iptal hakkı tanımaz.

Özellikle:
- Konser biletleri
- Festival girişleri
- Stand-up ve sahne gösterileri
- Spor ve özel etkinlikler

iptali en zor bilet türleri arasındadır.

ETKİNLİK BİLETİ DEVRİ NEDİR?

Bilet devri, katılamayacağınız konser, festival veya etkinlik biletini başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Bilet boşa gitmez
- Paran tamamen yanmaz
- Bileti devralan kişi daha uygun fiyata etkinliğe katılır

HANGİ ETKİNLİK BİLETLERİ DEVREDİLEBİLİR?

Belgesi veya e-bileti olan birçok etkinlik devredilebilir. En yaygın olanlar:
- Konser biletleri
- Festival biletleri
- Stand-up ve tiyatro
- Workshop ve atölyeler
- Spor müsabakaları
- Özel davetler

ETKİNLİK BİLETİ DEVRİ NASIL YAPILIR?

1. Bilet bilgilerini hazırlayın.
Etkinlik adı, tarih, şehir, bilet türü ve ödediğiniz fiyat net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Etkinlik Devri kategorisinden ilan oluşturun.

3. Satış fiyatını belirleyin.
Genellikle %10–30 indirim alıcı bulmayı hızlandırır.

4. Devri tamamlayın.
Bilet bilgileri ve giriş detayları yeni sahibine aktarılır.

KONSER BİLETİ SATMAK YASAL MI?

Kişisel kullanım için alınmış biletlerin belgeli ve şeffaf şekilde devredilmesi yasal ve güvenlidir. TatiliniDevret.com alıcı ve satıcıyı buluşturan aracı platformdur.

KONSERİNE GİDEMİYORSAN BİLETİN YANMASIN

Etkinliğe katılamıyorsanız bu biletin tamamen yanması gerekmez. Bilet devri sayesinde paranızı kurtarabilirsiniz.

TatiliniDevret.com, konser, festival ve etkinlik biletlerini güvenli ve şeffaf şekilde devretmeniz için kurulmuştur.
    `),
  },

  {
    id: "7",
    title: "Workshop, Eğitim ve Atölye Biletleri Nasıl Devredilir? Gidemiyorsan Paran Yanmasın",
    desc: "Yoga, kahve, sanat, gastronomi eğitimlerini devrederek zararını azalt.",
    img: "/images/blog-7.jpg",
    metaTitle: "Workshop, Eğitim ve Atölye Biletleri Nasıl Devredilir? | TatiliniDevret",
    metaDescription:
      "Workshop veya eğitime gidemiyor musunuz? Eğitim biletinizi devrederek paranızın yanmasını önleyin.",
    metaDescriptionAlt:
      "Eğitim iptal edilemiyorsa çözüm burada. Workshop biletini devret, kaybetme.",
    content: formatContent(`
WORKSHOP, EĞİTİM VE ATÖLYE BİLETLERİ NASIL DEVREDİLİR?
GİDEMİYORSAN PARAN YANMASIN

Bir workshop, eğitim programı veya atölye satın aldınız. Belki bir yoga eğitimi, kahve workshop’u, gastronomi atölyesi ya da sertifikalı bir eğitim… Ancak planlar değişti ve katılım sağlayamıyorsunuz.

Bu noktada birçok kişinin Google’da yaptığı aramalar şunlardır:

Workshop’a gidemiyorum ne yapmalıyım?
Eğitim ücretimi geri alamıyorum.
Atölye iptal edilemiyor param yanacak mı?
Workshop biletimi satabilir miyim?

Eğer bu sorular sana da tanıdık geliyorsa, yalnız değilsin.

WORKSHOP VE EĞİTİMLER NEDEN İPTAL EDİLEMEZ?

Workshop ve eğitim programlarında kontenjanlar sınırlıdır. Eğitmen, mekan ve içerik önceden planlanır. Bu nedenle birçok organizasyon iade veya iptal hakkı tanımaz.

Özellikle:
- Yoga ve mindfulness workshopları
- Kahve, gastronomi ve barista eğitimleri
- Sanat ve tasarım atölyeleri
- Sertifikalı eğitim programları

iptali en zor etkinlikler arasındadır.

WORKSHOP VE EĞİTİM DEVRİ NEDİR?

Workshop devri, katılamayacağınız eğitim veya atölye kaydını başka bir kullanıcıya belgeli şekilde devretmenizdir.

Bu sayede:
- Paran tamamen yanmaz
- Kontenjan boşa gitmez
- Eğitimi devralan kişi daha uygun fiyata katılır

HANGİ WORKSHOP VE EĞİİMLER DEVREDİLEBİLİR?

Belgesi veya kayıt onayı olan birçok eğitim devredilebilir. En yaygın olanlar:
- Yoga ve pilates workshopları
- Kahve, gastronomi ve şarap eğitimleri
- Sanat ve tasarım atölyeleri
- Fotoğraf ve içerik üretimi eğitimleri
- Online ve offline eğitim programları

WORKSHOP BİLETİ DEVRİ NASIL YAPILIR?

1. Eğitim bilgilerini hazırlayın.
Eğitim adı, tarih, lokasyon, eğitmen ve ödediğiniz ücret net olmalıdır.

2. TatiliniDevret.com’da ilan verin.
Workshop & Eğitim kategorisinden ilan oluşturun.

3. Satış fiyatını belirleyin.
Genellikle %15–30 indirim alıcı bulmayı hızlandırır.

4. Devri tamamlayın.
Katılımcı bilgileri güncellenir ve eğitim yeni sahibine geçer.

WORKSHOP DEVRİ YASAL MI?

Belgeli ve kişisel kullanım hakkı olan eğitimlerin devri yasal ve güvenlidir. TatiliniDevRet.com alıcı ve satıcıyı buluşturan aracı platformdur.

EĞİTİME GİDEMİYORSAN PARAN YANMASIN

Workshop veya eğitime katılamıyorsanız bu ücretin tamamen yanması gerekmez. Eğitim devri sayesinde zararınızı minimuma indirebilirsiniz.

TatiliniDevret.com, workshop, eğitim ve atölye biletlerini güvenli ve şeffaf şekilde devretmeniz için kurulmuştur.
    `),
  },

  {
    id: "8",
    title: "Son Dakika Tatil ve Etkinlik Devri: Etkinliğe Az Kaldıysa Ne Yapmalı?",
    desc: "Son günler kala ilanını öne çıkar, boost kullan, satış ihtimalini artır.",
    img: "/images/blog-8.jpg",
    metaTitle:
      "Son Dakika Tatil ve Etkinlik Devri: Etkinliğe Az Kaldıysa Ne Yapmalı?",
    metaDescription:
      "Etkinliğe veya tatile son günler mi kaldı? Son dakika devri ve boost ile ilanını öne çıkar, satışı hızlandır.",
    metaDescriptionAlt:
      "Bilet veya tatil satılmıyor mu? Son dakika devri ile görünür ol, paran yanmasın.",
    content: formatContent(`
ETKİNLİĞE SON GÜNLER KALA NE YAPMALI?
SON DAKİKA DEVİR VE BOOST MANTIĞI

Bir etkinliğe, tatile ya da rezervasyona günler kaldı… Ancak hâlâ alıcı yok ve zaman hızla daralıyor. Bu noktada panik yapmak yerine doğru adımları atmak gerekir.

Birçok kişinin Google’da yaptığı aramalar şunlardır:

Etkinliğe gidemiyorum son dakika ne yapmalıyım?
Konser bileti satılmıyor.
Tatiline az kaldı alıcı yok.
Son dakika bilet nasıl satılır?

Eğer bu yazıyı okuyorsanız, hâlâ şansınız var.

SON DAKİKA DEVRİ NEDİR?

Son dakika devri, tarihi yaklaşmış tatil, etkinlik veya rezervasyonların aciliyet avantajı kullanılarak devredilmesidir.

Zaman azaldıkça doğru fiyat ve doğru görünürlük satış ihtimalini artırır.

ETKİNLİĞE KAÇ GÜN KALA NE YAPILMALI?

7 gün kala:
İlan hâlâ rahat satılabilir. %15–25 indirim idealdir.

3–5 gün kala:
İndirim oranı %25–35 seviyesine çıkarılmalıdır. İlan başlığında “son günler” vurgusu yapılmalıdır.

Son 48 saat:
Fiyat ve görünürlük kritik hâle gelir. %35–45 indirim ve öne çıkarma (boost) önerilir.

SON DAKİKA İLANLARI NEDEN DAHA HIZLI SATILIR?

Çünkü alıcı tarafında kaçırma korkusu oluşur. Aynı tarih, aynı ürün, daha uygun fiyat hızlı karar verilmesini sağlar.

BOOST NEDİR VE NE İŞE YARAR?

Boost, ilanınızı üst sıralara taşıyarak daha fazla kişiye gösterilmesini sağlar. Özellikle son 72 saat içinde boost kullanımı satış ihtimalini ciddi şekilde artırır.

SON DAKİKA DEVİR İÇİN DOĞRU İLAN NASIL OLMALI?

Başlık net ve acil olmalıdır.
Açıklamalar kısa, tarih ve fiyat net olmalıdır.
Fiyat “belki satar” değil “satılsın” mantığıyla belirlenmelidir.

SON GÜNLERDE YAPILAN EN BÜYÜK HATA

Beklemek. Son günlerde beklemek yerine ilanı görünür kılmak gerekir.

SON DAKİKA = SON ŞANS DEĞİL, DOĞRU HAMLE

Etkinliğe veya tatile son günler kalmış olsa bile doğru fiyatlama ve doğru görünürlükle hâlâ satış yapılabilir.

TatiliniDevret.com, son dakika tatil ve etkinlik devrinde ilanlarınızı öne çıkararak satış ihtimalini artırır.
    `),
  },

  {
    id: "9",
    title: "Tatilini Devretmek Güvenli mi? Dolandırıcılıktan Nasıl Korunursun?",
    desc: "Belgeli ilan, şeffaf süreç ve güvenlik kontrol listesi.",
    img: "/images/blog-9.jpg",
    metaTitle:
      "Tatilini Devretmek Güvenli mi? Dolandırıcılıktan Nasıl Korunursun?",
    metaDescription:
      "Tatil devri güvenli mi diye mi düşünüyorsun? Belgeli ve güvenli tatil devri hakkında bilmen gereken her şey burada.",
    metaDescriptionAlt:
      "Tatil ve etkinlik devrinde dolandırılmamak için nelere dikkat etmelisin? Güvenli tatil devri rehberi.",
    content: formatContent(`
TATİLİNİ DEVRETMEK GÜVENLİ Mİ?
DOLANDIRICILIKTAN NASIL KORUNURSUN?

Tatilini devretmek fikri birçok kişi için mantıklı olsa da akla ilk gelen soru genellikle aynıdır: Güvenli mi? İnternette dolandırıcılık vakalarının artması, bu sorunun sorulmasını son derece doğal kılar.

Bu nedenle Google’da sıkça şu aramalar yapılır:

Tatil devri güvenli mi?
Tatilini devretmek dolandırıcılık mı?
Bilet devrinde dolandırılır mıyım?
Param gider mi?

Eğer bu sorular aklından geçiyorsa, doğru yerdesin.

İNSANLAR NEDEN TATİL DEVRİ KONUSUNDA ENDİŞELİ?

Birçok kişi daha önce şunlarla karşılaşmıştır:
- Sosyal medyada rastgele yapılan satışlar
- Sahte rezervasyon belgeleri
- Başkasına ait ekran görüntüleri
- Kapora alıp kaybolan kişiler

Bu nedenle tatil devri ancak doğru yöntemlerle yapıldığında güvenlidir.

TATİL DEVRİ NEDİR, NE DEĞİLDİR?

Tatil devri şudur:
- Belgeli
- Şeffaf
- Gerçek rezervasyonlara dayalı

Tatil devri şu değildir:
- WhatsApp veya DM üzerinden kontrolsüz satış
- Belgesiz ilan
- Kimliği belirsiz kişilerle işlem

Aradaki fark güvenliktir.

TATİL DEVRİ GÜVENLİ Mİ?

Evet, doğru platformda ve belgeli şekilde yapıldığında tatil devri güvenlidir. Ancak bunun için bazı temel kurallara dikkat edilmelidir.

DOLANDIRICILIKTAN NASIL KORUNURSUN?

1. Belge görmeden ödeme yapma.
Gerçek voucher, bilet PDF’i veya onay e-postası mutlaka talep edilmelidir.

2. Aşırı ucuz fiyatlara şüpheyle yaklaş.
Piyasanın çok altında fiyatlar genellikle risklidir.

3. İlan detaylarını dikkatle oku.
Tarih, kişi sayısı ve devir şekli net olmalıdır.

4. Platform dışına çıkma.
Ödemeyi ve iletişimi mümkün olduğunca platform üzerinden yürüt.

TATİLİNİDEVRET.COM GÜVENLİ Mİ?

TatiliniDevret.com, alıcı ve satıcıyı buluşturan aracı bir platformdur. Belgeli ilanlara izin verir, ilan verme kuralları nettir ve süreç şeffaftır.

Platform, alıcı ve satıcı arasındaki anlaşmanın tarafı değildir. Bu şeffaflık, güvenin temelidir.

EN GÜVENLİ TATİL DEVRİ NASIL YAPILIR?

- Belgeli ilan
- Net iletişim
- Şeffaf süreç

Bu üç unsur bir aradaysa tatil devri güvenlidir.

Tatil devri doğru şekilde yapıldığında hem satıcıyı hem alıcıyı koruyan bir sistemdir. Ancak güven duygusu yoksa işlem yapılmamalıdır.

TATİLİN YANMASIN, GÜVEN DE YANMASIN

TatiliniDevret.com, tatil ve etkinlik devrini bilinçli, kontrollü ve şeffaf şekilde yapman için kurulmuştur.
    `),
  },
];
