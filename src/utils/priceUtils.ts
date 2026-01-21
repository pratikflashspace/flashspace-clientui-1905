
import { VirtualOfficeItem } from "@/types/services";

export interface PlanDetails {
  key: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export interface PricingStructure {
  gst: PlanDetails;
  mailing: PlanDetails;
  br: PlanDetails;
}

/**
 * Parses a price string (e.g. "₹1,000" or "1000") into a number.
 */
export const parsePrice = (priceStr: string | number | undefined): number => {
  if (priceStr === undefined || priceStr === null) return 0;
  if (typeof priceStr === 'number') return priceStr;

  const match = priceStr.toString().match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
};

/**
 * Generates the standardized pricing structure for a Virtual Office.
 * Includes calculated yearly prices.
 */
export const getVirtualOfficePricing = (spaceDetails: VirtualOfficeItem | null): PricingStructure | null => {
  if (!spaceDetails) return null;

  const gstPrice = parsePrice(spaceDetails.gstPlanPrice || spaceDetails.price);
  const mailingPrice = parsePrice(spaceDetails.mailingPlanPrice || spaceDetails.price);
  const brPrice = parsePrice(spaceDetails.brPlanPrice || spaceDetails.price);

  const gstPriceYearly = parsePrice(spaceDetails.gstPlanPriceYearly);
  const mailingPriceYearly = parsePrice(spaceDetails.mailingPlanPriceYearly);
  const brPriceYearly = parsePrice(spaceDetails.brPlanPriceYearly);

  // Helper to prioritize explicit yearly price but fallback to calculation
  const resolveYearly = (monthly: number, yearlyExplicit: number) => {
    return yearlyExplicit > 0 ? yearlyExplicit : monthly * 12;
  };

  return {
    gst: {
      key: "gst",
      name: "GST Plan",
      monthlyPrice: gstPrice,
      yearlyPrice: resolveYearly(gstPrice, gstPriceYearly),
      features: ["Virtual Address", "GST Registration", "Mail Handling"]
    },
    mailing: {
      key: "mailing",
      name: "Mailing Plan",
      monthlyPrice: mailingPrice,
      yearlyPrice: resolveYearly(mailingPrice, mailingPriceYearly),
      features: ["Mail Handling", "Courier Receipt"]
    },
    br: {
      key: "br",
      name: "BR Plan",
      monthlyPrice: brPrice,
      yearlyPrice: resolveYearly(brPrice, brPriceYearly),
      features: ["Business Registration", "Lounge Access", "Meeting Rooms"]
    },
  };
};
