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
    new Promise<Buffer>((resolve, reject) =>
      inkjet.decode(buf, (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      }),
    ),
  encode: (buf: Buffer, options: object) =>
    new Promise<Buffer>((resolve, reject) =>
      inkjet.encode(buf, options, (err, encoded) => {
        if (err) return reject(err);
        return resolve(encoded);
      }),
    ),
  exif: (buf: Buffer) =>
    new Promise<object>((resolve, reject) =>
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

console.log('inkjet', inkjet, EXIF_TRANSFORMS);
