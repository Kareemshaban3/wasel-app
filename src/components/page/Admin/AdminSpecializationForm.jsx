import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createSpecialization,
  getCategories,
  getSpecialization,
  updateSpecialization,
} from "../../../services/api";

const TYPE_OPTIONS = [
  { value: "online", label: "أونلاين" },
  { value: "recorded", label: "أوفلاين" },
  { value: "free", label: "مجاني" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "medium", label: "متوسط" },
  { value: "expert", label: "خبير" },
];

const normalizeType = (v) => {
  if (!v) return "online";
  const s = String(v).trim();
  if (["online", "recorded", "free"].includes(s)) return s;

  if (s === "أونلاين" || s === "اونلاين") return "online";
  if (s === "أوفلاين" || s === "اوفلاين") return "recorded";
  if (s === "مجاني") return "free";

  return "online";
};

const normalizeLevel = (v) => {
  if (!v) return "beginner";
  const s = String(v).trim();
  if (["beginner", "medium", "expert"].includes(s)) return s;

  if (s === "مبتدئ") return "beginner";
  if (s === "متوسط") return "medium";
  if (s === "خبير" || s === "متقدم") return "expert";

  return "beginner";
};

export default function AdminSpecializationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    type: "online",
    level: "beginner",
    time_course: "",
    category_id: "",
    image: null,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const payload = res?.data ?? {};
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await getSpecialization(id);
        const item = res?.data?.data ?? res?.data ?? null;
        if (!item) throw new Error("not found");

        setForm((p) => ({
          ...p,
          name: item.name ?? "",
          description: item.description ?? "",
          price: item.price ?? "",
          type: normalizeType(item.type),
          level: normalizeLevel(item.level),
          time_course: item.time_course ?? "",
          category_id: item.category_id ?? "",
          image: null,
        }));
      } catch {
        toast.error("تعذر تحميل بيانات التخصص");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id, isEdit]);

  const onChange = (key) => (e) => {
    const value = key === "image" ? e.target.files?.[0] || null : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const tId = toast.loading(isEdit ? "جارٍ التعديل..." : "جارٍ الإنشاء...");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("type", form.type);
      fd.append("level", form.level);
      fd.append("time_course", form.time_course);

      const priceValue = form.type === "free" ? 0 : (form.price || 0);
      fd.append("price", priceValue);

      if (form.category_id) fd.append("category_id", form.category_id);
      if (form.image) fd.append("image", form.image);

      if (isEdit) await updateSpecialization(id, fd);
      else await createSpecialization(fd);

      toast.success(isEdit ? "تم التعديل ✅" : "تم الإنشاء ✅", { id: tId });
      navigate("/admin/specializations");
    } catch (err) {
      const msg = err?.response?.data?.message || "حصل خطأ. راجع البيانات.";
      toast.error(msg, { id: tId });
      console.log(err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard" dir="rtl">
      <div className="container">
        <div
          className="dashboard__head"
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <div>
            <h1 className="dashboard__title">
              {isEdit ? "تعديل تخصص" : "إنشاء تخصص"}
            </h1>
            <p className="dashboard__subtitle">املأ البيانات ثم حفظ</p>
          </div>

          <button
            className="dashboard__btn"
            type="button"
            onClick={() => navigate("/admin/specializations")}
          >
            رجوع
          </button>
        </div>

        <form className="dashboard__card" onSubmit={handleSubmit}>
          <div className="dashboard__grid">
            <div className="dashboard__field">
              <label>اسم التخصص</label>
              <input value={form.name} onChange={onChange("name")} required />
            </div>

            <div className="dashboard__field">
              <label>السعر</label>
              <input
                value={form.price}
                onChange={onChange("price")}
                type="number"
                min="0"
                disabled={form.type === "free"}
              />
            </div>

            <div className="dashboard__field">
              <label>نوع التخصص</label>
              <select value={form.type} onChange={onChange("type")}>
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="dashboard__field">
              <label>درجة الصعوبة</label>
              <select value={form.level} onChange={onChange("level")}>
                {LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="dashboard__field">
              <label>مدة التخصص</label>
              <input value={form.time_course} onChange={onChange("time_course")} required />
            </div>

            <div className="dashboard__field">
              <label>القسم</label>
              <select value={form.category_id} onChange={onChange("category_id")} required>
                <option value="">اختر القسم</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name ?? c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="dashboard__field dashboard__field--full">
              <label>وصف التخصص</label>
              <textarea value={form.description} onChange={onChange("description")} rows={4} required />
            </div>

            <div className="dashboard__field dashboard__field--full">
              <label>صورة التخصص {isEdit ? "(اختياري)" : ""}</label>
              <input type="file" accept="image/*" onChange={onChange("image")} />
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
