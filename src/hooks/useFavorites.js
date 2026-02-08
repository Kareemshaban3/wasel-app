import { useCallback, useEffect, useMemo, useState } from "react";
import { addFavorite, getFavorites, removeFavorite } from "../services/api";

// key: `${type}:${id}` => favorite_id
export default function useFavorites() {
  const [favMap, setFavMap] = useState(() => new Map());
  const [loadingFavs, setLoadingFavs] = useState(true);

  const loadFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFavMap(new Map());
      setLoadingFavs(false);
      return;
    }

    setLoadingFavs(true);
    try {
      const res = await getFavorites();
      const list = res?.data?.items ?? [];
      const map = new Map();

      (Array.isArray(list) ? list : []).forEach((f) => {
        const key = `${f.type}:${f.id}`;
        map.set(key, f.favorite_id);
      });

      setFavMap(map);
    } catch (e) {
      setFavMap(new Map());
    } finally {
      setLoadingFavs(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFav = useCallback(
    (type, id) => !!id && favMap.has(`${type}:${id}`),
    [favMap]
  );

  const toggleFav = useCallback(
    async (type, id) => {
      const token = localStorage.getItem("token");
      if (!token) return { ok: false, needsLogin: true };

      const key = `${type}:${id}`;
      const existingFavId = favMap.get(key);

      try {
        if (existingFavId) {
          await removeFavorite(existingFavId);
          setFavMap((prev) => {
            const next = new Map(prev);
            next.delete(key);
            return next;
          });
          return { ok: true, added: false };
        } else {
          const res = await addFavorite({ type, id });
          const favItem = res?.data?.item ?? null;
          const newFavId = favItem?.favorite_id ?? null;

          setFavMap((prev) => {
            const next = new Map(prev);
            if (newFavId) next.set(key, newFavId);
            return next;
          });

          return { ok: true, added: true };
        }
      } catch (e) {
        return { ok: false, error: e };
      }
    },
    [favMap]
  );

  return {
    favMap,
    loadingFavs,
    loadFavorites,
    isFav,
    toggleFav,
  };
}
