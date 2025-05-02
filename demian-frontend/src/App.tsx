import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Tabs from './components/Tabs';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Layout>
        <Tabs />
      </Layout>
    </Box>
  );
};

export default App; 