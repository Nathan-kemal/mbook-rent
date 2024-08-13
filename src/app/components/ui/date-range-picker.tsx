import React from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { IconButton, InputAdornment } from "@mui/material";

const MDateRangePicker = () => {
  return (
    <DateRangePicker
      slotProps={{
        textField: {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <ArrowDropDownIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        },
      }}
      slots={{ field: SingleInputDateRangeField }}
      name="allowedRange"
      sx={{
        "& .MuiOutlinedInput-root": {
          border: "none",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
    />
  );
};

export default MDateRangePicker;
