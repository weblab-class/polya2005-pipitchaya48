import React, { useContext } from "react";
import { useGoogleLogin, GoogleLogin, googleLogout } from "@react-oauth/google";

import { ProfileCard } from "../modules/ProfileCard";
import { MenuList, MenuListItem } from "../modules/MenuList";
import { UserContext } from "../App";

export const Settings = () => {
  const { user, handleCustomLogin, handleLogin, handleLogout } = useContext(UserContext);
  const customLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleCustomLogin,
    onError: console.log,
  });
  console.log(user);
  return (
    <div className="flex flex-col items-center py-12">
      <ProfileCard user={user} />
      <MenuList>
        <MenuListItem>Navigation Settings</MenuListItem>
        {user ? (
          <MenuListItem
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </MenuListItem>
        ) : (
          <>
            <GoogleLogin onSuccess={handleLogin}></GoogleLogin>
            <MenuListItem onClick={() => customLogin()}>Login</MenuListItem>
          </>
        )}
      </MenuList>
    </div>
  );
};
