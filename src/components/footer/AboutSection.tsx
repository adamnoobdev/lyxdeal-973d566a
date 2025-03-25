import { FC } from "react";

interface AboutSectionProps {
  onNavigate: (path: string) => void;
}

export const AboutSection: FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-semibold text-lg mb-4">Om oss</h3>
      <ul className="space-y-2">
      </ul>
    </div>
  );
};
