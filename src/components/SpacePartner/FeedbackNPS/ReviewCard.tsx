const ReviewCard = ({ review }: any) => {

    return (

        <div className="bg-white rounded-xl p-5 shadow relative overflow-hidden">

            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-gray-900">{review.company}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        {review.location}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-yellow-500 font-bold mb-0.5">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </p>
                    <p className="text-xs text-gray-400">
                        {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                            : review.date}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-100 pl-3">
                    "{review.review}"
                </p>
            </div>

            {review.spaceName && (
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Space:</span>
                    <span className="text-[10px] text-gray-600 font-semibold">{review.spaceName}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <span className="text-[10px] text-gray-400">{review.spaceType}</span>
                </div>
            )}
        </div>

    );

};



export default ReviewCard;

