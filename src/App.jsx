import Die from "./components/Die.jsx"
import Confetti from "./components/Confetti.jsx"
import React, { useEffect } from "react"
import {nanoid} from "nanoid"

export default function App() {

    // - add dots on diece faces
    // - keep track of total rolls
    // - keep track of total time required to complete
    // - save best roll number to local storage

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)

    const countFromStorage = JSON.parse(localStorage.getItem("count"))
    const [bestScore, setBestScore] = React.useState(countFromStorage ? countFromStorage : "")






    // console.log(countFromStorage)


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const sameValue = dice.every(die => die.value === firstValue)
        if (allHeld && sameValue) {
            setTenzies(true)
        }
    }, [dice])


    function determineBestScore() {
        if (rollCount < bestScore) {
            setBestScore(oldBest => rollCount)
            
        } 
    }

    React.useEffect(() => {
        localStorage.setItem("count", JSON.stringify(bestScore))
    }, [bestScore])


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }


    function rollDice() {
    if (tenzies) {
        setDice(allNewDice())
        setRollCount(0)
        setTenzies(false)

    } else {
        setRollCount(oldCount => oldCount + 1)
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
    }
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
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
            {diceElements}
        </div>
        <button className="roll-dice" onClick={rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
        <div className="best-container">
            {/* <p className="tot-rollz">My best time: xxxx</p> */}
            <p className="tot-rollz">Total rolls: {rollCount}</p>
            {bestScore && <p className="tot-rollz">Best score: {bestScore}</p>}
        </div>
    </main>
    )
}