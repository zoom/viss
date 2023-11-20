import { AppBar, Box, Container, Link, Stack, Toolbar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }} maxWidth="150px">
            <img src="/assets/logo.svg" alt="Zoom VISS Configurator" />
          </Box>
          <Box sx={{ flexGrow: 1 }} display="flex">
            <Stack direction="row" spacing={ 2 }>
              <Link href="/configuration" color="inherit" variant="body1" underline="hover">
                Configurations
              </Link>
              <Link href="/group" color="inherit" variant="body1" underline="hover">
                Groups
              </Link>
            </Stack>
          </Box>
          <Stack direction="row">
            <SettingsIcon />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
