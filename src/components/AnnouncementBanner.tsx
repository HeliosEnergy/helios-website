import { ArrowRight } from "lucide-react";

export const AnnouncementBanner = () => {
  return (
    <div className="bg-primary py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-primary-foreground">
        <span className="font-medium">Fireworks RFT now available!</span>
        <span className="hidden sm:inline text-primary-foreground/90">
          Fine-tune open models that outperform frontier models.
        </span>
        <a
          href="#"
          className="inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Try today
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
