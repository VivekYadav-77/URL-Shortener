export const getUrlStatusLabel = (url) => {
  if (url.status === "deleted") {
    return url.deletedBy === "admin"
      ? "Removed by admin"
      : "Deleted by you";
  }

  if (url.status === "expired") {
    return "Expired";
  }

  if (!url.isActive) {
    return url.disabledBy === "admin"
      ? "Disabled by admin"
      : "Disabled by you";
  }

  return "Active";
};
export const getStatusStyles = (label) => {
  switch (label) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Disabled by you":
      return "bg-yellow-100 text-yellow-700";
    case "Disabled by admin":
      return "bg-orange-100 text-orange-700";
    case "Deleted by you":
      return "bg-red-100 text-red-700";
    case "Removed by admin":
      return "bg-red-200 text-red-800";
    case "Expired":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};
export const getActionLabel = (url) => {
  if (url.status === "deleted") {
    return url.deletedByRole === "admin"
      ? "Removed by Company"
      : "Removed by You";
  }

  if (!url.isActive) {
    return url.disabledByRole === "admin"
      ? "Disabled by Company"
      : "Disabled by You";
  }

  return null;
};

