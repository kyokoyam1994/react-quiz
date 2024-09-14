import { useEffect } from "react";
import { QuizReducerAction } from "../QuizReducerAction";

interface TimerProps {
  dispatch: React.Dispatch<QuizReducerAction>;
  timeRemaining: number;
}

export default function Timer({ dispatch, timeRemaining }: TimerProps) {
  const mins = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  useEffect(() => {
    const id = setInterval(() => {
      console.log("tick");
      dispatch({ type: "timerUpdate" });
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}
