const Bar = ({ label, value, color }: any) => (

    <div className="mb-4">

        <div className="flex justify-between text-sm mb-1">

            <span>{label}</span>

            <span>{value}%</span>

        </div>

        <div className="h-2 bg-gray-100 rounded">

            <div className={`h-2 rounded ${color}`} style={{ width: `${value}%` }} />

        </div>

    </div>

);



const NpsBreakdownCard = ({ data }: any) => {

    if (!data) return null;



    const { promoters, passives, detractors, totalResponses } = data;

    const promotersPct = totalResponses ? Math.round((promoters / totalResponses) * 100) : 0;

    const passivesPct = totalResponses ? Math.round((passives / totalResponses) * 100) : 0;

    const detractorsPct = totalResponses ? Math.round((detractors / totalResponses) * 100) : 0;



    return (

        <div className="bg-white rounded-xl p-6 shadow">

            <h3 className="font-semibold mb-4">NPS Breakdown</h3>

            <Bar label="Promoters (9–10)" value={promotersPct} color="bg-emerald-500" />

            <Bar label="Passives (7–8)" value={passivesPct} color="bg-yellow-400" />

            <Bar label="Detractors (0–6)" value={detractorsPct} color="bg-red-500" />

        </div>

    );

};



export default NpsBreakdownCard;

