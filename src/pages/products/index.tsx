import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import ProductsTable from '@/components/products-table';
import RightDrawer from '@/components/right-drawer';
import { StyledAppBar } from '@/components/StyledAppBar';
import { StyledDrawer } from '@/components/StyledDrawer';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Menu() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [cart, setCart] = React.useState<any>({});
  const [updateBasket, setUpdateBasket] = React.useState<boolean>(false);

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
    ...(cart.products && {
      marginRight: `300px`
    })
  }));

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

    axios.get(
      'http://localhost:3333/cart',
      { headers: { token: token } }
    ).then((resp) => {
      console.log(resp.data.products);
      setCart(resp.data);
    })
  }, [])

  React.useEffect(() => {
    var token = localStorage.getItem('token');

    axios.get(
      'http://localhost:3333/cart',
      { headers: { token: token } }
    ).then((resp) => {
      console.log(resp.data.products);
      setCart(resp.data);
    })
  }, [updateBasket])

  const router = useRouter()

  const loggout = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('admin', 'false');
    router.reload()
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const addToCart = async (id: any) => {
    var token = localStorage.getItem('token');

    await axios.post(
      `http://localhost:3333/carts/add/${id}`,
      {},
      {
          headers: {
              token: token
          }
      }
    ).then((resp) => {
      setUpdateBasket(!updateBasket);
      console.log(resp);
    })
  };

  const decreaseFromCart = async (id: any) => {
    var token = localStorage.getItem('token');

    await axios.post(
      `http://localhost:3333/carts/decrease/${id}`,
      {},
      {
          headers: {
              token: token
          }
      }
    ).then((resp) => {
      setUpdateBasket(!updateBasket);
      console.log(resp);
    })
  };

  const submitOrder = () => {
    var token = localStorage.getItem('token');

    axios.post(
      'http://localhost:3333/order/submit',
      {},
      {
          headers: {
              token: token
          }
      }
    ).then((resp) => {
      setUpdateBasket(!updateBasket);
      alert(resp?.data.msg);
    })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar cart={cart} loggout={loggout} handleDrawerOpen={handleDrawerOpen} open={open} drawerWidth={drawerWidth}/>
      <StyledDrawer loggout={loggout} handleDrawerClose={handleDrawerClose} open={open} drawerWidth={drawerWidth}/>
      <Main open={open}>
        <DrawerHeader />
        <Typography className="" variant="h4">
          Produtos
        </Typography>
        <ProductsTable updateBasket={updateBasket} setUpdateBasket={setUpdateBasket} addToCart={addToCart}></ProductsTable>
        {(cart.products) && 
          <RightDrawer cart={cart} submitOrder={submitOrder} updateBasket={updateBasket} setUpdateBasket={setUpdateBasket} addToCart={addToCart} decreaseFromCart={decreaseFromCart}></RightDrawer>
        }
      </Main>
    </Box>
  );
}