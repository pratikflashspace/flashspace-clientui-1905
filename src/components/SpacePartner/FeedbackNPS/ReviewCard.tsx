const ReviewCard = ({ review }: any) => {

    return (

        <div className="bg-white rounded-xl p-5 shadow">

            <div className="flex justify-between">

                <div>

                    <h4 className="font-semibold">{review.company}</h4>

                    <p className="text-sm text-gray-500">{review.location}</p>

                </div>

                <div className="text-right">

                    <p className="text-yellow-500">

                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}

                    </p>

                    <p className="text-xs text-gray-400">

                        {review.createdAt

                            ? new Date(review.createdAt).toLocaleDateString()

                            : review.date}

                    </p>

                </div>

            </div>

            <p className="text-sm text-gray-600 mt-3">{review.review}</p>

        </div>

    );

};



export default ReviewCard;

