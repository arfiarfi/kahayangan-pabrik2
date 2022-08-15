import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const Filter = ({ filterName, filterData, setFilter }) => {
  const [value, setValue] = useState("");

  return (
    <Box sx={{ width: "15rem" }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            backgroundColor: "white",
            pr: 1,
          }}
        >
          {filterName}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Location"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setFilter(e.target.value);
          }}
          sx={{ height: "2.5rem" }}
        >
          <MenuItem value="">All Data</MenuItem>
          {filterData?.map((item, index) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filter;
