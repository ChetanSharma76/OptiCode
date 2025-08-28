import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const languageOptions = {
  java: { label: "Java", value: "java" },
  python: { label: "Python", value: "python" },
  cpp: { label: "C++", value: "cpp" },
};

const boilerplates = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define pb push_back
#define vi vector<int>
#define vll vector<long long>
#define pii pair<int, int>
#define MOD 1000000007
#define fastio ios_base::sync_with_stdio(false); cin.tie(0);

int main() {
    fastio;
    
    // Write your code here
    
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    static final int MOD = 1000000007;
    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    static StringTokenizer st;
    
    public static void main(String[] args) throws IOException {
        // Write your code here
        
    }
    
    static String next() throws IOException {
        while (st == null || !st.hasMoreTokens()) {
            st = new StringTokenizer(br.readLine());
        }
        return st.nextToken();
    }
    
    static int nextInt() throws IOException {
        return Integer.parseInt(next());
    }
    
    static long nextLong() throws IOException {
        return Long.parseLong(next());
    }
}`,
  python: `import sys
import math
from collections import defaultdict, deque, Counter
from bisect import bisect_left, bisect_right
from heapq import heappush, heappop

def main():
    # Write your code here
    pass

if __name__ == "__main__":
    main()`
};

const ProblemPage = () => {
  const { id: problemId } = useParams();
  const { token, userData, problems } = useContext(AppContext);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [output, setOutput] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [aiReviewCount, setAiReviewCount] = useState(0);
  const [aiReviewResponse, setAiReviewResponse] = useState("");
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [failedTestCase, setFailedTestCase] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState("50%");
  const [isDragging, setIsDragging] = useState(false);
  const [isRunMode, setIsRunMode] = useState(true);
  const [showAIReview, setShowAIReview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("vs-dark");
  const [isAiReviewOpen, setIsAiReviewOpen] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [testCaseKey, setTestCaseKey] = useState(0);

  const themeOptions = {
    "vs-dark": {
      label: "Dark (VS Code)",
      bg: "bg-gray-900",
      border: "border-gray-700",
      selectBg: "bg-gray-800",
      selectHover: "hover:bg-gray-700",
    },
    "vs-light": {
      label: "Light",
      bg: "bg-gray-50",
      border: "border-gray-300",
      selectBg: "bg-white",
      selectHover: "hover:bg-gray-100",
    },
    "hc-black": {
      label: "High Contrast Dark",
      bg: "bg-black",
      border: "border-yellow-400",
      selectBg: "bg-gray-900",
      selectHover: "hover:bg-gray-800",
    },
    "github-dark": {
      label: "GitHub Dark",
      bg: "bg-slate-900",
      border: "border-slate-600",
      selectBg: "bg-slate-800",
      selectHover: "hover:bg-slate-700",
    },
    monokai: {
      label: "Monokai",
      bg: "bg-stone-900",
      border: "border-stone-600",
      selectBg: "bg-stone-800",
      selectHover: "hover:bg-stone-700",
    },
  };

  const currentTheme = themeOptions[theme];
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize language and code from localStorage
  useEffect(() => {
    if (token && userData?._id) {
      const userKey = userData._id;
      const savedLanguage =
        localStorage.getItem(`language-${problemId}-${userKey}`) || "cpp";
      const savedCode = localStorage.getItem(
        `code-${problemId}-${userKey}-${savedLanguage}`
      );

      setLanguage(savedLanguage);
      setCode(savedCode || boilerplates[savedLanguage]);
    }
  }, [token, userData?._id, problemId]);

  // Window resize (no transitions)
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedWidth = Math.max(30, Math.min(70, newLeftWidth));
    setLeftPanelWidth(`${clampedWidth}%`);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Debounced code saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        token &&
        userData?._id &&
        code &&
        code !== boilerplates[language] &&
        !String(code).includes("//Write your code here...")
      ) {
        localStorage.setItem(
          `code-${problemId}-${userData._id}-${language}`,
          code
        );
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [code, token, userData?._id, problemId, language]);

  // Initial data loading for AI review and language
  useEffect(() => {
    if (token && userData?._id && !dataLoaded) {
      const userKey = userData._id;

      const savedLanguage = localStorage.getItem(
        `language-${problemId}-${userKey}`
      );
      if (savedLanguage && savedLanguage !== language) {
        setLanguage(savedLanguage);
      }

      const savedAiReview = localStorage.getItem(
        `aiReview-${problemId}-${userKey}`
      );
      if (savedAiReview) {
        setAiReviewResponse(savedAiReview);
      }

      const savedCount = localStorage.getItem(`aiReviewCount-${userKey}`);
      if (savedCount) {
        setAiReviewCount(Number(savedCount));
      }

      setDataLoaded(true);
    }
  }, [token, userData?._id, problemId, dataLoaded, language]);

  // On language change, reset verdict/output and load saved code
  useEffect(() => {
    setVerdict(null);
    setOutput(null);
    setTestCases([]);
    setFailedTestCase(null);
    setIsRunMode(true);
    setTestCaseKey((prev) => prev + 1);

    if (token && userData?._id) {
      const userKey = userData._id;
      const savedCode = localStorage.getItem(
        `code-${problemId}-${userKey}-${language}`
      );
      if (savedCode && savedCode.trim() !== "" && savedCode !== boilerplates[language]) {
        setCode(savedCode);
      } else {
        setCode(boilerplates[language] || "//Write your code here...");
      }
      localStorage.setItem(`language-${problemId}-${userKey}`, language);
    } else {
      setCode(boilerplates[language] || "//Write your code here...");
    }
  }, [language, problemId, token, userData?._id]);

  // Clear data when no token
  useEffect(() => {
    if (!token) {
      setCode("//Write your code here...");
      setLanguage("cpp");
      setAiReviewResponse("");
      setAiReviewCount(0);

      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes("code-") ||
          key.includes("language-") ||
          key.includes("aiReview-")
        ) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [token]);

  // Load problem
  useEffect(() => {
    try {
      const selectedProblem = problems.find((p) => p._id === problemId);
      if (selectedProblem) {
        setProblem(selectedProblem);
      }
      // Keep loading simple and static (no animation)
      const t = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(t);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching the problem");
      setLoading(false);
    }
  }, [problemId, problems]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsRunMode(false);
    setVerdict(null);
    setOutput(null);
    setFailedTestCase(null);
    setTestCases([]);
    setTestCaseKey((prev) => prev + 1);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submit`,
        {
          username: userData?.username,
          problemId,
          code,
          language,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        res.data.output === "Runtime error or non-zero exit code"
          ? setVerdict("Time Limit Exceeded")
          : res.data.verdict === "Runtime Error"
          ? setVerdict("Memory Limit Exceeded")
          : setVerdict(res.data.verdict || "Success");

        setOutput(res.data.output || "");
        setExecutionTime(res.data.executionTime || 0);
        setMemoryUsage(Math.floor(Math.random() * 10) + 5);
        setTestCases([]);
        setFailedTestCase(null);
      } else {
        const errorType = res.data.type || "Error";
        const errorMsg = res.data.error || "Unknown error occurred";
        toast.error(`${errorType}: ${errorMsg}`);
        setVerdict(errorType);
        setOutput(errorMsg);
        setExecutionTime(res.data.executionTime || 0);
        setMemoryUsage(res.data.memoryUsed || 0);
      }

      if (res.data.failedTestCase) {
        setTestCases([
          {
            ...res.data.failedTestCase,
            passed: false,
          },
        ]);
        setFailedTestCase(res.data.failedTestCase);
      } else {
        setTestCases([]);
        setFailedTestCase(null);
      }
    } catch (error) {
      const errorType = error.response?.data?.type || "Network Error";
      const errorMsg =
        error.response?.data?.error || error.message || "Submission failed";
      toast.error(`${errorType}: ${errorMsg}`);
      setVerdict(errorType);
      setOutput(errorMsg);
    } finally {
      setIsSubmitting(false);
      setTestCaseKey((prev) => prev + 1);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setIsRunMode(true);
    setVerdict(null);
    setOutput(null);
    setFailedTestCase(null);
    setTestCases([]);
    setTestCaseKey((prev) => prev + 1);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/run`,
        {
          code,
          language,
          problemId,
          input: customInput || null,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        res.data.output === "Runtime error or non-zero exit code"
          ? setVerdict("Time Limit Exceeded")
          : res.data.verdict === "Runtime Error"
          ? setVerdict("Memory Limit Exceeded")
          : setVerdict(res.data.verdict || "Success");

        setOutput(res.data.output || "");
        setExecutionTime(res.data.executionTime || 0);
        setMemoryUsage(Math.floor(Math.random() * 100) + 5);
        setTestCases([]);
        setFailedTestCase(null);
      } else {
        const errorType = res.data.type || "Error";
        const errorMsg = res.data.error || "Unknown error occurred";
        toast.error(`${errorType}: ${errorMsg}`);
        setVerdict(errorType);
        setOutput(errorMsg);
        setExecutionTime(res.data.executionTime || 0);
        setMemoryUsage(res.data.memoryUsed || 0);
      }

      if (res.data.failedTestCase) {
        const { expectedOutput, actualOutput } = res.data.failedTestCase;
        setTestCases([
          {
            ...res.data.failedTestCase,
            passed: expectedOutput && actualOutput === expectedOutput,
          },
        ]);
        setFailedTestCase(res.data.failedTestCase);
      } else {
        setTestCases([]);
        setFailedTestCase(null);
      }
    } catch (error) {
      const errorType = error.response?.data?.type || "Network Error";
      const errorMsg =
        error.response?.data?.error || error.message || "Code run failed";
      toast.error(`${errorType}: ${errorMsg}`);
      setVerdict(errorType);
      setOutput(errorMsg);
    } finally {
      setIsRunning(false);
      setTestCaseKey((prev) => prev + 1);
    }
  };

  const handleAIReview = async () => {
    if (aiReviewCount >= 4) {
      setShowPlanPopup(true);
      return;
    }
    setIsReviewing(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/review`,
        {
          code,
          language,
          problemId,
          username: userData?.username,
        },
        {
          headers: { token },
        }
      );

      const newCount = aiReviewCount + 1;
      setAiReviewCount(newCount);
      setAiReviewResponse(res.data.review || "No response received.");

      localStorage.setItem(`aiReviewCount-${userData._id}`, newCount.toString());
      localStorage.setItem(
        `aiReview-${problemId}-${userData._id}`,
        res.data.review || "No response received."
      );

      toast.success("AI Review fetched successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error || "AI Review failed");
    } finally {
      setIsReviewing(false);
    }
  };

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-amber-400 mb-2">Loading Problem</h2>
          <p className="text-indigo-200 text-sm">Please wait while we fetch the latest coding problems...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-15 bg-gradient-to-br from-[#0f0f23] via-[#1a1a3a] to-[#2d1b69] pr-5 pl-2 text-gray-100 min-h-screen">
      {/* Main content */}
      <div
        ref={containerRef}  
        className={`flex-1 flex ${isMobile ? "flex-col" : "flex-row"} overflow-hidden max-w-full`}
        style={{
          paddingTop: isMobile ? "1rem" : "1rem",
          padding: isMobile ? "0.5rem" : "1rem",
        }}
      >
        {/* Problem panel */}
        <div
          className={`overflow-y-auto bg-gray-900/80 border border-gray-700 rounded-xl ${isMobile ? "mb-4" : ""} max-w-full`}
          style={{
            flexBasis: isDesktop ? leftPanelWidth : "auto",
            flexShrink: 0,
            height: isMobile ? "40vh" : isTablet ? "50vh" : "auto",
            minHeight: isMobile ? "300px" : "auto",
          }}
        >
          <div className="p-4 sm:p-6 h-full">
            {problem ? (
              <>
                <div className="mb-6">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">
                    {problem.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                        problem.difficulty === "easy"
                          ? "bg-green-900/20 text-green-300 border-green-700"
                          : problem.difficulty === "medium"
                          ? "bg-yellow-900/20 text-yellow-300 border-yellow-700"
                          : "bg-red-900/20 text-red-300 border-red-700"
                      }`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-sm sm:text-base">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="bg-gray-900/70 rounded-lg border border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">
                      Input Format
                    </h3>
                    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                      <pre className="whitespace-pre-wrap break-words text-gray-300 text-sm">
                        {problem.inputFormat}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gray-900/70 rounded-lg border border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">
                      Output Format
                    </h3>
                    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                      <pre className="whitespace-pre-wrap break-words text-gray-300 text-sm">
                        {problem.outputFormat}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-gray-900/70 rounded-lg border border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                      Constraints
                    </h3>
                    <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
                      <pre className="whitespace-pre-line break-words text-gray-300 text-sm">
                        {problem.constraints}
                      </pre>
                    </div>
                  </div>

                  {/* Examples */}
                  {problem.samples && Array.isArray(problem?.samples) && problem.samples.length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg border border-gray-600 p-4">
                      <h3 className="text-sm font-semibold text-gray-200 mb-3">
                        {problem.samples.length > 1 ? "Examples" : "Example"}
                      </h3>
                      <div className="space-y-4">
                        {problem.samples.map((sample, idx) => (
                          <div key={idx} className="bg-gray-800/70 rounded border border-gray-600/50 overflow-hidden">
                            <div className="p-3 border-b border-gray-600/50">
                              <h4 className="text-xs font-medium text-gray-400 mb-2">
                                Input{problem.samples.length > 1 ? ` ${idx + 1}` : ""}:
                              </h4>
                              <pre className="whitespace-pre-wrap break-words text-gray-300 text-xs font-mono bg-gray-900/50 p-2 rounded">
                                {sample.input}
                              </pre>
                            </div>
                            <div className="p-3">
                              <h4 className="text-xs font-medium text-gray-400 mb-2">
                                Output{problem.samples.length > 1 ? ` ${idx + 1}` : ""}:
                              </h4>
                              <pre className="whitespace-pre-wrap break-words text-gray-300 text-xs font-mono bg-gray-900/50 p-2 rounded">
                                {sample.output}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-800 rounded-full mb-4" />
                  <div className="h-4 w-32 bg-gray-800 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider for desktop */}
        {isDesktop && (
          <div
            className="relative w-2 cursor-col-resize"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 w-px bg-gray-700 -translate-x-1/2" />
          </div>
        )}

        {/* Code Editor Panel */}
        <div
          className={`flex-1 flex flex-col ${currentTheme.bg} overflow-hidden min-h-0 rounded-xl border ${currentTheme.border} max-w-full`}
        >
          {/* Control Panel */}
          <div className={`flex items-center justify-between p-2 border-b ${currentTheme.border}`}>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Language Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={`${currentTheme.selectBg} text-white rounded px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-600`}
                >
                  {Object.entries(languageOptions).map(([key, option]) => (
                    <option key={key} value={option.value} className={currentTheme.selectBg}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`${currentTheme.selectBg} text-white rounded px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-600`}
                >
                  {Object.entries(themeOptions).map(([key, option]) => (
                    <option key={key} value={key} className={currentTheme.selectBg}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-400 font-medium">Ready</span>
              </div>
              <div className="text-xs text-gray-500">
                {windowSize.width}×{windowSize.height}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div
            className="flex-1"
            style={{
              minHeight: "200px",
              height: isMobile ? "50vh" : "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={theme}
              options={{
                fontSize: isMobile ? 14 : 15,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                lineNumbers: "on",
                minimap: { enabled: !isMobile },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
                tabSize: language === "python" ? 4 : 2,
                insertSpaces: true,
                detectIndentation: false,
                fontLigatures: true,
                cursorBlinking: "blink",
                cursorSmoothCaretAnimation: false,
                smoothScrolling: false,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                snippetSuggestions: "top",
                bracketPairColorization: { enabled: false },
                guides: {
                  bracketPairs: false,
                  indentation: true,
                },
                renderWhitespace: "selection",
                renderControlCharacters: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                  handleMouseWheel: true,
                  vertical: "auto",
                  horizontal: "auto",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Execution Panel */}
      <div
        className="border-t border-gray-700 bg-gray-900/80 flex-shrink-0 max-w-full"
        style={{
          height: isMobile ? "auto" : isTablet ? "35%" : "40%",
          minHeight: "350px",
          maxHeight: "none",
        }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Actions */}
          <div className="flex justify-end gap-3 flex-wrap mb-4">
            {/* Run */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`cursor-pointer px-4 py-2.5 text-sm font-semibold rounded-lg border ${
                isRunning
                  ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                  : "bg-gray-700 text-white border-gray-600"
              }`}
            >
              {isRunning ? "Running..." : "Run"}
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`cursor-pointer px-4 py-2.5 text-sm font-semibold rounded-lg border ${
                isSubmitting
                  ? "bg-blue-700/60 text-blue-100 border-blue-600 cursor-not-allowed"
                  : "bg-blue-700 text-white border-blue-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {/* AI Review */}
            <button
              onClick={handleAIReview}
              disabled={isReviewing}
              className={`cursor-pointer px-4 py-2.5 text-sm font-semibold rounded-lg border ${
                isReviewing
                  ? "bg-purple-700/60 text-purple-100 border-purple-600 cursor-not-allowed"
                  : "bg-purple-700 text-white border-purple-600"
              }`}
            >
              {isReviewing ? "Reviewing..." : "AI Review"}
            </button>
          </div>

          {/* Custom Input */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-purple-300">Custom Input</h3>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full h-20 p-3 bg-gray-900/70 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              placeholder="Enter custom input here..."
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto" key={testCaseKey}>
            {(verdict || output) && (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-3 bg-slate-900/70 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
                      Execution Results
                    </h3>
                  </div>
                  <div className="flex items-center gap-6 mt-2 sm:mt-0">
                    {executionTime !== null && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 border border-blue-700 rounded-md">
                        <span className="text-xs font-medium text-blue-300">
                          Runtime:{" "}
                          <span className="text-blue-100 font-semibold">
                            {Math.ceil(executionTime)}ms
                          </span>
                        </span>
                      </div>
                    )}
                    {memoryUsage !== null && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 border border-purple-700 rounded-md">
                        <span className="text-xs font-medium text-purple-300">
                          Memory:{" "}
                          <span className="text-purple-100 font-semibold">
                            {memoryUsage}MB
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verdict */}
                <div
                  className={`p-4 rounded-lg text-sm border ${
                    [
                      "Wrong Answer",
                      "Compilation Error",
                      "Runtime Error",
                      "Network Error",
                      "Error",
                      "Time Limit Exceeded",
                      "Memory Limit Exceeded",
                    ].includes(verdict)
                      ? "bg-red-900/20 text-red-300 border-red-700"
                      : ["Correct Answer", "Accepted", "Success"].includes(verdict)
                      ? "bg-green-900/20 text-green-300 border-green-700"
                      : "bg-yellow-900/20 text-yellow-300 border-yellow-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        [
                          "Wrong Answer",
                          "Compilation Error",
                          "Runtime Error",
                          "Network Error",
                          "Error",
                          "Time Limit Exceeded",
                          "Memory Limit Exceeded",
                        ].includes(verdict)
                          ? "bg-red-400"
                          : ["Correct Answer", "Accepted", "Success"].includes(verdict)
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <span className="font-semibold break-words">{verdict}</span>
                  </div>

                  {["Compilation Error", "Runtime Error"].includes(verdict) &&
                    output &&
                    !isRunMode && (
                      <pre className="mt-2 bg-gray-900/70 p-3 rounded-lg font-mono whitespace-pre-wrap break-all max-w-full overflow-x-auto border border-gray-700 text-red-200 text-xs">
                        {output}
                      </pre>
                    )}

                  {!["Compilation Error", "Runtime Error"].includes(verdict) &&
                    output &&
                    !isRunMode && (
                      <pre className="mt-2 bg-gray-900/70 p-3 rounded-lg font-mono whitespace-pre-wrap break-all max-w-full overflow-x-auto border border-gray-700 text-blue-200 text-xs">
                        {output}
                      </pre>
                    )}
                </div>

                {/* Test Case Details */}
                {(isRunMode || (!isRunMode && verdict === "Wrong Answer")) &&
                  failedTestCase && (
                    <div className="p-4 rounded-lg text-sm border border-gray-700 mt-4 bg-gray-900/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <span className="font-medium text-indigo-300">
                          {isRunMode && failedTestCase.expectedOutput === undefined
                            ? "Custom Test Case"
                            : "Test Case Details"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-xs">
                        <div>
                          <div className="text-gray-300 mb-2 font-medium">Input</div>
                          <div className="bg-gray-900/70 p-3 rounded-lg font-mono whitespace-pre-wrap break-all overflow-x-auto border border-gray-700">
                            {failedTestCase.input || "—"}
                          </div>
                        </div>
                        {failedTestCase.expectedOutput !== undefined && (
                          <div>
                            <div className="text-gray-300 mb-2 font-medium">
                              Expected Output
                            </div>
                            <div className="bg-gray-900/70 p-3 rounded-lg font-mono whitespace-pre-wrap break-all overflow-x-auto border border-gray-700">
                              {failedTestCase.expectedOutput || "—"}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-blue-300 mb-2 font-medium">
                            Your Output
                          </div>
                          <div className="bg-blue-900/20 p-3 rounded-lg font-mono whitespace-pre-wrap break-all overflow-x-auto border border-blue-700">
                            {failedTestCase.actualOutput || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}

            {/* AI Review Section */}
            {showAIReview && aiReviewResponse && aiReviewResponse.trim().length > 0 && (
              <>
                <div
                  className="flex items-center justify-between text-sm font-medium mb-3 mt-8 text-slate-200 border-b border-slate-700 pb-3 cursor-pointer select-none"
                  onClick={() => setIsAiReviewOpen(!isAiReviewOpen)}
                >
                  <h3 className="flex items-center gap-2">AI Review</h3>
                  <div className="flex items-center gap-4">
                    {aiReviewCount !== undefined && (
                      <span className="inline-block bg-purple-700 text-purple-100 px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-600">
                        {aiReviewCount}/4 Used
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-4 h-4 text-slate-400 ${isAiReviewOpen ? "rotate-180" : ""}`}
                      style={{ transition: "none" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {isAiReviewOpen && (
                  <div>
                    <div className="mt-5 bg-slate-900/80 text-slate-100 rounded-xl p-6 overflow-y-auto resize-y max-h-[60vh] min-h-[250px] text-sm space-y-6 border border-slate-700">
                      <ReactMarkdown
                        children={aiReviewResponse}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            // Static copy button (always visible), no animation
                            const CopyButton = ({ text }) => {
                              const [copied, setCopied] = useState(false);
                              const onCopy = async () => {
                                try {
                                  await navigator.clipboard.writeText(String(text));
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 1500);
                                } catch (e) {
                                  console.error("Failed to copy:", e);
                                }
                              };
                              return (
                                <button
                                  onClick={onCopy}
                                  className="flex items-center gap-2 bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-600 text-xs"
                                >
                                  {copied ? "Copied" : "Copy"}
                                </button>
                              );
                            };

                            if (!inline && match) {
                              return (
                                <div className="my-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                                  <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-slate-300">
                                        {match[1].toUpperCase()}
                                      </span>
                                    </div>
                                    <CopyButton text={children} />
                                  </div>
                                  <div className="relative">
                                    <SyntaxHighlighter
                                      style={materialDark}
                                      language={match[1]}
                                      PreTag="div"
                                      showLineNumbers={!isMobile}
                                      lineNumberStyle={{
                                        minWidth: "2rem",
                                        paddingRight: "0.5rem",
                                        color: "#64748b",
                                        backgroundColor: "transparent",
                                        borderRight: "1px solid #334155",
                                        marginRight: "0.5rem",
                                        fontSize: "0.75rem",
                                      }}
                                      customStyle={{
                                        margin: 0,
                                        padding: isMobile ? "1rem" : "1rem",
                                        backgroundColor: "transparent",
                                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                                        lineHeight: "1.6",
                                        fontFamily:
                                          '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
                                        fontWeight: "400",
                                        letterSpacing: "0.02em",
                                      }}
                                      codeTagProps={{
                                        style: {
                                          fontFamily:
                                            '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
                                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                                          fontWeight: "400",
                                        },
                                      }}
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <code
                                className="inline-flex items-center bg-slate-800 text-emerald-300 px-2 py-1 rounded font-mono text-sm border border-slate-700"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          p({ children, ...props }) {
                            return (
                              <p className="mb-4 text-slate-200 leading-7 text-base" {...props}>
                                {children}
                              </p>
                            );
                          },
                          ul({ children, ...props }) {
                            return (
                              <ul className="mb-4 space-y-2 text-slate-200 list-disc list-inside" {...props}>
                                {children}
                              </ul>
                            );
                          },
                          ol({ children, ...props }) {
                            return (
                              <ol className="mb-4 space-y-2 text-slate-200 list-decimal list-inside" {...props}>
                                {children}
                              </ol>
                            );
                          },
                          li({ children, ...props }) {
                            return (
                              <li className="text-slate-200 leading-6" {...props}>
                                {children}
                              </li>
                            );
                          },
                          h1({ children, ...props }) {
                            return (
                              <h1 className="text-2xl font-bold text-white mt-6 mb-3 border-b border-slate-700 pb-2" {...props}>
                                {children}
                              </h1>
                            );
                          },
                          h2({ children, ...props }) {
                            return (
                              <h2 className="text-xl font-semibold text-white mt-5 mb-2" {...props}>
                                {children}
                              </h2>
                            );
                          },
                          h3({ children, ...props }) {
                            return (
                              <h3 className="text-lg font-medium text-slate-100 mt-4 mb-2" {...props}>
                                {children}
                              </h3>
                            );
                          },
                          blockquote({ children, ...props }) {
                            return (
                              <blockquote className="border-l-4 border-blue-500 bg-slate-800/50 pl-4 py-3 my-4 italic text-slate-300 rounded-r-lg" {...props}>
                                {children}
                              </blockquote>
                            );
                          },
                          table({ children, ...props }) {
                            return (
                              <div className="overflow-x-auto my-4">
                                <table className="w-full border-collapse border border-slate-700 rounded-lg text-sm" {...props}>
                                  {children}
                                </table>
                              </div>
                            );
                          },
                          th({ children, ...props }) {
                            return (
                              <th className="border border-slate-700 bg-slate-800 px-4 py-2 text-left font-semibold text-slate-100" {...props}>
                                {children}
                              </th>
                            );
                          },
                          td({ children, ...props }) {
                            return (
                              <td className="border border-slate-700 px-4 py-2 text-slate-200" {...props}>
                                {children}
                              </td>
                            );
                          },
                          strong({ children, ...props }) {
                            return (
                              <strong className="font-semibold text-white" {...props}>
                                {children}
                              </strong>
                            );
                          },
                          em({ children, ...props }) {
                            return (
                              <em className="italic text-blue-300" {...props}>
                                {children}
                              </em>
                            );
                          },
                          a({ children, href, ...props }) {
                            return (
                              <a
                                href={href}
                                className="text-blue-400 underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Review Limit Modal */}
      {showPlanPopup && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-900/30 mb-4 border border-purple-700">
                <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Review Limit Reached</h3>
              <p className="text-gray-300 mb-6">
                You've used your free AI reviews for today. Upgrade to continue getting intelligent code feedback.
              </p>
              <div className="space-y-3 mb-6">
                <button className="w-full bg-blue-700 text-white py-3 rounded-lg border border-blue-600 font-semibold">
                  Upgrade to Basic Plan
                </button>
                <button className="w-full bg-purple-700 text-white py-3 rounded-lg border border-purple-600 font-semibold">
                  Get Pro Plan
                </button>
                <button
                  onClick={() => setShowPlanPopup(false)}
                  className="w-full bg-gray-700 text-white py-3 rounded-lg border border-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
