import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cancelOrder, getOrder } from "../../../services/api";
import toast from "react-hot-toast";

export default function Payment() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // ✅ FIX: useState بدل State
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);
  const [payMethod, setPayMethod] = useState("card");
  const [canceling, setCanceling] = useState(false);

  // ✅ Modal state بدل confirm
  const [openCancel, setOpenCancel] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const res = await getOrder(orderId);
        const data = res?.data?.data ?? res?.data?.order ?? res?.data ?? null;
        if (mounted) setOrder(data);
      } catch (e) {
        console.log(e?.response?.data || e?.message || e);
        if (mounted) setOrder(null);
        toast.error("تعذر تحميل بيانات الطلب");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      mounted = false;
    };
  }, [orderId, navigate]);

  const subtotal = useMemo(() => Number(order?.subtotal ?? 0) || 0, [order]);
  const tax = useMemo(() => Number(order?.tax ?? 0) || 0, [order]);
  const total = useMemo(
    () => Number(order?.total ?? subtotal + tax) || 0,
    [order, subtotal, tax]
  );

  const doCancel = async () => {
    if (!order?.id) return;

    try {
      setCanceling(true);
      await cancelOrder(order.id);

      toast.success("تم إلغاء الطلب ✅");
      setOpenCancel(false);
      navigate("/cart");
    } catch (e) {
      console.log(e?.response?.data || e?.message || e);
      toast.error(e?.response?.data?.message || "فشل إلغاء الطلب");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <section className="pay" dir="rtl">
        <div className="container">
          <div className="Loading">
            <span />
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="pay" dir="rtl">
        <div className="container">
          <p>الطلب غير موجود</p>
          <Link to="/cart">العودة للسلة</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pay" dir="rtl">
      <div className="container">
        <div className="pay__crumbs">
          <Link className="pay__link" to="/">
            الرئيسية
          </Link>
          <span className="pay__sep">{"<"}</span>
          <Link className="pay__link" to="/cart">
            العربة
          </Link>
          <span className="pay__sep">{"<"}</span>
          <span className="pay__link">الدفع</span>
        </div>

        <h1 className="pay__title">طريقة الدفع اونلاين</h1>

        <div className="pay__grid">
          <div className="pay__panel">
            <div className="pay__tabs">
              <button
                type="button"
                className={`pay__tab ${payMethod === "card" ? "is-active" : ""}`}
                onClick={() => setPayMethod("card")}
              >
                <i className="fa-regular fa-credit-card" /> كارت بنكي
              </button>

              <button
                type="button"
                className={`pay__tab ${payMethod === "installment" ? "is-active" : ""}`}
                onClick={() => setPayMethod("installment")}
              >
                <i className="fa-solid fa-wallet" /> بالتقسيط
              </button>
            </div>

            <div className="pay__form">
              <div className="pay__row">
                <label className="pay__label">نوع الكارت</label>
                <select className="pay__input">
                  <option>VISA</option>
                  <option>MasterCard</option>
                </select>
              </div>

              <div className="pay__row">
                <label className="pay__label">رقم الكارت</label>
                <input className="pay__input" placeholder="0000 0000 0000 0000" />
              </div>

              <div className="pay__row">
                <label className="pay__label">اسم حامل الكارت</label>
                <input className="pay__input" placeholder="الاسم بالكامل" />
              </div>

              <div className="pay__row pay__row--two">
                <div>
                  <label className="pay__label">CVV</label>
                  <input className="pay__input" placeholder="123" />
                </div>

                <div>
                  <label className="pay__label">تاريخ الانتهاء</label>
                  <input className="pay__input" placeholder="MM/YY" />
                </div>
              </div>

              <button
                className="pay__confirm"
                type="button"
                onClick={() => toast.success("تم التأكيد (تجريبي) ✅")}
              >
                تأكيد
              </button>

              <button
                className="pay__cancel"
                type="button"
                onClick={() => setOpenCancel(true)}
                disabled={canceling}
              >
                إلغاء الطلب
              </button>
            </div>
          </div>

          <aside className="pay__summary">
            <h3 className="pay__sumTitle">ملخص الطلب</h3>

            <div className="pay__sumBox">
              <div className="pay__sumRow">
                <span>المجموع الفرعي</span>
                <b>{subtotal} LE</b>
              </div>
              <div className="pay__sumRow">
                <span>الضريبة</span>
                <b>{tax} LE</b>
              </div>
              <div className="pay__sumRow pay__sumRow--total">
                <span>المجموع الكلي</span>
                <b>{total} LE</b>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {openCancel && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__overlay" onClick={() => !canceling && setOpenCancel(false)} />
          <div className="modal__card" dir="rtl">
            <h3 className="modal__title">إلغاء الطلب</h3>
            <p className="modal__text">هل أنت متأكد أنك تريد إلغاء الطلب؟</p>

            <div className="modal__actions">
              <button
                type="button"
                className="modal__btn modal__btn--ghost"
                onClick={() => setOpenCancel(false)}
                disabled={canceling}
              >
                رجوع
              </button>

              <button
                type="button"
                className="modal__btn modal__btn--danger"
                onClick={doCancel}
                disabled={canceling}
              >
                {canceling ? "جارٍ الإلغاء..." : "تأكيد الإلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
