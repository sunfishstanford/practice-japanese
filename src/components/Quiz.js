import React, { useState, useEffect, useCallback, useRef } from 'react';
import { allData } from '../data';
import './Quiz.css';

function Quiz({ settings }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const feedbackRef = useRef(null);

  const startNewSession = useCallback(() => {
    // Get previously incorrect questions from localStorage
    const savedIncorrect = localStorage.getItem('incorrectQuestions');
    const previouslyIncorrect = savedIncorrect ? JSON.parse(savedIncorrect) : [];

    // Generate questions with emphasis on previously incorrect ones
    const newQuestions = generateQuestions(
      settings.questionsPerSession,
      previouslyIncorrect
    );

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIncorrectQuestions([]);
    setSessionComplete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.questionsPerSession]);

  // Initialize quiz session
  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  // Scroll to feedback when it becomes visible
  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showFeedback]);

  const generateQuestions = (count, emphasizeItems) => {
    const questions = [];
    const usedIndices = new Set();

    // First, add 40% from emphasized items if available
    const emphasizeCount = Math.min(
      Math.floor(count * 0.4),
      emphasizeItems.length
    );

    for (let i = 0; i < emphasizeCount; i++) {
      const item = emphasizeItems[i];
      const question = createQuestion(item);
      questions.push(question);
    }

    // Fill the rest with random questions
    while (questions.length < count) {
      const randomIndex = Math.floor(Math.random() * allData.length);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const item = allData[randomIndex];
        const question = createQuestion(item);
        questions.push(question);
      }
    }

    // Shuffle the questions
    return shuffleArray(questions);
  };

  const createQuestion = (item) => {
    // Randomly choose Japanese->English or English->Japanese
    const isJapaneseToEnglish = Math.random() < 0.5;

    const question = {
      item: item,
      type: isJapaneseToEnglish ? 'jp-to-en' : 'en-to-jp',
      questionText: isJapaneseToEnglish ? item.japanese : item.english,
      correctAnswer: isJapaneseToEnglish ? item.english : item.japanese,
      romaji: item.romaji
    };

    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(item, isJapaneseToEnglish);

    // Combine and shuffle
    const answers = shuffleArray([
      question.correctAnswer,
      ...wrongAnswers
    ]);

    question.answers = answers;

    return question;
  };

  const generateWrongAnswers = (correctItem, isJapaneseToEnglish) => {
    const wrongAnswers = [];
    const usedIndices = new Set();
    const targetField = isJapaneseToEnglish ? 'english' : 'japanese';

    while (wrongAnswers.length < 3) {
      const randomIndex = Math.floor(Math.random() * allData.length);
      const randomItem = allData[randomIndex];

      if (
        randomItem[targetField] !== correctItem[targetField] &&
        !usedIndices.has(randomIndex)
      ) {
        usedIndices.add(randomIndex);
        wrongAnswers.push(randomItem[targetField]);
      }
    }

    return wrongAnswers;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (answer) => {
    if (showFeedback) return; // Prevent changing answer after submission

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    } else {
      // Track incorrect question
      setIncorrectQuestions([...incorrectQuestions, currentQuestion.item]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Session complete
      finishSession();
    }
  };

  const finishSession = () => {
    setSessionComplete(true);

    // Save score to history
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    const sessionData = {
      date: new Date().toISOString(),
      score: score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0),
      total: questions.length,
      percentage: Math.round(
        ((score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0)) /
          questions.length) *
          100
      )
    };
    history.push(sessionData);
    localStorage.setItem('quizHistory', JSON.stringify(history));

    // Update incorrect questions list
    const finalIncorrect = [...incorrectQuestions];
    if (selectedAnswer !== questions[currentQuestionIndex].correctAnswer) {
      finalIncorrect.push(questions[currentQuestionIndex].item);
    }
    localStorage.setItem('incorrectQuestions', JSON.stringify(finalIncorrect));
  };

  if (questions.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (sessionComplete) {
    const finalScore = score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="quiz-complete">
        <h2>Session Complete!</h2>
        <div className="score-display">
          <p className="score-text">
            Score: {finalScore} / {questions.length}
          </p>
          <p className="percentage-text">{percentage}%</p>
        </div>
        <button className="new-session-btn" onClick={startNewSession}>
          Start New Session
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="quiz-score">
        Score: {score} / {currentQuestionIndex + (showFeedback ? 1 : 0)}
      </div>

      <div className="question-card">
        {currentQuestion.item.type !== 'phrase' && (
          <div className="question-type-badge">
            {currentQuestion.item.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
          </div>
        )}
        <div className="question-text">{currentQuestion.questionText}</div>
        {settings.showRomaji && currentQuestion.type === 'jp-to-en' && (
          <div className="romaji-text">({currentQuestion.romaji})</div>
        )}
      </div>

      <div className="answers-container">
        {currentQuestion.answers.map((answer, index) => {
          let buttonClass = 'answer-btn';

          if (showFeedback) {
            if (answer === currentQuestion.correctAnswer) {
              buttonClass += ' correct';
            } else if (answer === selectedAnswer) {
              buttonClass += ' incorrect';
            }
          } else if (answer === selectedAnswer) {
            buttonClass += ' selected';
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerClick(answer)}
              disabled={showFeedback}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div ref={feedbackRef} className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <p className="feedback-text">
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </p>
          {!isCorrect && (
            <p className="correct-answer-text">
              Correct answer: {currentQuestion.correctAnswer}
            </p>
          )}
          <button className="next-btn" onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
