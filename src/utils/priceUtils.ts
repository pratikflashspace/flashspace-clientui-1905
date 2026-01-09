
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
export const parsePrice = (priceStr: string | undefined): number => {
  if (!priceStr) return 0;
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

  return {
    gst: { 
      key: "gst",
      name: "GST Plan", 
      monthlyPrice: gstPrice,
      yearlyPrice: gstPrice * 12, 
      features: ["Virtual Address", "GST Registration", "Mail Handling"] 
    },
    mailing: { 
      key: "mailing",
      name: "Mailing Plan", 
      monthlyPrice: mailingPrice,
      yearlyPrice: mailingPrice * 12, 
      features: ["Mail Handling", "Courier Receipt"] 
    },
    br: { 
      key: "br",
      name: "BR Plan", 
      monthlyPrice: brPrice,
      yearlyPrice: brPrice * 12, 
      features: ["Business Registration", "Lounge Access", "Meeting Rooms"] 
    },
  };
};
