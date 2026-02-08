export const TYPE_UI = {
  online: "أونلاين",
  recorded: "أوفلاين",
  free: "مجاني",
};

export const LEVEL_UI = {
  beginner: "مبتدئ",
  medium: "متوسط",
  expert: "متقدم",
};

// Helpers (اختياري لكن مفيد)
export const renderType = (type) => TYPE_UI[type] ?? type ?? "—";
export const renderLevel = (level) => LEVEL_UI[level] ?? level ?? "—";
