//import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { appRoutes } from "./routes";

function App() {
  const { user } = useAuth();
  /*
  if (!user) {
    return <div>Carregando...</div>;
  }*/

  const routes = createBrowserRouter(appRoutes(user));

  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
