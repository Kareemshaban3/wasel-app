import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [ddPos, setDdPos] = useState({ top: 0, right: 0, width: 260 });

  const { user, signOut } = useAuth();

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  const initials = useMemo(() => {
    const name = user?.name || localStorage.getItem("name") || "";
    const clean = name.trim();
    if (!clean) return "WA";
    const parts = clean.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = (parts[1]?.[0] || parts[0]?.[1] || "") ?? "";
    return (first + second).toUpperCase();
  }, [user?.name]);

  const placeDropdown = () => {
    if (!avatarRef.current) return;
    const r = avatarRef.current.getBoundingClientRect();
    setDdPos({
      top: r.bottom + 10 + window.scrollY,
      right: window.innerWidth - r.right - window.scrollX,
      width: Math.max(240, r.width + 140),
    });
  };

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!profileOpen) return;
      if (dropdownRef.current?.contains(e.target)) return;
      if (avatarRef.current?.contains(e.target)) return;
      setProfileOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    placeDropdown();

    const onResize = () => placeDropdown();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!open) setProfileOpen(false);
  }, [open]);

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setProfileOpen(false);
      setOpen(false);
    }
  };

  const onAvatarClick = () => {
    if (isMobile()) return; // ✅ موبايل: مفيش dropdown
    setProfileOpen((v) => !v);
    setTimeout(placeDropdown, 0);
  };

  return (
    <header className="nav" dir="rtl">
      <div className="container">
        <div className="nav__top">
          <div className="nav__right">
            <div className="nav__brand">
              <Link className="nav__brandText" to="/">
                واصل
              </Link>

              <span className="nav__mark" aria-hidden="true">
                <span className="m1" />
                <span className="m2" />
                <span className="m3" />
                <span className="m4" />
              </span>
            </div>

            <Link className="nav__link" to="/browse">
              تصفح
            </Link>
          </div>

          <button
            className={`nav__toggle ${open ? "is-open" : ""}`}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="toggle"
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>

        <div className={`nav__menu ${open ? "is-open" : ""}`}>
          <form className="nav__search" role="search">
            <input type="text" placeholder="ابحث" />
            <i className="fa-solid fa-magnifying-glass" />
          </form>

          {!user ? (
            <div className="nav__actions">
              <Link className="nav__btn nav__btn--outline" to="/login">
                تسجيل الدخول
              </Link>

              <Link className="nav__btn nav__btn--solid" to="/login">
                انضم إلينا
              </Link>
            </div>
          ) : (
            <div className="nav__profile">
              <div className="nav__mobileCard">
                {user?.role === "admin" && (
                  <Link
                    className="nav__mobileLink"
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                  >
                    <i className="fa-solid fa-graduation-cap" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}

                <Link
                  className="nav__mobileLink"
                  to="/cart"
                  onClick={() => setOpen(false)}
                >
                  <i className="fa-solid fa-cart-shopping" />
                  <span>السلة</span>
                </Link>

                <button
                  className="nav__mobileLogout"
                  type="button"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" />
                  <span>تسجيل خروج</span>
                </button>
              </div>

              <button
                ref={avatarRef}
                type="button"
                className={`nav__avatar ${profileOpen ? "is-open" : ""}`}
                onClick={onAvatarClick}
                aria-expanded={profileOpen}
                aria-label="profile"
              >
                <span className="nav__avatarText">{initials}</span>
                <span className="nav__caret" aria-hidden="true">
                  <i className="fa-solid fa-chevron-down" />
                </span>
              </button>

              {profileOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="nav__dropdown nav__dropdown--portal is-open"
                    style={{ left: 0 }}
                  >
                    <div className="nav__dropdownHead">
                      <span className="nav__dropdownName">
                        {user?.name || localStorage.getItem("name")}
                      </span>
                    </div>

                    <div className="nav__dropdownLinks">
                      {user?.role === "admin" && (
                        <Link
                          className="nav__ddLink"
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                        >
                          <i className="fa-solid fa-graduation-cap" />
                          <span>لوحة التحكم</span>
                        </Link>
                      )}

                      <Link
                        className="nav__ddLink"
                        to="/Favorites"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i className="fa-solid fa-heart" />
                        <span>دوراتك المفضلة</span>
                      </Link>

                      <Link
                        className="nav__ddLink"
                        to="/cart"
                        onClick={() => setProfileOpen(false)}
                      >
                        <i className="fa-solid fa-cart-shopping" />
                        <span>السلة</span>
                      </Link>
                    </div>

                    <button
                      className="nav__logoutBtn"
                      type="button"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket" />
                      <span>تسجيل خروج</span>
                    </button>
                  </div>,
                  document.body
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}