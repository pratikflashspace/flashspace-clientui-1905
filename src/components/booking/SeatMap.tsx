import React from "react";

interface Seat {
  _id: string;
  seatNumber: string;
  type?: string;
  available: boolean;
}

interface Table {
  tableNumber: string;
  seats: Seat[];
}

interface Floor {
  floorNumber: number;
  name?: string;
  tables: Table[];
}

interface SeatMapProps {
  layout: Floor[];
  onSeatToggle: (seatId: string, seatNumber: string) => void;
  selectedSeats: string[];
}

export const SeatMap: React.FC<SeatMapProps> = ({
  layout,
  onSeatToggle,
  selectedSeats,
}) => {
  return (
    <div className="flex flex-col gap-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Seat Layout
      </h2>
      {layout.map((floor) => (
        <div
          key={floor.floorNumber}
          className="bg-white p-6 rounded shadow-sm relative"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Floor {floor.floorNumber} {floor.name ? `- ${floor.name}` : ""}
          </h3>
          <div className="flex flex-col gap-6">
            {floor.tables.map((table) => (
              <div
                key={table.tableNumber}
                className="border border-gray-200 p-4 rounded-md"
              >
                <h4 className="text-md font-medium text-gray-600 mb-3">
                  Table {table.tableNumber}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {table.seats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat._id);
                    let bgColor =
                      "bg-gray-200 hover:bg-gray-300 cursor-pointer";
                    let textColor = "text-gray-700";
                    let border = "border-transparent";

                    if (!seat.available) {
                      bgColor = "bg-red-100 cursor-not-allowed";
                      textColor = "text-red-400 line-through";
                    } else if (isSelected) {
                      bgColor = "bg-teal-600 hover:bg-teal-700";
                      textColor = "text-white font-bold";
                      border = "border-teal-800";
                    }

                    return (
                      <button
                        key={seat._id}
                        disabled={!seat.available}
                        onClick={() => onSeatToggle(seat._id, seat.seatNumber)}
                        title={`Seat: ${seat.seatNumber} Type: ${seat.type || "N/A"}`}
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-sm transition-all duration-200 border-2 ${bgColor} ${textColor} ${border}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {layout?.length === 0 && (
        <p className="text-gray-500 italic text-center py-8">
          No layout data available for this space.
        </p>
      )}
    </div>
  );
};
