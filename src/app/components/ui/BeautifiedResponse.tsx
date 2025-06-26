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

  // Calculate dynamic padding based on content
  const contentLength = text.length;
  const lineCount = lines.length;
  const isShortContent = contentLength < 200 && lineCount <= 3;
  const isMediumContent = contentLength < 500 && lineCount <= 6;
  
  const dynamicPadding = isShortContent ? "p-3" : isMediumContent ? "p-4" : "p-6";
  const dynamicSpacing = isShortContent ? "space-y-1.5" : isMediumContent ? "space-y-2" : "space-y-3";
  const dynamicRadius = isShortContent ? "rounded-xl" : "rounded-2xl";

  return (
    <div className="animate-fade-in transition-opacity duration-300">
      <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 ${dynamicPadding} ${dynamicRadius} border border-white/10 backdrop-blur-sm ${dynamicSpacing} text-white text-sm max-w-none`}>
        {lines.map((line, idx) => {
          // Headers
          if (isHeader(line)) {
            const cleanHeader = line.replace(/^(###|##|#|\*\*|\- \*\*)/g, '').replace(/\*\*$/g, '').trim();
            const headerMargin = isShortContent ? "mt-2 mb-1" : isMediumContent ? "mt-3 mb-2" : "mt-6 mb-3";
            const headerSize = isShortContent ? "text-base" : "text-lg";
            return (
              <h4 key={idx} className={`text-chiliz-primary font-bold ${headerSize} ${headerMargin} first:mt-0 flex items-center gap-2`}>
                <div className="w-1 h-6 bg-gradient-to-b from-chiliz-primary to-red-600 rounded-full"></div>
                {cleanHeader}
              </h4>
            );
          }

          // Code blocks
          if (isCodeBlock(line)) {
            const codePadding = isShortContent ? "p-2" : "p-3";
            const codeRadius = isShortContent ? "rounded-md" : "rounded-lg";
            return (
              <div key={idx} className={`bg-black/40 border border-white/10 ${codeRadius} ${codePadding} font-mono text-xs overflow-x-auto`}>
                <code className="text-green-400">{line.replace(/```/g, '').trim()}</code>
              </div>
            );
          }

          // Functions
          if (isFunction(line)) {
            const functionSpacing = isShortContent ? "my-1" : "my-2";
            const functionPadding = isShortContent ? "px-2 py-1.5" : "px-3 py-2";
            const functionRadius = isShortContent ? "rounded-md" : "rounded-lg";
            return (
              <div key={idx} className={`flex items-center gap-2 ${functionSpacing}`}>
                <div className="w-2 h-2 bg-chiliz-primary rounded-full"></div>
                <code className={`inline-block bg-chiliz-primary/20 text-chiliz-primary ${functionRadius} ${functionPadding} text-sm font-mono border border-chiliz-primary/30`}>
                  {line.trim()}
                </code>
              </div>
            );
          }

          // Key-value pairs
          if (isKeyValue(line)) {
            const [label, ...rest] = line.split(": ");
            const cleanLabel = label.replace(/^\s*[-*+•]\s*|\*\*/g, '').trim();
            const kvPadding = isShortContent ? "px-1.5 py-0.5" : "px-2 py-1";
            const kvSpacing = isShortContent ? "py-0.5" : "py-1";
            return (
              <div key={idx} className={`flex flex-wrap items-start gap-2 ${kvSpacing}`}>
                <span className={`text-white/70 font-semibold min-w-fit bg-gray-800/40 ${kvPadding} rounded`}>
                  {cleanLabel}:
                </span>
                <span className="text-white/90 flex-1">{rest.join(": ")}</span>
              </div>
            );
          }

          // Bullet points
          if (isBulletPoint(line)) {
            const cleanLine = line.replace(/^\s*[-*+•]\s*/, '').trim();
            const bulletSpacing = isShortContent ? "gap-2 py-0.5" : "gap-3 py-1";
            const bulletSize = isShortContent ? "w-1.5 h-1.5 mt-1.5" : "w-2 h-2 mt-2";
            return (
              <div key={idx} className={`flex items-start ${bulletSpacing}`}>
                <div className={`${bulletSize} bg-red-600 rounded-full flex-shrink-0`}></div>
                <span className="text-white/90">{cleanLine}</span>
              </div>
            );
          }

          // Numbered lists
          if (isNumberedList(line)) {
            const match = line.match(/^\s*(\d+)\.\s*(.+)/);
            if (match) {
              const listSpacing = isShortContent ? "gap-2 py-0.5" : "gap-3 py-1";
              const numberSize = isShortContent ? "w-5 h-5 text-xs" : "w-6 h-6 text-xs";
              return (
                <div key={idx} className={`flex items-start ${listSpacing}`}>
                  <span className={`bg-chiliz-primary text-white rounded-full ${numberSize} flex items-center justify-center font-bold flex-shrink-0`}>
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