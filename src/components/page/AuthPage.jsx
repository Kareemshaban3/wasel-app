import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = useMemo(() => {
    const em = mode === "signup" ? signup.email : loginForm.email;
    if (!em) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim());
  }, [mode, signup.email, loginForm.email]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (signup.name.trim().length < 2) return setError("اكتب الاسم بالكامل.");
    if (!signup.email.trim()) return setError("اكتب البريد الإلكتروني.");
    if (!isEmailValid) return setError("البريد الإلكتروني غير صحيح.");
    if (signup.password.length < 8)
      return setError("كلمة المرور لازم تكون 8 أحرف أو أكثر.");
    if (signup.password !== signup.confirmPassword)
      return setError("كلمتا المرور غير متطابقتين.");

    try {
      setLoading(true);
      await signUp({
        name: signup.name.trim(),
        email: signup.email.trim(),
        password: signup.password,
        password_confirmation: signup.confirmPassword,
        phone: signup.phone.trim() || undefined,
      });

      setMode("login");
      setLoginForm((l) => ({ ...l, email: signup.email.trim() }));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };


const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!loginForm.email.trim()) {
    setError("اكتب البريد الإلكتروني.");
    toast.error("اكتب البريد الإلكتروني");
    return;
  }

  if (!isEmailValid) {
    setError("البريد الإلكتروني غير صحيح.");
    toast.error("البريد الإلكتروني غير صحيح");
    return;
  }

  if (!loginForm.password) {
    setError("اكتب كلمة المرور.");
    toast.error("اكتب كلمة المرور");
    return;
  }

  try {
    setLoading(true);

    await signIn({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    toast.success("تم تسجيل الدخول بنجاح ✅");
    navigate("/");
  } catch (err) {
    const msg = err?.response?.data?.message || "بيانات الدخول غير صحيحة";
    setError(msg);
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="auth" dir="rtl">
      <div className="container">
        <div className="auth__grid">
          <div className="auth__card">
            <h2 className="auth__title">مرحباً بك !</h2>

            <div className="auth__switch">
              <button
                type="button"
                className={`auth__switchBtn ${mode === "signup" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                انضم إلينا
              </button>

              <button
                type="button"
                className={`auth__switchBtn ${mode === "login" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                تسجيل الدخول
              </button>
            </div>

            {error ? <div className="auth__error">{error}</div> : null}

            {mode === "signup" ? (
              <form onSubmit={handleRegister} className="auth__form">
                <div className="auth__field">
                  <label>الاسم بالكامل</label>
                  <input
                    value={signup.name}
                    onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))}
                    placeholder="نادين أحمد"
                  />
                </div>

                <div className="auth__field">
                  <label>بريدك الإلكتروني</label>
                  <input
                    value={signup.email}
                    onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))}
                    placeholder="NadeenAh@gmail.com"
                  />
                </div>

                <div className="auth__field">
                  <label>كلمة المرور</label>
                  <div className="auth__inputIcon">
                    <button type="button" className="auth__eye" onClick={() => setShowPass1((v) => !v)}>
                      <i className={`fa-regular ${showPass1 ? "fa-eye" : "fa-eye-slash"}`} />
                    </button>
                    <input
                      value={signup.password}
                      onChange={(e) => setSignup((s) => ({ ...s, password: e.target.value }))}
                      type={showPass1 ? "text" : "password"}
                      placeholder="************"
                    />
                  </div>
                </div>

                <div className="auth__field">
                  <label>تأكيد كلمة المرور</label>
                  <div className="auth__inputIcon">
                    <button type="button" className="auth__eye" onClick={() => setShowPass2((v) => !v)}>
                      <i className={`fa-regular ${showPass2 ? "fa-eye" : "fa-eye-slash"}`} />
                    </button>
                    <input
                      value={signup.confirmPassword}
                      onChange={(e) =>
                        setSignup((s) => ({ ...s, confirmPassword: e.target.value }))
                      }
                      type={showPass2 ? "text" : "password"}
                      placeholder="************"
                    />
                  </div>
                </div>

                <button className="auth__submit" disabled={loading}>
                  {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="auth__form">
                <div className="auth__field">
                  <label>بريدك الإلكتروني</label>
                  <input
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((l) => ({ ...l, email: e.target.value }))}
                    placeholder="NadeenAh@gmail.com"
                  />
                </div>

                <div className="auth__field">
                  <label>كلمة المرور</label>
                  <div className="auth__inputIcon">
                    <button type="button" className="auth__eye" onClick={() => setShowPass1((v) => !v)}>
                      <i className={`fa-regular ${showPass1 ? "fa-eye" : "fa-eye-slash"}`} />
                    </button>
                    <input
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((l) => ({ ...l, password: e.target.value }))}
                      type={showPass1 ? "text" : "password"}
                      placeholder="************"
                    />
                  </div>
                </div>

                <button className="auth__submit" disabled={loading}>
                  {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>
            )}
          </div>

          <div className="auth__art">
            <img
              src="https://ouch-cdn2.icons8.com/3fKq5SBtQwL9d4n7ZgF2nZsYdP3w1Hk2hGqIu6tS4Hk/rs:fit:800:600/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjM5/LzY0MmY0ZWYwLTc1MTEtNGI4Mi1hMGZhLWYwNzM5OGQ5NjA0YS5zdmc.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
