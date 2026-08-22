export interface SyntheticFarmerFixture {
  readonly farmerId: string;
  readonly demoPin: string;
  readonly name: { readonly en: string; readonly mr: string; readonly hi: string; readonly kn: string };
  readonly village: { readonly en: string; readonly mr: string; readonly hi: string; readonly kn: string };
  readonly district: string;
  readonly scenario: string;
  readonly synthetic: true;
}

export const SYNTHETIC_DEMO_FARMERS: readonly SyntheticFarmerFixture[] = [
  {
    farmerId: '27202600000001',
    demoPin: '2468',
    name: {
      en: 'Namdev Tukaram Shinde',
      mr: 'नामदेव तुकाराम शिंदे',
      hi: 'नामदेव तुकाराम शिंदे',
      kn: 'ನಾಮದೇವ ತುಕಾರಾಮ ಶಿಂಧೆ',
    },
    village: {
      en: 'Pashan',
      mr: 'पाषाण',
      hi: 'पाषाण',
      kn: 'ಪಾಶಾಣ',
    },
    district: 'Pune',
    scenario: 'Joint Owner (50% share on Survey 123/1A), Soybean & Tur, Eligible for Drip & KCC',
    synthetic: true,
  },
  {
    farmerId: '27202600000002',
    demoPin: '2468',
    name: {
      en: 'Savitri Bai Patil',
      mr: 'सावित्री बाई पाटील',
      hi: 'सावित्री बाई पाटिल',
      kn: 'ಸಾವಿತ್ರಿ ಬಾಯಿ ಪಾಟೀಲ',
    },
    village: {
      en: 'Baramati',
      mr: 'बारामती',
      hi: 'बारामती',
      kn: 'ಬಾರಾಮತಿ',
    },
    district: 'Pune',
    scenario: 'Solo Owner (100% share on Survey 45/2), Sugarcane, Ready for Mechanization Subsidy',
    synthetic: true,
  },
  {
    farmerId: '27202600000003',
    demoPin: '2468',
    name: {
      en: 'Ramesh Vithal Ghadge',
      mr: 'रमेश विठ्ठल घाडगे',
      hi: 'रमेश विट्ठल घाडगे',
      kn: 'ರಮೇಶ ವಿಠ್ಠಲ ಘಾಡ್ಗೆ',
    },
    village: {
      en: 'Haveli',
      mr: 'हवेली',
      hi: 'हवेली',
      kn: 'ಹವೇಲಿ',
    },
    district: 'Pune',
    scenario: 'Partial Source Timeout Test Case (ULI simulated delayed response)',
    synthetic: true,
  },
] as const;

export const ALLOWLISTED_FARMER_IDS = new Set(SYNTHETIC_DEMO_FARMERS.map((f) => f.farmerId));

export function isAllowlistedFarmerId(farmerId: string): boolean {
  return ALLOWLISTED_FARMER_IDS.has(farmerId);
}
