import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages";
import UrlNotFound from "./components/common/UrlNotFound";
import Dashboard from "./pages/dashboard";
import DataMaster from "./pages/masterData";
import AHP from "./pages/ahp";
import Alternatif from "./pages/masterData/alternatif";
import Kriteria from "./pages/masterData/kriteria";
import { API, setAuthToken } from "./config/API";
import Topsis from "./pages/topsis";
import MOPA from "./pages/mopa";

function App() {
  const navigate = useNavigate();
  const checkUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const response = await API.get("/check-auth");
      let payload = response.data.data;
      payload.token = localStorage.token;

      navigate("/dashboard");
    } catch (error) {
      if (error.response.data.code === 401) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/dashboard/" element={<Dashboard />}>
        {/* <Route exact path=":data-master/" element={<DataMaster />} /> */}
        <Route exact path=":data-master/alternatif" element={<Alternatif />} />
        <Route exact path=":data-master/kriteria" element={<Kriteria />} />
        <Route exact path=":menu/topsis" element={<Topsis />} />
        <Route exact path=":menu/ahp" element={<AHP />} />
        <Route exact path=":menu/mopa" element={<MOPA />} />
        <Route
          exact
          path="dashboard/*"
          element={<UrlNotFound url="/dashboard" />}
        />
      </Route>
      <Route exact path="*" element={<UrlNotFound url="/" />} />
    </Routes>
  );
}

export default App;
