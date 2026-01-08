import { memo } from "react";
import { BarChart2, Copy, Trash2 } from "lucide-react";
import {
  getUrlStatusLabel,
  getStatusStyles,
} from "../../utils/urlStatusLabel.js";
import { getActionLabel } from "../../utils/urlStatusLabel.js";
const UrlItem = memo(({ url, onToggle, onDelete, onStats, onCopy }) => {
  const shortUrl = `${window.location.origin}/${url.shortCode}`;
  const statusLabel = getUrlStatusLabel(url);
  const statusStyle = getStatusStyles(statusLabel);

  return (
    <div
      className="
        bg-white rounded-xl border
        hover:shadow-md transition
        p-5 flex flex-col gap-3
      "
    >
      {/* URL INFO */}
      <div>
        <p className="font-semibold text-[#2563EB] break-all">{shortUrl}</p>
        <p className="text-sm text-slate-500 truncate">{url.originalUrl}</p>
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-4 text-sm">
        <span
          className={`flex items-center gap-1 ${
            url.isActive ? "text-[#10B981]" : "text-slate-400"
          }`}
        >
          ● {url.isActive ? "Active" : "Disabled"}
        </span>
        <span className={`px-3 py-1 rounded-full font-semibold ${statusStyle}`}>
          {statusLabel}
        </span>
        {getActionLabel(url) && (
          <span className="text-xs font-semibold text-slate-500">
            {getActionLabel(url)}
          </span>
        )}
        <span className="text-slate-500">{url.clicks || 0} clicks</span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 mt-2">
        {/* COPY */}
        <button
          onClick={() => onCopy(shortUrl)}
          className="
            bg-blue-600 flex items-center gap-1
            px-3 py-1.5 text-sm text-white
            rounded-md hover:bg-blue-400
          "
        >
          <Copy size={14} /> Copy
        </button>

        {/* STATS */}
        <button
          onClick={() => onStats?.(url._id)}
          className="
            bg-yellow-600 flex items-center gap-1
            px-3 py-1.5 text-sm
            rounded-md hover:bg-yellow-400
          "
        >
          <BarChart2 size={14} /> Stats
        </button>

        {/* TOGGLE */}
        <button
          onClick={() => onToggle(url)}
          className="
            bg-red-600 px-3 py-1.5 text-sm text-white
            rounded-md hover:bg-red-400
          "
        >
          {url.isActive ? "Disable" : "Enable"}
        </button>

        {/* DELETE */}
        <button
          onClick={() => onDelete(url._id)}
          className="
            ml-auto text-red-600
            hover:bg-red-50 p-2 rounded-md
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default UrlItem;
