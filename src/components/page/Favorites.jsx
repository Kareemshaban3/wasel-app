import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFavorite, getFavorites, removeFavorite } from "../../services/api";

const toCard = (fav) => {
  // ✅ favoriteToArray بيرجع item مباشر
  return {
    favoriteId: fav?.favorite_id,
    type: fav?.type, // course | specialization
    itemId: fav?.id,
    title: fav?.name || "-",
    price: Number(fav?.price) || 0,
    img: fav?.image_url || "",
  };
};

export default function Favorites() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const favSet = useMemo(() => new Set(items.map((x) => x.itemId)), [items]);

  useEffect(() => {
    let mounted = true;

    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getFavorites();
        // ✅ backend: { items: [...] }
        const list = res?.data?.items ?? [];
        const mapped = Array.isArray(list) ? list.map(toCard) : [];
        if (mounted) setItems(mapped);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFavs();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim();
    if (!query) return items;
    return items.filter((x) => (x.title || "").includes(query));
  }, [q, items]);

  const toggleFav = async (item) => {
    if (!item?.itemId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (favSet.has(item.itemId)) {
        await removeFavorite(item.favoriteId);
        setItems((prev) => prev.filter((x) => x.itemId !== item.itemId));
      } else {
        // ✅ backend wants: { type, id }
        const res = await addFavorite({
          type: item.type || "course",
          id: item.itemId,
        });

        // ✅ backend returns: { message, item: {...} }
        const newItem = res?.data?.item ?? null;
        if (newItem) setItems((prev) => [toCard(newItem), ...prev]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="fav" dir="rtl">
      <div className="container">
        <div className="fav__top">
          <h2 className="fav__title">المفضلة</h2>

          <form className="fav__search" role="search" onSubmit={(e) => e.preventDefault()}>
            <button className="fav__searchIcon" type="button" aria-label="search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="البحث في المفضلة"
            />
          </form>
        </div>

        <div className="fav__grid">
          {loading ? (
            <p className="Loading">
              <span />
            </p>
          ) : (
            filtered.map((it) => (
              <article className="fav-card" key={`${it.type}-${it.itemId}`}>
                <div className="fav-card__media">
                  <img src={it.img} alt={it.title} />

                  <button
                    className={`fav-card__heart ${favSet.has(it.itemId) ? "is-active" : ""}`}
                    type="button"
                    onClick={() => toggleFav(it)}
                    aria-label="favorite"
                    title="مفضلة"
                  >
                    <i className={`${favSet.has(it.itemId) ? "fa-solid" : "fa-regular"} fa-heart`} />
                  </button>

                  <div className="fav-card__level">{it.type === "specialization" ? "تخصص" : "كورس"}</div>
                </div>

                <div className="fav-card__body">
                  <div className="fav-card__titleRow">
                    <i className="fa-solid fa-brain fav-card__brain" />
                    <h3 className="fav-card__title">{it.title}</h3>
                  </div>

                  <div className="fav-card__bottom">
                    <div className="fav-card__views">
                      <i className="fa-solid fa-download" />
                      <span>—</span>
                    </div>

                    <div className="fav-card__price">{it.price} LE</div>

                    <div className="fav-card__rate">
                      <i className="fa-solid fa-star" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
