import React, { useEffect, useState } from "react";
import Categories from "../Categories";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CourseCardSkills from "../../ui/CourseCardSkills";
import { Link, useNavigate } from "react-router-dom";
import PopularCourseCard from "../../ui/PopularCourseCard";
import {
  getCategoryCourses,
  getCategorySpecializations,
  getCourses,
  getSpecializations,
} from "../../services/api";

import "swiper/css";
import "swiper/css/navigation";

import useFavorites from "../../hooks/useFavorites";

const parsePaginated = (payload) => {
  // wrapped: { data: { data:[...], last_page } }
  if (payload?.data && Array.isArray(payload.data?.data)) {
    return { items: payload.data.data, lastPage: Number(payload.data.last_page || 1) || 1 };
  }
  // direct paginator: { data:[...], last_page }
  if (payload && Array.isArray(payload.data)) {
    return { items: payload.data, lastPage: Number(payload.last_page || 1) || 1 };
  }
  if (Array.isArray(payload)) return { items: payload, lastPage: 1 };
  return { items: [], lastPage: 1 };
};

function Browse() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  const [specializations, setSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const { isFav, toggleFav } = useFavorites();

  const onToggleFav = async (type, id) => {
    const res = await toggleFav(type, id);
    if (res?.needsLogin) navigate("/login");
  };

  useEffect(() => {
    let mounted = true;

    const fetchSpecs = async () => {
      setLoadingSpecs(true);
      try {
        const res = category?.id
          ? await getCategorySpecializations(category.id, { per_page: 12 })
          : await getSpecializations({ per_page: 12 });

        const payload = res?.data ?? {};
        const { items } = parsePaginated(payload);

        if (mounted) setSpecializations(Array.isArray(items) ? items : []);
      } catch (e) {
        if (mounted) setSpecializations([]);
      } finally {
        if (mounted) setLoadingSpecs(false);
      }
    };

    fetchSpecs();
    return () => {
      mounted = false;
    };
  }, [category]);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = category?.id
          ? await getCategoryCourses(category.id, { per_page: 12 })
          : await getCourses({ per_page: 12 });

        const payload = res?.data ?? {};
        const { items } = parsePaginated(payload);

        if (mounted) setCourses(Array.isArray(items) ? items : []);
      } catch (e) {
        if (mounted) setCourses([]);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, [category]);

  return (
    <section className="browse">
      <Categories onSelect={setCategory} />

      <div className="top__title">
        <h2>التخصصات</h2>
        <Link to="/AllSpecializations">عرض الكل</Link>
      </div>

      <div className="container">
        <div className="skills_slider" dir="rtl">
          {loadingSpecs ? (
            <p className="Loading">  <span /> </p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={18}
              slidesPerView={3}
              breakpoints={{
                0: { slidesPerView: 1.1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
            >
              {specializations.map((sp) => (
                <SwiperSlide key={sp.id ?? sp.name}>
                  <CourseCardSkills item={sp} isFav={isFav} onToggleFav={onToggleFav} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <div className="top__title">
        <h2>الدورات</h2>
        <Link to="/AllRoundabouts">عرض الكل</Link>
      </div>

      <div className="container">
        <div className="skills_slider">
          {loadingCourses ? (
            <p className="Loading">  <span /></p>
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
                <SwiperSlide key={course.id ?? course.name}>
                  <PopularCourseCard course={course} isFav={isFav} onToggleFav={onToggleFav} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}

export default Browse;
