// /src/components/test/TierOptions.jsx
"use client";

import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';

const TierOptions = ({ options, selectedValue, onChange, label }) => {
  return (
    <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
      {label && <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'medium' }}>{label}</FormLabel>}
      <RadioGroup
        aria-label={label || "options"}
        name={label || "options-group"}
        value={selectedValue || ''}
        onChange={onChange}
      >
        {options.map((option) => (
          <Box key={option.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1, '&:hover': { borderColor: 'primary.main' } }}>
            <FormControlLabel
              value={option.id}
              control={<Radio />}
              label={option.text}
              sx={{ width: '100%', m: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default TierOptions;