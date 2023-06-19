import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, Container, TextField } from '@mui/material';
import * as yup from "yup";
import { StyledAppBar } from '@/components/StyledAppBar';
import { StyledDrawer } from '@/components/StyledDrawer';
import { StyledTextField } from '@/components/TextField';

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

interface IFormInput {
    quantity: number;
}

const schema = yup.object().shape({
    quantity: yup.number().required()
});

export default function EditCartProduct() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

    const [product, setProduct] = React.useState("");
    const [quantity, setQuantity] = React.useState("");

    const [productCorrect, setProductCorrect] = React.useState(false);
    const [quantityCorrect, setQuantityCorrect] = React.useState(false);

    const [canBeSubmitted, setCanBeSubmitted] = React.useState(false);

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

        function setDetails() {
            console.log(router.query.id)
            axios.get(
                'http://localhost:3333/cart-products/' + router.query.cart_id,
                {
                    headers: {
                        token: token
                    }
                }
            ).then((resp) => {
                if (resp?.status == 200) {
                    resp.data.products?.forEach((element: any) => {
                        if (element.details.id == router.query.product_id) {
                            setProduct(element.details.name);
                            setQuantity(element.item.quantity);
                        }
                    });
                    
                } else {
                    console.log(resp);
                }
            })
        }

        setDetails()

    }, [])

    const router = useRouter()

    const removeProduct = async () => {
        var token = localStorage.getItem('token');

        var body = {
            product_id: router.query.product_id,
        }
        const resp = await axios.delete(
            'http://localhost:3333/cart-products/' + router.query.cart_id,
            {
                headers: {
                    token: token
                },
                data: body
            }
        )
        if (resp?.status === 200) {
            router.push('/carts/edit?id=' + router.query.cart_id)
        } else {
            console.log(resp);
        }
    }

    function verifyFields() {
        if (productCorrect && quantityCorrect) {
            return true;
        } else {
            return false;
        }
    }

    React.useEffect(() => {
        setCanBeSubmitted(verifyFields());
    }, [productCorrect, quantityCorrect])

    const submitForm = () => {
        var token = localStorage.getItem('token');

        var body = {
            quantity: quantity,
            product_id: router.query.product_id,
        }

        axios.post(
            'http://localhost:3333/cart-products/' + router.query.cart_id,
            body,
            {
                headers: {
                    token: token
                }
            }
        )

        router.push('/carts/edit?id=' + router.query.cart_id)

    };

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
            <StyledAppBar loggout={loggout} handleDrawerOpen={handleDrawerOpen} open={open} drawerWidth={drawerWidth} />
            <StyledDrawer loggout={loggout} handleDrawerClose={handleDrawerClose} open={open} drawerWidth={drawerWidth} />
            <Main open={open}>
                <DrawerHeader />
                <Container maxWidth="md" className="register-form">
                    <Typography className="" variant="h3">
                        Editar Produto no Carrinho
                    </Typography>
                    <form onSubmit={submitForm} className="" noValidate>
                        <StyledTextField type="text" label={'Nome'} state={product} setState={setProduct} correct={productCorrect} setCorrect={setProductCorrect} disabled={true} />
                        <StyledTextField type="number" label={'Quantidade'} state={quantity} setState={setQuantity} correct={quantityCorrect} setCorrect={setQuantityCorrect} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className=""
                            disabled={!canBeSubmitted}
                        >
                            Editar
                        </Button>
                    </form>
                    <Box textAlign='center'>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            className=""
                            sx={{ width: 200, padding: 1, margin: 2 }}
                            onClick={removeProduct}
                        >
                            Remover
                        </Button>
                    </Box>

                </Container>
            </Main>
        </Box>
    );
}