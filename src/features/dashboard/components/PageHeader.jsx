import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

const PageHeader = ({ title, description, linkText, url }) => {
  return (
    <Card className="overflow-hidden border border-base-200 shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">{title}</h1>
          <p className="mt-1 text-sm text-base-content/70">
            {description}
          </p>
        </div>

        <Link
          to={`/dashboard/${url}`}
          className="btn btn-error text-white rounded-xl"
        >
          {linkText}
        </Link>
      </div>
    </Card>
  );
};

export default PageHeader;