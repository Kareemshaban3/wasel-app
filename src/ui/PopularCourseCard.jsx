import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PopularCourseCard({
  course,
  isFav,
  onToggleFav,
  loadingFavs = false, // ✅ جديد (اختياري)
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const courseId = course?.id;

  const imageSrc = useMemo(() => {
    return (
      course?.image_url ||
      (course?.image ? `http://127.0.0.1:8000/storage/${course.image}` : "") ||
      "https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg"
    );
  }, [course]);

  const active = !!(isFav && courseId && isFav("course", courseId));

  const goToDetails = () => {
    if (!courseId) return;
    navigate(`/CourseDetails/${courseId}`);
  };

  const onHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseId) return;

    // ✅ لو hooks مش متوصلة
    if (!onToggleFav) return;

    // ✅ منع ضغط متكرر
    if (busy || loadingFavs) return;

    setBusy(true);
    try {
      const res = await onToggleFav("course", courseId);

      // ✅ لو محتاج login
      if (res?.needsLogin) navigate("/login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pc-card" dir="rtl" onClick={goToDetails} style={{ cursor: "pointer" }}>
      <div className="pc-card__media">
        <img src={imageSrc} alt={course?.name || "course"} />

        <button
          className={`pc-card__fav ${active ? "is-active" : ""}`}
          type="button"
          aria-label="favorite"
          onClick={onHeartClick}
          title="مفضلة"
          disabled={busy || loadingFavs}
        >
          <i className={`${active ? "fa-solid" : "fa-regular"} fa-heart`} />
        </button>
      </div>

      <div className="pc-card__body">
        <div className="pc-card__level">{course?.level}</div>

        <div className="pc-card__titleRow">
          <h3 className="pc-card__title">{course?.name}</h3>
          <div className="pc-card__titleIcon">
            <i className="fa-solid fa-brain" />
          </div>
        </div>

        <div className="pc-card__rows">
          <div className="pc-card__row">
            <i className="fa-regular fa-clock" />
            <span>مدة الدورة: {course?.time_course}</span>
          </div>

          <div className="pc-card__row pc-card__row--between">
            <div className="pc-card__left">
              <i className="fa-regular fa-window-restore" />
              <span>نوع الدورة: {course?.type}</span>
            </div>

            <div className="pc-card__views">
              <i className="fa-regular fa-eye" />
              <span>{course?.views ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="pc-card__footer">
          <div className="pc-card__price">{course?.price} LE</div>
          <div className="pc-card__rate">
            <i className="fa-solid fa-star" />
            <span>{course?.rate ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
