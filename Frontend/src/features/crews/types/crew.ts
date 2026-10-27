export type CrewLevel = 0 | 1 | 2;
export type CrewSize = 0 | 1 | 2; 

export interface Crew {
  id: number;
  name: string;
  level: CrewLevel;
  age: number;
  size: CrewSize;
}

export interface CrewFormData {
  name: string;
  level: CrewLevel;
  age: number;
  size: CrewSize;
}

export interface CrewCreateFormValues {
  name: string;
  level: CrewLevel | "";
  age: number | "";
  size: CrewSize | "";
}

export interface CrewCategory {
  id: number;
  name: string;
  groupCount: number;
  type: "main" | "other";
}

export const CREW_LEVEL_NAMES: Record<CrewLevel, string> = {
  0: "Recreativo",
  1: "Competencia",
  2: "Elite",
};

export const CREW_MAX_CAPACITY: Record<CrewSize, number> = {
  0: 4,
  1: 9,
  2: 40,
};

export function getCrewMaxCapacity(size: CrewSize): number {
  return CREW_MAX_CAPACITY[size];
}
