import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import PopularCourseCard from "../ui/PopularCourseCard";
import { getCourses, getFavorites } from "../services/api";
import useFavorites from './../hooks/useFavorites';
import { Link } from "react-router-dom";

export default function PopularCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favMap, setFavMap] = useState(new Map());

  const { isFav, toggleFav, loadingFavs } = useFavorites();

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        const res = await getCourses({ per_page: 12 });
        const items = res.data?.data ?? res.data;
        if (mounted) setCourses(items || []);
      } catch (e) {
        // no-op
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getFavorites();
        const data = res?.data?.data ?? res?.data ?? [];
        const map = new Map();
        (Array.isArray(data) ? data : []).forEach((f) => {
          const course = f?.course || f?.item || f;
          const id = course?.id ?? f?.item_id ?? f?.course_id;
          if (id != null) map.set(id, f?.id ?? f?.favorite_id ?? id);
        });
        if (mounted) setFavMap(map);
      } catch (e) {
        // no-op
      }
    };

    fetchCourses();
    fetchFavs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="popular-courses" dir="rtl">
      <div className="container">
        <div className="popular-courses__header">
          <div className="popular-courses__headText">
            <h2 className="popular-courses__title">الدورات الأكثر طلباً</h2>
            <p className="popular-courses__desc">
              اختر من أحد هذه الدورات لتطوير مهاراتك في مجالات مختلفة.
            </p>
            <br />
            <button   className="popular-courses__cta bUnifier" type="button">
              <Link to="/AllRoundabouts" >
              تصفح الدورات
              </Link>
            </button>
          </div>
        </div>

        <div className="skills_slider">
          {loading ? (
            <p className="Loading" >  <span /> </p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={18}
              slidesPerView={3}
              breakpoints={{
                0: { slidesPerView: 1.1, spaceBetween: 14 },
                576: { slidesPerView: 2, spaceBetween: 16 },
                992: { slidesPerView: 3, spaceBetween: 18 },
              }}
              className="popular-courses__slider"
            >
              {courses.map((course) => (
                <SwiperSlide key={course.id}>
                  <PopularCourseCard
                    course={course}
                    isFav={isFav}
                    onToggleFav={toggleFav}
                    loadingFavs={loadingFavs}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <hr />
    </section>
  );
}
