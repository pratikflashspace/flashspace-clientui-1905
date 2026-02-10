import { useEffect, useState } from "react";

import { FeedbackService } from "@/services/feedback.service";



import NpsCard from "./NpsCard";

import AverageRatingCard from "./AverageRatingCard";

import NpsBreakdownCard from "./NpsBreakdownCard";

import ReviewList from "./ReviewList";



type Review = {

    _id: string;

    company: string;

    rating: number;

    npsScore?: number;

    location: string;

    review: string;

    createdAt?: string;

};



const FeedbackNPSLayout = () => {

    const [reviews, setReviews] = useState<Review[]>([]);

    const [npsData, setNpsData] = useState<any>(null);

    const [aiInsight, setAiInsight] = useState<string>("");

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const loadData = async () => {

            try {

                const [reviewsData, npsStats, insight] = await Promise.all([

                    FeedbackService.getAllReviews(),

                    FeedbackService.getNpsStats(),

                    FeedbackService.getAiInsight(),

                ]);



                setReviews(Array.isArray(reviewsData) ? reviewsData : []);

                setNpsData(npsStats || null);

                setAiInsight(insight);

            } catch (error) {

                console.error("Failed to load feedback data:", error);

            } finally {

                setLoading(false);

            }

        };



        loadData();

    }, []);



    if (loading) {

        return (

            <div className="p-6 bg-[#FAFAF8] min-h-screen">

                <p className="text-gray-500">Loading feedback data...</p>

            </div>

        );

    }



    return (

        <div className="p-6 bg-[#FAFAF8] min-h-screen">

            <h1 className="text-2xl font-semibold">

                Feedback & <span className="text-emerald-600">NPS</span>

            </h1>

            <p className="text-sm text-gray-500 mb-6">

                Monitor client satisfaction and feedback

            </p>



            {/* TOP CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <NpsCard data={npsData} />

                <AverageRatingCard reviews={reviews} />

                <div className="bg-white rounded-xl p-6 shadow">

                    <p className="text-sm text-gray-500">Response Rate</p>

                    <h2 className="text-4xl font-bold mt-2">72%</h2>

                    <p className="text-green-600 text-sm mt-1">

                        ↑ +8% improvement

                    </p>

                </div>

            </div>



            {/* CONTENT */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <ReviewList reviews={reviews} />



                <div className="space-y-6">

                    <NpsBreakdownCard data={npsData} />



                    <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">

                        <h3 className="font-semibold mb-2">AI Insight</h3>

                        <p className="text-sm text-gray-700 leading-relaxed">

                            {aiInsight || "Generating AI insight..."}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};



export default FeedbackNPSLayout;