import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  triggerClassName?: string;
};

export default function SelectBox({
  value,
  onChange,
  options,
  placeholder = "Select",
  triggerClassName,
}: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:ring-[#3FA69E]/20 sm:w-52 ${triggerClassName ?? ""}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-slate-200/80 bg-white p-1 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-[#3FA69E]/10 data-[state=checked]:text-[#2f7d76] [&>span:first-child]:hidden"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
