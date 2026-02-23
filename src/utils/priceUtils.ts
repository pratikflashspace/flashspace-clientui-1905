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
  if (typeof priceStr === "number") return priceStr;

  const match = priceStr.toString().match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

/**
 * Generates the standardized pricing structure for a Virtual Office.
 * Includes calculated yearly prices.
 */
export const getVirtualOfficePricing = (
  spaceDetails: VirtualOfficeItem | null,
): PricingStructure | null => {
  if (!spaceDetails) return null;

  // Prioritize new numeric fields from backend, fallback to legacy string parsing
  const gstPriceYearly =
    spaceDetails.gstPlanPricePerYear !== undefined
      ? spaceDetails.gstPlanPricePerYear
      : parsePrice(spaceDetails.gstPlanPriceYearly);

  const mailingPriceYearly =
    spaceDetails.mailingPlanPricePerYear !== undefined
      ? spaceDetails.mailingPlanPricePerYear
      : parsePrice(spaceDetails.mailingPlanPriceYearly);

  const brPriceYearly =
    spaceDetails.brPlanPricePerYear !== undefined
      ? spaceDetails.brPlanPricePerYear
      : parsePrice(spaceDetails.brPlanPriceYearly);

  // For monthly price, if we only have yearly, we can estimate it, or use legacy
  const gstPriceMonthly = parsePrice(
    spaceDetails.gstPlanPrice || spaceDetails.price,
  );
  const mailingPriceMonthly = parsePrice(
    spaceDetails.mailingPlanPrice || spaceDetails.price,
  );
  const brPriceMonthly = parsePrice(
    spaceDetails.brPlanPrice || spaceDetails.price,
  );

  return {
    gst: {
      key: "gst",
      name: "GST Plan",
      monthlyPrice: gstPriceMonthly,
      yearlyPrice: gstPriceYearly || gstPriceMonthly * 12,
      features: ["Virtual Address", "GST Registration", "Mail Handling"],
    },
    mailing: {
      key: "mailing",
      name: "Mailing Plan",
      monthlyPrice: mailingPriceMonthly,
      yearlyPrice: mailingPriceYearly || mailingPriceMonthly * 12,
      features: ["Mail Handling", "Courier Receipt"],
    },
    br: {
      key: "br",
      name: "BR Plan",
      monthlyPrice: brPriceMonthly,
      yearlyPrice: brPriceYearly || brPriceMonthly * 12,
      features: ["Business Registration", "Lounge Access", "Meeting Rooms"],
    },
  };
};
