import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

// ✅ Bearer Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================= Auth =========================
export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);
export const logout = () => API.post("/logout");
export const getUsers = () => API.get("/users");

// ========================= Categories =========================
export const getCategories = () => API.get("/categories");
export const getCategory = (id) => API.get(`/categories/${id}`);

export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// category -> courses/specializations/programs
export const getCategoryCourses = (categoryId, params = {}) =>
  API.get(`/categories/${categoryId}/courses`, { params });

export const getCategorySpecializations = (categoryId, params = {}) =>
  API.get(`/categories/${categoryId}/specializations`, { params });

export const getCategoryPrograms = (categoryId, params = {}) =>
  API.get(`/categories/${categoryId}/programs`, { params });

// ========================= Courses =========================
export const getCourses = (params = {}) => API.get("/courses", { params });
export const getCourse = (id) => API.get(`/courses/${id}`);

export const createCourse = (formData) =>
  API.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCourse = (id, formData) =>
  API.post(`/courses/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// ========================= Specializations =========================
export const getSpecializations = (params = {}) =>
  API.get("/specializations", { params });

export const getSpecialization = (id) => API.get(`/specializations/${id}`);

export const createSpecialization = (formData) =>
  API.post("/specializations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateSpecialization = (id, formData) =>
  API.post(`/specializations/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteSpecialization = (id) => API.delete(`/specializations/${id}`);

// ========================= Cart =========================
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart/add", data);
// data مثال: { type: "course", id: 5 }
export const removeCartItem = (cartItemId) =>
  API.delete(`/cart/items/${cartItemId}`);
export const clearCart = () => API.delete("/cart/clear");

// ========================= Favorites =========================
export const getFavorites = () => API.get("/favorites");
export const addFavorite = (data) => API.post("/favorites", data);
export const removeFavorite = (favoriteId) =>
  API.delete(`/favorites/${favoriteId}`);
export const clearFavorites = () => API.delete("/favorites/clear");

// ========================= Checkout =========================
export const checkoutCart = () => API.post("/cart/checkout");

// ========================= Orders =========================
export const getOrders = (params = {}) => API.get("/orders", { params });
export const getOrder = (orderId) => API.get(`/orders/${orderId}`);
export const cancelOrder = (orderId) => API.delete(`/orders/${orderId}`);

export default API;
