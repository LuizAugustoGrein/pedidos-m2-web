import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, Container, MenuItem, Select, TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from 'react';

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

interface IFormInput {
    product_id: number;
    quantity: number;
}

const schema = yup.object().shape({
    product_id: yup.number().required(),
    quantity: yup.number().required()
});

export default function Menu() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [products, setProducts] = useState<Array<any>>([]);

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

        const fetchProducts = async () => {
            await axios.get(
                'http://localhost:3333/products'
            ).then((resp) => {
                if (resp?.status === 200) {
                    if (resp.data.products) {
                        const data: any = [];
                        resp.data.products.forEach((product: any) => {
                            data.push(product);
                        });
                        setProducts(data);
                    }
                }
            })
        }

        fetchProducts();
    }, [])

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: IFormInput) => {
        var token = localStorage.getItem('token');
        
        var body = {
            quantity: data.quantity,
            product_id: data.product_id,
            cart_id: router.query.id
        }
        console.log(body);
        const resp = await axios.post(
            'http://localhost:3333/cart-products/' + router.query.id,
            body,
            {
                headers: {
                    token: token
                }
            }
        )
        if (resp?.status === 200) {
            router.push('/carts/edit?id=' + router.query.id)
        } else {
            console.log(resp);
        }
    };

    const loggout = () => {
        localStorage.setItem('token', '');
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
                    <ListItem key={'carts'} disablePadding component="a" href="/carts">
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
                <Container maxWidth="md" className="register-form">
                    <Typography className="" variant="h3">
                        Adicionar Produto ao Carrinho
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className="" noValidate>
                        <Select
                            {...register("product_id")}
                            variant="outlined"
                            label="Produto"
                            error={!!errors.product_id?.message}
                            fullWidth
                            required
                        >
                            {products.map((item, index) => {
                                return <MenuItem value={item.id}>{item.name}</MenuItem>
                            })}
                        </Select>
                        <TextField
                            {...register("quantity")}
                            variant="outlined"
                            margin="normal"
                            label="Quantidade"
                            helperText={errors.quantity?.message}
                            error={!!errors.quantity?.message}
                            type="number"
                            fullWidth
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className=""
                        >
                            Adicionar
                        </Button>
                    </form>
                </Container>
            </Main>
        </Box>
    );
}