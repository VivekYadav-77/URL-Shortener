import { memo } from "react";
import { BarChart2, Copy, Trash2 } from "lucide-react";

const UrlItem = memo(({ url, onToggle, onDelete, onStats }) => {
  const shortUrl = `${window.location.origin}/${url.shortCode}`;

  return (
    <div
      className="
        bg-white rounded-xl border
        hover:shadow-md transition
        p-5 flex flex-col gap-3
      "
    >
      <div>
        <p className="font-semibold text-[#2563EB] break-all">
          {shortUrl}
        </p>
        <p className="text-sm text-slate-500 truncate">
          {url.originalUrl}
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span
          className={`flex items-center gap-1 ${
            url.isActive
              ? "text-[#10B981]"
              : "text-slate-400"
          }`}
        >
          ● {url.isActive ? "Active" : "Disabled"}
        </span>

        <span className="text-slate-500">
          {url.clicks || 0} clicks
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => navigator.clipboard.writeText(shortUrl)}
          className="
            flex items-center gap-1
            px-3 py-1.5 text-sm
            border rounded-md
            hover:bg-slate-50
          "
        >
          <Copy size={14} /> Copy
        </button>

        <button
          onClick={() => onStats(url._id)}
          className="
            flex items-center gap-1
            px-3 py-1.5 text-sm
            border rounded-md
            hover:bg-slate-50
          "
        >
          <BarChart2 size={14} /> Stats
        </button>

        <button
          onClick={() => onToggle(url)}
          className="
            px-3 py-1.5 text-sm
            border rounded-md
            hover:bg-slate-50
          "
        >
          {url.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={() => onDelete(url._id)}
          className="
            ml-auto text-red-600
            hover:bg-red-50
            p-2 rounded-md
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default UrlItem;
