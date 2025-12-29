import { memo } from "react";
import { useNavigate } from "react-router-dom";

const UrlItem = memo(({ url, onToggle, onDelete }) => {
  const navigate = useNavigate();
  const shortUrl = `${window.location.origin}/${url.shortCode}`;

  return (
    <div className="p-4 flex justify-between items-center gap-4">
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <p className="font-medium break-all">{shortUrl}</p>
        <p className="text-sm text-gray-500 truncate">
          {url.originalUrl}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 text-sm shrink-0">
        <button
          onClick={() => navigator.clipboard.writeText(shortUrl)}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          Copy
        </button>

        <button
          onClick={() => onToggle(url)}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          {url.isActive ? "Disable" : "Enable"}
        </button>

        <button
          onClick={() => onDelete(url._id)}
          className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

        <button
          onClick={() => navigate(`/urls/${url._id}/stats`)}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          Stats
        </button>
      </div>
    </div>
  );
});

export default UrlItem;
