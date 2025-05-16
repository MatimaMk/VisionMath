import {
  AnswersMap,
  ClientMathQuestion,
  ClientMathTest,
  GradedQuestion,
  MathQuestion,
  TestResult,
} from "../../app/interfaces/mathTestTypes";
import { supabase } from "../../lib/supabase";

export const mathTestService = {
  async generateTest(
    topic: string,
    difficulty: string,
    questionCount: number
  ): Promise<ClientMathTest> {
    try {
      const { data, error } = await supabase.functions.invoke("testing-api", {
        method: "POST",
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount: questionCount.toString(),
          apikey: "369d92303d5e02a4e9ebe7854a7f0b8a09900b4235ca",
          Authorization: `Bearer 369d92303d5e02a4e9ebe7854a7f0b8a09900b4235ca`,
        }),
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned from function");
      }

      // Store the complete test in Supabase (with answers)
      const { data: testData, error: insertError } = await supabase
        .from("math_tests")
        .insert({
          title: data.title,
          topic: data.topic,
          difficulty: data.difficulty,
          questions: data.questions,
          user_id: (await supabase.auth.getUser()).data?.user?.id,
        })
        .select()
        .single();

      if (insertError)
        throw new Error(`Error saving test: ${insertError.message}`);
      if (!testData) throw new Error("Failed to retrieve saved test data");

      const clientQuestions: ClientMathQuestion[] = data.questions.map(
        (q: MathQuestion) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options || [],
        })
      );

      return {
        id: testData.id,
        title: data.title,
        topic: data.topic,
        difficulty: data.difficulty as "easy" | "medium" | "hard",
        questions: clientQuestions,
        userId: (await supabase.auth.getUser()).data?.user?.id || "",
      };
    } catch (err) {
      console.error("Error in generateTest:", err);
      throw err;
    }
  },
  async submitTest(
    testId: string,
    answers: AnswersMap,
    timeInSeconds: number
  ): Promise<{ resultId: string }> {
    try {
      const specificUserId = "f6593f95-ead6-43b0-9164-fa135f4d98c4";

      const { data: test, error: testError } = await supabase
        .from("math_tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testError)
        throw new Error(`Error retrieving test: ${testError.message}`);
      if (!test) throw new Error("Test not found");

      const gradedQuestions = test.questions.map((question: MathQuestion) => {
        const questionId = question.id;
        const userAnswer = answers[questionId] || "";
        let isCorrect = false;

        const safeCompare = (
          a: string | AnswersMap,
          b: string | AnswersMap
        ): boolean => {
          const strA =
            typeof a === "string" ? a.trim() : String(a || "").trim();
          const strB =
            typeof b === "string" ? b.trim() : String(b || "").trim();

          return strA.toLowerCase() === strB.toLowerCase();
        };

        if (question.type === "multiple_choice") {
          isCorrect = safeCompare(userAnswer, question.correctAnswer);
        } else {
          isCorrect = safeCompare(userAnswer, question.correctAnswer);
        }

        // Create graded question with proper formatting
        return {
          id: questionId,
          text: question.text || "",
          type: question.type || "open_ended",
          userAnswer:
            typeof userAnswer === "string"
              ? userAnswer
              : String(userAnswer || ""),
          correctAnswer:
            typeof question.correctAnswer === "string"
              ? question.correctAnswer
              : String(question.correctAnswer || ""),
          isCorrect,
          explanation: question.explanation || "",
          // Include options if present
          ...(question.options ? { options: question.options } : {}),
        };
      });

      // Calculate score
      const correctCount = gradedQuestions.filter(
        (q: GradedQuestion) => q.isCorrect
      ).length;
      const score = Math.round((correctCount / test.questions.length) * 100);

      const simpleRecommendations = [
        {
          title: "Review Core Concepts",
          description: `Focus on strengthening your understanding of ${test.topic} fundamentals.`,
        },
        {
          title: "Practice Similar Problems",
          description:
            "Try solving more problems at this difficulty level to build confidence.",
        },
        {
          title: "Time Management",
          description:
            "Work on improving your speed while maintaining accuracy.",
        },
      ];

      try {
        const { data: minimalResult, error: minimalError } = await supabase
          .from("math_test_results")
          .insert({
            test_id: testId,
            user_id: specificUserId,
            score: score,
            time_in_seconds: timeInSeconds,
          })
          .select()
          .single();

        if (!minimalError && minimalResult) {
          return { resultId: minimalResult.id };
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const { data: withQuestionsResult, error: withQuestionsError } =
          await supabase
            .from("math_test_results")
            .insert({
              test_id: testId,
              user_id: specificUserId,
              score: score,
              time_in_seconds: timeInSeconds,
              questions: gradedQuestions,
            })
            .select()
            .single();

        if (!withQuestionsError && withQuestionsResult) {
          return { resultId: withQuestionsResult.id };
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const { data: fullResult, error: fullError } = await supabase
          .from("math_test_results")
          .insert({
            test_id: testId,
            user_id: specificUserId,
            score: score,
            time_in_seconds: timeInSeconds,
            questions: gradedQuestions,
            recommendations: simpleRecommendations,
          })
          .select()
          .single();

        if (!fullError && fullResult) {
          return { resultId: fullResult.id };
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const { data: jsonResult, error: jsonError } = await supabase
          .from("math_test_results")
          .insert({
            test_id: testId,
            user_id: specificUserId,
            score: score,
            time_in_seconds: timeInSeconds,
            questions: JSON.stringify(gradedQuestions),
            recommendations: JSON.stringify(simpleRecommendations),
          })
          .select()
          .single();

        if (!jsonError && jsonResult) {
          return { resultId: jsonResult.id };
        }

        throw new Error(`Could not submit test results: ${jsonError?.message}`);
      } catch (err) {
        throw new Error(
          `Failed to submit test results: ${(err as Error).message}`
        );
      }
    } catch (err) {
      throw err;
    }
  },

  async getTestResult(resultId: string): Promise<TestResult> {
    try {
      if (!resultId || resultId === "undefined") {
        console.error("Invalid resultId provided:", resultId);
        throw new Error("Invalid result ID provided");
      }

      // Log the resultId for debugging
      console.log("Fetching test result with ID:", resultId);

      // Get the test result and join with the math_tests table
      const { data, error } = await supabase
        .from("math_test_results")
        .select("*, math_tests:test_id (*)")
        .eq("id", resultId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Error retrieving result: ${error.message}`);
      }

      if (!data) {
        console.error("Result not found for ID:", resultId);
        throw new Error("Result not found");
      }

      // Ensure proper formatting of data
      const formattedResult: TestResult = {
        ...data,
        questions: Array.isArray(data.questions)
          ? data.questions
          : typeof data.questions === "string"
          ? JSON.parse(data.questions)
          : [],
        recommendations: Array.isArray(data.recommendations)
          ? data.recommendations
          : typeof data.recommendations === "string"
          ? JSON.parse(data.recommendations)
          : [],
      };

      return formattedResult;
    } catch (err) {
      console.error("Error in getTestResult:", err);
      throw err;
    }
  },
  async getTestHistory(): Promise<TestResult[]> {
    try {
      const { data, error } = await supabase
        .from("math_test_results")
        .select(
          `
            id,
            test_id,
            score,
            time_in_seconds,
            completed_at,
            math_tests:test_id (
              id,
              title,
              topic,
              difficulty
            )
          `
        )
        .order("completed_at", { ascending: false });

      if (error) throw new Error(`Error retrieving history: ${error.message}`);
      if (!data) return [];

      // Transform the data to match our TestResult interface
      const transformedData: TestResult[] = data.map((item) => {
        const mathTest = Array.isArray(item.math_tests)
          ? item.math_tests[0]
          : item.math_tests;

        return {
          id: item.id,
          test_id: item.test_id,
          score: item.score,
          time_in_seconds: item.time_in_seconds,
          completed_at: item.completed_at,
          math_tests: mathTest
            ? {
                id: mathTest.id,
                title: mathTest.title,
                topic: mathTest.topic,
                difficulty: mathTest.difficulty as "easy" | "medium" | "hard",
              }
            : undefined,
          questions: [],
          recommendations: [],
        };
      });

      return transformedData;
    } catch (err) {
      console.error("Error in getTestHistory:", err);
      throw err;
    }
  },
};
