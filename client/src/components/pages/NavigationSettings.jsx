import React, { useContext, useState, useEffect } from "react";
import { MenuList, MenuListSwitch } from "../modules/MenuList";
import { SettingsHeading } from "../modules/SettingsHeading";
import { get, post } from "../../utilities";
import _ from "underscore";

export const NavigationSettings = () => {
  const [navSet, setNavSet] = useState({
    avoidGrass: true,
    stayIndoor: true,
  });

  // fetch stored data
  useEffect(() => {
    get("/api/navigation-setting").then((data) => {
      if (data !== null) {
        setNavSet(_.extend({...navSet}, data));
      }
    });
  }, []);

  const changeAvoidGrass = (event) => {
    post("/api/navigation-settings", { field: "avoidGrass", value: event.target.checked }).then(
      (value) => {
        setNavSet({
          stayIndoor: navSet.stayIndoor,
          avoidGrass: value,
        });
      }
    );
  };

  const changeStayIndoor = (event) => {
    post("/api/navigation-settings", { field: "stayIndoor", value: event.target.checked }).then(
      (value) => {
        setNavSet({
          stayIndoor: value,
          avoidGrass: navSet.avoidGrass,
        });
      }
    );
  };

  return (
    <div className="flex flex-col items-center py-8 w-full">
      <SettingsHeading>Navigation Settings</SettingsHeading>
      <MenuList>
        <MenuListSwitch checked={navSet.avoidGrass} onChange={changeAvoidGrass}>
          Avoid grass
        </MenuListSwitch>
        <MenuListSwitch checked={navSet.stayIndoor} onChange={changeStayIndoor}>
          Stay indoor if possible
        </MenuListSwitch>
      </MenuList>
    </div>
  );
};
