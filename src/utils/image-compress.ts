/**
 * Image compression utility functions
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

/**
 * Compress image
 * @param file Original image file
 * @param options Compression options
 * @returns Compressed File object
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 4096,
    maxHeight = 4096,
    quality = 0.9,
    maxSizeMB = 20,
  } = options;

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Image too large, please upload images smaller than ${maxSizeMB}MB`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Unable to create Canvas context'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('File parsing failed, please check if the file is corrupted'));
    };

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Batch compress images
 */
export async function compressImages(
  files: File[],
  options?: CompressOptions
): Promise<File[]> {
  const results = await Promise.allSettled(
    files.map((file) => compressImage(file, options))
  );

  const compressed: File[] = [];
  const errors: Error[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      compressed.push(result.value);
    } else {
      errors.push(new Error(`${files[index].name}: ${result.reason.message}`));
    }
  });

  if (errors.length > 0 && compressed.length === 0) {
    throw errors[0];
  }

  return compressed;
}
