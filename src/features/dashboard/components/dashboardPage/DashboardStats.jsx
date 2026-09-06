import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CardTitle } from "@/components/ui/Typography";

import {
  Squares2X2Icon,
  QueueListIcon,
  CubeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const DashboardStats = ({ productCount }) => {
  const stats = [
    {
      title: "Kategoriler",
      count: "10",
      button: "Kategori Ekle",
      icon: Squares2X2Icon,
    },
    {
      title: "Alt Kategoriler",
      count: "24",
      button: "Alt Kategori Ekle",
      icon: QueueListIcon,
    },
    {
      title: "Markalar",
      count: "18",
      button: "Marka Ekle",
      icon: TagIcon,
    },
    {
      title: "Ürünler",
      count: productCount,
      button: "Ürün Ekle",
      icon: CubeIcon,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <Card
            key={index}
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

              <Button className="w-full btn-error text-white">
                {item.button}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
