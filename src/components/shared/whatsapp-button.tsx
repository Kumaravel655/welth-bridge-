import { site } from "@/lib/site";

const WHATSAPP_MESSAGE =
  "Hi Wealth Bridge, I'd like to know more about your services.";

export function WhatsappButton() {
  const number = site.phone.replace(/\D/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="size-7"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.821.487 3.53 1.338 5.003L2.05 21.95l5.062-1.327A9.953 9.953 0 0 0 12 22c5.523 0 10-4.478 10-10S17.524 2 12.001 2zm0 18.007a7.98 7.98 0 0 1-4.075-1.115l-.292-.174-3.005.788.802-2.929-.19-.301A7.977 7.977 0 0 1 4.023 12c0-4.407 3.57-7.977 7.978-7.977 4.407 0 7.977 3.57 7.977 7.977 0 4.408-3.57 7.978-7.977 8.007z" />
      </svg>
    </a>
  );
}
