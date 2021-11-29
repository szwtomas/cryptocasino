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
  Row,
  Typography,
} from 'antd'
import Dice from 'react-dice-roll'

import { FancyButton } from './FancyButton'
import CryptoCraps from './artifacts/contracts/CryptoCraps.sol/CryptoCraps.json'

const crapsContractAddress = '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6'

const { Title } = Typography

export function Dices(props: {
  updateBalance: () => void
  onGoBack: () => void
}) {
  const [currentPlayersRemaining, setCurrentPlayersRemaining] = useState<
    number
  >(6)
  const [currentBetValue, setCurrentBetValue] = useState<number>(0)
  const [choice, _setChoice] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [bet, _setBet] = useState<number>(0)
  const [playingDice, _setPlayingDice] = useState<boolean>(false)
  const [winningDice, _setWinningDice] = useState<1 | 2 | 3 | 4 | 5 | 6 | undefined>(undefined)

  const betRef = useRef(bet)
  const choiceRef = useRef(choice)
  const playingDiceRef = useRef(playingDice)
  const winningDiceRef = useRef(winningDice)

  const setChoice = (choice: 1 | 2 | 3 | 4 | 5 | 6) => {
    choiceRef.current = choice
    _setChoice(choice)
  }
  const setBet = (bet: number) => {
    betRef.current = bet
    _setBet(bet)
  }
  const setPlayingDice = (playing: boolean) => {
    playingDiceRef.current = playing
    _setPlayingDice(playing)
  }

  const setWinningDice = (choice: 1 | 2 | 3 | 4 | 5 | 6) => {
    winningDiceRef.current = choice
    _setWinningDice(choice)
  }

  useEffect(() => {
    getDiceInformation()
  }, [])

  useEffect(() => {

    console.log("dado ganador dice", winningDice);
    winningDice !== undefined && window.dispatchEvent(
      new KeyboardEvent('keypress', {
        key: 'd',
      }),
    )
  }, [winningDice])

  useEffect(() => {
    
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        crapsContractAddress,
        CryptoCraps.abi,
        signer,
      )

      contract.on('DiceRolled', async (winnerAddress, diceNumber) => {
        if (playingDiceRef.current.valueOf()) {
          setWinningDice(diceNumber)
          setTimeout(async () => {
            if (winnerAddress == (await signer.getAddress())) {
              Modal.success({ title: `Congrats! You won` })
              setPlayingDice(await contract.playerIsPlaying())
            } else {
              Modal.error({ title: "You didn't choose the right one :(" })
              setPlayingDice(await contract.playerIsPlaying())
            }
          }, 7000)
        } else {
          winningDice !== undefined && getDiceInformation()
        }
      })

      contract.on('PlayerAdded', async (currentPlayers) => {
        if(playingDiceRef.current){
          setCurrentPlayersRemaining(6 - (await contract.currentPlayersCount()))
          setCurrentBetValue(await contract.currentBetValue())
          setBet(await contract.currentBetValue())
          props.updateBalance();
        }
      })

      return () => {
        contract.removeAllListeners()
      }
    }
  }, [playingDice])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getDiceInformation() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        crapsContractAddress,
        CryptoCraps.abi,
        signer,
      )
      console.log("obteniendo dice info");
      try {
        setCurrentPlayersRemaining(6 - (await contract.currentPlayersCount()))
        setCurrentBetValue(await contract.currentBetValue())
        setPlayingDice(await contract.playerIsPlaying())
        setBet(await contract.currentBetValue())
      } catch (err) {
        console.error('Error: ', err)
      }
    } else {
      alert(
        'this is a dapp, so please install metamask chrome extensions to continue',
      )
    }
  }

  async function betSingleDice(diceNumber: number, bet: number) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        crapsContractAddress,
        CryptoCraps.abi,
        signer,
      )
      const transaction = await contract.betNumberSingleDice(diceNumber, bet)
      await transaction.wait()
      setPlayingDice(true)
    }
  }

  return (
    <div
      style={{
        marginTop: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#d7d7d7',
          width: 200,
          height: 200,
          border: '10px ridge #c13f3f',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Dice
          rollingTime={6000}
          cheatValue={winningDiceRef.current}
          triggers={['d']}
          defaultValue={1}
          size={100}
          faceBg={'#d7d7d7'}
          faces={[
            'Dice-1-b.svg.png',
            '/Dice-2-b.svg.png',
            '/Dice-3-b.svg.png',
            '/Dice-4-b.svg.png',
            '/Dice-5-b.svg.png',
            '/Dice-6-b.svg.png',
          ]}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Title
          style={{
            fontWeight: 800,
            margin: 10,
            fontSize: '1.5rem',
            color: 'white',
          }}
        >
          {`Current Bet Value: ${currentBetValue} chips`}{' '}
        </Title>
        <Title
          style={{
            fontWeight: 800,
            margin: 20,
            fontSize: '1.5rem',
            color: 'white',
          }}
        >
          {`${currentPlayersRemaining} Players remaining to join...`}{' '}
        </Title>
        {!playingDice && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
           
            <Title
              style={{
                fontWeight: 800,
                margin: 20,
                fontSize: '1.5rem',
                color: 'white',
              }}
            >
              Choose a number between 1 and 6{' '}
            </Title>
            <InputNumber
              style={{
                backgroundColor: 'black',
                padding: 10,
                color: 'white',
                fontSize: 20,
              }}
              defaultValue={1}
              value={choice}
              onChange={(newchoice) => setChoice(newchoice)}
            ></InputNumber>
          </div>
        )}
        {currentPlayersRemaining === 6 && !playingDice && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Title
              style={{
                fontWeight: 800,
                margin: 20,
                fontSize: '1.5rem',
                color: 'white',
              }}
            >
              Choose how much to bet{' '}
            </Title>
            <InputNumber
              style={{
                backgroundColor: 'black',
                padding: 10,
                color: 'white',
                fontSize: 20,
              }}
              defaultValue={0}
              value={bet}
              onChange={(newbet) => setBet(newbet as any)}
            ></InputNumber>
          </div>
        )}
      <div style={{marginTop: 20}}>
      <FancyButton
              customStyle={{ width: 300 }}
              text="Join Game"
              onClick={() => betSingleDice(choice, bet)}
            />
        <FancyButton
          customStyle={{ width: 300 }}
          text="Back to Menu"
          onClick={props.onGoBack}
          />
          </div>
      </div>
    </div>
  )
}
