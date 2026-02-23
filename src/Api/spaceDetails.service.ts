// Space Details Model
export type SpaceDetailsPayload = {
  userKyc: string;
  spaceName: string;
  sampleAgreement?: File;
  ownerOfPremisesName: string;
  propertyTaxReceipt?: File;
  overallStatus?: string;
  aadhaarDocument?: File;
  panDocument?: File;
};

// Example function (stub)
export function createSpaceDetails(payload: SpaceDetailsPayload) {
  // Implement API call here
  return Promise.resolve({ success: true });
}
