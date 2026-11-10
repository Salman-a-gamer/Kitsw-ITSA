import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import AdminLayout from "./components/layout/AdminLayout";
import SiteLayout from "./components/layout/SiteLayout";
import PageLoader from "./components/ui/PageLoader";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import LegacyRedirect from "./pages/LegacyRedirect";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import RouteError from "./pages/RouteError";
import Sumshodhini from "./pages/Sumshodhini";
import Workshops from "./pages/Workshops";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";

/*
|--------------------------------------------------------------------------
| ROUTER
|--------------------------------------------------------------------------
|
| All pages are imported directly.
|
| This intentionally avoids lazy-loaded route chunks so that
| direct Vercel refreshes are more reliable.
|--------------------------------------------------------------------------
*/

const router = createBrowserRouter([
  {
    path: "hackathon/*",
    lazy: async () => ({ Component: (await import("./pages/hackathon/Hackathon")).default }),
    HydrateFallback: PageLoader,
    errorElement: <RouteError />,
  },
  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  */

  {
    path: "admin",

    Component: AdminLayout,

    HydrateFallback: PageLoader,

    errorElement: <RouteError />,

    children: [
      /*
      |--------------------------------------------------------------------------
      | /admin
      |--------------------------------------------------------------------------
      */

      {
        index: true,

        Component: AdminHome,
      },

      /*
      |--------------------------------------------------------------------------
      | /admin/login
      |--------------------------------------------------------------------------
      */

      {
        path: "login",

        Component: AdminLogin,
      },

      /*
      |--------------------------------------------------------------------------
      | /admin/dashboard
      |--------------------------------------------------------------------------
      */

      {
        path: "dashboard",

        Component: AdminDashboard,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | WEBSITE
  |--------------------------------------------------------------------------
  */

  {
    Component: SiteLayout,

    HydrateFallback: PageLoader,

    children: [
      {
        errorElement: <RouteError />,

        children: [
          /*
          |--------------------------------------------------------------------------
          | HOME
          |--------------------------------------------------------------------------
          */

          {
            index: true,

            Component: Home,
          },

          /*
          |--------------------------------------------------------------------------
          | SUMSHODHINI
          |--------------------------------------------------------------------------
          */

          {
            path: "sumshodhini",

            Component: Sumshodhini,
          },

          /*
          |--------------------------------------------------------------------------
          | EVENTS
          |--------------------------------------------------------------------------
          */

          {
            path: "events",

            Component: Events,
          },

          /*
          |--------------------------------------------------------------------------
          | WORKSHOPS
          |--------------------------------------------------------------------------
          */

          {
            path: "workshops",

            Component: Workshops,
          },

          /*
          |--------------------------------------------------------------------------
          | REGISTER
          |--------------------------------------------------------------------------
          */

          {
            path: "register",

            Component: Register,
          },

          /*
          |--------------------------------------------------------------------------
          | ABOUT
          |--------------------------------------------------------------------------
          */

          {
            path: "about",

            Component: About,
          },

          /*
          |--------------------------------------------------------------------------
          | GALLERY
          |--------------------------------------------------------------------------
          */

          {
            path: "gallery",

            Component: Gallery,
          },

          /*
          |--------------------------------------------------------------------------
          | CONTACT
          |--------------------------------------------------------------------------
          */

          {
            path: "contact",

            Component: Contact,
          },
          {
            path: "privacy",
            Component: Privacy,
          },

          /*
          |--------------------------------------------------------------------------
          | LEGACY REDIRECTS
          |--------------------------------------------------------------------------
          */

          {
            path: "index.html",

            element: (
              <LegacyRedirect
                to="/"
              />
            ),
          },

          {
            path: "pages/:file",

            Component: LegacyRedirect,
          },

          {
            path: "samshodini",

            element: (
              <LegacyRedirect
                to="/sumshodhini"
              />
            ),
          },

          {
            path: "association",

            element: (
              <LegacyRedirect
                to="/about"
              />
            ),
          },

          {
            path: "samshodhini",

            element: (
              <LegacyRedirect
                to="/sumshodhini"
              />
            ),
          },

          {
            path: "samshodhini",

            element: (
              <LegacyRedirect
                to="/sumshodhini"
              />
            ),
          },

          {
            path: "workshop",

            element: (
              <LegacyRedirect
                to="/workshops"
              />
            ),
          },

          /*
          |--------------------------------------------------------------------------
          | NOT FOUND
          |--------------------------------------------------------------------------
          */

          {
            path: "*",

            Component: NotFound,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
    />
  );
}
