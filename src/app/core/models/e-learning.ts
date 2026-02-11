export interface CourseI {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

export interface OptionI {
  id: string | number;
  option_text: string;
  is_correct: boolean;
}

export interface QuestionI {
  id: number;
  text: string;
  options: OptionI[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  videoId: string;
  duration: string;
  questions: QuestionI[];
}