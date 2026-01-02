export const mapBuildTypeToId = (buildType: string): number => {
  const mapping: Record<string, number> = {
    "New Build": 2,
    "Retrofit or Refurbishment": 1,
  };
  return mapping[buildType];
};

export const mapSubstrateToId = (substrate: string): number => {
  const mapping: Record<string, number> = {
    "Standard Brick": 2,
    "Block": 3,
    "Other Masonry (Cavity, Stone, Clay)": 4,
    "Park Home": 5,
    "Timber Frame / SIPS": 6,
    "Metal Frame": 7,
    "ICF": 8,
    "Other": 1,
  };
  return mapping[substrate] || 1;
};

export const mapSystemToId = (system: string): number => {
  const mapping: Record<string, number> = {
    "EWI EPS": 1,
    "EWI Mineral Wool": 2,
    "EWI K5": 3,
    "Render Only": 4,
    "Durashield Pro (Innovation System)": 5,
  };
  return mapping[system] || 1;
};

export const mapWarrantyProviderToId = (provider: string): number => {
  const mapping: Record<string, number> = {
    "None": 0,
    "SWIGA": 2,
    "IAA": 3,
    "Quality Mark": 4,
    "Other": 1,
  };
  return mapping[provider] || 0;
};

export const cleanAddress = (value: any): string => {
  return typeof value === "string" ? value : "";
};
