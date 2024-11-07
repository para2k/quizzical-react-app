import { useState } from 'react';
import { decode } from 'html-entities';
import QA_Block from './components/QA_Block';
import QuizSetup from './components/QuizSetup';

function App() {

  const [questionsArr, setQuestionsArr] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [startedGame, setStartedGame] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchQuestions(categoryId, difficulty, numQuestions) {

    const cat = categoryId ? `&category=${categoryId}` : ""
    const diff = difficulty ? `&difficulty=${difficulty}` : ""

    setIsLoading(true)
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}${cat}${diff}&type=multiple`);
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setQuestionsArr(data.results.map(result => {
          return {
            question: decode(result.question),
            answerArray: result.incorrect_answers.map(answer => decode(answer)),
            correctAnswer: decode(result.correct_answer)
          }
        }))
        setStartedGame(true)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setIsLoading(false)
    }
  }

  function checkAnswers(event) {
    event.preventDefault();

    if (submitted) {
      setStartedGame(false)
      setScore(0)
      setSelectedAnswers([])
      setSubmitted(false)
      return
    }

    const allAnswered = questionsArr.every((question, index) => selectedAnswers[index] !== undefined);

    if (!allAnswered) {
      alert("Please answer all questions!")
      return
    }

    let correctAnswers = 0
    questionsArr.forEach((question, index) => {
      if (question.correctAnswer === selectedAnswers[index]) {
        correctAnswers++
      }
    })

    setScore(correctAnswers)
    setSubmitted(true)
  }

  const handleAnswerSelect = (selectedAnswer, questionIndex) => {
    setSelectedAnswers(prev => (
      {
        ...prev,
        [questionIndex]: selectedAnswer
      }
    ))
  }

  return (
    <>
      {
        !startedGame ?
          <QuizSetup 
          isLoading = {isLoading}
          startGame = {fetchQuestions}/>
          :
          <section className="form-container">
            <form id="trivia-form" onSubmit={checkAnswers}>
              {questionsArr.map((question, index) =>
                <QA_Block
                  key={question.question}
                  questionIndex={index}
                  question={question.question}
                  incorrectAnswers={question.answerArray}
                  correctAnswer={question.correctAnswer}
                  selectedAnswer={selectedAnswers[index]}
                  submitted={submitted}
                  onAnswerSelect={handleAnswerSelect}
                />)}
              <div className="score">
                {submitted && <h3>You scored {score}/{questionsArr.length} correct answers</h3>}
                <button type="submit" className="btn-quiz btn-quiz--small">{submitted ? "Play again" : "Check answers"}</button>
              </div>
            </form>

          </section>
      }
    </>

  )
}

export default App
