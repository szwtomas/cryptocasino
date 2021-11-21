import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
import {ethers} from "ethers";
import { Button, Image, InputNumber, Layout, Row, Typography } from 'antd';
import Dice from 'react-dice-roll';

import {FancyButton} from "./FancyButton";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import CryptoCasino from "./artifacts/contracts/CryptoCraps.sol/CryptoCraps.json";



const greeterContractAdress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const casinoContractAddress = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e";

const { Header, Footer, Content, Sider } = Layout;
const {Title} = Typography;

function App() {
  const [greeting, setGreetingValue] = useState<string>('');
  const [balance, setBalanceValue] = useState<number>(0);
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [currentChipAmount, setCurrentChipAmount] = useState<number>(0);
  const [gameState, setGameState] = useState<'menu' | 'dices'>("menu");
  const [currentPlayersRemaining, setCurrentPlayersRemaining] = useState<number>(6);
  const [currentBetValue, setCurrentBetValue] = useState<number>(0);
  const [choice, setChoice] = useState<number>(0);
  const [bet, setBet] = useState<number>(0);
  const [playingDice, setPlayingDice] = useState<boolean>(false);


  useEffect(() => {
    async function realizar(){
      await getBalance();
      await getDiceInformation();
      await waitForDiceRolled();
    };
    realizar();
  }, []);

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

    async function waitForDiceRolled(){
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        contract.on("DiceRolled", (diceNumber) => {
          console.log(`winner: ${diceNumber}`);
        });
      }
    }

    async function getDiceInformation(){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        try {
          const currentPlayers = await contract.currentPlayersCount();
          setCurrentPlayersRemaining(6 - currentPlayers);
          const currentBet = await contract.currentBetValue();
          setCurrentBetValue(currentBet);
          if (currentPlayers > 0) {
            setBet(currentBet);
          }
          const isPlaying = await contract.playerPlayingDice();
          setPlayingDice(isPlaying);
        } catch (err) {
          console.log("Error: ", err)
        }
      } else {
        alert("this is a dapp, so please install metamask chrome extensions to continue");
      }
    }

    async function getBalance(){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer)
        try {
          const currentBalance = await contract.balance();
          setCurrentChipAmount(Number(currentBalance._hex));
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
        const cantidad = amount / 100;
        const transaction = await contract.buy({value: ethers.utils.parseEther(`${cantidad}`)});
        await transaction.wait();

        await getBalance();
      }
    
    }


    async function betSingleDice(diceNumber: number, bet: number) {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(casinoContractAddress, CryptoCasino.abi, signer);
        const transaction = await contract.betNumberSingleDice(diceNumber, bet);
        await transaction.wait();
        await getDiceInformation();
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
          padding: 20
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
         <FancyButton customStyle={{width: 400}} text={`Play Slots 🎰`} onClick={() => console.log("hola")}/>
         <FancyButton customStyle={{width: 400}} text={`Play Roulette 🎡`} onClick={() => console.log("hola")}/>
         </div>
          }

          {
            gameState == 'dices' && 
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{backgroundColor: "#d7d7d7", width: 200, height: 200, border: "10px ridge #c13f3f", display: "flex", justifyContent: "center", alignItems: "center"}}>
              	<Dice rollingTime={10000} size={100} faceBg={"#d7d7d7"} faces={['Dice-1-b.svg.png','/Dice-2-b.svg.png','/Dice-3-b.svg.png','/Dice-4-b.svg.png','/Dice-5-b.svg.png','/Dice-6-b.svg.png' ]}
				      />
            </div>
            <div style={{marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Title style={{fontWeight: 800, margin: 10, fontSize: "1.5rem", color: "white"}}>{`Current Bet Value: ${currentBetValue} chips`}  </Title>
            <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>{`${currentPlayersRemaining} Players remaining to join...`}  </Title>
            {
              !playingDice && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <FancyButton customStyle={{width: 300}} text="Join Game" onClick={() =>  betSingleDice (choice, bet)}/>
              <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>Choose a number between 1 and 6 </Title>
              <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}} defaultValue={0} value={choice} onChange={(newchoice) => setChoice(newchoice)}></InputNumber>
              </div>
            }
            {
              currentPlayersRemaining === 6 &&
              <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>Choose how much to bet </Title>
                <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}} defaultValue={0} value={bet} onChange={(newbet) => setBet(newbet)}></InputNumber>
              </div>
            }
            
            <FancyButton customStyle={{width: 300}} text="Back to Menu" onClick={() =>  setGameState("menu")}/>
            </div>
                </div>
          } 
      </div>
      </Layout>
    );
}

export default App;
