import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCardSkills({ item, isFav, onToggleFav }) {
  const navigate = useNavigate();

  const data = item || {};
  const id = data.id;

  const title = data.name || "—";
  const duration = data.time_course || data.duration || "—";
  const type = data.type || "—";
  const views = data.views ?? 0;
  const price = data.price ?? 0;

  const imageSrc =
    data.image_url || (data.image ? `http://127.0.0.1:8000/storage/${data.image}` : "");

  const active = isFav?.("specialization", id);

  const goToDetails = () => {
    if (!id) return;
    navigate(`/SpecializationDetails/${id}`);
  };

  const onHeartClick = async (e) => {
    e.stopPropagation();
    if (!id) return;
    await onToggleFav?.("specialization", id);
  };

  return (
    <div className="pc-card pc-card--skills" dir="rtl" onClick={goToDetails} style={{ cursor: "pointer" }}>
      <div className="pc-card__media">
        <img src={imageSrc} alt={title} />

        <button
          className={`pc-card__fav ${active ? "is-active" : ""}`}
          type="button"
          aria-label="favorite"
          onClick={onHeartClick}
          title="مفضلة"
        >
          <i className={`${active ? "fa-solid" : "fa-regular"} fa-heart`} />
        </button>
      </div>

      <div className="pc-card__body">
        <div className="pc-card__top">
          <div className="pc-card__titleWrap">
            <div className="pc-card__titleRow">
              <h3 className="pc-card__title">{title}</h3>
              <div className="pc-card__badgeIcon">
                <i className="fa-solid fa-chart-line" />
              </div>
            </div>

            <div className="pc-card__meta">
              <div className="pc-card__row">
                <i className="fa-regular fa-clock" />
                <span>مدة التخصص . {duration}</span>
              </div>

              <div className="pc-card__row">
                <i className="fa-solid fa-graduation-cap" />
                <span>نوع التخصص . {type}</span>
              </div>
            </div>

            <div className="pc-card__views">
              <i className="fa-regular fa-eye" />
              <span>{views}</span>
            </div>
          </div>
        </div>

        <div className="pc-card__footer pc-card__footer--skills">
          <button className="pc-card__btn" type="button">
            تخصص
          </button>
          <div className="pc-card__price">{price} LE</div>
        </div>
      </div>
    </div>
  );
}
