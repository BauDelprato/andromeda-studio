export type CrewLevel = 0 | 1 | 2;

export interface Crew {
  id: number;
  name: string;
  level: CrewLevel;
  age: number;
  size: number;
}

export interface CreateCrewFormData {
  name: string;
  level: CrewLevel;
  age: number;
  size: number;
}

export interface CrewCategory {
  id: number;
  name: string;
  groupCount: number;
  type: "main" | "other";
}