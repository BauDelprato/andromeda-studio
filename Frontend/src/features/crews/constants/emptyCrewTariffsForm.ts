import type {
  CrewTariffFieldConfig,
  CrewTariffSectionConfig,
  CrewTariffsFormValues,
} from "../types/crewTariff";

export const CREW_TARIFF_SECTIONS: ReadonlyArray<CrewTariffSectionConfig> = [
  {
    key: "elite",
    crewLevel: 2,
    title: "Grupos Elite",
  },
  {
    key: "competition",
    crewLevel: 1,
    title: "Grupos Competencia",
  },
  {
    key: "recreational",
    crewLevel: 0,
    title: "Grupos Recreativos",
  },
];

export const CREW_TARIFF_FIELDS: ReadonlyArray<CrewTariffFieldConfig> = [
  {
    key: "regularFee",
    label: "Cuota Regular",
  },
  {
    key: "payment1To5",
    label: "Abonando del 1 - 5",
  },
  {
    key: "payment6To10",
    label: "Abonando del 6 - 10",
  },
];

export const EMPTY_CREW_TARIFFS_FORM: CrewTariffsFormValues = {
  elite: {
    regularFee: "",
    payment1To5: "",
    payment6To10: "",
  },
  competition: {
    regularFee: "",
    payment1To5: "",
    payment6To10: "",
  },
  recreational: {
    regularFee: "",
    payment1To5: "",
    payment6To10: "",
  },
};
