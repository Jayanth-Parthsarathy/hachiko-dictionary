"use client";
import React, { useEffect, useState } from "react";
import QuizMenu from "@/components/QuizMenu";
import axiosInstance from "@/lib/axiosInstance";
import QuizResult from "@/components/QuizResult";
import QuizGame from "@/components/QuizGame";
import GameHeader from "@/components/GameHeader";
import { toast } from "react-toastify";
import QuizIntermediary from "@/components/QuizIntermediary";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState("menu");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleStartGame = () => {
    setGameState("playing");
    fetchNewQuestions();
  };

  const completeQuiz = () => {
    handleCompleteQuiz();
    setGameState("result");
  };

  const handleAnswerQuestion = (choice) => {
    if (choice === questions[currentIndex].answer) {
      setCorrectAnswers((current) => [
        ...current,
        {
          question: questions[currentIndex],
          yourAnswer: choice,
        },
      ]);
    } else {
      setIncorrectAnswers((current) => [
        ...current,
        {
          question: questions[currentIndex],
          yourAnswer: choice,
        },
      ]);
    }
    setCurrentIndex(currentIndex + 1);
    if (currentIndex === questions.length - 1) {
      setGameState("intermediate");
    }
  };

  const fetchNewQuestions = async () => {
    await axiosInstance
      .get("/api/v1/quiz/generate/medium")
      .then((res) => {
        console.log("fetched questions: ", res.data);
        setQuestions(res.data.data.questions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePlayAgain = () => {
    console.log("handle play again");
  };

  const handleCompleteQuiz = () => {
    console.log(
      "completing quiz: ",
      correctAnswers.length,
      incorrectAnswers.length
    );
    axiosInstance
      .post("/api/v1/quiz/complete", {
        correctAnswers: correctAnswers.length,
        incorrectAnswers: incorrectAnswers.length,
        difficulty: "medium",
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center py-4 w-full">
      <GameHeader title="Quiz" image="quiz" />

      {gameState === "menu" && <QuizMenu handleStartGame={handleStartGame} />}

      {gameState === "playing" && (
        <QuizGame
          questions={questions}
          currentIndex={currentIndex}
          handleAnswerQuestion={handleAnswerQuestion}
        />
      )}
      {gameState === "intermediate" && (
        <QuizIntermediary handleCompleteQuiz={completeQuiz} />
      )}
      {gameState === "result" && (
        <QuizResult
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          handlePlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default Quiz;