export function decode(
  buf: Buffer,
  cb: (err: object | boolean, decoded: Buffer) => any,
): void;

export function encode(
  buf: Buffer,
  options: object,
  cb: (err: object | boolean, encoded: Buffer) => any,
): any;

export function exif(
  buf: Buffer,
  cb: (err: object | boolean, metadata: object) => any,
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
