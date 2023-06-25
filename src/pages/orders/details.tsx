import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function OrderDetails() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [order, setOrder] = React.useState<any>({});
    const router = useRouter();

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

        const fetchOrder = async () => {
            var orderID = localStorage.getItem('current_order');
            await axios.get(
                'http://localhost:3333/order/' + orderID,
                { headers: { token: token } }
            ).then((resp) => {
                console.log(resp.data);
                if (resp?.status === 200) {
                    setOrder(resp.data);
                }
            })
        }

        fetchOrder();
        
    }, [])

    const loggout = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('admin', 'false');
        router.reload()
    };

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Pedidos
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="loggout"
                        onClick={loggout}
                        edge="end"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key={'products'} disablePadding component="a" href="/products">
                        <ListItemButton>
                            <ListItemIcon>
                                <FastfoodIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Produtos'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'orders'} disablePadding component="a" href="/orders">
                        <ListItemButton>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Pedidos'} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem key={`products`} disablePadding onClick={loggout}>
                        <ListItemButton>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Desconectar'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <Typography className="" variant="h4">
                    Detalhes do pedido nº{order.id}
                </Typography>
                <Toolbar sx={{ justifyContent: "space-between" }}>

                </Toolbar>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Nome</TableCell>
                                <TableCell align="right">Valor Unitario</TableCell>
                                <TableCell align="right">Quantidade</TableCell>
                                <TableCell align="right">Valor Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.products?.map((row: any) => (
                                <TableRow
                                    key={row.details.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right">{row.details.name}</TableCell>
                                    <TableCell align="right">R$ {row.unity_value.toFixed(2)}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell align="right">R$ {(row.unity_value * row.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow
                                key={'last'}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">
                                    <Typography className="" variant="h6">
                                        Total do pedido: R$ {(order.total_price)?.toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Main>
        </Box>
    );
}