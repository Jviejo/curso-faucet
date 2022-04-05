const { ethereum } = window;
import { useEffect, useState } from 'react';
import './App.css';
import genesis from './genesis.json';
import axios from 'axios'

import { useQuery } from "react-query";

function App() {
  const [cuenta, setCuenta] = useState(null)
  const [saldo, setSaldo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  function enviar(e) {
    setIsLoading(true)
    axios.get(
      `http://localhost:4444/enviar/${cuenta}`
    ).then((res) => { setIsLoading(false); setSaldo(res.data) })
  }

  useEffect(() => {
    ethereum && ethereum.request({ method: 'eth_requestAccounts' }).then(i => {
      setCuenta(i[0])
      setIsLoading(true)
      axios.get(
        `http://localhost:4444/balance/${i[0]}`
      ).then((res) => {
        setIsLoading(true);
        setSaldo(res.data);
        setIsLoading(false);
      })

      ethereum.on('accountsChanged', (i) => {
        setCuenta(i[0])
        axios.get(
          `http://localhost:4444/balance/${i[0]}`
        ).then((res) => setSaldo(res.data))
      })
    });
  }, [])

  return (
    <div className='container'>
      <h2>Faucet del Curso del Curso Cripto</h2>
      <p>Debe de conectar el metamask con la red privada localhost:7545</p>
      <button className='btn btn-primary mb-3'>Conectar con Metamask</button>
      <h4>Crea la red a partir del fichero genesis.json.</h4>
      <code>geth init --datadir data genesis.json</code>
      <br />
      <code>docker run -v $PWD/localdir:/datadir -v $PWD/genesis.json:/genesis.json --name nombre-eth ethereum/client-go init --datadir /datadir /genesis.json
      </code>
      <h4 className='my-3'>fichero genesis usando. Cambiar la cuenta 0xff... por la vuestra</h4>
      <pre>{JSON.stringify(genesis)}</pre>
      <h4 className='my-3'>Lanza la red</h4>
      <code>geth   --datadir data --http.api personal,eth,net,web3  --http --http.addr 0.0.0.0 --http.port 7545 --mine --miner.etherbase 0xff21E724B7D483fc93708855AbE6ee4f1eD97BF3 --miner.threads=1</code>
      <br />
      <code> docker run --name ethereum-node -p 7545:7545 -v $PWD/data:/data -d ethereum/client-go --datadir data --http.api personal,eth,net,web3  --http --http.addr 0.0.0.0 --http.port 7545 --mine --miner.etherbase 0xff21E724B7D483fc93708855AbE6ee4f1eD97BF3 --miner.threads=1
      </code>
      <p className='mt-3'>Cuenta</p>

        <div>
          <p><b>{cuenta} <br></br>saldo {JSON.stringify(saldo)}</b></p>
          {!isLoading && <button onClick={(e) => { enviar(e) }} className='btn btn-primary text-end mt-3'>Enviar 10eth </button>}
        </div>
    </div>

  )
}

export default App
