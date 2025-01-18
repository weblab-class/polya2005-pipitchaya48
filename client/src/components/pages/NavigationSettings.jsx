import React, { useContext, useState } from "react";
import { MenuList, MenuListSwitch } from "../modules/MenuList";
import { SettingsHeading } from "../modules/SettingsHeading";

export const NavigationSettings = () => {
  return (
    <div className="flex flex-col items-center py-8 w-full">
      <SettingsHeading>Navigation Settings</SettingsHeading>
      <MenuList>
        <MenuListSwitch>Avoid grass</MenuListSwitch>
        <MenuListSwitch>Stay indoor if possible</MenuListSwitch>
      </MenuList>
    </div>
  );
};
