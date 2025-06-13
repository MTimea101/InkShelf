import cloudinary from '../config/cloudinary.js';

export const getImageUrl = (cover) => {
  if (!cover) return null;

  // If it's already a full URL (Cloudinary), return as is
  if (cover.startsWith('http://') || cover.startsWith('https://')) {
    return cover;
  }

  // If it's a local filename, prepend the uploads path
  return `/uploads/${cover}`;
};

export const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 300,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    ...options,
  };

  return cloudinary.url(publicId, defaultOptions);
};

export const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return null;
  }

  // Extract public ID from URL pattern
  const match = cloudinaryUrl.match(/\/v\d+\/(?<publicId>.+)\./u);
  return match ? match.groups.publicId : null;
};

export const isCloudinaryImage = (cover) => {
  return cover && (cover.startsWith('http://') || cover.startsWith('https://')) && cover.includes('cloudinary.com');
};

export const imageUrl = (cover, transformOptions = {}) => {
  if (!cover) return null;

  if (isCloudinaryImage(cover)) {
    const publicId = extractPublicId(cover);
    if (publicId && Object.keys(transformOptions).length > 0) {
      return getOptimizedImageUrl(publicId, transformOptions);
    }
    return cover;
  }

  return getImageUrl(cover);
};

export const getResponsiveImages = (cover) => {
  if (!isCloudinaryImage(cover)) {
    const localUrl = getImageUrl(cover);
    return {
      thumbnail: localUrl,
      small: localUrl,
      medium: localUrl,
      large: localUrl,
      original: localUrl,
    };
  }

  const publicId = extractPublicId(cover);
  if (!publicId) return null;

  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 200 }),
    small: getOptimizedImageUrl(publicId, { width: 200, height: 280 }),
    medium: getOptimizedImageUrl(publicId, { width: 300, height: 400 }),
    large: getOptimizedImageUrl(publicId, { width: 500, height: 700 }),
    original: cloudinary.url(publicId),
  };
};
