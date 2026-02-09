export default function Footer() {
  return (
    <footer className="mt-8 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 rounded-2xl shadow-sm">
      <p>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-700">flashspace</span>. All rights reserved.
      </p>

      <p className="text-xs text-slate-400">
        Space Partner Portal • v1.0
      </p>
    </footer>
  );
}
