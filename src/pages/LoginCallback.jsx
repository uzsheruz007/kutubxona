import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { Loader } from "lucide-react";

export default function LoginCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithHemis } = useUser();
    const [status, setStatus] = useState("Authenticating...");

    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;

        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code) {
            effectRan.current = true;
            handleCallback({ code, state });
        } else {
            setStatus("Authorization Code not found.");
        }
    }, [searchParams]);

    const handleCallback = async (data) => {
        try {
            const result = await loginWithHemis(data);
            if (result.success) {
                navigate('/');
            } else {
                setStatus("Error: " + result.error);
                // setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            setStatus("Authentication failed.");
            // setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="flex flex-col items-center gap-4">
                <Loader className="w-8 h-8 animate-spin text-amber-600" />
                <p className="text-stone-600">{status}</p>
            </div>
        </div>
    );
}
