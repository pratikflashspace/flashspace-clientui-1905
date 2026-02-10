const AverageRatingCard = ({ reviews }: any) => {

  const avg =

    reviews.length === 0

      ? 0

      : (

          reviews.reduce((s: number, r: any) => s + r.rating, 0) /

          reviews.length

        ).toFixed(1);



  return (

    <div className="bg-white rounded-xl p-6 shadow">

      <p className="text-sm text-gray-500">Average Rating</p>

      <h2 className="text-4xl font-bold mt-2">{avg}</h2>

      <p className="text-yellow-500 text-lg">

        {"★".repeat(Math.round(Number(avg)))}{"☆".repeat(5 - Math.round(Number(avg)))}

      </p>

      <p className="text-xs text-gray-400">Out of 5 stars</p>

    </div>

  );

};



export default AverageRatingCard;