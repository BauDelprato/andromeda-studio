import type { CrewLevel } from "./crew";

export type CrewTariffGroupKey = "elite" | "competition" | "recreational";

export type CrewTariffFieldKey =
  | "regularFee"
  | "payment1To5"
  | "payment6To10";

export interface CrewTariffTierFormValues {
  regularFee: string;
  payment1To5: string;
  payment6To10: string;
}

export type CrewTariffsFormValues = Record<
  CrewTariffGroupKey,
  CrewTariffTierFormValues
>;

export interface CrewTariffSectionConfig {
  key: CrewTariffGroupKey;
  crewLevel: CrewLevel;
  title: string;
}

export interface CrewTariffFieldConfig {
  key: CrewTariffFieldKey;
  label: string;
}

/**
 * Contratos preparados para la futura integración con ASP.NET Core Web API
 */
export interface CrewTariffTierAmounts {
  crewLevel: CrewLevel;
  regularFee: number;
  payment1To5: number;
  payment6To10: number;
}

export interface SaveCrewTariffsRequest {
  tariffs: CrewTariffTierAmounts[];
}
