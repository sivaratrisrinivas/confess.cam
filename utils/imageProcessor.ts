export async function processPolaroid(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Add vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add film grain
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const grainAmount = 15;

      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * grainAmount;
        data[i] = Math.max(0, Math.min(255, data[i] + grain)); // R
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain)); // G
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain)); // B
      }
      ctx.putImageData(imageData, 0, 0);

      // Add date stamp (bottom right, retro style)
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().slice(-2)}`;
      ctx.fillStyle = '#ff6b35';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(dateStr, canvas.width - 20, canvas.height - 20);

      // Add light leak effect (subtle orange/yellow overlay)
      const leakGradient = ctx.createLinearGradient(0, 0, canvas.width * 0.3, canvas.height * 0.3);
      leakGradient.addColorStop(0, 'rgba(255, 200, 100, 0.15)');
      leakGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = leakGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = imageDataUrl;
  });
}

