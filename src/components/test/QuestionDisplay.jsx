// /src/components/test/QuestionDisplay.jsx
"use client";

import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const QuestionDisplay = ({currentQuestionIndex, image, tier1Text, tier2Text, showTier2 }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box mb={showTier2 ? 2 : 0}>
        <Typography variant="h6" component="p" gutterBottom sx={{ fontWeight: 'medium' }}>
          Soal :
        </Typography>
        {image && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <img src={image} alt={`Soal ${currentQuestionIndex}`} style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }} />
          </Box>
        )}
        <Typography variant="body1" component="p" sx={{ mb: 1, lineHeight: 1.7 }}>
          {tier1Text}
        </Typography>
      </Box>
      {showTier2 && tier2Text && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="h6" component="p" gutterBottom sx={{ fontWeight: 'medium', color: 'secondary.main' }}>
            (Alasan):
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 1, lineHeight: 1.7 }}>
            {tier2Text}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default QuestionDisplay;