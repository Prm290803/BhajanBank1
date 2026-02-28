import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Radius } from "lucide-react";

export default function GoogleLoginButton() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKENDURL;
  const VITE_GOOGLE = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCallbackResponse = async (response) => {
    try {
      const res = await axios.post(`${backend_url}/api/google-login`, {
        token: response.credential,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiry", Date.now() + 86400000);
      setUser(user);

     
      navigate("/data");
       window.location.reload();
    } catch (error) {
      console.error("Google login failed:", error.response?.data || error.message);
    }
  };

  const handleclick = () => {
    if (!window.google) {
      console.error("Google script not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: VITE_GOOGLE,
      callback: handleCallbackResponse,
    });
    window.google.accounts.id.renderButton(
  document.getElementById("googleButton"),
   { 
      theme: "outline", 
      size: "large",
      type: "standard",        // Show text + icon
      text: "continue_with",   // "Continue with Google"
      shape: "pill",           // Rounded corners
      logo_alignment: "left",  // Google logo on left
      max_width: "250",
      width:"100"             // Fixed width
    }
);
  };

  useEffect(() => {
    handleclick();
  }, []);   // Only once

  return (
    <div className="justify-center flex ">
      <div id="googleButton"></div>
    </div>
  );
}
