import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "./components/Confetti"

export default function App() {

    const [isStarted, setIsStarted] = React.useState(false)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)

    const [startTime, setStartTime] = React.useState(null)
    const [timeElapsed, setTimeElapsed] = React.useState(0)
    const [timerActive, setTimerActive] = React.useState(false)

    // const [bestTime, setBestTime] = React.useState(null)

    console.log(isStarted)

  

    function formatTime() {
        if (timerActive) {
            const totalSeconds = Math.floor(timeElapsed / 1000).toString().padStart(2, '0')
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
            const seconds = totalSeconds % 60
                return `${minutes}:${seconds}`
        } else {
            return 0
        }
    }

    React.useEffect(() => {
        let interval;
        if (timerActive) {
            interval = setInterval(() => {
                setTimeElapsed(Date.now() - startTime)
            }, 1000)
        }
    
        return () => clearInterval(interval)
    }, [timerActive, startTime])

    React.useEffect(() => {
        if (tenzies) {
            setTimerActive(false)
            setIsStarted(false)
        }
    }, [tenzies])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        if (isStarted) {
            return {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }
        } else {
            return {
                value: '?',
                isHeld: false,
                id: nanoid()
            }
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function handleClick() {
        if (!isStarted) {
            startNewGame()
        } else {
            rollDice()
        }
    }

    function rollDice() {
            setRolls((prevRolls) => prevRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))     
    }

    function startNewGame() {
        setIsStarted(true)
        setTenzies(false)
        setDice(allNewDice())
        setStartTime(Date.now())
        setRolls(0)
        setTimerActive(true)
        setTimeElapsed(0)
}

    function reset() {
        setTimerActive(false)
        setRolls(0)
        setIsStarted(false)
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

   
    
    return (
        <main>
            {tenzies && <Confetti />}
            {/* <h5 className="reset" onClick={reset}>RESET</h5> */}
            <h1 className="title">Tiro a Muzzo</h1>
            <p className="instructions">Arrulla finu a quannu tutti li dadi sunnu uguali.<br/>
                Clicca ncapu a ogni matrici pi ghiacciarilu ô so valuri attuali.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={handleClick}>{!isStarted || tenzies ? 'Nova Pattita' : 'Arrulla'}</button>
            <div className="game-data">
                <p><span className="bold">Tempu totale: </span>{timerActive ? formatTime() : '00:00'}</p>
                <p><span className="bold">Tiri: <br/></span>{rolls}</p>
                <p><span className="bold">Megghiu tempu: </span>00:00</p>
            </div>
        </main>
    )
}