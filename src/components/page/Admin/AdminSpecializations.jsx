import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteSpecialization, getSpecializations } from "../../../services/api";
import { renderType, renderLevel } from "../../../utils/programTranslations";

export default function AdminSpecializations() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ pagination state
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res = await getSpecializations({ page: p });
      const payload = res?.data ?? {};

      const list = Array.isArray(payload?.data) ? payload.data : [];
      setItems(list);

      setPage(payload?.current_page ?? p);
      setLastPage(payload?.last_page ?? 1);
      setTotal(payload?.total ?? list.length);
    } catch (e) {
      setItems([]);
      toast.error("تعذر تحميل التخصصات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
  

    const tId = toast.loading("جارٍ الحذف...");
    try {
      await deleteSpecialization(id);
      toast.success("تم الحذف ✅", { id: tId });

      const willBeEmpty = items.length === 1 && page > 1;
      const nextPage = willBeEmpty ? page - 1 : page;

      setPage(nextPage);
      if (!willBeEmpty) fetchData(nextPage);
    } catch (e) {
      toast.error("فشل الحذف", { id: tId });
    }
  };

  const imgSrc = (it) =>
    it?.image_url ||
    (it?.image ? `http://127.0.0.1:8000/storage/${it.image}` : "") ||
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg";

  const categoryName = (it) =>
    it?.category?.name || it?.category_name || it?.category?.title || "—";

  const renderPagination = () => {
    if (lastPage <= 1) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 24,
        }}
      >
        <button
          className="dashboard__btn"
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          السابق
        </button>

        {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className="dashboard__btn"
            type="button"
            onClick={() => setPage(p)}
            style={{
              opacity: p === page ? 1 : 0.7,
              border: p === page ? "2px solid #222" : undefined,
            }}
          >
            {p}
          </button>
        ))}

        <button
          className="dashboard__btn"
          type="button"
          disabled={page === lastPage}
          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
        >
          التالي
        </button>
      </div>
    );
  };

  return (
    <section className="dashboard" dir="rtl">
      <div className="container">
        <div
          className="dashboard__head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 className="dashboard__title">إدارة التخصصات</h1>
            <p className="dashboard__subtitle">
              عرض / إضافة / تعديل / حذف — الإجمالي: <b>{total}</b>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="dashboard__btn"
              type="button"
              onClick={() => navigate("/admin/specializations/new")}
            >
              + إنشاء تخصص
            </button>

            <button
              className="dashboard__btn"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              رجوع
            </button>
          </div>
        </div>

        {loading ? (
          <div className="Loading">
            <span />
          </div>
        ) : (
          <>
            <div
              className="dashboard__grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
              {items.map((it) => (
                <div key={it.id} className="dashboard__card" style={{ padding: 14 }}>
                  <img
                    src={imgSrc(it)}
                    alt={it?.name}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  />

                  <h3 style={{ margin: "6px 0" }}>{it?.name || "—"}</h3>

                  <p style={{ margin: "4px 0", opacity: 0.85 }}>
                    <b>النوع:</b> {renderType(it?.type)}
                  </p>

                  <p style={{ margin: "4px 0", opacity: 0.85 }}>
                    <b>المستوى:</b> {renderLevel(it?.level)}
                  </p>

                  <p style={{ margin: "4px 0", opacity: 0.85 }}>
                    <b>المدة:</b> {it?.time_course || "—"}
                  </p>

                  <p style={{ margin: "4px 0", opacity: 0.85 }}>
                    <b>القسم:</b> {categoryName(it)}
                  </p>

                  <p style={{ margin: "4px 0", opacity: 0.85 }}>
                    <b>السعر:</b>{" "}
                    {it?.type === "free" || Number(it?.price) === 0
                      ? "مجاني"
                      : `${Number(it?.price) || 0} LE`}
                  </p>

                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 14,
                      opacity: 0.75,
                      lineHeight: 1.6,
                    }}
                  >
                    <b>الوصف:</b> {it?.description || "—"}
                  </p>

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      className="dashboard__btn"
                      type="button"
                      onClick={() => navigate(`/admin/specializations/${it.id}/edit`)}
                    >
                      تعديل
                    </button>

                    <button
                      className="dashboard__btn"
                      type="button"
                      onClick={() => handleDelete(it.id)}
                      style={{ background: "#c0392b" }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}

              {!items.length ? <p>لا يوجد تخصصات</p> : null}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </section>
  );
}
