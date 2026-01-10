import UrlItem from "./UrlItems";
import { useNavigate } from "react-router-dom";

const UrlList = ({ urls, onToggle, onDelete, onCopy }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center">
      <div className="grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-2
          gap-6 
          w-full 
          max-w-4xl
      ">
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

export default UrlList;
