// Utility functions for image processing

/**
 * Compress and resize image to reduce localStorage usage
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default: 150px)
 * @param {number} maxHeight - Maximum height (default: 150px) 
 * @param {number} quality - JPEG quality 0-1 (default: 0.7)
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = (file, maxWidth = 150, maxHeight = 150, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Check localStorage usage
 * @returns {object} - Usage statistics
 */
export const getStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  
  const totalMB = (total / (1024 * 1024)).toFixed(2);
  const limitMB = 5; // Approximate localStorage limit
  const usagePercent = ((total / (limitMB * 1024 * 1024)) * 100).toFixed(1);
  
  return {
    totalBytes: total,
    totalMB,
    usagePercent,
    limitMB
  };
};

/**
 * Clean up old user data if storage is getting full
 */
export const cleanupStorage = () => {
  const usage = getStorageUsage();
  
  if (parseFloat(usage.usagePercent) > 80) {
    console.warn('localStorage usage is high:', usage);
    
    // Could implement cleanup logic here
    // For now, just warn the user
    return false;
  }
  
  return true;
};