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

const casinoContractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
const crapsContractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";

const { Header, Footer, Content, Sider } = Layout;
const {Title} = Typography;

function App() {

  const [gameState, setGameState] = useState<'menu' | 'dices' | 'slots' | 'roulette'>("menu");
  const [currentPlayersRemaining, setCurrentPlayersRemaining] = useState<number>(6);
  const [currentBetValue, setCurrentBetValue] = useState<number>(0);
  const [choice, _setChoice] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [bet, _setBet] = useState<number>(0);
  const [playingDice, _setPlayingDice] = useState<boolean>(false);
  const [winningDice, _setWinningDice] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const betRef = useRef(bet);
  const choiceRef = useRef(choice);
  const playingDiceRef = useRef(playingDice);
  const winningDiceRef = useRef(winningDice);


  const setChoice = (choice: 1 | 2 | 3 | 4 | 5 | 6) => {
    choiceRef.current = choice;
    _setChoice(choice);
  };
  const setBet = (bet: number) => {
    betRef.current = bet;
    _setBet(bet);
  };
  const setPlayingDice = (playing: boolean) => {
    playingDiceRef.current = playing;
    _setPlayingDice(playing);
  };

  const setWinningDice = (choice: 1 | 2 | 3 | 4 | 5 | 6) => {
    winningDiceRef.current = choice;
    _setWinningDice(choice);
  };

  useEffect(() => {
    async function realizar(){
      await getBalance();
      await getDiceInformation();
    };
    realizar();
  }, []);

  useEffect(() => {
    console.log(winningDiceRef.current);
    window.dispatchEvent(new KeyboardEvent('keypress', {
      'key': 'd'
    }));
  }, [winningDice])

 
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(crapsContractAddress, CryptoCraps.abi, signer)

      contract.on("DiceRolled", async (winnerAddress, diceNumber) => {
        console.log("dice rolled!");
        if(playingDiceRef.current) {
         setWinningDice(diceNumber);
         setTimeout(async () => {
           if(winnerAddress == await signer.getAddress()){
             Modal.success({title: `Congrats! You won`});
           } else {
             Modal.error({title: "You didn't choose the right one :("});
           }
          setPlayingDice(await contract.playerPlayingDice());

         }, 3500);
        }
      });

      contract.on("PlayerAdded", async (currentPlayers) => {
        console.log("nuevo player");
        await getDiceInformation();
      });

      return () => {
        contract.removeAllListeners('DiceRolled');
        contract.removeAllListeners('PlayerAdded');
      }
    }
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  function resetDiceGame(){
    setCurrentPlayersRemaining(6);
    setCurrentBetValue(0);
    setChoice(1);
    setBet(0);
    setPlayingDice(false);
  }

    async function getDiceInformation(){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(crapsContractAddress, CryptoCraps.abi, signer)
        try {
          const currentPlayers = await contract.currentPlayersCount();
          setCurrentPlayersRemaining(6 - currentPlayers);
          const currentBet = await contract.currentBetValue();
          setCurrentBetValue(currentBet);
          if (currentPlayers > 0) {
            setBet(currentBet);
          }
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
        const contract = new ethers.Contract(crapsContractAddress, CryptoCraps.abi, signer);
        const transaction = await contract.betNumberSingleDice(diceNumber, bet);
        await transaction.wait();
        setPlayingDice(true);
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
         <FancyButton customStyle={{width: 400}} text={`Play Slots 🎰`} onClick={() => setGameState("slots")}/>
         <FancyButton customStyle={{width: 400}} text={`Play Roulette 🎡`} onClick={() => setGameState("roulette")}/>
         </div>
          }

          {
            gameState == 'dices' && 
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{backgroundColor: "#d7d7d7", width: 200, height: 200, border: "10px ridge #c13f3f", display: "flex", justifyContent: "center", alignItems: "center"}}>
              	<Dice rollingTime={3000} cheatValue={winningDiceRef.current} triggers={["d"]} size={100} faceBg={"#d7d7d7"} faces={['Dice-1-b.svg.png','/Dice-2-b.svg.png','/Dice-3-b.svg.png','/Dice-4-b.svg.png','/Dice-5-b.svg.png','/Dice-6-b.svg.png' ]}
				      />
            </div>
            <div style={{marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Title style={{fontWeight: 800, margin: 10, fontSize: "1.5rem", color: "white"}}>{`Current Bet Value: ${currentBetValue} chips`}  </Title>
            <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>{`${currentPlayersRemaining} Players remaining to join...`}  </Title>
            {
              !playingDice && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <FancyButton customStyle={{width: 300}} text="Join Game" onClick={() =>  betSingleDice (choice, bet)}/>
              <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>Choose a number between 1 and 6 </Title>
              <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}} defaultValue={1} value={choice} onChange={(newchoice) => setChoice(newchoice)}></InputNumber>
              </div>
            }
            {
              currentPlayersRemaining === 6 && !playingDice &&
              <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Title style={{fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white"}}>Choose how much to bet </Title>
                <InputNumber style={{backgroundColor: "black", padding: 10, color: "white",  fontSize: 20}} defaultValue={0} value={bet} onChange={(newbet) => setBet(newbet as any)}></InputNumber>
              </div>
            }
            
            <FancyButton customStyle={{width: 300}} text="Back to Menu" onClick={() =>  setGameState("menu")}/>
            </div>
                </div>
          } 

          {
            gameState == 'roulette' && 
            <div>
           <RouletteWheel/>
           
              <FancyButton customStyle={{width: 300}} text="Join Game" onClick={() =>  betSingleDice (choice, bet)}/>
            <FancyButton customStyle={{width: 300}} text="Back to Menu" onClick={() =>  setGameState("menu")}/>
            </div>
          } 
      </div>
      </Layout>
    );
}

export default App;
