import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)({
  display: 'flex',
  height: '100vh',
  width: '100vw',
});

const LeftPanel = styled(Paper)({
  width: '16.67%', // 1/6
  padding: '20px',
  backgroundColor: '#f5f5f5',
});

const RightPanel = styled(Paper)({
  width: '83.33%', // 5/6
  padding: '20px',
});

interface LayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

function Layout({ leftContent, rightContent }: LayoutProps) {
  return (
    <StyledBox>
      <LeftPanel elevation={3}>
        {leftContent}
      </LeftPanel>
      <RightPanel elevation={3}>
        {rightContent}
      </RightPanel>
    </StyledBox>
  );
}

export default Layout; 