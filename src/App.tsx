import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import Shell from "./components/Shell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Shell />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
