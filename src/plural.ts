const suffixes = [
  "_zero",
  "_one",
  "_many",
  "_other",
  "_two",
  "_few",
  "_interval",
];

export function removeSuffixes(str: string) {
  for (const suffix of suffixes) {
    if (str.endsWith(suffix)) {
      str = str.slice(0, -suffix.length);
      break;
    }
  }
  return str;
}
