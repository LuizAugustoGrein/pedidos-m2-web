import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, Container, TextField } from '@mui/material';
import { StyledTextField } from '@/components/TextField';
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

export default function ProductsEdit() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [validity, setValidity] = React.useState("");
    const [name, setName] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [description, setDescription] = React.useState("");

    const [validityCorrect, setValidityCorrect] = React.useState(false);
    const [nameCorrect, setNameCorrect] = React.useState(false);
    const [brandCorrect, setBrandCorrect] = React.useState(false);
    const [priceCorrect, setPriceCorrect] = React.useState(false);
    const [descriptionCorrect, setDescriptionCorrect] = React.useState(false);

    const [canBeSubmitted, setCanBeSubmitted] = React.useState(true);

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
                'http://localhost:3333/products/' + router.query.id
            ).then((resp) => {
                if (resp?.status == 200) {
                    setValidity(resp.data.validity?.slice(0, 10));
                    setName(resp.data.name);
                    setBrand(resp.data.brand)
                    setPrice(resp.data.price)
                    setDescription(resp.data.description)
                } else {
                    console.log(resp);
                }
            })
        }

        setDetails()
    }, [])    

    function verifyFields () {
        if (validityCorrect && nameCorrect && brandCorrect && priceCorrect && descriptionCorrect) {
            return true;
        } else {
            return false;
        }
    }

    React.useEffect(() => {
        setCanBeSubmitted(verifyFields());
    }, [validityCorrect, nameCorrect, brandCorrect, priceCorrect, descriptionCorrect])

    const router = useRouter()

    const submitForm = () => {
        var body = {
            validity: validity.slice(0, 10),
            name: name,
            brand: brand,
            price: Number(price),
            description: description
        }
        
        axios.put(
            'http://localhost:3333/products/' + router.query.id,
            body
        ).then(() => {
        })

        router.replace('/products')
             
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
            <StyledAppBar loggout={loggout} handleDrawerOpen={handleDrawerOpen} open={open} drawerWidth={drawerWidth}/>
            <StyledDrawer loggout={loggout} handleDrawerClose={handleDrawerClose} open={open} drawerWidth={drawerWidth}/>
            <Main open={open}>
                <DrawerHeader />
                <Container maxWidth="xs" className="register-form">
                    <Typography className="" variant="h3">
                        Editar Produto
                    </Typography>
                    <form className="" noValidate>
                        <StyledTextField type="text" label={'Nome'} state={name} setState={setName} correct={nameCorrect} setCorrect={setNameCorrect} />
                        <StyledTextField type="text" label={'Marca'} state={brand} setState={setBrand} correct={brandCorrect} setCorrect={setBrandCorrect} />
                        <StyledTextField type="number" label={'Preco'} state={price} setState={setPrice} correct={priceCorrect} setCorrect={setPriceCorrect} />
                        <StyledTextField type="date" label={'Validade'} state={validity} setState={setValidity} correct={validityCorrect} setCorrect={setValidityCorrect} />
                        <StyledTextField type="text" label={'Descricao'} state={description} setState={setDescription} correct={descriptionCorrect} setCorrect={setDescriptionCorrect} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className=""
                            onClick={submitForm}
                            disabled={!canBeSubmitted}
                        >
                            Editar
                        </Button>
                    </form>
                </Container>
            </Main>
        </Box>
    );
}