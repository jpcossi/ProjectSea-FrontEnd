import { CreateUser } from "./pages/CreateUser";
import { EditAdmin } from "./pages/EditAdmin";
import { HomeAdmin } from "./pages/HomeAdmin";
import { ShowUserAdmin } from "./pages/ShowUserAdmin";
import { SignIn } from "./pages/SignIn";
import { UserHome } from "./pages/UserHome";

export const appRoutes = (userRole: string) =>
  userRole === "admin"
    ? [
        {
          path: "/",
          element: <HomeAdmin />,
        },
        {
          path: "/new",
          element: <CreateUser />,
        },
        {
          path: "/edit/:id",
          element: <EditAdmin />,
        },
        {
          path: "/userAdmin/:id",
          element: <ShowUserAdmin />,
        },
      ]
    : [
        {
          path: "/",
          element: <UserHome />,
        },
      ];

export const authRoutes = [
  {
    path: "/",
    element: <SignIn />,
  },
];
