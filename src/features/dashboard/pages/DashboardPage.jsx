import DashboardHeader from "@/features/dashboard/components/dashboardPage/DashboardHeader";
import DashboardStats from "@/features/dashboard/components/dashboardPage/DashboardStats";
import ProductTable from "@/features/dashboard/components/productsPage/ProductTable";
import { products } from "@/features/shop/data/products";

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <DashboardHeader />
      <DashboardStats productCount={products.length} />
      <ProductTable products={products} />
    </section>
  );
};

export default DashboardPage;