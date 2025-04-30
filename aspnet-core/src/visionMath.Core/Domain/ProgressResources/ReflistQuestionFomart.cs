using System.ComponentModel;

namespace visionMath.Domain.ProgressResources
{
    public  enum ReflistQuestionFomart
    {
        [Description("Multiple Choice")]
        MultipleChoice = 1,

        [Description("True/False")]
        TrueFalse = 2,

        [Description("Numeric")]
        Numeric = 3,

        [Description("Algebraic")]
        Algebraic = 4,

        [Description("Fill in the Blank")]
        FillInTheBlank = 5,

        [Description("Match Columns")]
        MatchColumns = 6

    }
}
