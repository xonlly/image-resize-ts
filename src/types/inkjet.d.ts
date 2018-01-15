export function decode(
  buf: Buffer,
  cb: (err: object | boolean, decoded: Buffer) => void,
): void;

export function encode(
  buf: Buffer,
  options: object,
  cb: (err: object | boolean, encoded: Buffer) => void,
): any;

export function exif(
  buf: Buffer,
  cb: (err: object | boolean, metadata: object) => void,
): void;

export function info(buf: Buffer, cb: () => void): void;

export function magic(buf: Buffer, cb: () => void): void;

export namespace decode {
  const prototype: {};
}

export namespace encode {
  const prototype: {};
}

export namespace exif {
  const prototype: {};
}

export namespace info {
  const prototype: {};
}

export namespace magic {
  const prototype: {};
}
