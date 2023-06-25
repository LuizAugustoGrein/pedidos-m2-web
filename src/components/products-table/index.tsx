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

interface tableProps{
  setUpdateBasket: (state: boolean) => void,
  updateBasket: boolean,
  addToCart: (id: Number) => void
}

interface Products {
  id: Number;
  name: string;
  description: string;
  price: Number;
}

export default function ProductsTable({setUpdateBasket, updateBasket, addToCart}: tableProps) {

  const [products, setProducts] = useState<Array<Products>>([])
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {

    var isAdmin = (localStorage.getItem('admin') == 'true') ? true : false;
    setAdmin(isAdmin);

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

  const edit = (id: any) => {
    localStorage.setItem('current_product', id);
    router.push('/products/edit');
  }

  const add = () => {
    router.push('/products/add');
  }

  return (
    <>
      {admin && (
        <Button style={{ marginTop: 20, marginBottom: 30 }} variant="contained" onClick={() => add()}>Adicionar Produto</Button>
      )}
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
                  {!admin && (
                    <Button variant="contained" onClick={() => addToCart(row.id)}>Adicionar ao carrinho</Button>
                  )}
                  {admin && (
                    <Button variant="contained" onClick={() => edit(row.id)}>Editar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
    
  );
}
