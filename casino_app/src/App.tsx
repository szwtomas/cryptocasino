import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import {ethers} from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterContractAdress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
  const [greeting, setGreetingValue] = useState<string>('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const contract = new ethers.Contract(greeterContractAdress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    } else {
      alert("this is a dapp, so please install metamask chrome extensions to continue");
    }
  }

  async function setGreeting(){
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterContractAdress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('');
      await transaction.wait()
      fetchGreeting()
      }
    }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greeting}/>
        <br />
      </header>
    </div>
  );
}

export default App;
