import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext";
import './i18n';
import "keen-slider/keen-slider.min.css";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <title>SamDPI Urgut fakulteti Elektron Kutubxonasi - Bilimlar Xazinasi</title>
        <meta name="description" content="SamDPI Urgut fakulteti elektron kutubxonasi. Minglab kitoblar, maqolalar va ilmiy ishlarni bepul yuklab oling va onlayn o'qing." />
        <link rel="canonical" href="https://e-library.samduuf.uz" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="SamDPI Urgut fakulteti Elektron Kutubxonasi" />
        <meta property="og:description" content="Elektron kutubxona - Kitoblar, Darsliklar va Ilmiy ishlar bazasi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://e-library.samduuf.uz" />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}