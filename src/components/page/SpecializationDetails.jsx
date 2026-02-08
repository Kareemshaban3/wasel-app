import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  addToCart,
  addFavorite,
  getSpecialization,
  removeFavorite,
  getFavorites,
  getCart,
} from "../../services/api";
import toast from "react-hot-toast";

export default function SpecializationDetails() {
  const [tab, setTab] = useState("desc");
  const [expanded, setExpanded] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  const [favId, setFavId] = useState(null);

  // ✅ منع الإضافة مرة تانية + منع ضغطات متتالية
  const [inCart, setInCart] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchSpec = async () => {
      setLoading(true);
      try {
        const res = await getSpecialization(id);
        const item = res?.data?.data ?? res?.data ?? null;
        if (mounted) setSpec(item);
      } catch (e) {
        if (mounted) setSpec(null);
        toast.error("تعذر تحميل بيانات التخصص");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSpec();
    return () => {
      mounted = false;
    };
  }, [id]);

  // ✅ فحص هل التخصص موجود بالفعل في السلة (حتى بعد ريفريش)
  useEffect(() => {
    let mounted = true;

    const checkInCart = async () => {
      const token = user?.token || localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getCart();
        const items = res?.data?.items ?? [];

        const found = items.some(
          (it) => it?.type === "specialization" && String(it?.id) === String(id)
        );

        if (mounted) setInCart(found);
      } catch (e) {
        // لو فشلنا نفحص السلة، ما نعطلش الزر
      }
    };

    checkInCart();
    return () => {
      mounted = false;
    };
  }, [id, user]);

  useEffect(() => {
    let mounted = true;
    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getFavorites();
        const data = res?.data?.items ?? [];
        let found = null;

        (Array.isArray(data) ? data : []).forEach((f) => {
          if (String(f?.id) === String(id) && f?.type === "specialization") {
            found = f?.favorite_id ?? null;
          }
        });

        if (mounted) setFavId(found);
      } catch (e) {}
    };
    fetchFavs();
    return () => {
      mounted = false;
    };
  }, [id]);

  const imageSrc =
    spec?.image_url ||
    (spec?.image ? `http://127.0.0.1:8000/storage/${spec.image}` : "") ||
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg";

  const isFree = useMemo(() => {
    if (!spec) return false;
    return spec.type === "free" || Number(spec.price) === 0;
  }, [spec]);

  const ctaText = useMemo(() => {
    if (inCart) return "موجود في السلة ✅";
    if (isFree) return "مجاني";
    return "إضافة إلى السلة";
  }, [isFree, inCart]);

  const handleAddToCart = async () => {
    if (adding) return;

    if (inCart) {
      toast("التخصص موجود بالفعل في السلة 🛒", { icon: "ℹ️" });
      return;
    }

    if (!spec?.id) {
      toast.error("بيانات التخصص غير مكتملة");
      return;
    }

    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      toast("سجّل الدخول أولاً", { icon: "🔒" });
      navigate("/login");
      return;
    }

    if (isFree) {
      toast("هذا التخصص مجاني ✅", { icon: "🎁" });
      return;
    }

    setAdding(true);
    const tId = toast.loading("جارٍ الإضافة إلى السلة...");
    try {
      await addToCart({ type: "specialization", id: spec.id });
      setInCart(true);
      toast.success("تمت الإضافة إلى السلة ✅", { id: tId });
    } catch (e) {
      toast.error("حدث خطأ أثناء الإضافة للسلة", { id: tId });
    } finally {
      setAdding(false);
    }
  };

  const toggleFavorite = async () => {
    if (!spec?.id) return;

    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      toast("سجّل الدخول أولاً", { icon: "🔒" });
      navigate("/login");
      return;
    }

    const tId = toast.loading("جارٍ تحديث المفضلة...");
    try {
      if (favId) {
        await removeFavorite(favId);
        setFavId(null);
        toast.success("تمت الإزالة من المفضلة ❤️", { id: tId });
      } else {
        const res = await addFavorite({ type: "specialization", id: spec.id });
        const favItem = res?.data?.item ?? null;
        setFavId(favItem?.favorite_id ?? null);
        toast.success("تمت الإضافة للمفضلة ⭐", { id: tId });
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء تحديث المفضلة", { id: tId });
    }
  };

  const renderTabContent = () => {
    if (tab === "desc") {
      return (
        <>
          <h1 className="course-details__title">{spec.name}</h1>
          <h3 className="course-details__sub">وصف التخصص</h3>

          <div className={`course-details__text ${expanded ? "is-open" : ""}`}>
            <p>{spec.description}</p>
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
          <h1 className="course-details__title">{spec.name}</h1>
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
          <h1 className="course-details__title">{spec.name}</h1>
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
        <h1 className="course-details__title">{spec.name}</h1>
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

  if (loading) return <p className="Loading"> <span /></p>;
  if (!spec) return <p>Not found</p>;

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
                <img src={imageSrc} alt={spec.name} />
                <button className="side-card__play" type="button" aria-label="play">
                  <i className="fa-solid fa-play" />
                </button>
              </div>

              <div className="side-card__body">
                <div className="side-card__meta">
                  <i className="fa-regular fa-clock" />
                  <span>مدة التخصص: {spec.time_course}</span>
                </div>

                <div className="side-card__priceBox">
                  <h4 className="side-card__priceTitle">السعر</h4>
                  <div className="side-card__prices">
                    <div className="side-card__new">{Number(spec.price) || 0} LE</div>
                  </div>
                </div>

                <button
                  className="side-card__cta"
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isFree || inCart || adding}
                  style={
                    isFree || inCart || adding
                      ? { opacity: 0.6, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {adding ? "جارٍ الإضافة..." : ctaText}
                </button>

                <button
                  type="button"
                  onClick={toggleFavorite}
                  style={{ marginTop: 10 }}
                  className="side-card__cta"
                >
                  {favId ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                </button>
              </div>
            </div>
          </aside>

          <main className="course-details__main">{renderTabContent()}</main>
        </div>
      </div>
    </section>
  );
}
