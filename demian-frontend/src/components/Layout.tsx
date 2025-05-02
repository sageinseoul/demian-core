import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, TextField, Button } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 300;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            데미안 세무
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            사업자등록번호 선택
          </Typography>
          <TextField
            fullWidth
            label="사업자등록번호"
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            선택
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 