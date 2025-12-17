export const convertToPng = async (file: File): Promise<File> => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".png"), { type: 'image/png' }));
          }
        }, 'image/png');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};