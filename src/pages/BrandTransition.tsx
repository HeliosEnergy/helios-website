import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { PRIMARY_ORIGIN } from "@/lib/site";

const TARGET_DOMAIN = PRIMARY_ORIGIN;
const REDIRECT_DELAY = 12000;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BrandTransition = () => {
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      window.location.href = TARGET_DOMAIN;
    }, REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left — FlutedGlass over data center */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <FlutedGlass
          image="/helios_no_star_v2.png"
          width="100%"
          height="100%"
          colorBack="#080808"
          colorShadow="#0a0a0a"
          colorHighlight="#ffffff"
          size={0.4}
          shadows={0.2}
          highlights={0.06}
          shape="lines"
          angle={0}
          distortionShape="prism"
          distortion={0.35}
          blur={0.08}
          edges={0.2}
          margin={0}
          grainOverlay={0.02}
          fit="cover"
        />

        {/* Subtle logo watermark */}
        <div className="absolute bottom-10 left-10">
          <img
            src="/logos/logo-original.png"
            alt=""
            className="h-auto w-24 object-contain opacity-20 shrink-0"
          />
        </div>
      </div>

      {/* Right — Brand statement */}
      <div className="w-full lg:w-1/2 bg-primary flex flex-col justify-between p-8 md:p-14 lg:p-20 min-h-screen lg:min-h-0 relative">
        {/* Top — logo mark (inverted to black) */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <img
            src="/logos/logo-original.png"
            alt="Helios"
            className="h-auto w-32 md:w-40 object-contain brightness-0 shrink-0"
          />
        </motion.div>

        {/* Center — the announcement */}
        <div className="flex-1 flex flex-col justify-center -mt-10">
          {/* Old domain — fades through */}
          <motion.span
            className="text-sm md:text-base font-mono tracking-[0.2em] text-black/20 block mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0.25, 0] }}
            transition={{
              duration: 4,
              times: [0, 0.25, 0.5, 1],
              ease: "easeInOut",
            }}
          >
            heliosenergy.io
          </motion.span>

          {/* New domain — massive, split across lines */}
          <motion.h1
            className="text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-heading font-black tracking-tighter text-black leading-[0.85]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 3, ease: EASE }}
          >
            helios
            <br />
            .co
          </motion.h1>

          {/* One line — that's all */}
          <motion.p
            className="mt-8 md:mt-10 text-base md:text-lg text-black/35 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 5, ease: "easeOut" }}
          >
            Same GPU cloud. Shorter address.
          </motion.p>

          {/* Text CTA — no button chrome */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 6.5, ease: "easeOut" }}
          >
            <button
              onClick={() => (window.location.href = TARGET_DOMAIN)}
              className="group inline-flex items-center gap-4 text-black font-semibold text-base tracking-wide hover:gap-6 transition-all duration-500 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Bottom — progress bar, flush to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: REDIRECT_DELAY / 1000,
              ease: "linear",
            }}
            className="h-full bg-black origin-left"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandTransition;
