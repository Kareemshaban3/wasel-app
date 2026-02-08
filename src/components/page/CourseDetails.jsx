import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addToCart, getCourse, getCart } from "../../services/api";
import toast from "react-hot-toast";

export default function CourseDetails() {
  const [tab, setTab] = useState("desc");
  const [type, setType] = useState("online");
  const [level, setLevel] = useState("beginner");
  const [expanded, setExpanded] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ منع الإضافة مرة تانية + منع ضغطات متتالية
  const [inCart, setInCart] = useState(false);
  const [adding, setAdding] = useState(false);

  // ✅ جلب بيانات الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await getCourse(id);
        const item = res.data?.data ?? res.data;
        setCourse(item);
      } catch (e) {
        setCourse(null);
        toast.error("تعذر تحميل بيانات الكورس");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ✅ فحص هل الكورس موجود بالفعل في السلة (حتى بعد ريفريش)
  useEffect(() => {
    let mounted = true;

    const checkInCart = async () => {
      const token = user?.token || localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getCart();
        const items = res?.data?.items ?? [];

        const found = items.some(
          (it) => it?.type === "course" && String(it?.id) === String(id)
        );

        if (mounted) setInCart(found);
      } catch (e) {}
    };

    checkInCart();
    return () => {
      mounted = false;
    };
  }, [id, user]);

  // ✅ خلي type يتظبط من بيانات الباك (أونلاين/أوفلاين)
  useEffect(() => {
    if (!course) return;
    if (course.type === "أوفلاين") setType("offline");
    else setType("online");
  }, [course]);

  const ctaText = useMemo(() => {
    if (inCart) return "موجود في السلة ✅";
    if (type === "online") return "إضافة إلى السلة";
    return "انضم الآن";
  }, [type, inCart]);

  const handleCTA = async () => {
    if (adding) return;

    if (inCart) {
      toast("الكورس موجود بالفعل في السلة 🛒", { icon: "ℹ️" });
      return;
    }

    if (!user) {
      toast("سجّل الدخول أولاً", { icon: "🔒" });
      navigate("/login");
      return;
    }

    if (!course?.id) {
      toast.error("بيانات الكورس غير مكتملة");
      return;
    }

    if (type === "offline") {
      setPayModalOpen(true);
      return;
    }

    setAdding(true);
    const tId = toast.loading("جارٍ الإضافة إلى السلة...");
    try {
      await addToCart({
        type: "course",
        id: course.id,
        item_id: course.id,
        course_id: course.id,
      });

      setInCart(true);
      toast.success("تمت الإضافة إلى السلة ✅", { id: tId });
    } catch (e) {
      toast.error("حدث خطأ أثناء الإضافة للسلة", { id: tId });
    } finally {
      setAdding(false);
    }
  };

  const handlePayOnline = () => {
    toast("الدفع أونلاين (قريباً) 💳", { icon: "✨" });
    setPayModalOpen(false);
  };

  const handlePayLater = () => {
    toast.success("تم اختيار الدفع لاحقاً ✅");
    setPayModalOpen(false);
  };

  const imageSrc =
    course?.image_url ||
    (course?.image ? `http://127.0.0.1:8000/storage/${course.image}` : "");

  const renderTabContent = () => {
    if (tab === "desc") {
      return (
        <>
          <h1 className="course-details__title">{course.name}</h1>
          <h3 className="course-details__sub">وصف الكورس</h3>

          <div className={`course-details__text ${expanded ? "is-open" : ""}`}>
            <p>{course.description}</p>
          </div>

          <div className="course-details__moreRow">
            <button
              type="button"
              className="course-details__moreBtn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "عرض أقل" : "عرض المزيد"}
            </button>
          </div>
        </>
      );
    }

    if (tab === "learn") {
      return (
        <>
          <h1 className="course-details__title">{course.name}</h1>
          <h3 className="course-details__sub">ماذا ستتعلم</h3>
          <ul className="course-details__list">
            <li>—</li>
          </ul>
        </>
      );
    }

    if (tab === "plan") {
      return (
        <>
          <h1 className="course-details__title">{course.name}</h1>
          <h3 className="course-details__sub">الخطة الدراسية</h3>
          <div className="course-details__plan">
            <div className="course-details__planItem">
              <span>الأسبوع 1</span>
              <p>—</p>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h1 className="course-details__title">{course.name}</h1>
        <h3 className="course-details__sub">مدرب البرنامج</h3>
        <div className="course-details__trainer">
          <img src="https://i.pravatar.cc/120?img=5" alt="" />
          <div>
            <h4>—</h4>
            <p>—</p>
          </div>
        </div>
      </>
    );
  };

  if (loading) return <p className="Loading"> <span /> </p>;
  if (!course) return <p>Not found</p>;

  return (
    <section className="course-details" dir="rtl">
      <div className="course-details__tabs">
        <div className="container">
          <div className="course-details__tabsRow">
            <button
              className={`course-details__tab ${tab === "desc" ? "is-active" : ""}`}
              onClick={() => setTab("desc")}
              type="button"
            >
              الوصف
            </button>

            <button
              className={`course-details__tab ${tab === "learn" ? "is-active" : ""}`}
              onClick={() => setTab("learn")}
              type="button"
            >
              ماذا ستتعلم
            </button>

            <button
              className={`course-details__tab ${tab === "plan" ? "is-active" : ""}`}
              onClick={() => setTab("plan")}
              type="button"
            >
              الخطة الدراسية
            </button>

            <button
              className={`course-details__tab ${tab === "trainer" ? "is-active" : ""}`}
              onClick={() => setTab("trainer")}
              type="button"
            >
              مدرب البرنامج
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="course-details__grid">
          <aside className="course-details__side">
            <div className="side-card">
              <div className="side-card__media">
                <img src={imageSrc} alt={course.name} />
                <button className="side-card__play" type="button" aria-label="play">
                  <i className="fa-solid fa-play" />
                </button>
              </div>

              <div className="side-card__body">
                <div className="side-card__row">
                  <div className="side-card__label">نوع الدورة :</div>

                  <label className="side-card__radio">
                    <input
                      type="radio"
                      name="type"
                      checked={type === "online"}
                      onChange={() => setType("online")}
                    />
                    <span>اونلاين</span>
                  </label>

                  <label className="side-card__radio">
                    <input
                      type="radio"
                      name="type"
                      checked={type === "offline"}
                      onChange={() => setType("offline")}
                    />
                    <span>اوفلاين</span>
                  </label>
                </div>

                <div className="side-card__row side-card__row--col">
                  <div className="side-card__label">درجة الصعوبة</div>

                  <div className="side-card__levels">
                    <button
                      type="button"
                      className={`side-card__pill ${level === "expert" ? "is-active" : ""}`}
                      onClick={() => setLevel("expert")}
                    >
                      خبير
                    </button>

                    <button
                      type="button"
                      className={`side-card__pill ${level === "medium" ? "is-active" : ""}`}
                      onClick={() => setLevel("medium")}
                    >
                      متوسط
                    </button>

                    <button
                      type="button"
                      className={`side-card__pill ${level === "beginner" ? "is-active" : ""}`}
                      onClick={() => setLevel("beginner")}
                    >
                      مبتدئ
                    </button>
                  </div>
                </div>

                <div className="side-card__meta">
                  <i className="fa-regular fa-clock" />
                  <span>مدة الدورة: {course.time_course}</span>
                </div>

                <div className="side-card__priceBox">
                  <h4 className="side-card__priceTitle">السعر</h4>
                  <p className="side-card__hint">
                    يمكنك دفع خطتك التعليمية بـ 150 جنيه / الشهر أو
                  </p>

                  <div className="side-card__prices">
                    <div className="side-card__disc">—</div>
                    <div className="side-card__old">—</div>
                    <div className="side-card__new">{course.price} LE</div>
                  </div>

                  <div className="side-card__timer">
                    <i className="fa-regular fa-clock" />
                    <span>يوم واحد فقط متبقي على انتهاء العرض</span>
                  </div>
                </div>

                <button
                  className="side-card__cta"
                  type="button"
                  onClick={handleCTA}
                  disabled={inCart || adding}
                  style={
                    inCart || adding
                      ? { opacity: 0.6, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {adding ? "جارٍ الإضافة..." : ctaText}
                </button>
              </div>
            </div>
          </aside>

          <main className="course-details__main">{renderTabContent()}</main>
        </div>
      </div>

      <div className={`pay-modal ${payModalOpen ? "is-open" : ""}`} aria-hidden={!payModalOpen}>
        <div className="pay-modal__backdrop" onClick={() => setPayModalOpen(false)} />

        <div className="pay-modal__dialog" role="dialog" aria-modal="true">
          <button
            className="pay-modal__close"
            type="button"
            aria-label="close"
            onClick={() => setPayModalOpen(false)}
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <h3 className="pay-modal__title">إتمام التسجيل</h3>

          <p className="pay-modal__text">
            عند اختيارك الدفع لاحقاً سيتوجب عليك إتمام الاشتراك بالدفع في أقرب فرع لك
            مع العلم أن الالتحاق بالكورس سيكون بأولوية الدفع (المقاعد محدودة)
          </p>

          <div className="pay-modal__actions">
            <button
              className="pay-modal__btn pay-modal__btn--outline"
              type="button"
              onClick={handlePayLater}
            >
              الدفع لاحقاً
            </button>

            <button
              className="pay-modal__btn pay-modal__btn--solid"
              type="button"
              onClick={handlePayOnline}
            >
              الدفع اونلاين
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
