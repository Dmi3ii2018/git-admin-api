import {
  Routes,
  Route,
  HashRouter as Router
} from "react-router";

import { LoginPage } from "./pages/login/LoginPage";
import { ReposPage } from "./pages/repos/ReposPage";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/repos" element={<ReposPage />} />
        </Routes>
    </Router>
  );
}

export default App;
