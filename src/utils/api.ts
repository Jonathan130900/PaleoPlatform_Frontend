export const getImageUrl = (path: string) => {
  if (import.meta.env.DEV) {
    return `http://localhost:7224${path}`;
  }
  return path;
};
