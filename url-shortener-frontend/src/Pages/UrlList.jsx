import UrlItem from "./UrlItems";
const UrlList = ({ urls, onToggle, onDelete }) => {
  return (
    <div className="bg-white rounded shadow divide-y">
      {urls.map((url) => (
        <UrlItem
          key={url._id}
          url={url}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UrlList;
