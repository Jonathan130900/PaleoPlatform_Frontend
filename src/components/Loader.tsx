// components/Loader.tsx
import { BeatLoader } from "react-spinners";
import { paleoTheme } from "../styles/theme";

interface LoaderProps {
  size?: number;
  color?: string;
}

export const Loader = ({ size = 15, color }: LoaderProps) => {
  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <BeatLoader color={color || paleoTheme.colors.primary} size={size} />
    </div>
  );
};

export const SmallLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <BeatLoader color={paleoTheme.colors.primary} size={8} />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <BeatLoader color={paleoTheme.colors.primary} size={25} />
    </div>
  );
};
