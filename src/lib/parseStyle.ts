export function parseStyle(style: string): Record<string, string> {
  return style
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .reduce((acc, decl) => {
      const [prop, val] = decl.split(":").map((s) => s.trim());
      if (prop && val) acc[prop] = val;
      return acc;
    }, {} as Record<string, string>);
}
