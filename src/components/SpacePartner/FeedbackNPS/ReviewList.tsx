import ReviewCard from "./ReviewCard";



const ReviewList = ({ reviews }: any) => {

  return (

    <div className="lg:col-span-2 space-y-4">

      <h3 className="font-semibold mb-2">Recent Feedback</h3>

      {reviews.map((r: any) => (

        <ReviewCard key={r._id} review={r} />

      ))}

    </div>

  );

};



export default ReviewList;