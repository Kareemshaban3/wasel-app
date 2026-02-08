import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createCategory, getCategory, updateCategory } from "../../../services/api";

export default function AdminCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await getCategory(id);
        const item = res?.data?.data ?? res?.data ?? null;
        setName(item?.name ?? item?.title ?? "");
        setIcon(item?.icon ?? item?.title ?? "");
      } catch (e) {
        toast.error("تعذر تحميل بيانات القسم");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("اكتب اسم القسم");
      return;
    }

    if (!icon.trim()) {
      toast.error("اكتب اسم الايقون");
      return;
    }

    setLoading(true);
    const tId = toast.loading(isEdit ? "جارٍ التعديل..." : "جارٍ الإنشاء...");

    try {
      const payload = { name, icon };
      if (isEdit) await updateCategory(id, payload);
      else await createCategory(payload);

      toast.success(isEdit ? "تم التعديل ✅" : "تم الإنشاء ✅", { id: tId });
      navigate("/admin/categories");
    } catch (err) {
      toast.error("حصل خطأ. راجع البيانات.", { id: tId });
      console.log(err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard" dir="rtl">
      <div className="container">
        <div className="dashboard__head" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 className="dashboard__title">{isEdit ? "تعديل قسم" : "إنشاء قسم"}</h1>
            <p className="dashboard__subtitle">املأ البيانات ثم حفظ</p>
          </div>

          <button className="dashboard__btn" type="button" onClick={() => navigate("/admin/categories")}>
            رجوع
          </button>
        </div>

        <form className="dashboard__card" onSubmit={handleSubmit}>
          <div className="dashboard__grid">
            <div className="dashboard__field dashboard__field--full">
              <label>اسم القسم</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="dashboard__field dashboard__field--full">
              <label>اسم الايقون</label>
              <input value={icon} onChange={(e) => setIcon(e.target.value)} required />
            </div>
          </div>

          <div className="dashboard__actions">
            <button className="dashboard__btn" type="submit" disabled={loading}>
              {loading ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديل" : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
