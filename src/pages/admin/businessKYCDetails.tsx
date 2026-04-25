import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import type { KYCRequest } from "@/types/adminKyc";
import { ArrowLeft, Building2, Clock, User } from "lucide-react";
import { toast } from "sonner";

export default function BusinessKYCDetails() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [request, setRequest] = useState<KYCRequest | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchById = async () => {
			setLoading(true);
			try {
				const res = await adminService.getKYCDetails(id);
				if (res.success && res.data) {
					setRequest(res.data as unknown as KYCRequest);
				} else {
					toast.error(res.message || "Failed to load business KYC details");
				}
			} catch (error) {
				console.error("Failed to fetch business KYC details", error);
				toast.error("Failed to load business KYC details");
			} finally {
				setLoading(false);
			}
		};

		fetchById();
	}, [id]);

	if (loading || !request) {
		return (
			<div className="space-y-6 animate-in fade-in duration-300">
				<button
					onClick={() => navigate(-1)}
					className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
				>
					<ArrowLeft className="w-4 h-4" />
					Back
				</button>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-300">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 mb-3"
					>
						<ArrowLeft className="w-3 h-3" />
						Back
					</button>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[Poppins]">
						Business KYC Details
					</h1>
					<p className="text-gray-500 mt-1 text-sm">
						Review the business information associated with this KYC request.
					</p>
				</div>
				{request.createdAt && (
					<p className="text-xs text-gray-400 flex items-center gap-1">
						<Clock className="w-3 h-3" />
						Submitted: {new Date(request.createdAt).toLocaleString()}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
				<div className="space-y-4 md:col-span-1">
					<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
								{request.user?.fullName?.charAt(0) || "U"}
							</div>
							<div>
								<p className="text-sm text-gray-500 mb-0.5">Main Account Holder</p>
								<p className="font-semibold text-gray-900">{request.user?.fullName}</p>
								<p className="text-xs text-gray-500">{request.user?.email}</p>
							</div>
						</div>
						{request.profileName && (
							<p className="text-xs text-blue-600 font-medium mt-1">Profile: {request.profileName}</p>
						)}
					</div>

					{request.personalInfo && (
						<div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
							<div className="flex items-center gap-2 mb-3">
								<User className="w-4 h-4 text-blue-600" />
								<h3 className="text-sm font-semibold text-blue-900">Personal Info</h3>
							</div>
							<div className="space-y-1 text-sm">
								{request.personalInfo.fullName && (
									<p className="text-gray-700">
										<span className="font-medium">Name:</span> {request.personalInfo.fullName}
									</p>
								)}
								{request.personalInfo.phone && (
									<p className="text-gray-700">
										<span className="font-medium">Phone:</span> {request.personalInfo.phone}
									</p>
								)}
								{request.personalInfo.email && (
									<p className="text-gray-700">
										<span className="font-medium">Email:</span> {request.personalInfo.email}
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="md:col-span-2">
					{request.businessInfo ? (
						<div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
							<div className="flex items-center gap-2 mb-3">
								<Building2 className="w-4 h-4 text-purple-600" />
								<h3 className="text-sm font-semibold text-purple-900">Business Info</h3>
							</div>
							<div className="space-y-2 text-sm">
								{request.businessInfo.companyName && (
									<p className="text-gray-700">
										<span className="font-medium">Company:</span> {request.businessInfo.companyName}
									</p>
								)}
								{request.businessInfo.gstNumber && (
									<p className="text-gray-700">
										<span className="font-medium">GST:</span> {request.businessInfo.gstNumber}
									</p>
								)}
								{request.businessInfo.panNumber && !["NA", "N/A"].includes(request.businessInfo.panNumber.toUpperCase()) && (
									<p className="text-gray-700">
										<span className="font-medium">PAN:</span> {request.businessInfo.panNumber}
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
							<p className="text-sm font-medium text-orange-900 mb-1">No business information available</p>
							<p className="text-xs text-orange-700">
								This KYC request does not contain any business details.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
