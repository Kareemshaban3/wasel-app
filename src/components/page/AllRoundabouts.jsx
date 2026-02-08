import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Categories from "../Categories";
import PopularCourseCard from "../../ui/PopularCourseCard";
import {
  getCategoryCourses,
  getCourses,
  getFavorites,
} from "../../services/api";
import useFavorites from "../../hooks/useFavorites";

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

const readParam = (sp, key, fallback = "") => sp.get(key) ?? fallback;

const parsePaginated = (payload) => {
  // wrapped: { data: { data:[...], last_page } }
  if (payload?.data && Array.isArray(payload.data?.data)) {
    return {
      items: payload.data.data,
      lastPage: Number(payload.data.last_page || 1) || 1,
    };
  }
  // direct paginator: { data:[...], last_page }
  if (payload && Array.isArray(payload.data)) {
    return {
      items: payload.data,
      lastPage: Number(payload.last_page || 1) || 1,
    };
  }
  if (Array.isArray(payload)) return { items: payload, lastPage: 1 };
  return { items: [], lastPage: 1 };
};

export default function AllRoundabouts() {
  const { isFav, toggleFav, loadingFavs } = useFavorites();

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = readParam(searchParams, "category", "");
  const sortValue = readParam(searchParams, "sort", "latest");
  const levelValue = readParam(searchParams, "level", "");
  const typeValue = readParam(searchParams, "type", "");
  const page = Number(readParam(searchParams, "page", "1")) || 1;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPage, setLastPage] = useState(1);
  const [favMap, setFavMap] = useState(new Map());

  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useOutsideClick(sortRef, () => setOpenSort(false));
  useOutsideClick(filterRef, () => setOpenFilter(false));

  const updateParams = (patch) => {
    const current = Object.fromEntries(searchParams.entries());
    const next = { ...current, ...patch };
    Object.keys(next).forEach((k) => {
      if (next[k] === "" || next[k] == null) delete next[k];
    });
    setSearchParams(next);
  };

  const handleSelectCategory = (cat) => {
    if (!cat?.id) {
      updateParams({ category: "", page: "1" });
      return;
    }
    updateParams({ category: String(cat.id), page: "1" });
  };

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = { page, per_page: 12, sort: sortValue };
        if (levelValue) params.level = levelValue;
        if (typeValue) params.type = typeValue;

        const res = categoryId
          ? await getCategoryCourses(categoryId, params)
          : await getCourses(params);

        const payload = res?.data ?? {};
        const { items, lastPage } = parsePaginated(payload);

        if (mounted) {
          setCourses(Array.isArray(items) ? items : []);
          setLastPage(lastPage);
        }
      } catch (e) {
        if (mounted) {
          setCourses([]);
          setLastPage(1);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCourses();
    return () => {
      mounted = false;
    };
  }, [categoryId, sortValue, levelValue, typeValue, page]);

  useEffect(() => {
    let mounted = true;
    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getFavorites();
        const data = res?.data?.data ?? res?.data ?? [];
        const map = new Map();
        (Array.isArray(data) ? data : []).forEach((f) => {
          const course = f?.course || f?.item || f;
          const id = course?.id ?? f?.item_id ?? f?.course_id;
          if (id != null) map.set(id, f?.id ?? f?.favorite_id ?? id);
        });
        if (mounted) setFavMap(map);
      } catch (e) {}
    };
    fetchFavs();
    return () => {
      mounted = false;
    };
  }, []);

  const resetFilters = () => {
    updateParams({ sort: "latest", level: "", type: "", page: "1" });
  };

  return (
    <>
      <div className="AllRoundabouts">
        <Categories onSelect={handleSelectCategory} />

        <div className="container">
          <div className="topbar" dir="rtl">
            <div className="topbar__title">
              <h2>الدورات</h2>
            </div>

            <div className="topbar__controls">
              <div className="dd" ref={sortRef}>
                <button
                  type="button"
                  className="dd__btn"
                  onClick={() => {
                    setOpenSort((v) => !v);
                    setOpenFilter(false);
                  }}
                >
                  <span>ترتيب حسب</span>
                  <i
                    className={`fa-solid fa-chevron-down ${openSort ? "is-rot" : ""}`}
                  />
                </button>

                <div className={`dd__menu ${openSort ? "is-open" : ""}`}>
                  <label className="dd__item">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortValue === "latest"}
                      onChange={() =>
                        updateParams({ sort: "latest", page: "1" })
                      }
                    />
                    <span>الأحدث</span>
                  </label>

                  <label className="dd__item">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortValue === "views"}
                      onChange={() =>
                        updateParams({ sort: "views", page: "1" })
                      }
                    />
                    <span>الأكثر مشاهدة</span>
                  </label>

                  <label className="dd__item">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortValue === "price_desc"}
                      onChange={() =>
                        updateParams({ sort: "price_desc", page: "1" })
                      }
                    />
                    <span>السعر: من الأعلى للأقل</span>
                  </label>

                  <label className="dd__item">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortValue === "price_asc"}
                      onChange={() =>
                        updateParams({ sort: "price_asc", page: "1" })
                      }
                    />
                    <span>السعر: من الأقل للأعلى</span>
                  </label>
                </div>
              </div>

              <div className="dd" ref={filterRef}>
                <button
                  type="button"
                  className="dd__btn"
                  onClick={() => {
                    setOpenFilter((v) => !v);
                    setOpenSort(false);
                  }}
                >
                  <span>فرز المحتوى</span>
                  <i
                    className={`fa-solid fa-chevron-down ${openFilter ? "is-rot" : ""}`}
                  />
                </button>

                <div className={`dd__menu ${openFilter ? "is-open" : ""}`}>
                  <div className="dd__item" style={{ fontWeight: 700 }}>
                    النوع
                  </div>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="type"
                      checked={typeValue === ""}
                      onChange={() => updateParams({ type: "", page: "1" })}
                    />
                    <span>الكل</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="type"
                      checked={typeValue === "online"}
                      onChange={() =>
                        updateParams({ type: "online", page: "1" })
                      }
                    />
                    <span>أونلاين</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="type"
                      checked={typeValue === "recorded"}
                      onChange={() =>
                        updateParams({ type: "recorded", page: "1" })
                      }
                    />
                    <span>مسجل</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="type"
                      checked={typeValue === "free"}
                      onChange={() => updateParams({ type: "free", page: "1" })}
                    />
                    <span>مجاني</span>
                  </label>

                  <hr />

                  <div className="dd__item" style={{ fontWeight: 700 }}>
                    المستوى
                  </div>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="level"
                      checked={levelValue === ""}
                      onChange={() => updateParams({ level: "", page: "1" })}
                    />
                    <span>الكل</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="level"
                      checked={levelValue === "beginner"}
                      onChange={() =>
                        updateParams({ level: "beginner", page: "1" })
                      }
                    />
                    <span>مبتدئ</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="level"
                      checked={levelValue === "medium"}
                      onChange={() =>
                        updateParams({ level: "medium", page: "1" })
                      }
                    />
                    <span>متوسط</span>
                  </label>

                  <label className="dd__item dd__item--check">
                    <input
                      type="radio"
                      name="level"
                      checked={levelValue === "expert"}
                      onChange={() =>
                        updateParams({ level: "expert", page: "1" })
                      }
                    />
                    <span>خبير</span>
                  </label>

                  <hr />

                  <button
                    type="button"
                    className="dd__item"
                    onClick={resetFilters}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {loading ? (
              <p className="Loading">  <span /></p>
            ) : (
              courses.map((course) => (
                <div
                  className="col-lg-4 my-2 col-md-6 col-sm-12"
                  key={course.id ?? course.name}
                >
                  <PopularCourseCard
                    course={course}
                    isFav={isFav}
                    onToggleFav={toggleFav}
                    loadingFavs={loadingFavs}
                  />
                </div>
              ))
            )}
          </div>

          <div className="pager" dir="rtl">
            <button
              className="pager__btn"
              type="button"
              disabled={page <= 1}
              onClick={() =>
                updateParams({ page: String(Math.max(1, page - 1)) })
              }
            >
              السابق
            </button>
            <span className="pager__info">
              صفحة {page} من {lastPage}
            </span>
            <button
              className="pager__btn"
              type="button"
              disabled={page >= lastPage}
              onClick={() =>
                updateParams({ page: String(Math.min(lastPage, page + 1)) })
              }
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
