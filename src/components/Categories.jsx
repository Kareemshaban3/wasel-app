import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { getCategories } from "../services/api";

export default function Categories({ onSelect }) {
  const [active, setActive] = useState("all");

  const fallbackItems = [
    { id: "all", label: "عرض الكل", icon: "fa-solid fa-border-all", isAll: true, isFallback: true },
    { id: "ai", label: "الذكاء الاصطناعي", icon: "fa-solid fa-brain", isFallback: true },
    { id: "design", label: "التصميم", icon: "fa-regular fa-lightbulb", isFallback: true },
    { id: "self", label: "تطوير الذات", icon: "fa-solid fa-user-tie", isFallback: true },
    { id: "lang", label: "اللغات", icon: "fa-solid fa-globe", isFallback: true },
  ];
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    let mounted = true;
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((c) => ({
          id: c.id ?? c.slug ?? c.name,
          label: c.name ?? c.title ?? c.label ?? String(c.id ?? ""),
          icon: c.icon || "fa-solid fa-folder",
          isFallback: false,
        }));
        if (mounted) setItems([fallbackItems[0], ...mapped]);
      } catch (e) {
        // keep fallback
      }
    };
    fetchCats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="cats" dir="rtl">
      <div className="container">
        <div className="cats__head">
          <h2 className="cats__title">الفئات</h2>
        </div>

        <div className="cats__sliderWrap">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={18}
            slidesPerView={5}
            breakpoints={{
              0: { slidesPerView: 2.2, spaceBetween: 12 },
              576: { slidesPerView: 3.2, spaceBetween: 14 },
              992: { slidesPerView: 5, spaceBetween: 18 },
            }}
            className="cats__slider"
          >
            {items.map((it) => (
              <SwiperSlide key={it.id}>
                <button
                  type="button"
                  className={`cats__item ${active === it.id ? "is-active" : ""} ${
                    it.isAll ? "cats__item--all" : ""
                  }`}
                  onClick={() => {
                    setActive(it.id);
                    if (it.isAll) onSelect?.(null);
                    else if (!it.isFallback) onSelect?.(it);
                  }}
                >
                  <i className={`cats__icon ${it.icon}`} />
                  <span className="cats__text">{it.label}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
