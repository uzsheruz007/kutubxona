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

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={ <Layout /> }>
                <Route path="/" element={ <Home /> } />
                <Route path="/book/:id" element={<BookDetails /> } />
                <Route path="/books" element={ <BooksPage /> } />
                <Route path="/profile" element={ <Profile /> } />
                <Route path="/news" element={ <NewsPage /> } /> 
                <Route path="/news/:id" element={ <NewsDetailPage /> } />
            </Route>
            <Route path="*" element={ <NotFound /> } />
            <Route path="/login" element={ <Login /> } />
        </Routes>
    );
}