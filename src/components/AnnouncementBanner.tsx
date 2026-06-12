import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const AnnouncementBanner = () => {
  return (
    <div className="bg-primary py-2.5 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-primary-foreground">
        <span className="font-bold">GB300 &amp; B300 capacity opening Q3.</span>
        <span className="hidden sm:inline text-primary-foreground/90">
          Thousands of GPUs, live in ~3 months.
        </span>
        <Link
          to="/contact?service=coloc"
          className="inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Join the waitlist
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
