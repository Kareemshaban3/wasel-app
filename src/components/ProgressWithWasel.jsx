import React from "react";

export default function ProgressWithWasel() {
  return (
    <section className="progress-with-wasel" dir="rtl">
      <div className="container">
        <h2 className="progress-with-wasel__title">تقدّم مع واصل</h2>

        <p className="progress-with-wasel__desc">
          انضم إلى مجتمع متعلمّي واصل لتحدث نقلة نوعية في مسيرتك المهنية من خلال
          البرامج المصممة لتزويدك بالمهارات التي تحتاجها لاستكشاف طاقاتك وإمكاناتك
          الذاتية. واختر بين التعلم المرن والتعلم التفاعلي.
        </p>

        <div className="progress-with-wasel__features">
          <div className="pww-card">
            <div className="pww-card__icon">
              <i className="fa-solid fa-chalkboard-user" />
            </div>
            <h3 className="pww-card__title">التعلم التفاعلي</h3>
            <p className="pww-card__text">
              اكتسب المهارات المطلوبة مع نخبة من أفضل الخبراء والمدربين.
            </p>
          </div>

          <div className="pww-card">
            <div className="pww-card__icon">
              <i className="fa-solid fa-wifi" />
            </div>
            <h3 className="pww-card__title">التعلم المرن</h3>
            <p className="pww-card__text">
              أحد البرامج لتنضم إلى مجتمع من المتخصصين الراغبين بالتطور مثلك تماماً.
            </p>
          </div>

          <div className="pww-card">
            <div className="pww-card__icon">
              <i className="fa-solid fa-award" />
            </div>
            <h3 className="pww-card__title">محتوى عالي الجودة</h3>
            <p className="pww-card__text">
              تميز في سوق العمل بمهاراتك وشغفك للتعلم والتطور.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
