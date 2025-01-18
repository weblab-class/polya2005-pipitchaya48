import React, { useContext } from "react";
import { useGoogleLogin, GoogleLogin, googleLogout } from "@react-oauth/google";

import { ProfileCard } from "../modules/ProfileCard";
import { MenuList, MenuListItem } from "../modules/MenuList";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const { user, handleCustomLogin, handleLogout } = useContext(UserContext);
  const customLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleCustomLogin,
    onError: console.log,
  });
  const navigate = useNavigate();
  const navigateToSubSettings = (settings) => () => navigate(`/settings/${settings}`);

  return (
    <div className="flex flex-col items-center py-12">
      <ProfileCard user={user} />
      {user ? (
        <MenuList>
          <MenuListItem onClick={navigateToSubSettings("navigation")}>
            Navigation Settings
          </MenuListItem>
          <MenuListItem onClick={navigateToSubSettings("saved-places")}>Saved Places</MenuListItem>
          <MenuListItem onClick={navigateToSubSettings("history")}>History</MenuListItem>
          <MenuListItem
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </MenuListItem>
        </MenuList>
      ) : (
        <MenuList>
          <MenuListItem onClick={navigateToSubSettings("navigation")}>
            Navigation Settings
          </MenuListItem>
          <MenuListItem onClick={customLogin}>Login</MenuListItem>
        </MenuList>
      )}
    </div>
  );
};
