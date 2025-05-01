import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import BusinessNumberDropdown from './components/BusinessNumberDropdown';
import TaxTabs from './components/Tabs';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        leftContent={<BusinessNumberDropdown />}
        rightContent={<TaxTabs />}
      />
    </ThemeProvider>
  );
}

export default App; 