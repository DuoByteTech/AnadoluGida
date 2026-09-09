import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "@/components/routing/ScrollToTop";

import SiteLayout from "../components/layout/SiteLayout";

import HomePage from "@/features/home/HomePage";
import ShopPage from "../features/shop/ShopPage";
import ProductDetailPage from "../features/shop/ProductDetailPage";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contact/ContactPage";

import LoginPage from "@/features/auth/pages/LoginPage";
import AdminRoute from "@/features/auth/components/AdminRoute";

import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

import CategoriesPage from "@/features/dashboard/pages/CategoriesPage";
import CategoryFormPage from "../features/dashboard/pages/CategoryFormPage";

import SubCategoriesPage from "@/features/dashboard/pages/SubCategoriesPage";
import SubCategoryFormPage from "../features/dashboard/pages/SubCategoryFormPage";

import ProductsPage from "@/features/dashboard/pages/ProductsPage";
import ProductFormPage from "../features/dashboard/components/productsPage/ProductFormPage";

import BrandsPage from "@/features/dashboard/pages/BrandsPage";
import BrandFormPage from "../features/dashboard/pages/BrandFormPage";

import PromotionsPage from "@/features/dashboard/pages/PromotionsPage";
import PromotionFormPage from "@/features/dashboard/pages/PromotionFormPage";

import DashboardAboutPage from "@/features/dashboard/pages/DashboardAboutPage";
import LogoutPage from "@/features/dashboard/pages/LogoutPage";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Site */}
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />

          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:categorySlug" element={<ShopPage />} />
          <Route path="shop/:categorySlug/:subSlug" element={<ShopPage />} />

          <Route path="angebote" element={<ShopPage />} />

          <Route path="product/:slug" element={<ProductDetailPage />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          {/* Categories */}
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/edit/:id" element={<CategoryFormPage />} />

          {/* Sub Categories */}
          <Route path="subcategories" element={<SubCategoriesPage />} />
          <Route path="subcategories/new" element={<SubCategoryFormPage />} />
          <Route
            path="subcategories/edit/:id"
            element={<SubCategoryFormPage />}
          />

          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />

          {/* Brands */}
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/new" element={<BrandFormPage />} />
          <Route path="brands/edit/:id" element={<BrandFormPage />} />

          {/* Promotions */}
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="promotions/new" element={<PromotionFormPage />} />
          <Route path="promotions/edit/:id" element={<PromotionFormPage />} />

          {/* About */}
          <Route path="about" element={<DashboardAboutPage />} />

          {/* Logout */}
          <Route path="logout" element={<LogoutPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
