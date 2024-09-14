import { ReactNode } from "react";

interface QuizProps {
  children: ReactNode;
}

function Quiz({ children }: QuizProps) {
  return <main className="main">{children}</main>;
}

export default Quiz;
