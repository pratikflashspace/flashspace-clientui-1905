import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-[var(--primary)]">
      <Search size={18} className="text-slate-400" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
