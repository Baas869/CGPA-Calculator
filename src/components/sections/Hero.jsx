import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaRocket } from "react-icons/fa";
import h1 from "../../assets/hero/hero1.jpg";
import h2 from "../../assets/hero/hero2.jpg";
import h3 from "../../assets/hero/hero4.jpg";
import h4 from "../../assets/hero/pr3.jpg";
import h5 from "../../assets/hero/pr8.jpg";

const slides = [
  { image: h1, title: "Achieve Academic Excellence", desc: "Use our CGPA Calculator & AI Predictor to plan your success.", link: "#" },
  { image: h2, title: "Track Your Progress", desc: "Stay ahead by monitoring your CGPA with accuracy.", link: "#" },
  { image: h3, title: "Smart AI Predictions", desc: "Get insights on your academic future with AI-powered predictions.", link: "#" },
  { image: h4, title: "Easy and Fast Calculations", desc: "Calculate your CGPA effortlessly and make informed decisions.", link: "#" },
  { image: h5, title: "Plan for Success", desc: "Take charge of your academic journey with precise tracking.", link: "#" }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = setInterval(() => emblaApi.scrollNext(), 5000);

    emblaApi.on("select", () => {
      setAnimationTrigger(false);
      setCurrentIndex(emblaApi.selectedScrollSnap());

      setTimeout(() => {
        setAnimationTrigger(true);
      }, 500);
    });

    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  return (
    <div id="hero" className="relative w-full overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="relative min-w-full" key={index}>
              <img src={slide.image} alt={slide.title} className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-6 text-center text-white">
                <AnimatePresence mode="wait">
                  {currentIndex === index && animationTrigger && (
                    <>
                      <motion.h2 
                        key={`title-${index}`}
                        className="text-5xl font-bold"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {slide.title}
                      </motion.h2>

                      <motion.p 
                        key={`desc-${index}`}
                        className="mt-4 text-xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {slide.desc}
                      </motion.p>

                      <motion.a 
                        key={`btn-${index}`}
                        href={slide.link}
                        className="mt-6 px-6 py-3 bg-btn-primary-color text-white rounded-lg text-lg font-semibold flex items-center gap-2 hover:bg-btn-hover-color transition"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <FaRocket size={20} /> Get Started
                      </motion.a>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.button 
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-btn-primary-color rounded-full text-white"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaLongArrowAltLeft size={30} />
      </motion.button>
      
      <motion.button 
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-btn-primary-color rounded-full text-white"
        onClick={() => emblaApi && emblaApi.scrollNext()}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaLongArrowAltRight size={30} />
      </motion.button>
    </div>
  );
};

export default Hero;
