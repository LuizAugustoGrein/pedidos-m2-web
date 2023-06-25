import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, Container, TextField } from '@mui/material';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

interface IFormInput {
    name: string;
    brand: string;
    price: number;
    validity: Date;
    description: string;
}

const schema = yup.object().shape({
    name: yup.string().required().min(2).max(100),
    price: yup.number().required(),
    description: yup.string().required().min(2)
});

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
            name: data.name,
            price: data.price,
            description: data.description
        }
        const resp = await axios.post(
            'http://localhost:3333/products',
            body,
            {
                headers: {
                    token: token
                }
            }
        )
        if (resp?.status === 200) {
            router.push('/products')
        } else {
            console.log(resp);
        }
    };

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

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledAppBar loggout={loggout} handleDrawerOpen={handleDrawerOpen} open={open} drawerWidth={drawerWidth}/>
            <StyledDrawer loggout={loggout} handleDrawerClose={handleDrawerClose} open={open} drawerWidth={drawerWidth}/>
            <Main open={open}>
                <DrawerHeader />
                <Container maxWidth="xs" className="register-form">
                    <Typography className="" variant="h3">
                        Adicionar Produto
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className="" noValidate>
                        <TextField
                            {...register("name")}
                            variant="outlined"
                            margin="normal"
                            label="Nome"
                            helperText={errors.name?.message}
                            error={!!errors.name?.message}
                            fullWidth
                            required
                        />
                        <TextField
                            {...register("price")}
                            variant="outlined"
                            margin="normal"
                            label="Preco"
                            helperText={errors.price?.message}
                            error={!!errors.price?.message}
                            type="number"
                            fullWidth
                            required
                        />
                        <TextField
                            {...register("description")}
                            variant="outlined"
                            margin="normal"
                            label="Descricao"
                            helperText={errors.description?.message}
                            error={!!errors.description?.message}
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