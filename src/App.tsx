import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router";

import { LoginPage } from "./pages/login/LoginPage";
import { ReposPage } from "./pages/repos/ReposPage";

function App() {
  return (
    <BrowserRouter basename="/git-admin-api">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/repos" element={<ReposPage />} />
        </Routes>
      </Router>
    </BrowserRouter>
  );
}

export default App;
