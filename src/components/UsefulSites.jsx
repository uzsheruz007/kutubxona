import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import AnimatedSectionDivider from "./AnimatedSectionDivider";

const usefulSites = [
  { id: 1, logo: "/Logo.png", url: "https://scholar.google.com" },
  { id: 2, logo: "/Logo.png", url: "https://www.jstor.org" },
  { id: 3, logo: "/Logo.png", url: "https://link.springer.com" },
  { id: 4, logo: "/Logo.png", url: "https://www.sciencedirect.com" },
  { id: 5, logo: "/Logo.png", url: "https://www.researchgate.net" },
  { id: 6, logo: "/Logo.png", url: "https://eric.ed.gov" },
];

export default function UsefulSitesCarousel() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 28,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 3, spacing: 20 },
      },
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(max-width: 480px)": {
        slides: { perView: 1.3, spacing: 12 },
      },
    },
    renderMode: "performance",
    drag: true,
    created(slider) {
       let interval = setInterval(() => {
        if (slider) slider.next();
       }, 3000);
       slider.on("destroyed", () => clearInterval(interval));
    },
  });

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
        >
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Foydali saytlar</h2>
            <p className="text-gray-600 text-lg mb-4">
                Talabalar va ilmiy izlanishlar uchun kerakli manbalar
            </p>
            <AnimatedSectionDivider />
        </motion.div>

        <div ref={sliderRef} className="keen-slider px-4">
            {usefulSites.map((site) => (
                <a
                    key={site.id}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="keen-slider__slide flex justify-center"
                >
                    <div className="w-36 h-36 md:h-40 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-blue-300 transition-all duration-300 flex items-center justify-center">
                        <img src={site.logo} alt={`Logo ${site.id}`} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                    </div>
                </a>
            ))}
        </div>
      </div>
    </section>
  );
}
