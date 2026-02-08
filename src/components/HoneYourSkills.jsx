import React, { useEffect, useState } from "react";
import CourseCardSkills from "../ui/CourseCardSkills";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getSpecializations } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import useFavorites from "../hooks/useFavorites";

const parsePaginated = (payload) => {
  if (payload?.data && Array.isArray(payload.data?.data))
    return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

function HoneYourSkills() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isFav, toggleFav } = useFavorites();

  const onToggleFav = async (type, id) => {
    const res = await toggleFav(type, id);
    if (res?.needsLogin) navigate("/login");
  };

  useEffect(() => {
    let mounted = true;

    const fetchSpecs = async () => {
      setLoading(true);
      try {
        const res = await getSpecializations({ per_page: 12 });
        const payload = res?.data ?? {};
        const list = parsePaginated(payload);

        if (mounted) setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSpecs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="HoneYourSkills">
        <div className="container">
          <div className="content_header">
            <h2>اصقل مهاراتك العملية مع تخصصات واصل</h2>
            <br />
            <p>
              طوّر مهاراتك العملية مع مجموعة من التخصصات المتنوعة التي تقدمها
              واصل
            </p>
            <br />
            <button className="bUnifier" type="button">
              <Link to="/AllSpecializations">تصفح التخصصات</Link>
            </button>
          </div>

          <div className="skills_slider" dir="rtl">
            {loading ? (
              <p className="Loading">
                <span />
              </p>
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
                {items.map((sp) => (
                  <SwiperSlide key={sp.id ?? sp.name}>
                    <CourseCardSkills
                      item={sp}
                      isFav={isFav}
                      onToggleFav={onToggleFav}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>
      <hr />
    </>
  );
}

export default HoneYourSkills;
