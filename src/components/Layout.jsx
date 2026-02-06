import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TestModeBanner from "./TestModeBanner";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <TestModeBanner />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}