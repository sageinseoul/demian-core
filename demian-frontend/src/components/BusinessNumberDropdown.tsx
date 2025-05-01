import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

function BusinessNumberDropdown() {
  const [businessNumber, setBusinessNumber] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setBusinessNumber(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="business-number-label">사업자 등록번호</InputLabel>
      <Select
        labelId="business-number-label"
        id="business-number-select"
        value={businessNumber}
        label="사업자 등록번호"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>선택하세요</em>
        </MenuItem>
        <MenuItem value="123-45-67890">123-45-67890</MenuItem>
        <MenuItem value="987-65-43210">987-65-43210</MenuItem>
      </Select>
    </FormControl>
  );
}

export default BusinessNumberDropdown; 