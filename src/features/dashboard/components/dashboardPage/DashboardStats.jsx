import { Link } from "react-router-dom";

import Card from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/Typography";

import {
  Squares2X2Icon,
  QueueListIcon,
  CubeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import LinkButton from "../../../../components/ui/LinkButton";

const DashboardStats = ({ stats }) => {
  const items = [
    {
      title: "Ürünler",
      count: stats.products,
      button: "Ürün Ekle",
      path: "/dashboard/products/new",
      icon: CubeIcon,
    },
    {
      title: "Kategoriler",
      count: stats.categories,
      button: "Kategori Ekle",
      path: "/dashboard/categories/new",
      icon: Squares2X2Icon,
    },
    {
      title: "Alt Kategoriler",
      count: stats.subcategories,
      button: "Alt Kategori Ekle",
      path: "/dashboard/subcategories/new",
      icon: QueueListIcon,
    },
    {
      title: "Markalar",
      count: stats.brands,
      button: "Marka Ekle",
      path: "/dashboard/brands/new",
      icon: TagIcon,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="card-body space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.title}</CardTitle>

                  <p className="text-sm text-base-content/70">
                    {item.count} adet
                  </p>
                </div>

                <div className="rounded-xl bg-base-200 p-2">
                  <Icon className="size-6 opacity-70" />
                </div>
              </div>

              <LinkButton to={item.path}>{item.button}</LinkButton>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
