import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { QuizQuestion } from "../QuizQuestion";
import { QuizReducerAction } from "../QuizReducerAction";

interface QuizState {
  questions: QuizQuestion[];
  status: "loading" | "error" | "ready" | "active" | "finished";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  timeRemaining: number;
}

interface QuizContextType {
  questions: QuizQuestion[];
  status: "loading" | "error" | "ready" | "active" | "finished";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  timeRemaining: number;
  numQuestions: number;
  maxPoints: number;
  dispatch: Dispatch<QuizReducerAction>;
}

interface QuizProviderProps {
  children: ReactNode;
}

const SECONDS_PER_QUESTION = 30;

const initialState: QuizState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  timeRemaining: -1,
};

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

const QuizContext = createContext<QuizContextType>();

function QuizProvider({ children }: QuizProviderProps) {
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
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        timeRemaining,
        numQuestions,
        maxPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("QuizContext was used outside of QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
