//import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { appRoutes, authRoutes } from "./routes";

function App() {
  const { user } = useAuth();
  /*
  if (!user) {
    return <div>Carregando...</div>;
  }*/

  const routes = createBrowserRouter(
    user && user.role ? appRoutes(user.role) : authRoutes
  );

  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
