"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function KvkkPage() {
  const { lang } = useLanguage();

  const isEN = lang === "en";
  const isPT = lang === "pt";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow bg-slate-50/30">

        {/* HEADER */}
        <section className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-medium text-slate-600 tracking-tight uppercase">
              {isEN
                ? "PERSONAL DATA PROTECTION NOTICE"
                : isPT
                ? "POLÍTICA DE PROTEÇÃO DE DADOS"
                : "KVKK AYDINLATMA METNİ"}
            </h1>

            <p className="text-slate-400 mt-2 text-sm font-light italic">
              {isEN
                ? "PassaReserva – Disclosure Text under Law No. 6698"
                : isPT
                ? "PassaReserva – Lei nº 6698 Proteção de Dados"
                : "PassaReserva – 6698 Sayılı KVKK Kapsamında Aydınlatma Metni"}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm p-8 md:p-12 text-slate-600 leading-relaxed">

            {/* INTRO */}
            <p className="mb-6">
              {isEN
                ? "As PassaReserva.com, we attach importance to the protection and privacy of personal data. This Disclosure Text has been prepared in accordance with the Personal Data Protection Law No. 6698 (“GDPR”) in order to explain for what purposes your personal data is processed, by which methods, to whom it is transferred, and your rights."
                : isPT
                ? "Como PassaReserva.com, valorizamos a proteção e privacidade dos dados pessoais. Este texto foi preparado de acordo com a Lei nº 6698 para explicar como seus dados são processados, utilizados e seus direitos."
                : "TatiliniDevret.com olarak kişisel verilerin korunmasını ve gizliliğini önemsiyoruz. İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“GDPR”) gereğince kişisel verilerinizin hangi amaçlarla, hangi yöntemlerle işlendiği, kimlere aktarıldığı ve sahip olduğunuz hakları açıklamak amacıyla hazırlanmıştır."}
            </p>

            {/* 1 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {isEN ? "1. Data Controller" : isPT ? "1. Controlador de Dados" : "1. Veri Sorumlusu"}
              </h2>

              <p>
                {isEN
                  ? "Data Controller: M&G Digital Agency – PassaReserva"
                  : isPT
                  ? "Controlador: M&G Digital Agency – PassaReserva"
                  : "Veri Sorumlusu: M&G Digital Agency – Tatilini Devret"}
              </p>

              <p>
                {isEN
                  ? "Address: Dikilitaş Mah. Emirhan Cad. Barbaros Sok. No:2 D:3 Beşiktaş / Istanbul"
                  : isPT
                  ? "Endereço: Dikilitaş Mah. Emirhan Cad. Barbaros Sok. No:2 D:3 Beşiktaş / Istambul"
                  : "Adres: Dikilitaş Mah. Emirhan Cad. Barbaros Sok. No:2 D:3 Beşiktaş / İstanbul"}
              </p>

              <p>E-mail: info@passareserva.com</p>
              <p>Telefon: +90 (850) 304 84 01</p>
            </div>

            {/* 2 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {isEN
                  ? "2. What Personal Data is Processed?"
                  : isPT
                  ? "2. Dados Coletados"
                  : "2. Hangi Kişisel Veriler İşlenmektedir?"}
              </h2>

              <p className="mb-4">
                {isEN
                  ? "During your use of PassaReserva.com, the following data is processed:"
                  : isPT
                  ? "Durante o uso da plataforma, os seguintes dados são processados:"
                  : "TatiliniDevret.com kullanımınız sırasında aşağıda yer alan veriler işlenir:"}
              </p>

              <p className="font-bold mt-4">
                {isEN ? "Identity Information" : isPT ? "Dados de Identidade" : "Kimlik Bilgileri"}
              </p>
              <ul className="list-disc list-inside mb-3 ml-2">
                <li>
                  {isEN
                    ? "Name, surname, date of birth"
                    : isPT
                    ? "Nome, sobrenome, data de nascimento"
                    : "Ad, soyad, doğum tarihi"}
                </li>
              </ul>

              <p className="font-bold mt-4">
                {isEN ? "Contact Information" : isPT ? "Contato" : "İletişim Bilgileri"}
              </p>
              <ul className="list-disc list-inside mb-3 ml-2">
                <li>
                  {isEN
                    ? "Phone number, e-mail address"
                    : isPT
                    ? "Telefone, e-mail"
                    : "Telefon numarası, e-posta adresi"}
                </li>
                <li>
                  {isEN
                    ? "IP information, device information"
                    : isPT
                    ? "IP, dispositivo"
                    : "IP bilgisi, cihaz bilgisi"}
                </li>
              </ul>

              <p className="font-bold mt-4">
                {isEN
                  ? "Account and Transaction Information"
                  : isPT
                  ? "Conta e Transações"
                  : "Hesap ve İşlem Bilgileri"}
              </p>
              <ul className="list-disc list-inside mb-3 ml-2">
                <li>
                  {isEN
                    ? "Membership information, login–logout times, listing history"
                    : isPT
                    ? "Informações de conta e histórico"
                    : "Üyelik bilgileri, giriş–çıkış saatleri, ilan verme geçmişi"}
                </li>
                <li>
                  {isEN ? "Messaging contents" : isPT ? "Mensagens" : "Mesajlaşma içerikleri"}
                </li>
                <li>
                  {isEN
                    ? "Documents: reservation confirmation, voucher, payment receipt"
                    : isPT
                    ? "Documentos: reserva, voucher, comprovante"
                    : "Belgeler: Rezervasyon onayı, voucher, ödeme dekontu"}
                </li>
              </ul>

              <p className="font-bold mt-4">
                {isEN
                  ? "Transaction Security and Financial Data"
                  : isPT
                  ? "Segurança e Financeiro"
                  : "İşlem Güvenliği ve Finansal Veriler"}
              </p>
              <ul className="list-disc list-inside mb-3 ml-2">
                <li>
                  {isEN
                    ? "IP logs, cookies, browser and device info"
                    : isPT
                    ? "Logs, cookies, navegador"
                    : "IP log kayıtları, çerez kayıtları, tarayıcı ve cihaz bilgileri"}
                </li>
                <li>
                  {isEN
                    ? "Price specified by the user"
                    : isPT
                    ? "Preço informado pelo usuário"
                    : "Kullanıcının kendi ilanında belirttiği fiyat bilgisi"}
                </li>
              </ul>
            </div>

            {/* 3 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {isEN
                  ? "3. Purposes of Processing Personal Data"
                  : isPT
                  ? "3. Finalidade"
                  : "3. Kişisel Verilerin İşlenme Amaçları"}
              </h2>

              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>{isEN ? "Account creation and login" : isPT ? "Criar conta" : "Üyelik oluşturma, giriş yapma ve doğrulama"}</li>
                <li>{isEN ? "Listing management" : isPT ? "Gerenciar anúncios" : "İlan yayınlama ve düzenleme işlemleri"}</li>
                <li>{isEN ? "Fraud prevention" : isPT ? "Prevenir fraude" : "Dolandırıcılık ve kötüye kullanımın önlenmesi"}</li>
                <li>{isEN ? "Legal compliance" : isPT ? "Cumprir leis" : "Yasal yükümlülüklerin yerine getirilmesi"}</li>
                <li>{isEN ? "Improve service quality" : isPT ? "Melhorar serviço" : "Hizmet kalitesinin artırılması"}</li>
                <li>{isEN ? "Marketing & analytics" : isPT ? "Marketing" : "Reklam ve kullanıcı deneyimi iyileştirme"}</li>
              </ul>
            </div>

            

            {/* 4. Aktarım */}
<div className="mb-8">
  <h2 className="text-lg font-bold text-slate-800 mb-2">
    {isEN
      ? "4. Transfer of Personal Data"
      : isPT
      ? "4. Transferência de Dados Pessoais"
      : "4. Kişisel Verilerin Aktarılması"}
  </h2>

  <p className="mb-3">
    {isEN
      ? "Your personal data may be transferred to the following persons and institutions:"
      : isPT
      ? "Seus dados pessoais podem ser compartilhados com as seguintes entidades:"
      : "Kişisel verileriniz aşağıdaki kişi ve kurumlara aktarılabilir:"}
  </p>

  <ul className="list-disc list-inside mb-4 ml-2">
    <li>
      {isEN
        ? "Legal authorities (courts, prosecutors, BTK, etc.)"
        : isPT
        ? "Autoridades legais (tribunais, promotores, etc.)"
        : "Yasal merciler (mahkemeler, savcılıklar, BTK vb.)"}
    </li>
    <li>
      {isEN
        ? "Buyer–Seller parties (only if shared by the user in their own listing)"
        : isPT
        ? "Comprador e vendedor (apenas se compartilhado pelo usuário)"
        : "Alıcı–Satıcı taraf (sadece kullanıcı kendi ilanında paylaştıysa)"}
    </li>
    <li>
      {isEN
        ? "Authorized institutions and organizations"
        : isPT
        ? "Instituições autorizadas"
        : "Yetkili kurum ve kuruluşlar"}
    </li>
  </ul>

  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl text-orange-800 font-medium text-sm">
    {isEN
      ? "PassaReserva never sells, markets or shares your personal data without permission."
      : isPT
      ? "A PassaReserva nunca vende ou compartilha seus dados pessoais sem permissão."
      : "PassaReserva kişisel verileriniz kesinlikle satmaz, pazarlamaz veya izinsiz paylaşmaz."}
  </div>
</div>
{/* 5. Yöntem */}
<div className="mb-8">
  <h2 className="text-lg font-bold text-slate-800 mb-2">
    {isEN
      ? "5. Method of Collecting Personal Data and Legal Grounds"
      : isPT
      ? "5. Método de Coleta de Dados e Base Legal"
      : "5. Kişisel Veri Toplama Yöntemi ve Hukuki Sebepler"}
  </h2>

  <p className="mb-2">
    {isEN
      ? "Your data is collected through membership forms, listing steps and cookies. Legal grounds:"
      : isPT
      ? "Os dados são coletados através de formulários, anúncios e cookies. Base legal:"
      : "Verileriniz üyelik formu, ilan verme adımları ve çerezler aracılığıyla elde edilir. Hukuki sebepler:"}
  </p>

  <ul className="list-disc list-inside ml-2">
    <li>
      {isEN
        ? "GDPR Article 5/2 (Establishment and performance of the contract)"
        : isPT
        ? "Execução de contrato"
        : "GDPR md. 5/2 (Sözleşmenin kurulması ve ifası)"}
    </li>
    <li>
      {isEN
        ? "Legitimate interest, legal obligation and explicit consent where necessary"
        : isPT
        ? "Interesse legítimo e obrigação legal"
        : "Meşru menfaat, kanuni yükümlülük ve gerekli hallerde açık rıza."}
    </li>
  </ul>
</div>

{/* 6. Haklar */}
<div className="mb-8">
  <h2 className="text-lg font-bold text-slate-800 mb-2">
    {isEN
      ? "6. Your Rights Under GDPR"
      : isPT
      ? "6. Seus Direitos"
      : "6. GDPR Kapsamındaki Haklarınız"}
  </h2>

  <p className="mb-3">
    {isEN
      ? "Under Article 11 of GDPR, you have the following rights:"
      : isPT
      ? "De acordo com a lei, você possui os seguintes direitos:"
      : "GDPR md.11 kapsamında şu haklara sahipsiniz:"}
  </p>

  <ul className="list-disc list-inside space-y-2 ml-2 mb-6">
    <li>
      {isEN
        ? "Learn whether your data is processed and request information"
        : isPT
        ? "Saber se seus dados são processados"
        : "Verilerinizin işlenip işlenmediğini öğrenme ve bilgi talep etme"}
    </li>
    <li>
      {isEN
        ? "Learn whether it is used in accordance with its purpose"
        : isPT
        ? "Verificar uso adequado"
        : "Amacına uygun kullanılıp kullanılmadığını öğrenme"}
    </li>
    <li>
      {isEN
        ? "Request correction of incomplete or incorrect data"
        : isPT
        ? "Corrigir dados incorretos"
        : "Eksik veya yanlış işlenen verinin düzeltilmesini isteme"}
    </li>
    <li>
      {isEN
        ? "Request deletion or destruction of data"
        : isPT
        ? "Solicitar exclusão"
        : "Verilerin silinmesini veya yok edilmesini talep etme"}
    </li>
  </ul>

  <p className="text-center font-semibold text-sky-600">
    {isEN
      ? "For your requests: gpdr@passareserva.com"
      : isPT
      ? "Contato: gpdr@passareserva.com"
      : "Talepleriniz için: gpdr@passareserva.com"}
  </p>
</div>

{/* BACK */}
            <div className="text-center pt-10 border-t border-slate-50">
              <Link href="/" className="text-sky-500 font-bold hover:underline">
                {isEN ? "← Back to Home" : isPT ? "← Voltar" : "← Anasayfaya Geri Dön"}
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}