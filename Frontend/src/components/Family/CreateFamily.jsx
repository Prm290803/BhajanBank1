import React, { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateFamily = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const [familyName, setFamilyName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateFamily = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend_url}/api/create-family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          familyName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFamilyCode(data.familyCode);
      } else {
        setMessage(data.error || "Failed to create family");
      }
    } catch (err) {
      setMessage("Error creating family");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Family
        </h1>

        <form onSubmit={handleCreateFamily}>
          <input
            type="text"
            placeholder="Enter family name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Create Family
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-gray-700 font-medium">
            {message}
          </div>
        )}

        {familyCode && (
          <div className="mt-6 text-center bg-gray-50 border p-4 rounded-lg">
            <p className="text-gray-700">
              Your family code is:
              <br />
              <span className="font-bold text-lg text-blue-600">
                {familyCode}
              </span>
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Share this code with your family members.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-6 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition duration-200"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default CreateFamily;
