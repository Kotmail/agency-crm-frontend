import { FC } from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { UserWidget } from "./UserWidget";

export const Header: FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography variant="h5">
            CRM
          </Typography>
          <Box marginLeft='auto'>
            <UserWidget />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}