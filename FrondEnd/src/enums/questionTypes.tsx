export enum questionTypes {
  MultipleChoice = 1,
  TrueFalse = 2,
  Numeric = 3,
  Algebraic = 4,
  FillInTheBlank = 5,
  MatchColumns = 6,
}

// For backward compatibility and easier reference
export const QuestionTypes = {
  MULTIPLE_CHOICE: questionTypes.MultipleChoice,
  TRUE_FALSE: questionTypes.TrueFalse,
  FILL_IN_THE_BLANK: questionTypes.FillInTheBlank,
  NUMERIC: questionTypes.Numeric,
} as const;

// Helper function to get question type label
export const getQuestionTypeLabel = (type: questionTypes): string => {
  switch (type) {
    case questionTypes.MultipleChoice:
      return "Multiple Choice";
    case questionTypes.TrueFalse:
      return "True/False";
    case questionTypes.FillInTheBlank:
      return "Fill in the Blank";
    case questionTypes.Numeric:
      return "Numeric";
    default:
      return "Unknown";
  }
};
