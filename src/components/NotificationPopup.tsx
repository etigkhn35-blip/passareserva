"use client";

type NotificationPopupProps = {
  title: string;
  text?: string;
  onClose: () => void;
};

export default function NotificationPopup({
  title,
  text,
  onClose,
}: NotificationPopupProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white shadow-lg border rounded-lg p-4 w-80 animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {text && <p className="text-sm text-gray-600 mt-1">{text}</p>}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
