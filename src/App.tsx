import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./components/Header";
import Quiz from "./components/Quiz";
import Loader from "./components/Loader";
import StartScreen from "./components/StartScreen";
import ErrorMessage from "./components/Error";
import Question from "./components/Question";
import { QuizReducerAction } from "./QuizReducerAction";
import { QuizQuestion } from "./QuizQuestion";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

interface QuizState {
  questions: QuizQuestion[];
  status: "loading" | "error" | "ready" | "active" | "finished";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  timeRemaining: number;
}

const initialState: QuizState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  timeRemaining: -1,
};

const SECONDS_PER_QUESTION = 30;

function reducer(state: QuizState, action: QuizReducerAction): QuizState {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        timeRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer": {
      const currQuestion = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          currQuestion.correctOption === action.payload
            ? state.points + currQuestion.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "reset":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
      };
    case "timerUpdate":
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
        status: state.timeRemaining <= 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, timeRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Quiz>
        {status === "loading" && <Loader></Loader>}
        {status === "error" && <ErrorMessage></ErrorMessage>}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          ></StartScreen>
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            ></Question>
            <Footer>
              <Timer dispatch={dispatch} timeRemaining={timeRemaining}></Timer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              ></NextButton>
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          ></FinishedScreen>
        )}
      </Quiz>
    </div>
  );
}

export default App;
