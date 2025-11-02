const Problem = require("../models/problem.model");
const Submission = require("../models/submission.model");
const User = require("../models/user.model");
const { getLanguageById, submitBatch, submitToken, parseErrorMessage } = require("../utils/judge0.util");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (language === "cpp") language = "c++";

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      executionDetails: { testCasesTotal: problem.hiddenTestCases.length },
    });

    const languageId = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultTokens);

    // console.log("Test Results:", testResult); // Debug log

    let testCasesPassed = 0;
    let totalRuntime = 0;
    let maxMemory = 0;
    let status = "accepted";
    let errorMessage = "";
    let errorType = null;
    let failedTestCase = null;
    let errorLine = null;
    let errorColumn = null;

    // CHECK FIRST RESULT FOR COMPILATION/FATAL ERRORS
    const firstResult = testResult[0];

    // Status ID 6 = Compilation Error
    if (firstResult.status_id === 6) {
      status = "error";
      errorType = "compilation";
      errorMessage = firstResult.compile_output || firstResult.stderr || "Compilation failed";

      // Parse error to extract line numbers
      const parsedError = parseErrorMessage(errorMessage, language);
      errorLine = parsedError.line;
      errorColumn = parsedError.column;
      errorMessage = parsedError.message;

      console.log("Compilation Error Detected:", { errorMessage, errorLine, errorColumn });

    } else if (firstResult.status_id === 5) {
      // Status ID 5 = Time Limit Exceeded
      status = "error";
      errorType = "timeout";
      errorMessage = "Time Limit Exceeded";
      failedTestCase = 1;

    } else if ([7, 8, 9, 10, 11, 12].includes(firstResult.status_id)) {
      // Status IDs 7-12 = Runtime Errors
      status = "error";
      errorType = "runtime";
      errorMessage = firstResult.stderr || firstResult.message || "Runtime Error";
      failedTestCase = 1;

    } else {
      // No fatal errors, process each test case
      for (let i = 0; i < testResult.length; i++) {
        const test = testResult[i];

        if (test.status_id === 3) {
          // Accepted
          testCasesPassed++;
          totalRuntime += parseFloat(test.time || 0);
          maxMemory = Math.max(maxMemory, test.memory || 0);

        } else if (test.status_id === 5) {
          // Timeout on this test case
          status = "error";
          errorType = "timeout";
          errorMessage = "Time Limit Exceeded";
          failedTestCase = i + 1;
          break;

        } else if ([7, 8, 9, 10, 11, 12].includes(test.status_id)) {
          // Runtime error on this test case
          status = "error";
          errorType = "runtime";
          errorMessage = test.stderr || test.message || "Runtime Error";
          failedTestCase = i + 1;
          break;

        } else {
          // Wrong Answer (status_id = 4)
          status = "wrong";
          failedTestCase = i + 1;
          break;
        }
      }
    }

    submittedResult.status = status;
    submittedResult.executionDetails.testCasesPassed = testCasesPassed;
    submittedResult.executionDetails.runtime = totalRuntime;
    submittedResult.executionDetails.memory = maxMemory;
    submittedResult.errorDetails = { 
      errorMessage, 
      errorType,
      errorLine,
      errorColumn 
    };
    submittedResult.judge0Response = { tokens: resultTokens, submissions: testResult };
    await submittedResult.save();

    if (status === "accepted" && !req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
      problem.statistics.acceptedSubmissions += 1;
    }

    problem.statistics.totalSubmissions += 1;
    if (problem.updateStatistics) await problem.updateStatistics();
    await problem.save();

    // Build response based on status
    const response = {
      success: status === "accepted",
      submissionId: submittedResult._id,
      totalTestCases: submittedResult.executionDetails.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime: totalRuntime,
      memory: maxMemory,
      status,
    };

    // Add error details if present
    if (status === "error") {
      response.errorType = errorType;
      response.errorMessage = errorMessage;
      if (errorLine) response.errorLine = errorLine;
      if (errorColumn) response.errorColumn = errorColumn;
      if (failedTestCase) response.failedTestCase = failedTestCase;
    } else if (status === "wrong") {
      response.failedTestCase = failedTestCase;
    } else {
      // Accepted - include execution details
      response.executionDetails = {
        averageRuntime: totalRuntime / problem.hiddenTestCases.length,
        maxMemory,
        statusBreakdown: { 
          accepted: testCasesPassed, 
          failed: problem.hiddenTestCases.length - testCasesPassed 
        },
      };
    }

     if (!req.isPremiumUser) {
      await incrementFeatureUsageUtil(req.user.id, 'codeExecutions');
    }
    
    res.status(201).json(response);

  } catch (err) {
    console.error("Submit code error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    if (language === "cpp") language = "c++";

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }

    const languageId = getLanguageById(language);
    const submissions = problem.visibleTestCases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    // console.log("Submitting to Judge0:", submissions);

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((v) => v.token);
    const testResults = await submitToken(resultTokens);

    console.log("Judge0 Results:", testResults);

    // CHECK FIRST RESULT FOR COMPILATION ERROR
    const firstResult = testResults[0];

    if (firstResult.status_id === 6) {
      // Compilation Error
      const errorMessage = firstResult.compile_output || firstResult.stderr || "Compilation failed";
      const parsedError = parseErrorMessage(errorMessage, language);

      console.log("Compilation Error:", parsedError);

      return res.status(200).json({
        success: false,
        errorType: "compilation",
        errorMessage: parsedError.message,
        errorLine: parsedError.line,
        errorColumn: parsedError.column,
        totalTestCases: problem.visibleTestCases.length,
        passedTestCases: 0,
        runtime: 0,
        memory: 0
      });
    }

    if (firstResult.status_id === 5) {
      // Time Limit Exceeded
      return res.status(200).json({
        success: false,
        errorType: "timeout",
        errorMessage: "Time Limit Exceeded",
        failedTestCase: 1,
        totalTestCases: problem.visibleTestCases.length,
        passedTestCases: 0,
        runtime: 0,
        memory: 0
      });
    }

    if ([7, 8, 9, 10, 11, 12].includes(firstResult.status_id)) {
      // Runtime Error
      return res.status(200).json({
        success: false,
        errorType: "runtime",
        errorMessage: firstResult.stderr || firstResult.message || "Runtime Error",
        failedTestCase: 1,
        totalTestCases: problem.visibleTestCases.length,
        passedTestCases: 0,
        runtime: 0,
        memory: 0
      });
    }

    // No fatal errors, process each test case normally
    const detailedResults = testResults.map((test, index) => {
      const tc = problem.visibleTestCases[index];
      const passed = test.status_id === 3;

      let error = null;
      if (!passed) {
        if (test.status_id === 6) {
          error = "Compilation Error: " + (test.compile_output || test.stderr || "Unknown");
        } else if (test.status_id === 5) {
          error = "Time Limit Exceeded";
        } else if ([7, 8, 9, 10, 11, 12].includes(test.status_id)) {
          error = "Runtime Error: " + (test.stderr || test.message || "Unknown");
        } else {
          error = test.stderr || test.compile_output || null;
        }
      }

      return {
        testCaseNumber: index + 1,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: test.stdout ?? "",
        passed,
        runtime: parseFloat(test.time || 0),
        memory: test.memory || 0,
        error
      };
    });

    console.log("Detailed Results:", detailedResults);

    const passedCount = detailedResults.filter((r) => r.passed).length;
    const totalRuntime = detailedResults.reduce((sum, r) => sum + r.runtime, 0);
    const maxMemory = Math.max(...detailedResults.map((r) => r.memory));

    res.status(200).json({
      success: passedCount === problem.visibleTestCases.length,
      totalTestCases: problem.visibleTestCases.length,
      passedTestCases: passedCount,
      runtime: totalRuntime,
      memory: maxMemory,
      results: detailedResults,
    });

  } catch (err) {
    console.error("Run code error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = { submitCode, runCode };