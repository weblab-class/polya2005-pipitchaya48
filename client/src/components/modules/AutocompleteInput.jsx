import React, { useState } from "react";
import { useAutocomplete } from "@mui/base";
import { addClassName } from "../../utilities";

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
    <div className="AutocompleteInput-container">
      <label {...addClassName(getInputLabelProps(), "")}>{inputLabelText}</label>
      <div {...addClassName(getRootProps(), "AutocompleteInput-root u-flex")}>
        <input {...addClassName({ ...getInputProps(), ...props }, className)} />
      </div>
      {groupedOptions.length > 0 && (
        <div className="AutocompleteInput-dropdown">
          <ul {...addClassName(getListboxProps(), "")}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>{getOptionLabel(option)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
