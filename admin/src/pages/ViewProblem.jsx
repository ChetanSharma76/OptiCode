import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { FiTag, FiZap, FiList, FiKey, FiFileText, FiCheckCircle, FiCopy } from 'react-icons/fi';

const ViewProblem = () => {
  const { id: problemId } = useParams();
  const { problems } = useContext(AdminContext);

  const problem = problems.find(p => p._id === problemId);

  // Support both 'sampleTests' and 'samples'
  const sampleTests = problem?.sampleTests?.length
    ? problem.sampleTests
    : problem?.samples?.length
      ? problem.samples
      : [];

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07034d] px-4">
        <p className="text-xl text-red-500">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07034d] px-4 py-20 flex items-center justify-center">
      <div
        className="w-full max-w-3xl rounded-3xl shadow-2xl p-0 sm:p-0 overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(80,70,255,0.10) 100%)",
          backdropFilter: "blur(18px)",
          border: "1.5px solid rgba(255,255,255,0.16)",
        }}
      >
        {/* Header */}
        <div className="pt-12 pb-10 px-6 sm:px-10 bg-gradient-to-br from-indigo-700/80 to-indigo-900/60">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white drop-shadow-lg tracking-tight mb-4">
            {problem.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <DifficultyPill difficulty={problem.difficulty} />
            <div className="flex flex-wrap gap-1">
              {problem.tags?.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-200/30 text-indigo-100 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 animate-pulse" />

        {/* Content */}
        <div className="p-6 sm:p-12 space-y-12 bg-white/10 backdrop-blur-lg">
          <DetailSection
            title="Statement"
            icon={<FiFileText className="text-indigo-400" />}
            content={problem.description}
          />

          <SectionDivider />

          <div className="grid md:grid-cols-2 gap-12">
            <DetailSection
              title="Input Format"
              icon={<FiList className="text-pink-400" />}
              content={problem.inputFormat}
            />
            <DetailSection
              title="Output Format"
              icon={<FiCheckCircle className="text-emerald-400" />}
              content={problem.outputFormat}
            />
          </div>

          <SectionDivider />

          <DetailSection
            title="Constraints"
            icon={<FiKey className="text-yellow-400" />}
            content={problem.constraints}
          />

          {/* Sample Test Cases */}
          {sampleTests.length > 0 && (
            <>
              <SectionDivider />
              <div className="mt-10">
                <SectionHeader
                  icon={<FiZap className="text-pink-400" />}
                  title="Sample Test Cases"
                />
                <div className="space-y-8 mt-4">
                  {sampleTests.map((test, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-100/20 dark:bg-indigo-900/30 rounded-xl px-4 py-6 shadow-inner border border-indigo-200/30"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-indigo-200">Input</span>
                            <button
                              title="Copy input"
                              onClick={() => copyToClipboard(test.input)}
                              className="p-1 rounded hover:bg-indigo-200/40 transition"
                            >
                              <FiCopy size={16} className="text-indigo-200" />
                            </button>
                          </div>
                          <pre className="whitespace-pre-wrap break-words bg-white/10 dark:bg-indigo-950/40 mt-1 p-3 rounded-md text-indigo-100 text-sm sm:text-base font-mono">
                            {test.input}
                          </pre>
                        </div>
                        <div className="flex-1 mt-4 md:mt-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-pink-200">Output</span>
                            <button
                              title="Copy output"
                              onClick={() => copyToClipboard(test.output)}
                              className="p-1 rounded hover:bg-pink-200/40 transition"
                            >
                              <FiCopy size={16} className="text-pink-200" />
                            </button>
                          </div>
                          <pre className="whitespace-pre-wrap break-words bg-white/10 dark:bg-indigo-950/40 mt-1 p-3 rounded-md text-pink-100 text-sm sm:text-base font-mono">
                            {test.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {problem.tags?.length > 0 && (
            <>
              <SectionDivider />
              <div className="mt-10">
                <SectionHeader icon={<FiTag className="text-indigo-400" />} title="Tags" />
                <div className="flex flex-wrap gap-3 mt-4">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 text-white px-4 py-2 rounded-full text-xs font-semibold shadow hover:scale-105 transition-transform cursor-pointer"
                      title={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Difficulty Pill
const DifficultyPill = ({ difficulty }) => {
  let color = "bg-gray-300 text-gray-800";
  if (difficulty === "easy") color = "bg-emerald-400 text-white";
  if (difficulty === "medium") color = "bg-amber-400 text-white";
  if (difficulty === "hard") color = "bg-rose-400 text-white";

  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow ${color}`}
    >
      {difficulty}
    </span>
  );
};

// Section Header with Icon
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    {icon}
    <h2 className="text-2xl font-bold text-white">{title}</h2>
  </div>
);

// Section Divider (animated gradient)
const SectionDivider = () => (
  <div className="w-full h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 rounded-full opacity-60 animate-pulse my-8" />
);

// Detail Section
const DetailSection = ({ title, content, icon }) => (
  <div className="mt-6 mb-6 pt-4 pb-4">
    <SectionHeader icon={icon} title={title} />
    <p className="pl-2 whitespace-pre-wrap break-words text-indigo-100 text-lg">
      {content}
    </p>
  </div>
);

export default ViewProblem;
