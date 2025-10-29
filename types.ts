export type DeviceType = 'phone' | 'laptop';
export type Currency = 'USD' | 'INR';
export type User = { 
  name: string;
  email?: string;
};

export const USD_TO_INR_RATE = 83;

export interface CustomizationOption {
  selection: string;
  reason: string;
  price: number;
}

export interface Customization {
  component: string;
  selection: string;
  reason: string;
  price: number;
  options: CustomizationOption[];
}

export interface PerformanceBenchmarks {
  cpuScore: number;
  gpuScore: number;
  summary: string;
}

export interface CustomConfiguration {
  deviceType: DeviceType;
  deviceName: string;
  description: string;
  designDescription: string;
  basePrice: number;
  customizations: Customization[];
  totalPrice: number;
  imageUrl?: string;
  performanceBenchmarks: PerformanceBenchmarks;
}

export interface AdvisorCriteria {
    deviceType: DeviceType;
    priceRange: string;
    priorities: string;
}

export interface AdvisorResultData {
    deviceName: string;
    company: string;
    description: string;
    approximatePriceUSD: number;
    keySpecs: string[];
    pros: string[];
    cons: string[];
    reasoning: string;
    imageUrl?: string;
    groundingSources?: { uri: string; title: string }[];
}