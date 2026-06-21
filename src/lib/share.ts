export const shareContent = async (title: string, text: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      console.warn('Native share failed or was cancelled', err);
    }
  }
  return false;
};
