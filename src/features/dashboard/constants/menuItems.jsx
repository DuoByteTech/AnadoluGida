import {
  HomeIcon,
  Squares2X2Icon,
  QueueListIcon,
  CubeIcon,
  TagIcon,
  MegaphoneIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  {
    label: "Anasayfa",
    path: "/dashboard",
    icon: <HomeIcon className="size-5" />,
  },
  {
    label: "Kategoriler",
    path: "/dashboard/categories",
    icon: <Squares2X2Icon className="size-5" />,
  },
  {
    label: "Alt Kategoriler",
    path: "/dashboard/subcategories",
    icon: <QueueListIcon className="size-5" />,
  },
  {
    label: "Ürünler",
    path: "/dashboard/products",
    icon: <CubeIcon className="size-5" />,
  },
  {
    label: "Markalar",
    path: "/dashboard/brands",
    icon: <TagIcon className="size-5" />,
  },
  {
    label: "Promosyonlar",
    path: "/dashboard/promotions",
    icon: <MegaphoneIcon className="size-5" />,
  },
  {
    label: "Hakkımızda",
    path: "/dashboard/about",
    icon: <InformationCircleIcon className="size-5" />,
  },

  // en altta olacak
  {
    label: "Çıkış",
    path: "/dashboard/logout",
    icon: <ArrowRightOnRectangleIcon className="size-5" />,
  }
];

export default menuItems;