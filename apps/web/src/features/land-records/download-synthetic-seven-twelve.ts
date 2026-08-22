export interface SyntheticSevenTwelveHolding {
  readonly surveyNumber: string;
  readonly ulpinMasked: string;
  readonly village: string;
  readonly shareLabel: string;
  readonly allocatedCultivableHectares: string;
  readonly encumbrancePresent: boolean;
}

export interface SyntheticSevenTwelveDownloadInput {
  readonly farmerIdMasked: string;
  readonly farmerName: string;
  readonly generatedAt: string;
  readonly totalCultivableShareHectares: string;
  readonly holdings: readonly SyntheticSevenTwelveHolding[];
  readonly labels: {
    readonly documentTitle: string;
    readonly prototypeNotice: string;
    readonly farmerName: string;
    readonly farmerId: string;
    readonly generatedAt: string;
    readonly totalArea: string;
    readonly holding: string;
    readonly surveyNumber: string;
    readonly ulpin: string;
    readonly village: string;
    readonly ownership: string;
    readonly allocatedShare: string;
    readonly encumbrance: string;
    readonly yes: string;
    readonly no: string;
  };
}

export function downloadSyntheticSevenTwelve(input: SyntheticSevenTwelveDownloadInput): void {
  const lines = [
    input.labels.documentTitle,
    input.labels.prototypeNotice,
    '',
    `${input.labels.farmerName}: ${input.farmerName}`,
    `${input.labels.farmerId}: ${input.farmerIdMasked}`,
    `${input.labels.generatedAt}: ${input.generatedAt}`,
    `${input.labels.totalArea}: ${input.totalCultivableShareHectares}`,
    '',
  ];

  input.holdings.forEach((holding, index) => {
    lines.push(
      `${input.labels.holding} ${index + 1}`,
      `${input.labels.surveyNumber}: ${holding.surveyNumber}`,
      `${input.labels.ulpin}: ${holding.ulpinMasked}`,
      `${input.labels.village}: ${holding.village}`,
      `${input.labels.ownership}: ${holding.shareLabel}`,
      `${input.labels.allocatedShare}: ${holding.allocatedCultivableHectares}`,
      `${input.labels.encumbrance}: ${holding.encumbrancePresent ? input.labels.yes : input.labels.no}`,
      ''
    );
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `krishisetu-synthetic-7-12-${input.farmerIdMasked.slice(-4)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
