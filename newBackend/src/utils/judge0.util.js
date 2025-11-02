// / utils/problemUtility.js
const axios = require("axios");

// Map language names to Judge0 IDs
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63,
  };
  const id = language[lang.toLowerCase()];
  if (!id) throw new Error(`Unsupported language: ${lang}`);
  return id;
};

// Wait function
const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Convert string to base64
const toBase64 = (str) => {
  return Buffer.from(str).toString('base64');
};

// Convert base64 to string
const fromBase64 = (str) => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

// Submit batch of code to Judge0 with base64 encoding
const submitBatch = async (submissions) => {
  submissions.forEach((s) => {
    if (!s.language_id) throw new Error("Invalid language_id in submission");
  });

  // Encode submissions to base64
  const encodedSubmissions = submissions.map(sub => ({
    source_code: toBase64(sub.source_code),
    language_id: sub.language_id,
    stdin: toBase64(sub.stdin),
    expected_output: toBase64(sub.expected_output),
  }));

  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: { base64_encoded: "true" },  // Changed to true
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: { submissions: encodedSubmissions },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Judge0 batch submission error:", error.response?.data || error.message);
    throw error;
  }
};

// Poll Judge0 for submission results using tokens with base64 decoding
const submitToken = async (resultTokens) => {
  if (!resultTokens.length) throw new Error("No tokens provided for submission result");

  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultTokens.join(","),
      base64_encoded: "true",  // Changed to true
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Judge0 fetch result error:", error.response?.data || error.message);
      throw error;
    }
  };

  while (true) {
    const result = await fetchData();
    const isResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (isResultObtained) {
      // Decode base64 fields in results
      const decodedSubmissions = result.submissions.map(sub => ({
        ...sub,
        stdout: sub.stdout ? fromBase64(sub.stdout) : null,
        stderr: sub.stderr ? fromBase64(sub.stderr) : null,
        compile_output: sub.compile_output ? fromBase64(sub.compile_output) : null,
        message: sub.message ? fromBase64(sub.message) : null,
      }));

      return decodedSubmissions;
    }

    await waiting(1000);
  }
};

/**
 * Parse error messages to extract line numbers, column numbers, and clean error text
 * @param {string} errorMessage - Raw error message from compiler/runtime
 * @param {string} language - Programming language (c++, java, javascript)
 * @returns {object} - Parsed error with line, column, and message
 */
const parseErrorMessage = (errorMessage, language) => {
  if (!errorMessage) {
    return { line: null, column: null, message: "Unknown error" };
  }

  let line = null;
  let column = null;
  let cleanMessage = errorMessage;

  try {
    if (language === "c++") {
      // C++ error format examples:
      // main.cpp:5:10: error: expected ';' before 'return'
      // main.cpp:12:5: error: 'cout' was not declared in this scope
      const cppPattern = /(?:main\.cpp|prog\.cpp|solution\.cpp):(\d+):(\d+):\s*error:\s*(.+)/i;
      const match = errorMessage.match(cppPattern);

      if (match) {
        line = parseInt(match[1]);
        column = parseInt(match[2]);
        cleanMessage = match[3].trim();
      } else {
        // Try simpler pattern
        const simplePattern = /:(\d+):(\d+):/;
        const simpleMatch = errorMessage.match(simplePattern);
        if (simpleMatch) {
          line = parseInt(simpleMatch[1]);
          column = parseInt(simpleMatch[2]);
        }
      }

    } else if (language === "java") {
      // Java error format examples:
      // Main.java:5: error: ';' expected
      // Main.java:12: error: cannot find symbol
      const javaPattern = /(?:Main|Solution)\.java:(\d+):\s*error:\s*(.+)/i;
      const match = errorMessage.match(javaPattern);

      if (match) {
        line = parseInt(match[1]);
        cleanMessage = match[2].trim();
      } else {
        // Try to extract just line number
        const linePattern = /:line\s*(\d+)/i;
        const lineMatch = errorMessage.match(linePattern);
        if (lineMatch) {
          line = parseInt(lineMatch[1]);
        }
      }

    } else if (language === "javascript") {
      // JavaScript error format examples:
      // SyntaxError: Unexpected token (5:10)
      // ReferenceError: x is not defined
      const jsPattern = /(?:SyntaxError|ReferenceError|TypeError):\s*(.+?)\s*\((\d+):(\d+)\)/i;
      const match = errorMessage.match(jsPattern);

      if (match) {
        cleanMessage = match[1].trim();
        line = parseInt(match[2]);
        column = parseInt(match[3]);
      } else {
        // Try alternative pattern
        const altPattern = /at line (\d+)/i;
        const altMatch = errorMessage.match(altPattern);
        if (altMatch) {
          line = parseInt(altMatch[1]);
        }
      }
    }

    // Clean up common compiler noise
    cleanMessage = cleanMessage
      .replace(/\^\s*$/gm, '') // Remove caret indicators
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();

    // Limit message length
    if (cleanMessage.length > 500) {
      cleanMessage = cleanMessage.substring(0, 500) + '...';
    }

  } catch (parseError) {
    console.error("Error parsing error message:", parseError);
  }

  return {
    line,
    column,
    message: cleanMessage || errorMessage
  };
};

module.exports = { 
  getLanguageById, 
  submitBatch, 
  submitToken,
  parseErrorMessage 
};