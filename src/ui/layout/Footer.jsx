import React from "react";

export default function Footer() {
  return (
    <footer className="footer" dir="rtl">
      <div className="container">
        <div className="footer__topLine" />

        <div className="footer__grid">
        
          <div className="footer__col">
            <h4 className="footer__heading">عن واصل</h4>

            <ul className="footer__links">
              <li><a href="#">كيف تتعلم مع واصل</a></li>
              <li><a href="#">شروط الخدمة</a></li>
              <li><a href="#">سياسة الخصوصية</a></li>
              <li><a href="#">اتفاقية تحليل البيانات</a></li>
              <li><a href="#">سياسة ملفات الارتباط</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">المزيد</h4>

            <ul className="footer__links">
              <li><a href="#">منصة التعليم المدرسي</a></li>
              <li><a href="#">بودكاست واصل</a></li>
              <li><a href="#">المدونة</a></li>
              <li><a href="#">مركز المساعدة</a></li>
              <li><a href="#">تابعنا</a></li>
            </ul>

            <div className="footer__social">
              <a className="footer__socialBtn" href="#" aria-label="youtube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a className="footer__socialBtn" href="#" aria-label="linkedin">
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a className="footer__socialBtn" href="#" aria-label="google">
                <i className="fa-brands fa-google" />
              </a>
              <a className="footer__socialBtn" href="#" aria-label="twitter">
                <i className="fa-brands fa-twitter" />
              </a>
              <a className="footer__socialBtn" href="#" aria-label="facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a className="footer__socialBtn" href="#" aria-label="instagram">
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>

        

            <div className="footer__col footer__col--contact">
            <h4 className="footer__heading">تواصل معنا</h4>

            <ul className="footer__list">
              <li className="footer__item">
                <i className="fa-solid fa-location-dot" />
                <span>فرع القاهرة</span>
              </li>

              <li className="footer__item">
                <i className="fa-solid fa-location-dot" />
                <span>فرع الإسكندرية</span>
              </li>

              <li className="footer__item">
                <i className="fa-solid fa-phone" />
                <span dir="ltr">518-720-6230</span>
              </li>

              <li className="footer__item">
                <i className="fa-regular fa-envelope" />
                <span dir="ltr">wassel@gmail.com</span>
              </li>

              <li className="footer__item">
                <i className="fa-solid fa-globe" />
                <span dir="ltr">www.wassel.com</span>
              </li>
            </ul>

            <div className="footer__brand">
              <div className="footer__logoText">واصل</div>
              <div className="footer__logoMark" aria-hidden="true">
                <span className="m1" />
                <span className="m2" />
                <span className="m3" />
                <span className="m4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
