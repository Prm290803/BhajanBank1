import React, { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const JoinFamily = () => {
  const { user, token } = useAuth();
  const backend_url = import.meta.env.VITE_BACKENDURL || "";
  const [familyCode, setFamilyCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // const handleJoinFamily = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch(`${backend_url}/api/join-family`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         userId: user._id,
  //         familyCode,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       setMessage(data.message);
  //     } else {
  //       setMessage(data.error || "Failed to join family");
  //     }
  //   } catch (err) {
  //     setMessage("Error joining family");
  //     console.error(err);
  //   }
  // };

  const handleJoinFamily = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${backend_url}/api/join-family`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // optional unless backend checks it
      },
      body: JSON.stringify({
        userId: user._id,
        code: familyCode, // ✅ must match backend
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`${data.message}. Total Points: ${data.totalPoints}`);
    } else {
      setMessage(data.error || "Failed to join family");
    }
  } catch (err) {
    setMessage("Error joining family");
    console.error(err);
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Join Family
        </h1>

        <form onSubmit={handleJoinFamily}>
          <input
            type="text"
            placeholder="Enter family code"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Join Family
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-gray-700 font-medium">
            {message}
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

export default JoinFamily;
