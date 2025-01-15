import React, { useState } from "react";
import { useAutocomplete } from "@mui/base";
import { addClassName } from "../../utilities";
import clsx from "clsx";

import "./AutocompleteInput.css";
import "../../utilities.css";

/**
 * An input field with an autocomplete dropdown
 *
 * Proptypes:
 * @param {Array} options Array of options available for the autocomplete dropdown
 * @param {(object) => string} getOptionLabel Function that returns the label of the option
 * @param {string} inputLabelText Label for the input field
 * @param {(object) => void} onChange Function that is called when the value of the input field changes
 * @param {string | undefined} className Optional class name for the input field
 */
const AutocompleteInput = ({
  options,
  getOptionLabel,
  inputLabelText,
  onChange,
  className,
  ...props
}) => {
  const [value, setValue] = useState(null);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    options,
    getOptionLabel,
    value,
    onChange: (event, newValue) => {
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
  });

  return (
    <div className="flex flex-col items-start justify-start gap-s relative">
      <label {...addClassName(getInputLabelProps(), "")}>{inputLabelText}</label>
      <div {...addClassName(getRootProps(), "flex w-full border border-solid border-gray-300 rounded-lg")}>
        <input {...addClassName({ ...getInputProps(), ...props }, clsx(className, "w-full px-m py-s border-none u-border-radius-inherit flex-auto"))} />
      </div>
      {groupedOptions.length > 0 && (
        <div className="AutocompleteInput-dropdown">
          <ul {...addClassName(getListboxProps(), "list-none p-xs m-0 w-full max-h-80 overflow-y-auto absolute z-10 border border-solid border-gray-300 rounded-lg bg-white shadow")}>
            {groupedOptions.map((option, index) => (
              <li {...addClassName(getOptionProps({ option, index }), "list-none p-s rounded hover:bg-gray-50 cursor-pointer aria-selected:bg-gray-200")}>{getOptionLabel(option)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
