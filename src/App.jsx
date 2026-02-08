import { Routes, Route } from "react-router-dom";
import Header from "./ui/layout/Header";
import Footer from "./ui/layout/Footer";

import Browse from "./components/page/Browse";
import Home from "./components/page/Home";
import AllRoundabouts from "./components/page/AllRoundabouts";
import CourseDetails from "./components/page/CourseDetails";
import AuthPage from "./components/page/AuthPage";
import Cart from "./components/page/Cart";
import Favorites from "./components/page/Favorites";
import Dashboard from "./components/page/Dashboard";

// ✅ NEW
import AllSpecializations from "./components/page/AllSpecializations";
import SpecializationDetails from "./components/page/SpecializationDetails";
import Payment from "./components/page/Payment/Payment";
import AdminCourses from "./components/page/Admin/AdminCourses";
import AdminCourseForm from "./components/page/Admin/AdminCourseForm";
import AdminSpecializations from "./components/page/Admin/AdminSpecializations";
import AdminSpecializationForm from "./components/page/Admin/AdminSpecializationForm";
import AdminCategories from "./components/page/Admin/AdminCategories";
import AdminCategoryForm from "./components/page/Admin/AdminCategoryForm";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />

        <Route path="/AllRoundabouts" element={<AllRoundabouts />} />
        <Route path="/AllSpecializations" element={<AllSpecializations />} />

        <Route path="/CourseDetails/:id" element={<CourseDetails />} />
        <Route
          path="/SpecializationDetails/:id"
          element={<SpecializationDetails />}
        />

        <Route path="/Login" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment/:orderId" element={<Payment />} />

      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/courses/new" element={<AdminCourseForm />} />
      <Route path="/admin/courses/:id/edit" element={<AdminCourseForm />} />

      <Route path="/admin/specializations" element={<AdminSpecializations />} />
      <Route path="/admin/specializations/new" element={<AdminSpecializationForm />} />
      <Route path="/admin/specializations/:id/edit" element={<AdminSpecializationForm />} />

      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/categories/new" element={<AdminCategoryForm />} />
      <Route path="/admin/categories/:id/edit" element={<AdminCategoryForm />} />


      </Routes>


      <Footer />
    </>
  );
}

export default App;
