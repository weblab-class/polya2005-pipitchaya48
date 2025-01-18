import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Switch as BaseSwitch } from "@mui/base/Switch";

const resolveSlotProps = (fn, args) => {
  typeof fn === "function" ? fn(args) : fn;
};

export const Switch = ({ slotProps, ...props }) => {
  return (
    <BaseSwitch
      {...props}
      slotProps={{
        ...slotProps,
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(slotProps?.root, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              `group relative inline-block w-9 h-l m-2.5 ${
                ownerState.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
              }`,
              resolvedSlotProps?.className
            ),
          };
        },
        input: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(slotProps?.input, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              "cursor-inherit absolute block w-full h-full top-0 left-0 z-10 opacity-0 border-none",
              resolvedSlotProps?.className
            ),
          };
        },
        track: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(slotProps?.track, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              `absolute block w-full h-full transition rounded-full border border-solid outline-none border-none ${
                ownerState.checked ? "bg-silver-gray" : "bg-gray-200 hover:bg-gray-300"
              }`,
              resolvedSlotProps?.className
            ),
          };
        },
        thumb: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(slotProps?.thumb, ownerState);
          return {
            ...resolvedSlotProps,
            className: clsx(
              `block w-4 h-4 top-1 rounded-full border-none outline-none transition bg-white ${
                ownerState.checked ? "left-[18px]" : "left-[4px]"
              } relative transition-all`,
              resolvedSlotProps?.className
            ),
          };
        },
      }}
    />
  );
};
