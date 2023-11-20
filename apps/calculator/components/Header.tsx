import { AppBar, Box, Container, Divider, Link, Stack, Toolbar, Typography } from '@mui/material';
import { If, Then } from 'react-if';

interface HeaderProps {
  showHomeLink: boolean
  showSpecsLink: boolean
}

export function Header({ 
  showHomeLink,
  showSpecsLink
}: HeaderProps) {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }} maxWidth="150px">
            <img src="/assets/logo.svg" alt="Zoom VISS Configurator" />
          </Box>
          <Box sx={{ flexGrow: 1 }} display="flex">
            <Stack direction="row" spacing={ 2 }>
              <If condition={ showHomeLink }>
                <Then>
                  <Link href="/" color="inherit" variant="body1" underline="hover">
                    Home
                  </Link>
                </Then>
              </If>
              <Link href="/calculator" color="inherit" variant="body1" underline="hover">
                Calculator
              </Link>
              <If condition={ showSpecsLink }>
                <Then>
                  <Link href="/specifications" color="inherit" variant="body1" underline="hover">
                    Specifications
                  </Link>
                </Then>
              </If>
              <Link href="/versions" color="inherit" variant="body1" underline="hover">
                Versions
              </Link>
            </Stack>
          </Box>

          <Stack direction="row">
            <Typography paddingRight={ 1 } fontWeight={500} >RC</Typography>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
