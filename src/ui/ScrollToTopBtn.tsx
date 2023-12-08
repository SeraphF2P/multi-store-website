import {
  useMotionTemplate,
  useScroll,
  useTransform,
  motion as m,
} from "framer-motion";
import { cn, variants } from "~/lib/cva";
import Icons from "./Icons";

const ScrollToTopBtn = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, window.innerHeight], [0, 1]);
  return (
    <m.a
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{
        opacity: useMotionTemplate`${opacity}`,
      }}
      className={cn(
        variants({ variant: "fill" }),
        "fixed bottom-1/2 right-12 z-30   scroll-smooth p-2 ",
      )}
    >
      <Icons name="rightArrow" className=" h-4 w-4 -rotate-90 fill-slate-100" />
    </m.a>
  );
};

export default ScrollToTopBtn;
