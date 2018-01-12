export function decode(
  buf: Buffer,
  options: object,
  cb: (buf: Buffer) => void,
): void;

export function encode(
  buf: Buffer,
  options: object,
  cb: (buf: Buffer) => void,
): any;

export function exif(
  buf: Buffer,
  options: object,
  cb: (buf: Buffer) => void,
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
