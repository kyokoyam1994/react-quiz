import { QuizQuestion } from "../QuizQuestion";
import { QuizReducerAction } from "../QuizReducerAction";

interface OptionsProps {
  question: QuizQuestion;
  answer: number | null;
  dispatch: React.Dispatch<QuizReducerAction>;
}

export default function Options({ question, answer, dispatch }: OptionsProps) {
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          key={index}
          disabled={hasAnswered}
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
