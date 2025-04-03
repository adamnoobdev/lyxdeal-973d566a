
interface SearchPageTitleProps {
  title: string;
  description: string;
}

export const SearchPageTitle = ({
  title,
  description,
}: SearchPageTitleProps) => {
  return (
    <div className="my-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
