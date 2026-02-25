export interface KYCUserInfo {
	_id?: string;
	fullName?: string;
	email?: string;
	phoneNumber?: string;
}

export interface KYCPersonalInfo {
	fullName?: string;
	email?: string;
	phone?: string;
}

export interface KYCBusinessInfo {
	companyName?: string;
	gstNumber?: string;
	panNumber?: string;
}

export interface KYCDocument {
	_id?: string;
	type: string;
	name?: string;
	fileUrl?: string;
	status?: string;
	uploadedAt?: string;
	verifiedAt?: string;
	rejectionReason?: string;
}

export interface KYCRequest {
	_id: string;
	user?: KYCUserInfo;
	profileName?: string;
	kycType?: 'individual' | 'business' | string;
	isPartner?: boolean;
	overallStatus: 'not_started' | 'pending' | 'approved' | 'rejected' | 'resubmit' | string;
	progress?: number;
	personalInfo?: KYCPersonalInfo;
	businessInfo?: KYCBusinessInfo;
	documents?: KYCDocument[];
	createdAt: string;
}

