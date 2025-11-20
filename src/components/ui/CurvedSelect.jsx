import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDown } from "lucide-react";

export default function CurvedSelect({ value, onChange, options }) {
  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">

          {/* Button */}
          <Listbox.Button
            className="
              w-full rounded-xl border border-gray-300 bg-white
              py-3 px-4 text-left shadow-sm focus:outline-none
              flex justify-between items-center text-sm
            "
          >
            <span>{value}</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </Listbox.Button>

          {/* Dropdown Panel */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="
                absolute z-50 mt-2 w-full
                rounded-xl bg-white shadow-md
                border border-gray-200
                ring-0 outline-none
                p-1 space-y-1
              "
              style={{
                maxHeight: "260px",      // limit height
                overflowY: "auto",       // allow scroll only if needed
              }}
            >
              {options.map((item, idx) => (
                <Listbox.Option
                  key={idx}
                  value={item}
                  className={({ active }) =>
                    `
                    cursor-pointer rounded-lg px-3 py-2 text-sm
                    ${active ? "bg-gray-200" : "bg-white"}
                    `
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
