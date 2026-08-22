/**
 * Authoritative Product Configuration for KrishiSetu.
 * Single source of truth for product name, motto key, prototype flags, and branding strings.
 */
export const productConfig = {
  id: 'krishisetu',
  name: 'KrishiSetu',
  marathiName: 'कृषीसेतू',
  mottoKey: 'brand.motto',
  sanskritMotto: 'अन्नदः सर्वदश्चैव',
  mottoMeaning: 'The provider of food is the provider of everything.',
  prototype: true,
  supportContactKey: 'support.contact',
  disclosureText: 'Hackathon prototype • Not a government website • All records are fictional',
  disclosureKey: 'brand.prototypeDisclosure',
  version: '0.1.0',
} as const;

export type ProductConfig = typeof productConfig;
