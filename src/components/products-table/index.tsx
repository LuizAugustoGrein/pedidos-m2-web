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

interface Products {
  id: Number;
  name: string;
  description: string;
  price: Number;
}

export default function ProductsTable() {

  const [products, setProducts] = useState<Array<Products>>([])

  useEffect(() => {

    const fetchProducts = async () => {
      await axios.get(
        'http://localhost:3333/products'
      ).then((resp) => {
        if (resp?.status === 200) {
          if(resp.data.products) {
            const data: any = [];
            resp.data.products.forEach((product: Products) => {
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

  const addToCart = async (id: any) => {
    var token = localStorage.getItem('token');
    console.log(token);

    await axios.post(
      `http://localhost:3333/carts/add/${id}`,
      {},
      {
          headers: {
              token: token
          }
      }
    ).then((resp) => {
      console.log(resp);
    })
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Nome</TableCell>
            <TableCell align="right">Descricao</TableCell>
            <TableCell align="right">Preco</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.id.toString()}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.price.toString()}</TableCell>

              <TableCell align="right">
                <Button variant="contained" onClick={() => addToCart(row.id)}>Adicionar ao carrinho</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
