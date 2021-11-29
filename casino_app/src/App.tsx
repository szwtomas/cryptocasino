import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
import {ethers} from "ethers";
import { Button, Image, InputNumber, Layout, Modal, Row, Typography } from 'antd';
import Dice from 'react-dice-roll';

import {FancyButton} from "./FancyButton";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import CryptoCasino from "./artifacts/contracts/CryptoCasino.sol/CryptoCasino.json";
import CryptoCraps from "./artifacts/contracts/CryptoCraps.sol/CryptoCraps.json";
import { RouletteWheel } from './RouletteWheel';
import { Dices } from './Dices';
import { Roulette } from './Roulette';

const casinoContractAddress = "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853";

const { Header, Footer, Content, Sider } = Layout;
const {Title} = Typography;

function App() {


  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [currentChipAmount, setCurrentChipAmount] = useState<number>(0);
  const [gameState, setGameState] = useState<'menu' | 'dices' | 'slots' | 'roulette'>("menu");

  useEffect(() => {
   getBalance();
  }, []);


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

    async function getBalance(){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        try {
          const currentBalance = await contract.balance();
          setCurrentChipAmount(Number(currentBalance._hex));
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
        const cantidad = amount / 100;
        const transaction = await contract.buy({value: ethers.utils.parseEther(`${cantidad}`)});
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
        const transaction = await contract.sell(amount)
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
          paddingTop: 5,
          paddingRight: 10
        }}>
        <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>{`Available Chips: ${currentChipAmount} 🌕`}  </Title>
        <div style={{display: "flex", alignItems: "center"}}>
          <FancyButton customStyle={{fontSize: "1rem", fontWeight: 600}} text={'buy: '} onClick={() => buyChips(buyAmount)}/>
          <InputNumber style={{backgroundColor: "black", padding: 10, color: "white", fontSize: 20}} defaultValue={0} value={buyAmount} onChange={(newBuyAmount) => setBuyAmount(newBuyAmount)}></InputNumber>
          <div>
          <FancyButton customStyle={{fontSize: "1rem", fontWeight: 600}} text={'sell: '} onClick={() => sellChips(sellAmount)}/>
          <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}} defaultValue={0} value={sellAmount} onChange={(newSellAmount) => setSellAmount(newSellAmount)}></InputNumber>
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
         <FancyButton customStyle={{width: 400}} text={`Play Slots 🎰`} onClick={() => setGameState("slots")}/>
         <FancyButton customStyle={{width: 400}} text={`Play Roulette 🎡`} onClick={() => setGameState("roulette")}/>
         </div>
          }

          {gameState == 'dices' && <Dices updateBalance={getBalance} onGoBack={() => setGameState('menu')}/>} 

          {
            gameState == 'roulette' && <Roulette updateBalance={getBalance} onGoBack={() => setGameState('menu')}/>
          } 
      </div>
      </Layout>
    );
}

export default App;
