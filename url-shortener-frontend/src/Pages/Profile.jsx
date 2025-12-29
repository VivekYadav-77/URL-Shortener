import { useEffect,useState } from "react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useGetMeQuery,useUpdateMeMutation} from "../Features/auth/authapi";
const Profile = () => {
  const { data: user } = useGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMe({ username }).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          My Profile
        </h2>

        <form className="bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
          <Input
            label="Email"
            value={user?.email || ""}
            disabled
          />

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Profile;