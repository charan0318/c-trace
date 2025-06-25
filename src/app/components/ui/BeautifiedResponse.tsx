
import React from "react";

interface BeautifiedResponseProps {
  text: string;
}

const BeautifiedResponse: React.FC<BeautifiedResponseProps> = ({ text }) => {
  const lines = text.split("\n").filter(l => l.trim());

  const isHeader = (line: string) => line.match(/^(###|##|#|\*\*|Key Details|Summary|Detected Functions|Contract Details|Functions Available)/i);
  const isKeyValue = (line: string) => line.includes(": ") && !line.startsWith("http") && !line.startsWith("```");
  const isFunction = (line: string) => /[a-z]+\([a-zA-Z0-9_,\s]*\)/.test(line) && !line.startsWith("http");
  const isCodeBlock = (line: string) => line.startsWith("```") || line.includes("contract") || line.includes("function");
  const isBulletPoint = (line: string) => line.match(/^\s*[-*+•]\s/);
  const isNumberedList = (line: string) => line.match(/^\s*\d+\.\s/);

  return (
    <div className="animate-fade-in transition-opacity duration-300">
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10 backdrop-blur-sm space-y-3 text-white text-sm max-w-none">
        {lines.map((line, idx) => {
          // Headers
          if (isHeader(line)) {
            const cleanHeader = line.replace(/^(###|##|#|\*\*|\- \*\*)/g, '').replace(/\*\*$/g, '').trim();
            return (
              <h4 key={idx} className="text-chiliz-primary font-bold text-lg mt-6 mb-3 first:mt-0 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-chiliz-primary to-red-600 rounded-full"></div>
                {cleanHeader}
              </h4>
            );
          }

          // Code blocks
          if (isCodeBlock(line)) {
            return (
              <div key={idx} className="bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <code className="text-green-400">{line.replace(/```/g, '').trim()}</code>
              </div>
            );
          }

          // Functions
          if (isFunction(line)) {
            return (
              <div key={idx} className="flex items-center gap-2 my-2">
                <div className="w-2 h-2 bg-chiliz-primary rounded-full"></div>
                <code className="inline-block bg-chiliz-primary/20 text-chiliz-primary rounded-lg px-3 py-2 text-sm font-mono border border-chiliz-primary/30">
                  {line.trim()}
                </code>
              </div>
            );
          }

          // Key-value pairs
          if (isKeyValue(line)) {
            const [label, ...rest] = line.split(": ");
            const cleanLabel = label.replace(/^\s*[-*+•]\s*|\*\*/g, '').trim();
            return (
              <div key={idx} className="flex flex-wrap items-start gap-2 py-1">
                <span className="text-white/70 font-semibold min-w-fit bg-gray-800/40 px-2 py-1 rounded">
                  {cleanLabel}:
                </span>
                <span className="text-white/90 flex-1">{rest.join(": ")}</span>
              </div>
            );
          }

          // Bullet points
          if (isBulletPoint(line)) {
            const cleanLine = line.replace(/^\s*[-*+•]\s*/, '').trim();
            return (
              <div key={idx} className="flex items-start gap-3 py-1">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/90">{cleanLine}</span>
              </div>
            );
          }

          // Numbered lists
          if (isNumberedList(line)) {
            const match = line.match(/^\s*(\d+)\.\s*(.+)/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-3 py-1">
                  <span className="bg-chiliz-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0">
                    {match[1]}
                  </span>
                  <span className="text-white/90">{match[2]}</span>
                </div>
              );
            }
          }

          // Regular text
          if (line.trim()) {
            return (
              <p key={idx} className="text-white/80 leading-relaxed">
                {line}
              </p>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default BeautifiedResponse;
