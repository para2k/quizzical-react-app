import {nanoid} from "nanoid"
import { useState, useEffect, Fragment } from "react";

export default function QA_Block({ question, incorrectAnswers, correctAnswer, questionIndex, onAnswerSelect, submitted, selectedAnswer }) {

    const[shuffledAnswers, setShuffledAnswers] = useState([])

    const shuffleArray = (array) => {
        const copyArray = [...array]
        let currentIndex = copyArray.length, randomIndex;
        
        // While there remain elements to shuffle
        while (currentIndex !== 0) {
            // Pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // And swap it with the current element
            [copyArray[currentIndex], copyArray[randomIndex]] = [
                copyArray[randomIndex], copyArray[currentIndex]];
            }
            
            return copyArray;
        };
        
        useEffect(() => {
            const answers = shuffleArray([...incorrectAnswers, correctAnswer])
            setShuffledAnswers(answers)
        }, [incorrectAnswers, correctAnswer])

    return (
        <fieldset className="qa-block">
            <h2>{question}</h2>
            {shuffledAnswers.map((answer) => {

                const id = nanoid()
                const isCorrect = answer === correctAnswer
                const isSelected = selectedAnswer === answer
                let labelClass = '' 
                if(submitted) {
                    if(isCorrect) {
                        labelClass = 'correct'
                    } else if(isSelected) {
                        labelClass = 'incorrect'
                    }
                    else {
                        labelClass = 'opacity50'
                    }
                } 
                return (
                    <Fragment key={id}>
                        <input
                            type="radio"
                            id={id}
                            name={`question-${questionIndex}`}
                            value={answer}
                            checked={isSelected && !submitted}
                            onChange={() => { onAnswerSelect(answer, questionIndex) }}
                        />
                        <label className={`btn-option ${labelClass}`} htmlFor={id}>{answer}</label>
                    </Fragment>

                )
            }
            )}
        </fieldset>
    )
}