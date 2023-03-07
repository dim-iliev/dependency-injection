export const parseDepdendecies = (instance: Function): string[] => {
  return ((instance + "").match(/\(.+\)/)?.[0] || "")
    .replace(/[\(\)]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter((d) => d);
}

