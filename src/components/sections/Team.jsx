import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import baas from "../../assets/baas.png";
import musadiq from "../../assets/musadiq.jpeg";

const Team = () => {
  const teamMembers = [
    { id: 1, name: "Baas", title: "Founder", image: baas },
    { id: 2, name: "Musadiq", title: "Co-Founder", image: musadiq },
    { id: 3, name: "Boladale Sulaiman", title: "Designer/Front Developer", image: baas },
    { id: 4, name: "Musadiq Olatunji", title: "Backend Developer", image: musadiq },
    { id: 5, name: "Team Member 3", title: "Marketing", image: baas },
    { id: 6, name: "Team Member 4", title: "Operations", image: musadiq },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateScrollState);
    updateScrollState();

    const autoSlide = setInterval(() => {
      emblaApi && emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoSlide);
  }, [emblaApi, updateScrollState]);

  return (
    <section id='team' className="my-10 bg-white">
        <div className="container px-6 mx-auto py-14">
            <div className="flex flex-col items-center text-center mx-auto">
                <h2 className="text-4xl font-bold mb-4 text-primary-color">
                Our <span className="text-link-primary-color">Team</span>
                </h2>
                <p className="text-gray-600 max-w-2xl">
                Meet the talented individuals behind our success.
                </p>
            </div>

            <div className="relative mt-8">
                <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] px-3"
                    >
                        <div className="relative w-full  overflow-hidden shadow-lg">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-[280px] object-cover object-top"
                            />
                            <div className="absolute bottom-0 w-full bg-primary-color text-white p-3 text-center">
                                <h3 className="text-lg font-bold">{member.name}</h3>
                                <p className="text-sm font-semibold text-link-primary-color">{member.title}</p>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                <button
                    className={`p-2 rounded-full text-primary-text bg-primary-color hover:bg-link-primary-color transition ${
                    !canScrollPrev ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => emblaApi && emblaApi.scrollPrev()}
                    disabled={!canScrollPrev}
                >
                    <FaChevronLeft size={20} />
                </button>
                <button
                    className={`p-2 rounded-full text-primary-text bg-primary-color hover:bg-link-primary-color transition ${
                    !canScrollNext ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => emblaApi && emblaApi.scrollNext()}
                    disabled={!canScrollNext}
                >
                    <FaChevronRight size={20} />
                </button>
                </div>
            </div>
        </div>

    </section>
  );
};

export default Team;