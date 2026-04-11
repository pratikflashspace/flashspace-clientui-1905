import { GitCompareArrows, X } from "lucide-react";
import type { CompareSpace } from "./CompareDrawer";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";

const DEFAULT_IMAGE = "/hero-illustrated.jpg";

interface CompareFloatingBarProps {
  selectedSpaces: CompareSpace[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClearAll: () => void;
}

export default function CompareFloatingBar({
  selectedSpaces,
  onRemove,
  onCompare,
  onClearAll,
}: CompareFloatingBarProps) {
  if (selectedSpaces.length === 0) return null;

  const getImage = (ws: CompareSpace) => {
    const imgs = ws.images?.length ? ws.images : [ws.image];
    const valid = imgs.filter((i) => !isInvalidImageUrl(i)).map(getSafeImageUrl);
    return valid.length > 0 ? valid[0] : DEFAULT_IMAGE;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
        {/* Selected space thumbnails */}
        <div className="flex items-center gap-2">
          {selectedSpaces.map((ws) => (
            <div key={ws.id} className="relative group">
              <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary/30 shadow-sm">
                <img
                  src={getImage(ws)}
                  alt={ws.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                />
              </div>
              <button
                onClick={() => onRemove(ws.id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 2 - selectedSpaces.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-10 h-10 rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center"
            >
              <span className="text-[10px] text-muted-foreground/40">+</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/60" />

        {/* Count + Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{selectedSpaces.length}</span>/4 selected
          </span>

          <button
            onClick={onCompare}
            disabled={selectedSpaces.length < 2}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <GitCompareArrows className="w-3.5 h-3.5" />
            Compare {selectedSpaces.length > 1 ? `(${selectedSpaces.length})` : ""}
          </button>

          <button
            onClick={onClearAll}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
