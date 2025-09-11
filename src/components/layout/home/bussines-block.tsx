import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function BussinesBlock() {
  return (
    <div id="business-size" className="business-size">
      <div className="wrapper">
        <h2>Размер бизнеса не важен,</h2>
        <p>давайте расти вместе!</p>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false, // Keep autoplay on user interaction
          }}
          // navigation={{
          //   nextEl: ".swiper-button-next",
          //   prevEl: ".swiper-button-prev",
          // }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="businessSwiper rounded-[16px] overflow-hidden group"
        >
          <SwiperSlide>
            <img src="img/business-size-img1.png" alt="" />
            <span>Малый и средний бизнес</span>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/business-size-img2.png" alt="" />
            <span>Самозанятые специалисты</span>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/business-size-img3.png" alt="" />
            <span>Индивидуальные предприниматели</span>
          </SwiperSlide>
        </Swiper>

        <div className="swiper-pagination"></div>

        <a href="#" className="green-btn">
          Присоединиться
        </a>
      </div>
    </div>
  );
}

export default BussinesBlock;
