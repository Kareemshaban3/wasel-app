import React from "react";
import image from "./../assets/logo.jpg";

function Hero() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="content_one">
            <div className="row">
              <div className="col-md-8">
                <div className="content_left">
                  <img src={image} alt="image" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="content_right">
                  <h2>اطمع , تعلم , تقدم.</h2>
                  <p>
                    اختيار أفضل المواد لمنزلك — بجانب الطلاء والكسوة، هناك
                    تشطيبات داخلية أخرى يمكن أن تعزز مظهر ووظيفة منزلك.
                  </p>
                  <button className="bUnifier">اكتشف المزيد</button>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="content_tow">
          

            <div className="feature">
              <div className="journey__icon">
                  <i className="fa-solid fa-award" />
              </div>
                <h3>احصل على شهادة</h3>
                <p>لتعزز فرصك في إطلاق مسيرتك المهنية أو تطويرها.</p>
            </div>


            <div className="feature">
              <div className="journey__icon">
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <h3>تعلّم</h3>
              <p>مع أكثر المدرسين كفاءة لتحصل على مهاراتك المهنية والعملية.</p>
            </div>

            <div className="feature">
              <div className="journey__icon">
                <i className="fa-solid fa-user-plus" />
              </div>
              <h3>التحق</h3>
              <p>بأحد البرامج لتنضم إلى مجتمع من المتعلمين الراغبين بالتطور.</p>
            </div>

            <div className="feature">
              <div className="journey__icon">
                <i className="fa-solid fa-telescope" />
              </div>
              <h3>اكتشف</h3>
              <p>مجموعة كبيرة ومتنوعة من أكثر الدورات والتخصصات كفاءة وجودة.</p>
            </div>

            <div className="feature">
              <h2>
                من هنا تبدأ رحلتك
                <br />
                من العلم إلى
                <br />
                العمل
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
