import UrlItem from "./UrlItems";
import { useNavigate } from "react-router-dom";
const UrlList = ({ urls, onToggle, onDelete, onStats }) => {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {urls.map((url) => (
        <UrlItem
          key={url._id}
          url={url}
          onToggle={onToggle}
          onDelete={onDelete}
          onStats={(id) => navigate(`/urls/${id}/stats`)}
        />
      ))}
    </div>
  );
};
export default UrlList