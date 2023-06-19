import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import ProductsTable from '@/components/products-table';
import { StyledAppBar } from '@/components/StyledAppBar';
import { StyledDrawer } from '@/components/StyledDrawer';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Menu() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    var token = localStorage.getItem('token');

    axios.post(
      'http://localhost:3333/users/token',
      { token: token }
    ).then((resp) => {
      if (resp?.status === 200) {
        if (resp.data.login) {
          setIsAuthenticated(true);
        } else {
          router.push('/')
        }
      }
    })
  }, [])

  const router = useRouter()

  const loggout = () => {
    localStorage.setItem('token', '');
    router.reload()
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar loggout={loggout} handleDrawerOpen={handleDrawerOpen} open={open} drawerWidth={drawerWidth}/>
      <StyledDrawer loggout={loggout} handleDrawerClose={handleDrawerClose} open={open} drawerWidth={drawerWidth}/>
      <Main open={open}>
        <DrawerHeader />
        <Typography className="" variant="h4">
          Produtos
        </Typography>
        <Button variant="contained" component="a" href="/products/add">Adicionar</Button>
        <ProductsTable></ProductsTable>
      </Main>
    </Box>
  );
}