  import React, { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { useNavigate } from "react-router";
  import {
    Plus,
    Save,
    Trash2,
    AlertCircle,
    CheckCircle,
    Code,
    FileText,
    Settings,
    Hash,
    FileJson, // Imported FileJson icon
    Upload    // Imported Upload icon
  } from "lucide-react";
  import axiosClient from "../../utils/axiosClient";

  const AdminPanel = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // New State for JSON Import feature
    const [showJsonInput, setShowJsonInput] = useState(false);
    const [jsonInput, setJsonInput] = useState("");

    const [problemData, setProblemData] = useState({
      title: "",
      description: "",
      difficulty: "easy",
      tags: [],
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "javascript", initialCode: "" },
        { language: "c++", initialCode: "" },
        { language: "java", initialCode: "" },
      ],
      referenceSolution: [
        { language: "javascript", completeCode: "" },
        { language: "c++", completeCode: "" },
        { language: "java", completeCode: "" },
      ],
    });

    const availableTags = [
      "array",
      "linkedList",
      "graph",
      "dp",
      "string",
      "hash table",
      "math",
      "bit-manipulation" // Added based on your example
    ];

    // --- JSON IMPORT HANDLER ---
    const handleJsonImport = () => {
      try {
        if (!jsonInput.trim()) {
          setError("Please paste a JSON string.");
          return;
        }

        const parsedData = JSON.parse(jsonInput);

        // Basic validation to ensure it matches our schema
        if (!parsedData.title || !parsedData.description) {
          throw new Error("JSON must contain at least a 'title' and 'description'.");
        }

        // Merge parsed data with default structure to ensure all fields exist
        // We map specifically to ensure arrays are processed correctly
        setProblemData(prev => ({
          ...prev,
          ...parsedData,
          // Ensure arrays exist even if not in JSON, or use the JSON version
          tags: parsedData.tags || [],
          visibleTestCases: parsedData.visibleTestCases || prev.visibleTestCases,
          hiddenTestCases: parsedData.hiddenTestCases || prev.hiddenTestCases,
          startCode: parsedData.startCode || prev.startCode,
          referenceSolution: parsedData.referenceSolution || prev.referenceSolution
        }));

        setSuccess("Problem data imported successfully!");
        setShowJsonInput(false);
        setJsonInput(""); // Clear input
        setError("");
        
        // Clear success msg after 3s
        setTimeout(() => setSuccess(""), 3000);

      } catch (err) {
        console.error(err);
        setError("Invalid JSON Format. Please check syntax.");
      }
    };

    // --- EXISTING HANDLERS ---
    const handleInputChange = (field, value) => {
      setProblemData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleTagToggle = (tag) => {
      setProblemData((prev) => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
      setProblemData((prev) => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    };

    const addArrayItem = (arrayName, defaultItem) => {
      setProblemData((prev) => ({
        ...prev,
        [arrayName]: [...prev[arrayName], defaultItem],
      }));
    };

    const removeArrayItem = (arrayName, index) => {
      setProblemData((prev) => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index),
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validation
      if (!problemData.title.trim()) {
        setError("Problem title is required");
        return;
      }

      if (!problemData.description.trim()) {
        setError("Problem description is required");
        return;
      }

      if (problemData.tags.length === 0) {
        setError("At least one tag is required");
        return;
      }

      // Validate that all visible test cases have required fields
      for (let i = 0; i < problemData.visibleTestCases.length; i++) {
        const testCase = problemData.visibleTestCases[i];
        if (
          !testCase.input.trim() ||
          !testCase.output.trim() ||
          !testCase.explanation.trim()
        ) {
          setError(`Visible test case ${i + 1} is incomplete`);
          return;
        }
      }

      // Validate that all hidden test cases have required fields
      for (let i = 0; i < problemData.hiddenTestCases.length; i++) {
        const testCase = problemData.hiddenTestCases[i];
        if (!testCase.input.trim() || !testCase.output.trim()) {
          setError(`Hidden test case ${i + 1} is incomplete`);
          return;
        }
      }

      // Validate that all start code templates are provided
      for (let i = 0; i < problemData.startCode.length; i++) {
        const startCode = problemData.startCode[i];
        if (!startCode.initialCode.trim()) {
          setError(`Start code template for ${startCode.language} is required`);
          return;
        }
      }

      // Validate that all reference solutions are provided
      for (let i = 0; i < problemData.referenceSolution.length; i++) {
        const solution = problemData.referenceSolution[i];
        if (!solution.completeCode.trim()) {
          setError(`Reference solution for ${solution.language} is required`);
          return;
        }
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response = await axiosClient.post("/problem/create", problemData);

        if (response.status === 201) {
          setSuccess("Problem created successfully!");
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        }
      } catch (error) {
        console.error("Error creating problem:", error);
        setError(
          error.response?.data || "Failed to create problem. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Create New Problem
                </h1>
                <p className="text-gray-300">
                  Add a new coding problem manually or via JSON 

  [Image of JSON logo]

                </p>
              </div>
            </div>

            {/* JSON Import Toggle Button */}
            <button
              onClick={() => setShowJsonInput(!showJsonInput)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-200"
            >
              <FileJson className="w-5 h-5" />
              <span>{showJsonInput ? "Hide Importer" : "Import JSON"}</span>
            </button>
          </motion.div>

          {/* JSON Import Section */}
          <AnimatePresence>
            {showJsonInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Paste JSON Data
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Paste the problem JSON structure here to auto-fill the form fields.
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows="10"
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-green-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                    placeholder='{ "title": "...", "description": "...", ... }'
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => { setShowJsonInput(false); setJsonInput(""); }}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleJsonImport}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center"
                    >
                      <FileJson className="w-4 h-4 mr-2" />
                      Parse & Fill Form
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={problemData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Two Sum"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={problemData.difficulty}
                    onChange={(e) =>
                      handleInputChange("difficulty", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Tags * (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          problemData.tags.includes(tag)
                            ? 'bg-cyan-500 text-white border-2 border-cyan-400'
                            : 'bg-black/50 text-gray-300 border-2 border-gray-600 hover:border-cyan-400/50'
                        }`}
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                  {problemData.tags.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      Selected: {problemData.tags.join(", ")}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Problem Description *
                  </label>
                  <textarea
                    value={problemData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows="6"
                    className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-vertical"
                    placeholder="Describe the problem in detail..."
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Visible Test Cases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Code className="w-5 h-5 mr-2 text-cyan-400" />
                  Visible Test Cases
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("visibleTestCases", {
                      input: "",
                      output: "",
                      explanation: "",
                    })
                  }
                  className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Test Case</span>
                </button>
              </div>

              <div className="space-y-4">
                {problemData.visibleTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-200">
                        Test Case {index + 1}
                      </h3>
                      {problemData.visibleTestCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("visibleTestCases", index)
                          }
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            handleArrayChange(
                              "visibleTestCases",
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Input data"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.output}
                          onChange={(e) =>
                            handleArrayChange(
                              "visibleTestCases",
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Expected output"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Explanation
                        </label>
                        <textarea
                          value={testCase.explanation}
                          onChange={(e) =>
                            handleArrayChange(
                              "visibleTestCases",
                              index,
                              "explanation",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Explanation"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hidden Test Cases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                  Hidden Test Cases
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("hiddenTestCases", { input: "", output: "" })
                  }
                  className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Test Case</span>
                </button>
              </div>

              <div className="space-y-4">
                {problemData.hiddenTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-200">
                        Hidden Test Case {index + 1}
                      </h3>
                      {problemData.hiddenTestCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("hiddenTestCases", index)
                          }
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            handleArrayChange(
                              "hiddenTestCases",
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Input data"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.output}
                          onChange={(e) =>
                            handleArrayChange(
                              "hiddenTestCases",
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          placeholder="Expected output"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Start Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Code className="w-5 h-5 mr-2 text-cyan-400" />
                Start Code Templates
              </h2>

              <div className="space-y-4">
                {problemData.startCode.map((code, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-200 capitalize">
                        {code.language}
                      </h3>
                    </div>
                    <textarea
                      value={code.initialCode}
                      onChange={(e) =>
                        handleArrayChange(
                          "startCode",
                          index,
                          "initialCode",
                          e.target.value
                        )
                      }
                      rows="6"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder={`Initial code template for ${code.language}...`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reference Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-cyan-400" />
                Reference Solutions
              </h2>

              <div className="space-y-4">
                {problemData.referenceSolution.map((solution, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-200 capitalize">
                        {solution.language}
                      </h3>
                    </div>
                    <textarea
                      value={solution.completeCode}
                      onChange={(e) =>
                        handleArrayChange(
                          "referenceSolution",
                          index,
                          "completeCode",
                          e.target.value
                        )
                      }
                      rows="8"
                      className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder={`Complete solution in ${solution.language}...`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Error and Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{error}</p>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400">{success}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-end space-x-4"
            >
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Problem</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    );
  };

  export default AdminPanel;