import Card from "@/components/ui/Card";

const PromotionHeader = () => {
  return (
    <Card className="overflow-hidden border border-base-200 shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Promosyonlar</h1>
          <p className="mt-1 text-sm text-base-content/70">
            Promosyonları buradan yönetebilirsiniz.
          </p>
        </div>

        <button className="btn btn-error text-white rounded-xl">Promosyon Ekle</button>
      </div>
    </Card>
  )
};

export default PromotionHeader;
