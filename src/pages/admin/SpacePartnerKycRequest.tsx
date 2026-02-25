import React, { useEffect, useState } from 'react';
import { getAllSpacePartnerKyc, SpaceUserKycResponse } from '@/Api/spacePartnerKyc.service';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SpacePartnerKycRequest() {
 const [kycList, setKycList] = useState<SpaceUserKycResponse[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);
		getAllSpacePartnerKyc()
			.then((data) => {
				setKycList(data);
				setError(null);
			})
			.catch((err) => {
				setError(err.message || 'Failed to fetch KYC requests');
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <div className="p-8 text-center text-lg">Loading space partner KYC requests...</div>;
	}
	if (error) {
		return <div className="p-8 text-center text-red-600">{error}</div>;
	}

	if (kycList.length === 0) {
		return <div className="p-8 text-center text-gray-600">No space partner KYC requests found.</div>;
	}

	 return (
		 <div className="space-y-6">
			 {kycList.map((kyc) => {
				 return (
					 <div
						 key={kyc._id}
						 className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-2"
					 >
						 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							 <div>
								 <h3 className="text-lg font-bold text-gray-900">{kyc.fullName}</h3>
								 <div className="text-gray-600 text-sm">{kyc.email} &bull; {kyc.phoneNumber}</div>
							 </div>
							 <div className="flex gap-2">
								 <button
									 className="ml-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition-colors flex items-center gap-1"
									 onClick={() => navigate(`/admin/kyc-partners/${kyc._id}`)}
								 >
									 View KYC
									 {kyc.overallStatus === 'approved' ? (
										 <CheckCircle2 className="w-4 h-4 text-green-500" />
									 ) : (
										 <XCircle className="w-4 h-4 text-red-400" />
									 )}
								 </button>
								 <button
									 className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold hover:bg-purple-200 transition-colors flex items-center gap-1"
									 onClick={() => navigate(`/admin/space-details/${kyc._id}`)}
								 >
									 View Space Info
									 {kyc.status === 'approved' ? (
										 <CheckCircle2 className="w-4 h-4 text-green-500" />
									 ) : (
										 <XCircle className="w-4 h-4 text-red-400" />
									 )}
								 </button>
							 </div>
						 </div>
					 </div>
				 );
			 })}
		 </div>
	 );
// Removed all code below the return statement to fix syntax error
}
