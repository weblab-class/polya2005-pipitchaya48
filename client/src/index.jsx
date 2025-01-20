import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import NotFound from "./components/pages/NotFound";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Home } from "./components/pages/Home";
import { Results } from "./components/pages/Results";
import { Settings } from "./components/pages/Settings";
import { NavigationSettings } from "./components/pages/NavigationSettings";
import { SavedPlaces } from "./components/pages/SavedPlaces";
import { History } from "./components/pages/History";
import { Report } from "./components/pages/Report";

const GOOGLE_CLIENT_ID = "105463250048-ijbj257fhgd9gtlrp1lpoa1ffnklsfn1.apps.googleusercontent.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/navigation" element={<NavigationSettings />} />
      <Route path="/settings/saved-places" element={<SavedPlaces />} />
      <Route path="/settings/history" element={<History />} />
      <Route path="/report" element={<Report />} />
    </Route>
  )
);

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
