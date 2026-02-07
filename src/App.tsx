import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./page/Home";
import Employees from "./page/Employees";
import Faculties from "./page/Faculties";
import Provisions from "./page/Provisions";
import Login from "./page/Login";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/provisions" element={<Provisions />} />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
