type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
};

export default function SelectBox({ value, onChange, options }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-[var(--primary)] md:w-52"
    >
      {options.map((opt) => (
        <option value={opt.value} key={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
