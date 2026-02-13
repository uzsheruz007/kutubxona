import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import './i18n';
import "keen-slider/keen-slider.min.css";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <title>SamDUUF Elektron Kutubxona - Bilimlar Xazinasi</title>
        <meta name="description" content="Samarqand Davlat Universiteti Urgut filiali elektron kutubxonasi. Minglab kitoblar, maqolalar va ilmiy ishlarni bepul yuklab oling va onlayn o'qing." />
        <link rel="canonical" href="https://e-library.samduuf.uz" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SamDUUF Elektron Kutubxona" />
        <meta property="og:description" content="Elektron kutubxona - Kitoblar, Darsliklar va Ilmiy ishlar bazasi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://e-library.samduuf.uz" />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}