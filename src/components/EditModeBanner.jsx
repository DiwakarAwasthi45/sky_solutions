import { Pencil } from "lucide-react";

export default function EditModeBanner({ label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 mb-8">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/20 text-amber-600 shrink-0">
        <Pencil size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-800">
          Edit Mode: {label}
        </p>
        <p className="text-xs text-amber-700/80">
          You are editing an existing record. Changes will be saved on submit.
        </p>
      </div>
    </div>
  );
}
