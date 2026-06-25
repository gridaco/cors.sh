/**
 * Wrap a response body stream in a byte counter for bandwidth metering (PRD §4.4,
 * verified in spike 7.5). Counts pass-through bytes without buffering; fires `onBytes`
 * once the stream completes. Note: CF auto-decompresses gzip/br upstream bodies, so this
 * counts *decompressed* (logical) bytes — the chosen metering basis (PRD §4.4).
 */
export function meteredBody(
  body: ReadableStream<Uint8Array>,
  onBytes: (bytes: number) => void
): ReadableStream<Uint8Array> {
  let bytes = 0;
  const counter = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      bytes += chunk.byteLength;
      controller.enqueue(chunk);
    },
    flush() {
      onBytes(bytes);
    },
  });
  return body.pipeThrough(counter);
}
