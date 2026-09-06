import Card from "@/components/ui/Card";
import LinkButton from "@/components/ui/LinkButton";

const PageHeader = ({ title, description, linkText, url }) => {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="card-body relative z-10 gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">{title}</h1>

          <p className="mt-1 text-sm text-base-content/70">{description}</p>
        </div>

        <LinkButton to={`/dashboard/${url}`}>{linkText}</LinkButton>
      </div>
    </Card>
  );
};

export default PageHeader;
