import {
    Container,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { useRouter } from 'next/router'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface IFormInput {
    user: string;
    password: string;
}

const schema = yup.object().shape({
    user: yup.string().required().min(2).max(100),
    password: yup.string().required().min(8).max(120),
});

export default function Login() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: IFormInput) => {
        console.log(data);
        const resp = await axios.post(
            'http://localhost:3333/users/login',
            data
        )
        if (resp?.status === 200) {
            localStorage.setItem('token', resp.data.token);
            router.push('/home')
        } else {
            console.log(resp);
        }
    };

    return (
        <Container maxWidth="xs" className="register-form">
            <Typography className="" variant="h3">
                Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="" noValidate>
                <TextField
                    {...register("user")}
                    variant="outlined"
                    margin="normal"
                    label="Usuario"
                    helperText={errors.user?.message}
                    error={!!errors.user?.message}
                    fullWidth
                    required
                />
                <TextField
                    {...register("password")}
                    variant="outlined"
                    margin="normal"
                    label="Senha"
                    helperText={errors.password?.message}
                    error={!!errors.password?.message}
                    type="password"
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
                    Fazer login
                </Button>
                <hr />
                <a href="/register" className="login-url">Nao esta registrado? registrar-se agora.</a>
            </form>
        </Container>
    );
}