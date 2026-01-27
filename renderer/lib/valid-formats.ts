export const VALID_IMAGE_FORMATS = [
  "png",
  "jpg",
  "jpeg",
  "jfif",
  "webp",
] as const;

export type ImageFormat = (typeof VALID_IMAGE_FORMATS)[number];

export const isValidImageFormat = (ext: string): ext is ImageFormat =>
  (VALID_IMAGE_FORMATS as readonly string[]).includes(ext);
