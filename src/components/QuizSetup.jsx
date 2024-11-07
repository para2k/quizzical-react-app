import { useState, useEffect } from "react"

export default function QuizSetup(props) {

    const [quizCategories, setQuizCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(0)
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [numQuestions, setNumQuestions] = useState(5)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("https://opentdb.com/api_category.php")
                const data = await res.json()
                setQuizCategories([
                    {
                        id: 0,
                        category: "Any category"
                    },
                    ...data.trivia_categories.map(category => ({
                        id: category.id,
                        category: category.name
                    }))])
            }
            catch (error) {
                console.error(error)
            }
        }

        fetchCategories()

    }, [])

    return (<section className="start-quiz-container">
        <h1>Quizzical</h1>
        <label htmlFor="quiz-categories">Category:</label>
        <select
            name="category"
            id="quiz-categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}>

            {quizCategories.map(category => (
                <option key={category.id} value={category.id}>
                    {category.category}
                </option>
            )
            )}
        </select>
        <label htmlFor="quiz-difficulty">Difficulty:</label>
        <select
            name="difficulty"
            id="quiz-difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
            <option value="">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>

        <label htmlFor="quiz-numQuestions">Number of questions:</label>
        <input
            type="number"
            name="quiz-questions"
            id="quiz-numQuestions"
            value={numQuestions}
            min="1"
            max="50"
            onChange={(e) => setNumQuestions(e.target.value)} />
        <button onClick={() => props.startGame(selectedCategory, selectedDifficulty, numQuestions)} className="btn-quiz">{props.isLoading ? "Loading ..." : "Start quiz"}</button>
    </section>)
}