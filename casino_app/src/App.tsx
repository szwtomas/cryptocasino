import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import {ethers} from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import CryptoCasino from "./artifacts/contracts/CryptoCasino.sol/CryptoCasino.json";


const greeterContractAdress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const casinoContractAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";

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

    async function getRandomNumber(){
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        console.log(contract)
        const transaction = await contract.updateRandomNumber()
        await transaction.wait()
        contract.on("RandomNumberUpdatedEvent", (randomNumber, id) => {
          console.log(`random number from oracle: ${ randomNumber }`);
          // The event object contains the verbatim log data, the
          // EventFragment and functions to fetch the block,
          // transaction and receipt and event functions
        });
      }
    }
      

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <button onClick={getRandomNumber}>Get random number</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greeting}/>
        <br />
      </header>
    </div>
  );
}

export default App;
