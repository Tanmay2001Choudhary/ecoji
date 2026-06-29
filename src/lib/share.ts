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

interface ShareQRParams {
  elementId: string;
  filename: string;
  title: string;
  text?: string;
  url: string;
}

export const shareQRCode = async ({ elementId, filename, title, text = '', url }: ShareQRParams): Promise<boolean> => {
  return new Promise((resolve) => {
    const svg = document.getElementById(elementId) as unknown as SVGSVGElement;
    if (!svg) {
      shareContent(title, text, url).then(resolve);
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        const padding = 20;
        const width = (img.width || 200) + padding * 2;
        const height = (img.height || 200) + padding * 2;
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, padding, padding);
        }

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], filename, { type: 'image/png' });
            const combinedMessage = text ? `${text}\n\n${url}` : url;

            // Try sharing the file if browser supports it
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                // Omitting 'url' property when sharing files forces apps like WhatsApp/Telegram to put combinedMessage directly as the image caption!
                await navigator.share({
                  title,
                  text: combinedMessage,
                  files: [file]
                });
                resolve(true);
                return;
              } catch (shareErr) {
                console.warn('File share cancelled or failed, falling back to download', shareErr);
              }
            }

            // Fallback: If device doesn't support file sharing (e.g. Windows PC), trigger image save AND share combined link/text
            const dataUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = filename;
            downloadLink.href = dataUrl;
            downloadLink.click();

            if (navigator.share) {
              try {
                await navigator.share({ title, text: combinedMessage });
                resolve(true);
                return;
              } catch (e) {
                // ignore
              }
            }
            navigator.clipboard.writeText(combinedMessage);
          }
          resolve(true);
        }, 'image/png');
      };

      img.onerror = () => {
        shareContent(title, text, url).then(resolve);
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (err) {
      console.error('Error generating QR share', err);
      shareContent(title, text, url).then(resolve);
    }
  });
};
