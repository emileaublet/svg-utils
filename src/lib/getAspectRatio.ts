export function getAspectRatio(width: number, height: number) {
  // Euclidean algorithm for GCD
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return [w, h];
}
