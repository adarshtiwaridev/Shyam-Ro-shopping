import { signIn } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AuthModel } from "@/src/redux/slices/authSlice";

export default function LoginModal() {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.auth.showAuthModal);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-blue-900 p-6 rounded-xl w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">
          Welcome! Login or Sign up
        </h2>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Continue with Google
        </button>
        <button
          onClick={() => dispatch(AuthModel(false))}
          className="mt-4 text-gray-300 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
