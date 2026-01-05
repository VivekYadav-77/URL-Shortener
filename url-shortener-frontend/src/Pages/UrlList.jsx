import UrlItem from "./UrlItems";
import { useNavigate } from "react-router-dom";
const UrlList = ({ urls, onToggle, onDelete,onCopy}) => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {urls.map((url) => (
          <UrlItem
            key={url._id}
            url={url}
            onToggle={onToggle}
            onDelete={onDelete}
            onCopy={onCopy}
            onStats={(id) => navigate(`/urls/${id}/stats`)}
          />
        ))}
      </div>
    </div>
  );
};
export default UrlList