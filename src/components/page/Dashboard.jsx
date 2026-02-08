import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="dashboard" dir="rtl">
      <div className="container">
        <div className="dashboard__head">
          <h1 className="dashboard__title">لوحة التحكم</h1>
          <p className="dashboard__subtitle">إدارة الكورسات والتخصصات والأقسام</p>
        </div>

        <div className="dashboard__card">
          <div className="dashboard__grid">
            <button className="dashboard__btn" type="button" onClick={() => navigate("/admin/courses")}>
              إدارة الكورسات
            </button>

            <button className="dashboard__btn" type="button" onClick={() => navigate("/admin/specializations")}>
              إدارة التخصصات
            </button>

            <button className="dashboard__btn" type="button" onClick={() => navigate("/admin/categories")}>
              إدارة الأقسام
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
