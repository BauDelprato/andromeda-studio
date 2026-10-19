import { getCrewMaxCapacity, type CrewSize} from "@/features/crews/types/crew";


export const SIZE_OPTIONS: Array<{ value: CrewSize; label: string }> = [
  { value: 0, label: `Mini Crew · hasta ${getCrewMaxCapacity(0)} integrantes` },
  { value: 1, label: `Crew · hasta ${getCrewMaxCapacity(1)} integrantes` },
  { value: 2, label: `Mega Crew · hasta ${getCrewMaxCapacity(2)} integrantes` },
];