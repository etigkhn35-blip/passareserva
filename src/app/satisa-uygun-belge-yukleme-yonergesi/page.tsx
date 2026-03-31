"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function DocumentUploadGuidelinesPage() {
  const { lang } = useLanguage();

  const t =
    lang === "en"
      ? {
          title: "Document Upload Guidelines for Listing Approval",
          introTitle: "PassaReserva Document Upload Guidelines",
          intro:
            "All documents and images uploaded while creating a listing must be clear, accurate, and verifiable. The following rules apply to all users.",

          s1: "1. Required Documents",
          s1Items: [
            "Voucher or reservation confirmation",
            "Payment receipt (amount must be clearly visible)",
            "Official confirmation from hotel or provider",
            "Document showing reservation details (personal data may be hidden)",
          ],

          s2: "2. Upload Rules",
          s2Items: [
            "Images must be clear and readable",
            "Documents must not be altered or manipulated",
            "Accepted formats: PDF, JPEG, PNG",
            "Date, price, facility name and reservation details must be visible",
            "Misleading edits or manipulation are strictly prohibited",
            "Sensitive personal data may be hidden by the user",
          ],

          s3: "3. Prohibited Documents",
          s3Items: [
            "Fake or altered documents",
            "Uploading documents belonging to others without permission",
            "Blurry or unreadable files",
            "Non-official screenshots (WhatsApp, notes, etc.)",
          ],

          s4: "4. Review Process",
          s4Intro: "PassaReserva reserves the right to:",
          s4Items: [
            "Contact the hotel/provider for verification",
            "Suspend listings if documents are insufficient",
            "Suspend or terminate user accounts",
          ],
          s4Note: "These actions are at the platform’s sole discretion.",

          back: "Back to Home",
        }
      : {
          title: "Diretrizes para Upload de Documentos",
          introTitle: "Diretrizes do PassaReserva",
          intro:
            "Todos os documentos e imagens enviados devem ser claros, verificáveis e corretos. As regras abaixo aplicam-se a todos os usuários.",

          s1: "1. Documentos Obrigatórios",
          s1Items: [
            "Voucher ou confirmação de reserva",
            "Comprovante de pagamento (valor visível)",
            "Confirmação oficial do hotel",
            "Documento com detalhes da reserva (dados podem ser ocultados)",
          ],

          s2: "2. Regras de Upload",
          s2Items: [
            "Imagens devem ser legíveis",
            "Documentos não podem ser alterados",
            "Formatos aceitos: PDF, JPEG, PNG",
            "Data, preço e detalhes devem estar visíveis",
            "Manipulação é proibida",
            "Dados pessoais podem ser ocultados",
          ],

          s3: "3. Documentos Proibidos",
          s3Items: [
            "Documentos falsos ou alterados",
            "Uso de documentos de terceiros sem permissão",
            "Arquivos ilegíveis",
            "Capturas de tela não oficiais",
          ],

          s4: "4. Processo de Revisão",
          s4Intro: "O PassaReserva pode:",
          s4Items: [
            "Verificar com o hotel",
            "Suspender anúncios",
            "Encerrar contas",
          ],
          s4Note: "A decisão é exclusiva da plataforma.",

          back: "Voltar para Home",
        };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t.title}
        </h1>

        <p className="text-gray-700 mb-4 font-semibold">
          {t.introTitle}
        </p>

        <p className="text-gray-700 mb-6">
          {t.intro}
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">{t.s1}</h2>
        <ul className="list-disc list-inside space-y-1 mb-6">
          {t.s1Items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">{t.s2}</h2>
        <ul className="list-disc list-inside space-y-1 mb-6">
          {t.s2Items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">{t.s3}</h2>
        <ul className="list-disc list-inside space-y-1 mb-6">
          {t.s3Items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">{t.s4}</h2>
        <p className="mb-3">{t.s4Intro}</p>
        <ul className="list-disc list-inside space-y-1 mb-6">
          {t.s4Items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="mb-8">{t.s4Note}</p>

        <div className="text-sm text-gray-500 text-center">
          <Link href="/" className="text-primary hover:underline">
            {t.back}
          </Link>
        </div>

      </div>
    </main>
  );
}