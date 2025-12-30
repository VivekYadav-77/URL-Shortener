import UrlItem from "./UrlItems";
const UrlList = ({ urls, onToggle, onDelete, onStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {urls.map((url) => (
        <UrlItem
          key={url._id}
          url={url}
          onToggle={onToggle}
          onDelete={onDelete}
          onStats={onStats}
        />
      ))}
    </div>
  );
};
export default UrlList