import { QuizQuestion } from "../QuizQuestion";
import Options from "./Options";

interface QuestionProps {
  question: QuizQuestion;
  answer: number | null;
  dispatch: React.Dispatch<QuizReducerAction>;
}

export default function Question({
  question,
  answer,
  dispatch,
}: QuestionProps) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
      ></Options>
    </div>
  );
}
