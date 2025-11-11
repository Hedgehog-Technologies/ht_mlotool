const getLabelRank = (label: string) => {
  switch (label) {
    case 'alpha': return 0;
    case 'beta': return 1;
    case 'pre': return 2;
    default: return 3; // unknown labels come after known ones (treated as greater)
  }
}

export const parseSemVer = (s: string) => {
  let str = s.toLowerCase().replace(/^v/, '');
  str = str.split('+')[0]; // Remove build metadata

  const [version, suffix] = str.split('-');
  const versionParts = version.split('.');

  let suffixLabel = "";
  let suffixNum = 0;
  let hasSuffix = false;

  if (suffix) {
    if (!suffix.startsWith("priv")) {
      const tokens = suffix.split('.');
      suffixLabel = tokens[0];

      if (tokens[1] !== undefined) {
        const parsed = Number(tokens[1]);
        suffixNum = Number.isFinite(parsed) ? parsed : 0;
      }

      hasSuffix = !!suffixLabel;
    }
  }

  return { versionParts, suffixLabel, suffixNum, hasSuffix };
}

export const semverCompare = (a?: string, b?: string): number => {
  if (!a || !b) return 0;

  const pa = parseSemVer(a);
  const pb = parseSemVer(b);

  // Compare numeric version parts
  for (let i = 0; i < Math.max(pa.versionParts.length, pb.versionParts.length); i++) {
    const na = pa.versionParts[i] || 0;
    const nb = pb.versionParts[i] || 0;

    if (na > nb) return 1;
    if (na < nb) return -1;
  }

  // Numeric parts equal -> handle prerelease semantics
  if (!pa.hasSuffix && !pb.hasSuffix) return 0;

  // Release > Prerelease
  if (!pa.hasSuffix && pb.hasSuffix) return 1;
  if (pa.hasSuffix && !pb.hasSuffix) return -1;

  const ra = getLabelRank(pa.suffixLabel);
  const rb = getLabelRank(pb.suffixLabel);
  if (ra < rb) return -1;
  if (ra > rb) return 1;

  // Same label -> compare number prerelease suffix if present
  if (pa.suffixNum < pb.suffixNum) return -1;
  if (pa.suffixNum > pb.suffixNum) return 1;

  return 0;
}
