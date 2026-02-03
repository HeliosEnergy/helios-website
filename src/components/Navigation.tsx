import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";

/**
 * Combined Navigation component that renders:
 * - MobileNav for mobile viewports (lg:hidden)
 * - Navbar for desktop viewports (hidden lg:block)
 */
export const Navigation = () => {
  return (
    <>
      <MobileNav />
      <Navbar />
    </>
  );
};
