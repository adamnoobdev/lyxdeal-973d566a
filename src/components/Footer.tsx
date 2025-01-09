import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Lovable
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/lovable-labs/demo"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center">
          <Link 
            to="/salon/login" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Salongsportal
          </Link>
        </div>
      </div>
    </footer>
  );
};