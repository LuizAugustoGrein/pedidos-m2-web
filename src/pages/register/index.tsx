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

interface IFormInput {
  user: string;
  password: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  number: number;
  district: string;
  city: string;
  state: string;
  cep: string;
}

const schema = yup.object().shape({
  user: yup.string().required().min(2).max(100),
  password: yup.string().required().min(8).max(120),
  name: yup.string().required().min(2).max(100),
  cpf: yup.string().required().min(11).max(14),
  email: yup.string().required().email(),
  phone: yup.string().required().min(10).max(14),
  address: yup.string().required().min(2).max(100),
  number: yup.number(),
  district: yup.string().required().min(2).max(100),
  city: yup.string().required().min(2).max(100),
  state: yup.string().required().min(2).max(2),
  cep: yup.string().required().min(8).max(10)
});

function Register() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormInput) => {
    const resp = await axios.post(
      'http://localhost:3333/users', 
      data
    )
    if (resp?.status === 200) {
      localStorage.setItem('token', resp.data.token);
      router.push('/home')
    }
  };

  return (
    <Container maxWidth="xs" className="register-form">
      <Typography className="" variant="h3">
        Registrar-se
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
          {...register("cpf")}
          variant="outlined"
          margin="normal"
          label="CPF"
          helperText={errors.cpf?.message}
          error={!!errors.cpf?.message}
          fullWidth
          required
        />
        <TextField
          {...register("email")}
          variant="outlined"
          margin="normal"
          label="E-mail"
          helperText={errors.email?.message}
          error={!!errors.email?.message}
          fullWidth
          required
        />
        <TextField
          {...register("phone")}
          variant="outlined"
          margin="normal"
          label="Telefone"
          helperText={errors.phone?.message}
          error={!!errors.phone?.message}
          fullWidth
          required
        />
        <TextField
          {...register("address")}
          variant="outlined"
          margin="normal"
          label="Endereço"
          helperText={errors.address?.message}
          error={!!errors.address?.message}
          fullWidth
          required
        />
        <TextField
          {...register("number")}
          variant="outlined"
          margin="normal"
          label="Número"
          helperText={errors.number?.message}
          error={!!errors.number?.message}
          fullWidth
        />
        <TextField
          {...register("district")}
          variant="outlined"
          margin="normal"
          label="Bairro"
          helperText={errors.district?.message}
          error={!!errors.district?.message}
          fullWidth
          required
        />
        <TextField
          {...register("city")}
          variant="outlined"
          margin="normal"
          label="Cidade"
          helperText={errors.city?.message}
          error={!!errors.city?.message}
          fullWidth
          required
        />
        <TextField
          {...register("state")}
          variant="outlined"
          margin="normal"
          label="Estado"
          helperText={errors.state?.message}
          error={!!errors.state?.message}
          fullWidth
          required
        />
        <TextField
          {...register("cep")}
          variant="outlined"
          margin="normal"
          label="CEP"
          helperText={errors.cep?.message}
          error={!!errors.cep?.message}
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
          Continuar
        </Button>
        <hr />
        <a href="/" className="login-url">Faca o seu login aqui.</a>
      </form>
    </Container>
  );
}

export default Register;