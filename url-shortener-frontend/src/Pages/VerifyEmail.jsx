import { useParams, useNavigate, Link } from "react-router-dom";
import { useVerifyEmailQuery } from "../Features/auth/authapi";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useVerifyEmailQuery(token);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        {isLoading && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-800">Verifying Email...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your account.</p>
          </div>
        )}

        {data && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={56} />
            <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
            <p className="text-gray-600 mt-2">{data.message}</p>
            <button 
              onClick={() => navigate("/login")}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={56} />
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600 mt-2">{error.data?.message || "Invalid or expired token."}</p>
            <Link to="/login" className="mt-6 text-blue-600 font-medium hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;