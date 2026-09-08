import { Link } from "react-router-dom";

import Card from "@/components/ui/Card";

const PromotionHeader = () => {
  return (
    <Card className="overflow-hidden border border-base-200 shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Promosyonlar</h1>

          <p className="mt-1 text-sm text-base-content/70">
            Ana sayfada gösterilecek promosyonları ve kampanyaları yönetin.
          </p>
        </div>

        <Link
          to="/dashboard/promotions/new"
          className="btn rounded-xl border-brand-red-700 bg-brand-red-700 text-white hover:border-brand-red-800 hover:bg-brand-red-800"
        >
          Yeni Promosyon
        </Link>
      </div>
    </Card>
  );
};

export default PromotionHeader;
