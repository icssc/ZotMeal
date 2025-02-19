/** Darken or lighten a color by an amount. */
export function colorShade(color: string, amount: number) {
  color = color.replace(/^#/, "");
  if (color.length === 3)
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];

  let [r, g, b] = color.match(/.{2}/g)!;
  let [rn, gn, bn] = [
    parseInt(r, 16) + amount,
    parseInt(g, 16) + amount,
    parseInt(b, 16) + amount,
  ];

  r = Math.max(Math.min(255, rn), 0).toString(16);
  g = Math.max(Math.min(255, gn), 0).toString(16);
  b = Math.max(Math.min(255, bn), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
}

/** Return white or black text color depending on luminance. */
export function getContrastText(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance =
    (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/** Return a color string from a string hash. */
export function stringToColor(str: string) {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
}
