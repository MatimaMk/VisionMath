import Head from "next/head";
import Link from "next/link";
import styles from "@/components/aiTestGenerator/styles/mathTest.module.css";
import TestResultsClient from "../../../../components/aiTestGenerator/TestResultsClient";
import { mathTestService } from "../../../../components/aiServices/mathTestService";

type PageProps = {
  params: {
    resultId: string;
  };
};

export default async function TestResultsPage({ params }: PageProps) {
  console.log("params", params.resultId);
  console.log("params", params);

  let result;
  try {
    result = await mathTestService.getTestResult(params?.resultId);
  } catch (error) {
    console.error("Error fetching test result:", error);

    return (
      <div className={styles.errorContainer}>
        <h2>Oops! Something went wrong</h2>
        <p className={styles.errorMessage}>
          Failed to load test results. Please try again.
        </p>
        <Link href="/math-tests" className={styles.returnButton}>
          Return to Math Tests
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.errorContainer}>
        <h2>No test results found</h2>
        <Link href="/math-tests" className={styles.returnButton}>
          Return to Math Tests
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Math Test Results</title>
        <meta
          name="description"
          content="Your math test results and personalized recommendations"
        />
      </Head>

      <main className={styles.resultsMain}>
        <h1 className={styles.resultsTitle}>Test Results</h1>
        {/* Pass result data to client component */}
        <TestResultsClient result={result} />
      </main>
    </>
  );
}
