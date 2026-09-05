import PromotionHeader from "../components/promotionsPage/PromotionHeader";
import PromotionTable from "../components/promotionsPage/PromotionTable";

import { promotionsData } from "@/features/home/data/promotionsData";

const PromotionsPage = () => {
  return (
    <div className="space-y-6">
      <PromotionHeader />
      <PromotionTable promotions={promotionsData} />
    </div>
  );
};

export default PromotionsPage;