export type CrewLevel = 0 | 1 | 2;
export type CrewSize = 0 | 1 | 2; 

export interface Crew {
  id: number;
  name: string;
  level: CrewLevel;
  age: number;
  size: CrewSize;
}

export interface CreateCrewFormData {
  name: string;
  level: CrewLevel;
  age: number;
  size: CrewSize;
}

export interface CrewCategory {
  id: number;
  name: string;
  groupCount: number;
  type: "main" | "other";
}

export function getCrewMaxCapacity(size: CrewSize): number {
  switch (size) {
    case 0: return 4;
    case 1: return 9;
    case 2: return 40;
    default: return 9;
  }
}