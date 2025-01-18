import React, { useContext, useState } from "react";
import { MenuList, MenuListSwitch } from "../modules/MenuList";
import { SettingsHeading } from "../modules/SettingsHeading";
import { get, post } from "../../utilities";

export const NavigationSettings = () => {
  const [avoidGrass, setAvoidGrass] = useState(true);

  const changeAvoidGrass = (event) => {
    post("/api/navigation-settings", { field: "avoidGrass", value: event.target.checked }).then(
      (value) => {
        setAvoidGrass(value);
        console.log(avoidGrass);
      }
    );
  };

  return (
    <div className="flex flex-col items-center py-8 w-full">
      <SettingsHeading>Navigation Settings</SettingsHeading>
      <MenuList>
        <MenuListSwitch check={avoidGrass} onChange={changeAvoidGrass}>
          Avoid grass
        </MenuListSwitch>
        <MenuListSwitch check={true}>Stay indoor if possible</MenuListSwitch>
      </MenuList>
    </div>
  );
};
