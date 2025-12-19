import { ArrowRight } from "lucide-react";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

export const AnnouncementBanner = () => {
  const { data: banner, isLoading } = useSanityQuery<any>('announcement-banner', QUERIES.announcementBanner);

  if (isLoading || !banner || !banner.enabled) return null;

  return (
    <div className="bg-primary py-2.5 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-primary-foreground">
        <span className="font-medium">{banner.title}</span>
        {banner.description && (
          <span className="hidden sm:inline text-primary-foreground/90">
            {banner.description}
          </span>
        )}
        <a
          href={banner.ctaLink || "#"}
          className="inline-flex items-center gap-1 font-semibold hover:underline"
        >
          {banner.ctaText}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
