
export const AGE_OPTIONS = [
  { value: 0, label: "Baby" },
  { value: 1, label: "Junior A" },
  { value: 2, label: "Junior B" },
  { value: 3, label: "Varsity A" },
  { value: 4, label: "Varsity Adult" },
  { value: 5, label: "Senior" },
] as const satisfies ReadonlyArray<{ value: number; label: string }>;
