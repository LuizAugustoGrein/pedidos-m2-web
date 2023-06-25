import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';
import axios from 'axios';

interface DrawerProps{
  cart: any,
  submitOrder: () => void,
  setUpdateBasket: (state: boolean) => void,
  updateBasket: boolean,
  addToCart: (id: Number) => void,
  decreaseFromCart: (id: Number) => void
}

const drawerWidth = 300;

export default function RightDrawer({cart, submitOrder, setUpdateBasket, updateBasket, addToCart, decreaseFromCart}: DrawerProps) {

  const [customer, setCustomer] = React.useState<any>({});

  React.useEffect(() => {

      var token = localStorage.getItem('token');

      const fetchCustomer = async () => {
          await axios.get(
              'http://localhost:3333/customer',
              { headers: { token: token } }
          ).then((resp) => {
              console.log(resp.data);
              if (resp?.status === 200) {
                  setCustomer(resp.data);
              }
          })
      }

      fetchCustomer();
      
  }, [])

  return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Typography style={{padding: `20px`, textAlign: 'center'}} className="" variant="h5">Meu Carrinho</Typography>
        <Divider />
        <List>
          {cart.products.map((item: any) => (
            <>
              <ListItem key={item} disablePadding>
                <ListItemText primary={item.details.name} style={{padding: 10}} />
                <ListItemButton style={{position: 'absolute', right: 75}} onClick={() => decreaseFromCart(item.product_id)}>-</ListItemButton>
                <ListItemText primary={item.quantity} style={{position: 'absolute', right: 50}} />
                <ListItemButton style={{position: 'absolute', right: 0}} onClick={() => addToCart(item.product_id)}>+</ListItemButton>
              </ListItem>
              <Typography style={{textAlign: 'right', paddingRight: 30, paddingBottom: 15 }}>
                R$ {(item.unity_value * item.quantity).toFixed(2)}
              </Typography>
              <Divider />
            </>
          ))}
        </List>
          
        <Typography style={{textAlign: 'center' }}>
          Total do carrinho: R$ {(cart.total_price).toFixed(2)}
        </Typography>

        <Button variant="contained" onClick={() => submitOrder()} style={{margin: 10}}>Finalizar pedido</Button>

        <Typography style={{textAlign: 'center', margin: 10 }}>
          Entregar para {customer.name}: {customer.address}, número {customer.number}, {customer.district}, {customer.city} - {customer.state}, {customer.cep}
        </Typography>
        
      </Drawer>
  );
}