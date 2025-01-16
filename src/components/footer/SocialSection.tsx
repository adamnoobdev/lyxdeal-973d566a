import { FC } from "react";

export const SocialSection: FC = () => {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-semibold text-lg mb-4">Följ oss</h3>
      <ul className="space-y-2">
        <li>
          <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </li>
        <li>
          <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </li>
        <li>
          <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  );
};