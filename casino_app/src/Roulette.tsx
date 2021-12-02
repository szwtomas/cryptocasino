import React, { useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  Button,
  Image,
  InputNumber,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Spin,
  Typography,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

import { FancyButton } from './FancyButton'
import CryptoRoulette from './artifacts/contracts/CryptoRoulette.sol/CryptoRoulette.json'
import { RouletteWheel } from './RouletteWheel'

const rouletteContractAddress = '0x42aE74D436b45be932825e3bB293003d419D1B4f'

const { Title } = Typography

type NumberBet = { number: number; bet: number }
type ColorBet = { color: number; bet: number }

export function Roulette(props: {
  updateBalance: () => void
  onGoBack: () => void
}) {
  const [currentPlayersRemaining, _setCurrentPlayersRemaining] = useState<
    number
  >(2)
  const [waitingForTx, setWitingForTx] = useState<boolean>(false)

  const [numberBets, _setNumberBets] = useState<NumberBet[]>([])
  const [colorBets, _setColorBets] = useState<ColorBet[]>([])
  const [currentIndividualNumberBet, setCurrentIndividualNumberBet] = useState<
    number
  >(1)

  const [playingRoulette, _setplayingRoulette] = useState<boolean>(false)
  const [winningRouletteNumber, _setWinningRouletteNumber] = useState<
    number | undefined
  >()

  const [rouletteShouldSpin, _setRouletteShouldSpin] = useState<boolean>(false);

  const numberBetsRef = useRef(numberBets)
  const colorBetsRef = useRef(colorBets)
  const playingRouletteRef = useRef(playingRoulette)
  const winningRouletteNumberRef = useRef(winningRouletteNumber)
  const rouletteShouldSpinRef = useRef(rouletteShouldSpin)
  const currentPlayersRemainingRef = useRef(currentPlayersRemaining)


  const setNumberBets = (choice: NumberBet[]) => {
    numberBetsRef.current = choice
    _setNumberBets(choice)
  }

  const setCurrentPlayersRemaining = (choice: number) => {
    currentPlayersRemainingRef.current = choice;
    _setCurrentPlayersRemaining(choice)
  }

  const setRouletteShouldSpin = (val: boolean) => {
    rouletteShouldSpinRef.current = val
    _setRouletteShouldSpin(val)
  }

  const setColorBets = (choice: ColorBet[]) => {
    colorBetsRef.current = choice
    _setColorBets(choice)
  }
  const setplayingRoulette = (playing: boolean) => {
    playingRouletteRef.current = playing
    _setplayingRoulette(playing)
  }

  const setWinningRouletteNumber = (choice: 1 | 2 | 3 | 4 | 5 | 6) => {
    winningRouletteNumberRef.current = choice
    _setWinningRouletteNumber(choice)
  }

  useEffect(() => {
    getRouletteInformation()
  }, [])

  useEffect(() => {
    
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        rouletteContractAddress,
        CryptoRoulette.abi,
        signer,
        )
        console.log("actualizó is playing roulette")
        if(playingRouletteRef.current){
          contract.on('RouletteRolled', async (rouletteNumber, playerAddress, chipsWon) => {
            console.log("Roulette rolled");
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const b = await signer.getAddress()
            if (playerAddress === b && !rouletteShouldSpinRef.current) {
              console.log("roulette ", rouletteNumber, b, playerAddress);
              setWinningRouletteNumber(rouletteNumber)
              setRouletteShouldSpin(true);
              setTimeout(async () => {
                if (Number(chipsWon) > 0) {
                  Modal.success({ title: `Congrats! You got ${chipsWon} 🌕` , onOk: resetGame, cancelButtonProps: { style: {visibility: "hidden"}}})
                } else {
                  Modal.error({ title: "So sad... You didn't win anything", onOk: resetGame, cancelButtonProps: { style: {visibility: "hidden"}}})
                }
              }, 12000)
            } 
          })
          
        }
          contract.on('PlayerAdded', async (currentPlayers) => {
            console.log("setting curr player at player added")
              setCurrentPlayersRemaining(2 - await contract.playersCount());
            
          })
          
          return () => {
            contract.removeAllListeners()
          }
        }
  }, [playingRouletteRef.current])

  useEffect(() => {
    console.log("curr players remaining", currentPlayersRemaining);
  }, [currentPlayersRemaining])

  function resetGame(){
    console.log("resetting game");
    setCurrentPlayersRemaining(2);
    setplayingRoulette(false);
    setWitingForTx(false);
    setNumberBets([]);
    setColorBets([]);
    setCurrentIndividualNumberBet(1);
    setWinningRouletteNumber(1);
    setRouletteShouldSpin(false);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getRouletteInformation() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        rouletteContractAddress,
        CryptoRoulette.abi,
        signer,
      )
      console.log('obteniendo roulette info')
      try {
        const isPLaying = await contract.playerIsPlaying();
        setplayingRoulette(isPLaying)
        console.log("setting curr player at get reoulettte info")
        setCurrentPlayersRemaining(2 - await contract.playersCount());
        if(isPLaying){
          const {numbBet, colBet} = await contract.getPlayerData();
          setNumberBets(numbBet);
          setColorBets(colBet);
        }
      } catch (e: any) {
        Modal.error({
          title: 'Something went wrong. Open console for more information',
        })
        console.log(e.reason, e.transaction?.hash)
      }
    } else {
      alert(
        'this is a dapp, so please install metamask chrome extensions to continue',
      )
    }
  }

  async function finishBet() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        rouletteContractAddress,
        CryptoRoulette.abi,
        signer,
      )
      console.log(numberBets, colorBets)
      const transaction = await contract.addPlayerToRoulette(
        numberBets,
        colorBets,
        {gasLimit: 1000000}
      )
      try {
        setplayingRoulette(true)
        setWitingForTx(true);
        await transaction.wait()
        props.updateBalance();
        setWitingForTx(false);
        console.log("setting curr player at finish bet")
        setCurrentPlayersRemaining(2 - await contract.playersCount());
      } catch (e: any) {
        Modal.error({
          title: 'Something went wrong. Open console for more information',
        })
        console.log(e.reason, 'tx:', e.transaction)
        
        setWitingForTx(false);
      }
    }
  }

  async function addNumberBet(number: number, bet: number) {
    setNumberBets([...numberBets, { number, bet }])
  }

  return (
    <div
      style={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <RouletteWheel winningNumber={winningRouletteNumber} spin={rouletteShouldSpin} onStopSpinning={() => {setRouletteShouldSpin(false)}}/>
      {waitingForTx && <Title
        style={{
          fontWeight: 800,
          margin: 0,
          fontSize: '1.5rem',
          color: 'white',
        }}
      >
        
        {'Waiting For transaction to settle... '}<Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />}></Spin>
      </Title>}
     { !waitingForTx && !rouletteShouldSpin && <Title
        style={{
          fontWeight: 800,
          margin: 0,
          fontSize: '1.5rem',
          color: 'white',
        }}
      >
        
        {`${currentPlayersRemaining} Players remaining to join...`}{' '}
      </Title>}
      <div
        style={{
          display: 'flex',
          width: 1000,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Array.from(Array(37).keys()).map((n) => (
          <Popconfirm
            disabled={playingRoulette}
            onConfirm={() => addNumberBet(n, currentIndividualNumberBet)}
            color={'black'}
            icon={null}
            overlayInnerStyle={{ borderRadius: 20 }}
            okButtonProps={{ style: { backgroundColor: 'red' } }}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputNumber
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'black',
                    padding: 0,
                    marginLeft: -8,
                    color: 'white',
                    fontSize: 20,
                  }}
                  defaultValue={currentIndividualNumberBet}
                  onChange={(newBuyAmount) =>
                    setCurrentIndividualNumberBet(newBuyAmount)
                  }
                ></InputNumber>
                <span style={{ fontSize: 25, marginLeft: 3 }}>🌕</span>
              </div>
            }
            key={n}
          >
            <FancyButton
              key={n}
              customStyle={{
                width: 70,
                lineHeight: 0.5,
                backgroundColor: numberBets.some(
                  (numb) => numb.number === n,
                )
                  ? 'red'
                  : playingRoulette
                  ? 'gray'
                  : undefined,
              }}
              text={(n).toString()}
              onClick={() => null}
            />
          </Popconfirm>
        ))}
      </div>
      <div>
        <FancyButton
          customStyle={{ width: 300 }}
          text="Finish Bet"
          onClick={() => finishBet()}
        />
        <FancyButton
          customStyle={{ width: 300 }}
          text="Back to Menu"
          onClick={props.onGoBack}
        />
      </div>
    </div>
  )
}
