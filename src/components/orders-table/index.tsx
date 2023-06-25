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

interface Orders {
    id: Number;
    total_price: Number;
    status: string;
    customer_id: Number;
    creation_time: Date;
    update_time: Date;
}

export default function OrdersTable() {

    const [orders, setOrders] = useState<Array<Orders>>([])
    
    useEffect(() => {

        var token = localStorage.getItem('token');

        const fetchOrders = async () => {

            await axios.get(
                'http://localhost:3333/orders',
                {
                    headers: {
                        token: token
                    }
                }
            ).then((resp) => {
                console.log(resp);
                if (resp?.status === 200) {
                    if (resp.data.orders) {
                        const data: any = [];
                        resp.data.orders.forEach((order: Orders) => {
                            data.push(order);
                        });
                        setOrders(data);
                    }
                }
            })
        }

        fetchOrders();

    }, [])


    const router = useRouter()

    const orderDetails = (id: any) => {
        localStorage.setItem('current_order', id);
        router.push('/orders/details');
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Preço Total</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((row) => (
                        <TableRow
                            key={row.id.toString()}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{row.id.toString()}</TableCell>
                            <TableCell align="right">R$ {row.total_price.toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" onClick={() => orderDetails(row.id)} data-id={row.id}>ver Detalhes</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
