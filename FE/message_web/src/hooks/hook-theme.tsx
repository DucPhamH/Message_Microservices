import { useTheme } from "next-themes";
import React from "react";

export const useHookTheme = () => {
  const value = useTheme();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(value.theme === "dark");
  }, [value.theme]);

  return { isDark, ...value };
};
