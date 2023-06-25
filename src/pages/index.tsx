import Login from "./login";
import Home from "./home/index"
import Products from "./products/index"
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function  Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    var token = localStorage.getItem('token');

    axios.post(
      'http://localhost:3333/users/token', 
      { token: token }
    ).then((resp) => {
      if (resp?.status === 200) {
        if(resp.data.login) {
          setIsAuthenticated(true);
        }
      }
    })
  }, [])

  return (
    <>
      { isAuthenticated ? <Products /> : <Login /> } 
    </>
  );
}
