import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
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
        } catch {
            setStatus("Authentication failed.");
            // setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center" style={{ gap: "var(--space-3)" }}>
                <Loader size={28} color="var(--color-accent)" className="animate-spin" />
                <p className="text-muted" style={{ fontSize: 14 }}>{status}</p>
            </div>
        </div>
    );
}
