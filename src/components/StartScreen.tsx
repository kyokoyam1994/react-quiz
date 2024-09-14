import { QuizReducerAction } from "../QuizReducerAction";

interface StartScreenProps {
  numQuestions: number;
  dispatch: React.Dispatch<QuizReducerAction>;
}

export default function StartScreen({
  numQuestions,
  dispatch,
}: StartScreenProps) {
  return (
    <div className="start">
      <h2>Welcome To The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}
