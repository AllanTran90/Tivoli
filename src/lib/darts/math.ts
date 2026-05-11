export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function getDistance(dx: number, dy: number) {
  return Math.sqrt(dx * dx + dy * dy);
}
