import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import TestimonialReviews from "../ui/TestimonialReviews";

function Reviews() {
  return (
    <section className="reviews" dir="rtl">
      <div className="container">
        <h2 className="reviews__title">
          كيف يحقق أمثالك من المتعلمين أهدافهم عن طريق منصة واصل
        </h2>

        <div className="reviews__slider">
          <Swiper
            modules={[Pagination]}
            centeredSlides
            loop
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 22 },
              1200: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            <SwiperSlide>
              <TestimonialReviews />
            </SwiperSlide>
            <SwiperSlide>
              <TestimonialReviews />
            </SwiperSlide>
            <SwiperSlide>
              <TestimonialReviews />
            </SwiperSlide>
            <SwiperSlide>
              <TestimonialReviews />
            </SwiperSlide>
            <SwiperSlide>
              <TestimonialReviews />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <hr />
    </section>
  );
}

export default Reviews;
