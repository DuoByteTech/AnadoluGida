import Card from "@/components/ui/Card";
import {
  ArrowTrendingUpIcon,
  PercentBadgeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

const DashboardHeader = () => {
  return (
    <Card className="overflow-hidden border border-base-200 shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-error/20 bg-error/10 px-3 py-1 text-sm text-error">
            <ArrowTrendingUpIcon className="size-4" />
            Yönetim Paneli
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70 md:text-base">
              Kategori, alt kategori, ürün ve marka yönetimini buradan hızlıca
              takip edebilir; yeni kayıtlar ekleyerek paneli kolayca
              yönetebilirsin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
          <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-base-content/60">
              <PercentBadgeIcon className="size-4" />
              <p className="text-sm">Aktif İndirim</p>
            </div>
            <p className="text-2xl font-bold">8</p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100/80 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-base-content/60">
              <CubeIcon className="size-4" />
              <p className="text-sm">İndirimli Ürün</p>
            </div>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;