import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CurvedSelect({ value, onChange, options, className, dropdownClassName }) {
  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">

          {/* Button */}
          <Listbox.Button
            className={cn(
              "w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-left shadow-sm focus:outline-none flex justify-between items-center text-sm transition-colors",
              className
            )}
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="w-5 h-5 opacity-50" />
          </Listbox.Button>

          {/* Dropdown Panel */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                "absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border border-gray-200 ring-0 outline-none p-1 space-y-1 overflow-hidden",
                dropdownClassName
              )}
              style={{
                maxHeight: "260px",
                overflowY: "auto",
              }}
            >
              {options.map((item, idx) => (
                <Listbox.Option
                  key={idx}
                  value={item}
                  className={({ active }) =>
                    cn(
                      "cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-gray-100 text-black" : "text-gray-900 bg-transparent",
                      // Allow specific overrides for options text color if needed, but context dictates it handles itself mostly.
                      // If parent is dark, default options will still be white bg unless overridden in dropdownClassName.
                    )
                  }
                >
                  {item}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>

        </div>
      </Listbox>
    </div>
  );
}
