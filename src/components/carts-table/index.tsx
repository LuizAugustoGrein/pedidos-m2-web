import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

interface Carts {
    id: Number;
    total_price: Number;
    status: string;
    user_id: Number;
    created_at: Date;
    updated_at: Date;
}

export default function CartsTable() {

    const [carts, setCarts] = useState<Array<Carts>>([])
    
    useEffect(() => {

        var token = localStorage.getItem('token');

        const fetchCarts = async () => {

            await axios.get(
                'http://localhost:3333/carts',
                {
                    headers: {
                        token: token
                    }
                }
            ).then((resp) => {
                if (resp?.status === 200) {
                    if (resp.data.carts) {
                        const data: any = [];
                        resp.data.carts.forEach((cart: Carts) => {
                            data.push(cart);
                        });
                        setCarts(data);
                    }
                }
            })
        }

        fetchCarts();

    }, [])


    const router = useRouter()

    const editCart = (id: any) => {
        router.push('/carts/edit?id=' + id)
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Preco Total</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Criado em</TableCell>
                        <TableCell align="right">Atualizado em</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {carts?.map((row) => (
                        <TableRow
                            key={row.id.toString()}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{row.id.toString()}</TableCell>
                            <TableCell align="right">{row.total_price.toString()}</TableCell>
                            <TableCell align="right">{row.status.toString()}</TableCell>
                            <TableCell align="right">{row.created_at.toString()}</TableCell>
                            <TableCell align="right">{row.updated_at.toString()}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" onClick={() => editCart(row.id)} data-id={row.id}>Editar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
