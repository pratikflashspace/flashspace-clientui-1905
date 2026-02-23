import React, { useEffect, useState } from "react";

interface SeatSelectorProps {
  selectedSeats: { id: string; number: string }[];
  onHoldRequest: () => void;
  isHolding: boolean;
  holdExpiresAt?: Date;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  selectedSeats,
  onHoldRequest,
  isHolding,
  holdExpiresAt,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!holdExpiresAt) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(holdExpiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col gap-4 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
        Booking Summary
      </h3>

      <div className="flex flex-col gap-2 min-h-[4rem]">
        {selectedSeats.length > 0 ? (
          <div>
            <span className="text-sm text-gray-500">Selected Seats:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat.id}
                  className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-sm font-bold border border-teal-200"
                >
                  {seat.number}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium mt-3 text-gray-700">
              Total Seats: {selectedSeats.length}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 italic mt-2">No seats selected.</p>
        )}
      </div>

      {holdExpiresAt && timeLeft !== "Expired" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center justify-between">
          <span className="font-semibold text-sm">Hold expires in:</span>
          <span className="font-mono font-bold text-lg">{timeLeft}</span>
        </div>
      )}

      {holdExpiresAt && timeLeft === "Expired" && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-center">
          <span className="font-semibold text-sm">
            Hold Expired. Please select seats again.
          </span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 underline text-sm hover:text-red-900"
          >
            Refresh
          </button>
        </div>
      )}

      {(!holdExpiresAt || timeLeft === "Expired") && (
        <button
          onClick={onHoldRequest}
          disabled={selectedSeats.length === 0 || isHolding}
          className={`mt-4 py-3 px-4 rounded-md font-bold text-white transition-colors duration-200 shadow-sm
            ${selectedSeats.length === 0 || isHolding ? "bg-gray-300 cursor-not-allowed" : "bg-[#FFD43B] hover:bg-[#eec635] text-black"}
          `}
        >
          {isHolding ? "Holding..." : "Reserve Selected Seats"}
        </button>
      )}
    </div>
  );
};
