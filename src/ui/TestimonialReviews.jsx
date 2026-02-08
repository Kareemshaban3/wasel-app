import React from "react";

function TestimonialReviews() {
  return (
    <div className="testimonial-card" dir="rtl">
      <p className="testimonial-card__text">
        “Teachings of the great explore of truth the master-builder of human
        happiness”
      </p>

      <div className="testimonial-user">
        <img className="testimonial-user__img" src="https://i.pravatar.cc/60?img=1" alt="" />
        <div className="testimonial-user__info">
          <h4 className="testimonial-user__name">Finlay Kirk</h4>
          <span className="testimonial-user__job">Web Developer</span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialReviews;
