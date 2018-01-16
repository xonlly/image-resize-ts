import inkjet from 'inkjet';

const EXIF_TRANSFORMS: any = {
  1: { rotate: 0, flip: false },
  2: { rotate: 0, flip: true },
  3: { rotate: Math.PI, flip: false },
  4: { rotate: Math.PI, flip: true },
  5: { rotate: Math.PI * 1.5, flip: true },
  6: { rotate: Math.PI * 0.5, flip: false },
  7: { rotate: Math.PI * 0.5, flip: true },
  8: { rotate: Math.PI * 1.5, flip: false },
};

let inkjetPromised = {
  decode: (buf: Buffer) =>
    new Promise<any>((resolve, reject) =>
      inkjet.decode(buf, (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      }),
    ),
  encode: (buf: Buffer, options?: object) =>
    new Promise<Buffer>((resolve, reject) =>
      inkjet.encode(buf, options, (err, encoded) => {
        if (err) return reject(err);
        return resolve(encoded);
      }),
    ),
  exif: (buf: Buffer) =>
    new Promise<any>((resolve, reject) =>
      inkjet.exif(buf, (err, metadata) => {
        if (err) return reject(err);
        return resolve(metadata);
      }),
    ),
};

const transformCanvas = (
  ctx: CanvasRenderingContext2D,
  degrees = 0,
  flip = false,
): CanvasRenderingContext2D => {
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.rotate(degrees);
  if (flip) {
    ctx.scale(-1, 1);
  }
  return ctx;
};

const exifTransformCanvas = (
  ctx: CanvasRenderingContext2D,
  orientation: any,
): CanvasRenderingContext2D => {
  const transform = EXIF_TRANSFORMS[orientation];
  if (transform) {
    return transformCanvas(ctx, transform.rotate, transform.flip);
  }
  return ctx;
};

const getCanvasForImage = (
  image: ImageData, // TODO: need update for this
  maxWidth: number,
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  let w = image.width;
  let h = image.height;

  if (maxWidth && w > maxWidth) {
    const ratio = w / h;
    w = maxWidth;
    h = w / ratio;
  }

  canvas.width = w;
  canvas.height = h;
  return canvas;
};

const createImage = (binary: Buffer): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>(resolve => {
    const blob = new Blob([binary]);
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    image.onload = () => resolve(image);
  });


const rotateAndResize = async (
  inkjetImage: any,
  exifOrientationId: number,
  maxWidth = 800,
): Promise<Buffer | Blob | object> => {
  if (!EXIF_TRANSFORMS[exifOrientationId]) return inkjetImage;

  const canvas = getCanvasForImage(inkjetImage, maxWidth);
  const image = await createImage(inkjetImage.data);
  const w = canvas.width;
  const h = canvas.height;

  if (exifOrientationId > 4) {
    const temp = canvas.width;
    canvas.width = canvas.height;
    canvas.height = temp;
  }

  const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);

  ctx.drawImage(
    image,
    0,
    0,
    inkjetImage.width,
    inkjetImage.height,
    -w / 2,
    -h / 2,
    w,
    h,
  );

  if (typeof canvas.toBlob !== 'undefined') {
    return new Promise(resolve => canvas.toBlob(resolve));
  } else if (typeof canvas.msToBlob !== 'undefined') {
    return canvas.msToBlob();
  }

  return inkjetImage.data;
};


const Resizer = async (binary: Buffer, quality = 100, maxWidth = 800) => {
  try {
    const { data, width, height } = await inkjetPromised.decode(binary);
    const imageEncoded = await inkjetPromised.encode(data, {
      quality,
      width,
      height,
    });

    const metadata = await inkjetPromised.exif(binary);
    let orientation = 1;
    if (metadata.Orientation) orientation = metadata.Orientation.value;

    const image = await rotateAndResize(imageEncoded, orientation, maxWidth);
    return image;
  } catch (e) {
    return binary;
  }
};

export default Resizer;
