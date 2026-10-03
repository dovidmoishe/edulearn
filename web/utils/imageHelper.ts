export const getHighQualityImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url || typeof url !== 'string') return undefined;
  return url
    .replace(/_normal(\.[a-z]+)$/i, '_400x400$1')
    .replace(/_mini(\.[a-z]+)$/i, '_400x400$1')
    .replace(/_bigger(\.[a-z]+)$/i, '_400x400$1');
};

