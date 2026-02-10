const NpsCard = ({ data }: any) => {

    if (!data) return null;



    return (

        <div className="bg-white rounded-xl p-6 shadow">

            <p className="text-sm text-gray-500">Net Promoter Score</p>

            <h2 className="text-4xl font-bold text-emerald-600 mt-2">

                {data.nps}

            </h2>

            <p className="text-green-600 text-sm mt-1">

                ↑ +5 from last month

            </p>

            <p className="text-xs text-gray-400 mt-2">

                Based on {data.totalResponses} responses

            </p>

        </div>

    );

};



export default NpsCard;

