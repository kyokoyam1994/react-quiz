import { QuizReducerAction } from "../QuizReducerAction";

interface NextButtonProps {
  dispatch: React.Dispatch<QuizReducerAction>;
  answer: number | null;
  index: number;
  numQuestions: number;
}

export default function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
}: NextButtonProps) {
  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
  }
}
