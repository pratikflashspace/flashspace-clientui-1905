import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NpsCard = ({ data }: any) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">Net Promoter Score</p>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger className="cursor-help">
              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] p-4 text-sm bg-white border border-gray-200 shadow-xl rounded-lg">
              <p className="font-semibold mb-2">What is NPS?</p>
              <p className="text-gray-600 mb-2">
                Net Promoter Score measures customer loyalty globally.
              </p>
              <p className="text-gray-600 font-medium">Calculation:</p>
              <ul className="text-gray-600 list-disc list-inside mt-1 space-y-1 text-xs">
                <li>
                  <strong>Promoters (9-10):</strong> Loyal enthusiasts.
                </li>
                <li>
                  <strong>Passives (7-8):</strong> Satisfied but unenthusiastic.
                </li>
                <li>
                  <strong>Detractors (0-6):</strong> Unhappy customers.
                </li>
              </ul>
              <p className="mt-3 py-1 px-2 bg-gray-50 rounded text-center text-xs font-semibold text-gray-700">
                Formula: % Promoters - % Detractors
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <h2 className="text-4xl font-bold text-emerald-600 mt-2">{data.nps}</h2>

      <p className="text-green-600 text-sm mt-1">↑ +5 from last month</p>

      <p className="text-xs text-gray-400 mt-2">
        Based on {data.totalResponses} responses
      </p>
    </div>
  );
};

export default NpsCard;
