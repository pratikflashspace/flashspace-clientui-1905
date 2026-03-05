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
        className={`h-11 w-full rounded-xl border-[#2D3F33]/20 dark:border-white/10 bg-white dark:bg-[#101010] text-sm font-medium text-[#164e4e] dark:text-white shadow-sm transition-colors hover:bg-[#2D3F33]/5 dark:hover:bg-white/5 focus:ring-[#2D3F33]/20 sm:w-52 ${triggerClassName ?? ""}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-[#2D3F33]/15 dark:border-white/10 bg-white dark:bg-[#101010] p-1 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#164e4e] dark:text-gray-100 focus:bg-[#2D3F33]/10 dark:focus:bg-white/10 focus:text-[#164e4e] dark:focus:text-white data-[state=checked]:bg-[#2D3F33]/10 data-[state=checked]:text-[#2D3F33] dark:data-[state=checked]:text-[#FDE68A] [&>span:first-child]:hidden"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
