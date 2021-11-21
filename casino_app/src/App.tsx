import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import {ethers} from "ethers";
import { Button, Image, InputNumber, Layout, Row, Typography } from 'antd';
import Dice from 'react-dice-roll';

import {FancyButton} from "./FancyButton";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import CryptoCasino from "./artifacts/contracts/CryptoCraps.sol/CryptoCraps.json";



const greeterContractAdress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const casinoContractAddress = "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0";

const { Header, Footer, Content, Sider } = Layout;
const {Title} = Typography;

function App() {
  const [greeting, setGreetingValue] = useState<string>('');
  const [balance, setBalanceValue] = useState<number>(0);
  const [gameState, setGameState] = useState<'menu' | 'dices'>("menu");

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
        const transaction = await contract.betNumberSingleDice(4, 10)
        await transaction.wait()
        contract.on("RandomNumberUpdatedEvent", (randomNumber, id) => {
          console.log(`random number from oracle: ${ randomNumber }`);
          // The event object contains the verbatim log data, the
          // EventFragment and functions to fetch the block,
          // transaction and receipt and event functions
        });
      }
    }

    async function getBalance(){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, provider)
        try {
          const currentBalance = await contract.balance()
          //setBalanceValue(currentBalance);
          console.log('balance: ', Number(currentBalance._hex))
        } catch (err) {
          console.log("Error: ", err)
        }
      } else {
        alert("this is a dapp, so please install metamask chrome extensions to continue");
      }
    }
      
    async function buyChips(amount: number) {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        console.log(contract)
        const transaction = await contract.buy({value: ethers.utils.parseEther("0.1")});
        await transaction.wait();
        await getBalance();
      }
    
    }

    async function sellChips(amount: number) {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        console.log(contract)
        const transaction = await contract.sell(10)
        await transaction.wait();
        await getBalance();
      } 
    }

    return (
      <Layout style={{ 
        background: "linear-gradient(#a5100f, #4a0a09)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        }}>
        <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          overflow: "auto",
          width: 1440,
          minHeight: 900,
          borderRadius: 10,
          backgroundRepeat: "no-repeat",
          border: "10px ridge #3003036e",
          backgroundImage: "url(" + process.env.PUBLIC_URL + "/4dJZSy.jpeg" + ")" 
        }}
      >
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding: 20
        }}>
        <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>{`Available Chips: ${0} 🌕`}  </Title>
        <div style={{display: "flex", alignItems: "center"}}>
          <FancyButton customStyle={{fontSize: "1rem", fontWeight: 600}} text={'buy: '} onClick={() => console.log("hola")}/>
          <InputNumber style={{backgroundColor: "black", padding: 10, color: "white", fontSize: 20}}></InputNumber>
          <div>
          <FancyButton customStyle={{fontSize: "1rem", fontWeight: 600}} text={'sell: '} onClick={() => console.log("hola")}/>
          <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}}></InputNumber>
          </div>
          </div>

        </div>

        {
            gameState == "menu" &&
         <div  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%"
        }}>
         <Title style={{fontWeight: 900, fontSize: 60, color: "white"}}>Crypto Casino Online </Title>
        <FancyButton customStyle={{width: 400}} text={`Play Dices 🎲`} onClick={() => setGameState("dices")}/>
         <FancyButton customStyle={{width: 400}} text={`Play Slots 🎰`} onClick={() => console.log("hola")}/>
         <FancyButton customStyle={{width: 400}} text={`Play Roulette 🎡`} onClick={() => console.log("hola")}/>
         </div>
          }

          {
            gameState == 'dices' && 
            <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{backgroundColor: "#d7d7d7", width: 200, height: 200, border: "10px ridge #c13f3f", display: "flex", justifyContent: "center", alignItems: "center"}}>
              	<Dice rollingTime={10000} size={100} faceBg={"#d7d7d7"} faces={['Dice-1-b.svg.png','/Dice-2-b.svg.png','/Dice-3-b.svg.png','/Dice-4-b.svg.png','/Dice-5-b.svg.png','/Dice-6-b.svg.png' ]}
				      />
            </div>
            <div style={{marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Title style={{fontWeight: 800, margin: 10, fontSize: "1.5rem", color: "white"}}>{`Current Bet Value: ${0} chips`}  </Title>
            <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>{`2 Players remaining to join...`}  </Title>
            <FancyButton customStyle={{width: 300}} text="Join Game" onClick={() =>  null}/>
            <FancyButton customStyle={{width: 300}} text="Back to Menu" onClick={() =>  setGameState("menu")}/>
            </div>
                </div>
          } 
      </div>
      </Layout>
    );
}

export default App;
