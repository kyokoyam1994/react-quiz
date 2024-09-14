import { QuizReducerAction } from "../QuizReducerAction";

interface FinishedScreenProps {
  points: number;
  maxPoints: number;
  highscore: number;
  dispatch: React.Dispatch<QuizReducerAction>;
}

export default function FinishedScreen({
  points,
  maxPoints,
  highscore,
  dispatch,
}: FinishedScreenProps) {
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored <strong>{points}</strong> out of {maxPoints}
        &nbsp;({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "reset" })}
      >
        Restart
      </button>
    </>
  );
}
