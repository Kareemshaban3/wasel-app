import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  removeCartItem,
  getFavorites,
  addFavorite,
  removeFavorite,
  checkoutCart,
} from "../../services/api";
import toast from "react-hot-toast";

const toCartItem = (it) => {
  return {
    cartItemId: it?.cart_item_id ?? it?.id,
    type: it?.type,
    itemId: it?.id,
    title: it?.name || "—",
    price: Number(it?.price) || 0,
    img: it?.image_url || "",
  };
};

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const [favs, setFavs] = useState(() => new Set());
  const [favMap, setFavMap] = useState(() => new Map());

  useEffect(() => {
    let mounted = true;

    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) {
          setItems([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await getCart();
        const payload = res?.data ?? {};
        const list = Array.isArray(payload?.items) ? payload.items : [];
        const mapped = list.map(toCartItem);

        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getFavorites();
        const data = res?.data?.items ?? [];

        const map = new Map();
        const set = new Set();

        (Array.isArray(data) ? data : []).forEach((f) => {
          const itemId = f?.id;
          const fid = f?.favorite_id;
          if (itemId != null && fid != null) {
            set.add(itemId);
            map.set(itemId, fid);
          }
        });

        if (mounted) {
          setFavs(set);
          setFavMap(map);
        }
      } catch (e) {}
    };

    fetchCart();
    fetchFavs();

    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.price) || 0), 0),
    [items],
  );
  const tax = useMemo(() => Math.round(subtotal * 0.005), [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const goToDetails = (item) => {
    if (!item?.itemId) return;
    if (item.type === "specialization")
      navigate(`/SpecializationDetails/${item.itemId}`);
    else navigate(`/CourseDetails/${item.itemId}`);
  };

  const removeItem = async (item) => {
    if (!item?.cartItemId) return;
    try {
      await removeCartItem(item.cartItemId);
      setItems((prev) => prev.filter((x) => x.cartItemId !== item.cartItemId));
    } catch (e) {
      console.log(e);
    }
  };


  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("لازم تسجل دخول الأول");
      navigate("/login");
      return;
    }

    if (!items.length) {
      toast.error("السلة فاضية");
      return;
    }

    try {
      setCheckingOut(true);

      const res = await checkoutCart(); 
      const order = res?.data?.order ?? null;
      const orderId = order?.id;

      toast.success("تم إنشاء الطلب بنجاح ✅");

      setItems([]);

      if (orderId) {
        navigate(`/payment/${orderId}`);
      } else {
        toast.error("مش قادر أجيب رقم الطلب");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "حصل خطأ أثناء إنشاء الطلب";
      toast.error(msg);
      console.log(err?.response?.data || err?.message || err);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <section className="cart" dir="rtl">
      <div className="container">
        <div className="cart__top">
          <div className="cart__crumbs">
            <Link className="cart__link" to="/">
              الرئيسية
            </Link>
            <span className="cart__sep">{"<"}</span>
            <span className="cart__link">العربة</span>
          </div>

          <h1 className="cart__title">العربة</h1>

          <div className="cart__count">
            <h6>
              عدد العناصر في العربة : <b>{items.length}</b>
            </h6>
            <p>إضافة المزيد</p>
          </div>
        </div>

        <div className="cart__grid">
          <main className="cart__list">
            {loading ? (
              <div className="Loading">
                <span />
              </div>
            ) : (
              items.map((it) => (
                <article className="cart__item" key={it.cartItemId}>
                  <div
                    className="cart__thumb"
                    style={{ cursor: "pointer" }}
                    onClick={() => goToDetails(it)}
                    title="تفاصيل"
                  >
                    <img src={it.img} alt={it.title} />
                    <span className="cart__level">
                      {it.type === "specialization" ? "تخصص" : "كورس"}
                    </span>
                  </div>

                  <button
                    className="cart__remove"
                    type="button"
                    onClick={() => removeItem(it)}
                    aria-label="remove"
                    title="حذف"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>

                  <div className="cart__info">
                    <div className="cart__nameRow">
                      <i className="fa-solid fa-brain cart__icon" />
                      <h3
                        className="cart__name"
                        style={{ cursor: "pointer" }}
                        onClick={() => goToDetails(it)}
                        title="تفاصيل"
                      >
                        {it.title}
                      </h3>
                    </div>

                    <div className="cart__bottomRow">
                      <div className="cart__price">{it.price} LE</div>
                      <div className="cart__rate">
                        <i className="fa-solid fa-star" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </main>

          <aside className="cart__side">
            <div className="cart__summary">
              <h3 className="cart__sumTitle">مجموع العربة</h3>

              <div className="cart__sumBox">
                <div className="cart__sumRow">
                  <span>المجموع الفرعي</span>
                  <b>{subtotal} LE</b>
                </div>
                <div className="cart__sumRow">
                  <span>الضريبة</span>
                  <b>{tax} LE</b>
                </div>
                <div className="cart__sumRow cart__sumRow--total">
                  <span>المجموع الكلي</span>
                  <b>{total} LE</b>
                </div>
              </div>

              <button
                className="cart__checkout"
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || loading || items.length === 0}
              >
                {checkingOut ? "جارٍ إنشاء الطلب..." : "إتمام الشراء"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
