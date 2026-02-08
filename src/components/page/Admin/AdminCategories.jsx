import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteCategory, getCategories } from "../../../services/api";

export default function AdminCategories() {
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
      const res = await getCategories({ page: p }); // ✅ مهم: لازم endpoint يدعم paginate
      const payload = res?.data ?? {};

      const list = Array.isArray(payload?.data) ? payload.data : [];
      setItems(list);

      setPage(payload?.current_page ?? p);
      setLastPage(payload?.last_page ?? 1);
      setTotal(payload?.total ?? list.length);
    } catch (e) {
      setItems([]);
      toast.error("تعذر تحميل الأقسام");
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
      await deleteCategory(id);
      toast.success("تم الحذف ✅", { id: tId });

      // ✅ لو الصفحة هتفضى بعد الحذف ارجع صفحة
      const willBeEmpty = items.length === 1 && page > 1;
      const nextPage = willBeEmpty ? page - 1 : page;

      setPage(nextPage);
      if (!willBeEmpty) fetchData(nextPage);
    } catch (e) {
      toast.error("فشل الحذف", { id: tId });
    }
  };

  const renderPagination = () => {
    if (lastPage <= 1) return null;

    return (
      <div className="dash-pagination">
        <button
          className="dash-pagination__btn"
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          السابق
        </button>

        <div className="dash-pagination__pages">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`dash-pagination__page ${p === page ? "is-active" : ""}`}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="dash-pagination__btn"
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
            <h1 className="dashboard__title">إدارة الأقسام</h1>
            <p className="dashboard__subtitle">
              عرض / إضافة / تعديل / حذف — الإجمالي: <b>{total}</b>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="dashboard__btn"
              type="button"
              onClick={() => navigate("/admin/categories/new")}
            >
              + إنشاء قسم
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
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {items.map((it) => (
                <div key={it.id} className="dashboard__card" style={{ padding: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{it?.name ?? it?.title ?? "—"}</h3>
                    <p style={{ margin: "6px 0", opacity: 0.8 }}>ID: {it?.id}</p>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      className="dashboard__btn"
                      type="button"
                      onClick={() => navigate(`/admin/categories/${it.id}/edit`)}
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

              {!items.length ? <p>لا يوجد أقسام</p> : null}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </section>
  );
}
