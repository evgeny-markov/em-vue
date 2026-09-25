import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
);

gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

export { gsap, ScrollTrigger, SplitText };
