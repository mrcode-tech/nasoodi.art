declare module "*.JPG" {
  const image: import("next/image").StaticImageData;
  export default image;
}
