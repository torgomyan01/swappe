import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { fileHost } from "@/utils/consts";
import { useRef, useState } from "react";

interface IThisProps {
  offer: IUserOfferFront;
}

function LeftSlider({ offer }: IThisProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="left-info">
      <div className="max-w-4xl mx-auto sticky top-5">
        {/* Main Slider */}
        <div className="relative mb-6">
          <Swiper
            modules={[Navigation, Thumbs]}
            spaceBetween={10}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            className="main-swiper rounded-2xl overflow-hidden shadow-lg"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                const navigation = swiper.params.navigation;
                if (navigation) {
                  navigation.prevEl = prevRef.current;
                  navigation.nextEl = nextRef.current;
                }
              }
            }}
          >
            {offer.images.map((slide, index) => (
              <SwiperSlide key={`images-product-${index}`}>
                <div className="aspect-[4/3] bg-gray-100">
                  <Image
                    src={`${fileHost}${slide}` || "./default-image.png"}
                    alt={offer.name}
                    className="w-full h-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Previous slide"
          >
            <i className="fa-regular fa-chevron-left text-gray-700"></i>
          </button>

          <button
            ref={nextRef}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Next slide"
          >
            <i className="fa-regular fa-chevron-right text-gray-700"></i>
          </button>
        </div>

        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbs-swiper"
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {offer.images.map((slide, index) => (
            <SwiperSlide key={`thumb-offer__${index}`} className="my-4 px-2">
              <div
                className={`aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                  activeIndex === index
                    ? "ring-3 ring-green ring-offset-2 scale-105"
                    : "hover:ring-2 hover:ring-green/80 hover:scale-102"
                }`}
              >
                <Image
                  src={`${fileHost}${slide}` || "./default-image.png"}
                  alt={offer.name}
                  className="w-full h-full object-cover"
                  width={200}
                  height={200}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default LeftSlider;
