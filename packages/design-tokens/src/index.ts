export const brand = {
  name: "HerPages",
  tagline: "An app that grows with her.",
  midnightPlum: "#2C2138",
  auroraViolet: "#806BF2",
  coralGlow: "#FF7F86",
  pearl: "#FAF8FC",
  graphite: "#45414B",
} as const;

export const semantic = {
  light: {
    background: "#FAF8FC",
    surface: "#FFFFFF",
    text: "#2C2138",
    mutedText: "#45414B",
    action: "#6852C7",
    onAction: "#FFFFFF",
    border: "#817887",
    success: "#13745A",
    successSurface: "#E9F7EF",
    warning: "#815900",
    warningSurface: "#FFF4D5",
    danger: "#B4233B",
    dangerSurface: "#FFF0F2",
    focus: "#6852C7",
  },
  dark: {
    background: "#17141F",
    surface: "#24202D",
    text: "#F3EFF7",
    mutedText: "#D6CFDF",
    action: "#B59BFF",
    onAction: "#2C2138",
    border: "#968AA1",
    success: "#83D8B5",
    warning: "#F0CC79",
    danger: "#FFB1BB",
    focus: "#B59BFF",
  },
} as const;

export const stages = {
  first_pages: { accent1: "#C9C4FF", accent2: "#A9E4DC", warm: "#FFD6B8", surface: "#FFFCF7" },
  wonder: { accent1: "#8586FF", accent2: "#89E5CA", warm: "#FFC96B", surface: "#F9FAFF" },
  bloom: { accent1: "#A997FF", accent2: "#72D8C3", warm: "#FF9A82", surface: "#FBFAFE" },
  aura: { accent1: "#A980F8", accent2: "#A8D8EA", warm: "#D9869E", surface: "#FBF9FD" },
  horizon: { accent1: "#6657E8", accent2: "#19B6A5", warm: "#FF766D", surface: "#FAF8FC" },
  rise: { accent1: "#4E4BC8", accent2: "#27A99A", warm: "#E77C76", surface: "#FAF8F4" },
  momentum: { accent1: "#267F7D", accent2: "#8B6C9E", warm: "#C9796F", surface: "#FAF7F2" },
  rooted: { accent1: "#4B324B", accent2: "#81977D", warm: "#B26F78", surface: "#F7F3EC" },
  flourish: { accent1: "#245D70", accent2: "#9A80B8", warm: "#D49B76", surface: "#FBF8F2" },
  evergreen: { accent1: "#285F52", accent2: "#B29BC7", warm: "#C09A63", surface: "#FAF8F1" },
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 48] as const;

export const radii = {
  control: 12,
  card: 20,
  playful: 28,
} as const;

export const typography = {
  body: 17,
  lineHeight: 26,
  captionMinimum: 14,
  textScaling: true,
} as const;
