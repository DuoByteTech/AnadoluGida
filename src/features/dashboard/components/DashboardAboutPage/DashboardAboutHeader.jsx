import Card from "@/components/ui/Card";

const DashboardAboutHeader = () => {
  return (
    <Card className="overflow-hidden border border-base-200 shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Hakkımızda</h1>
          <p className="mt-1 text-sm text-base-content/70">
            Hakkımızda buradan yönetebilirsiniz.
          </p>
        </div>

        <button className="btn btn-error text-white rounded-xl">Hakkımızdayı Düzenle</button>
      </div>
    </Card>
  )
};

export default DashboardAboutHeader;
