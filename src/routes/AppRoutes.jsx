import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from '../pages/Home';
import BookDetails from "../pages/BookDetails";
import Layout from "../components/Layout";
import BooksPage from "../pages/BooksPage";
import Login from "../pages/Login";
import Profile from "../pages/UserProfile";
import NewsPage from "../pages/NewsPage";
import NewsDetailPage from "../pages/NewsDetails";
import LoginCallback from '../pages/LoginCallback';
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBooks from "../pages/admin/AdminBooks";
import AdminBookForm from "../pages/admin/AdminBookForm";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminNews from "../pages/admin/AdminNews";
import AdminNewsForm from "../pages/admin/AdminNewsForm";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
            </Route>
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route path="/admin-panel" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="books/new" element={<AdminBookForm />} />
                <Route path="books/edit/:id" element={<AdminBookForm />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="news/new" element={<AdminNewsForm />} />
                <Route path="news/edit/:id" element={<AdminNewsForm />} />
            </Route>
        </Routes>
    );
}