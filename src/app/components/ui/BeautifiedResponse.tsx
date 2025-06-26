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
  const isUltraShort = contentLength < 50 && lineCount <= 1;
  const isVeryShort = contentLength < 100 && lineCount <= 2;
  const isShortContent = contentLength < 200 && lineCount <= 3;
  const isMediumContent = contentLength < 500 && lineCount <= 6;

  const dynamicPadding = isUltraShort ? "p-2" : isVeryShort ? "p-3" : isShortContent ? "p-3" : isMediumContent ? "p-4" : "p-6";
  const dynamicSpacing = isUltraShort ? "space-y-0.5" : isVeryShort ? "space-y-1" : isShortContent ? "space-y-1.5" : isMediumContent ? "space-y-2" : "space-y-3";
  const dynamicRadius = isUltraShort ? "rounded-lg" : isVeryShort ? "rounded-xl" : isShortContent ? "rounded-xl" : "rounded-2xl";
  const dynamicTextSize = isUltraShort ? "text-xs" : isVeryShort ? "text-sm" : "text-sm md:text-base";

  return (
    <div className="animate-fade-in transition-opacity duration-300">
      <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 ${dynamicPadding} ${dynamicRadius} border border-white/10 backdrop-blur-sm overflow-x-auto`}>
        <div className={`${dynamicSpacing}`}>
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            if (isHeader(trimmedLine)) {
              const headerSize = isUltraShort || isVeryShort ? "text-sm" : "text-base";
              const headerMargin = isUltraShort ? "mb-1" : isVeryShort ? "mb-1.5" : "mb-2";
              return (
                <div key={index} className={`font-bold text-chiliz-primary ${headerSize} ${headerMargin}`}>
                  {trimmedLine.replace(/^#+\s*|\*\*/g, '')}
                </div>
              );
            }

            if (isKeyValue(trimmedLine)) {
              const [key, ...valueParts] = trimmedLine.split(": ");
              const value = valueParts.join(": ");
              const keyValueSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const keyValueGap = isUltraShort ? "gap-1" : "gap-1 sm:gap-2";
              return (
                <div key={index} className={`flex flex-col sm:flex-row ${keyValueGap} ${keyValueSize}`}>
                  <span className="font-medium text-white/90 min-w-fit">{key}:</span>
                  <span className="text-white/70 break-all">{value}</span>
                </div>
              );
            }

            if (isFunction(trimmedLine)) {
              const functionSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const functionPadding = isUltraShort ? "px-1.5 py-0.5" : "px-2 py-1";
              return (
                <div key={index} className={`font-mono ${functionSize} bg-gray-800/60 ${functionPadding} rounded border-l-2 border-chiliz-primary/50 text-chiliz-primary`}>
                  {trimmedLine}
                </div>
              );
            }

            if (isCodeBlock(trimmedLine)) {
              const codeSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const codePadding = isUltraShort ? "px-2 py-1" : "px-3 py-2";
              return (
                <div key={index} className={`font-mono ${codeSize} bg-gray-800/80 ${codePadding} rounded-lg border border-white/5 text-green-400`}>
                  {trimmedLine.replace(/```/g, '')}
                </div>
              );
            }

            if (isBulletPoint(trimmedLine)) {
              const bulletSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const bulletGap = isUltraShort ? "gap-1.5" : "gap-2";
              return (
                <div key={index} className={`flex items-start ${bulletGap} ${bulletSize} text-white/80`}>
                  <span className="text-chiliz-primary mt-0.5">•</span>
                  <span>{trimmedLine.replace(/^\s*[-*+•]\s*/, '')}</span>
                </div>
              );
            }

            if (isNumberedList(trimmedLine)) {
              const listSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const listGap = isUltraShort ? "gap-1.5" : "gap-2";
              return (
                <div key={index} className={`flex items-start ${listGap} ${listSize} text-white/80`}>
                  <span className="text-chiliz-primary font-medium">{trimmedLine.match(/^\s*(\d+\.)/)?.[1]}</span>
                  <span>{trimmedLine.replace(/^\s*\d+\.\s*/, '')}</span>
                </div>
              );
            }

            // Regular text with smart sizing
            return (
              <div key={index} className={`${dynamicTextSize} text-white/80 leading-relaxed`}>
                {trimmedLine}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BeautifiedResponse;
```");
  const isFunction = (line: string) => /[a-z]+\([a-zA-Z0-9_,\s]*\)/.test(line) && !line.startsWith("http");
  const isCodeBlock = (line: string) => line.startsWith("```") || line.includes("contract") || line.includes("function");
  const isBulletPoint = (line: string) => line.match(/^\s*[-*+•]\s/);
  const isNumberedList = (line: string) => line.match(/^\s*\d+\.\s/);

  // Calculate dynamic padding based on content
  const contentLength = text.length;
  const lineCount = lines.length;
  const isUltraShort = contentLength < 50 && lineCount <= 1;
  const isVeryShort = contentLength < 100 && lineCount <= 2;
  const isShortContent = contentLength < 200 && lineCount <= 3;
  const isMediumContent = contentLength < 500 && lineCount <= 6;

  const dynamicPadding = isUltraShort ? "p-2" : isVeryShort ? "p-3" : isShortContent ? "p-3" : isMediumContent ? "p-4" : "p-6";
  const dynamicSpacing = isUltraShort ? "space-y-0.5" : isVeryShort ? "space-y-1" : isShortContent ? "space-y-1.5" : isMediumContent ? "space-y-2" : "space-y-3";
  const dynamicRadius = isUltraShort ? "rounded-lg" : isVeryShort ? "rounded-xl" : isShortContent ? "rounded-xl" : "rounded-2xl";
  const dynamicTextSize = isUltraShort ? "text-xs" : isVeryShort ? "text-sm" : "text-sm md:text-base";

  return (
    <div className="animate-fade-in transition-opacity duration-300">
      <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 ${dynamicPadding} ${dynamicRadius} border border-white/10 backdrop-blur-sm overflow-x-auto`}>
        <div className={`${dynamicSpacing}`}>
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            if (isHeader(trimmedLine)) {
              const headerSize = isUltraShort || isVeryShort ? "text-sm" : "text-base";
              const headerMargin = isUltraShort ? "mb-1" : isVeryShort ? "mb-1.5" : "mb-2";
              return (
                <div key={index} className={`font-bold text-chiliz-primary ${headerSize} ${headerMargin}`}>
                  {trimmedLine.replace(/^#+\s*|\*\*/g, '')}
                </div>
              );
            }

            if (isKeyValue(trimmedLine)) {
              const [key, ...valueParts] = trimmedLine.split(": ");
              const value = valueParts.join(": ");
              const keyValueSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const keyValueGap = isUltraShort ? "gap-1" : "gap-1 sm:gap-2";
              return (
                <div key={index} className={`flex flex-col sm:flex-row ${keyValueGap} ${keyValueSize}`}>
                  <span className="font-medium text-white/90 min-w-fit">{key}:</span>
                  <span className="text-white/70 break-all">{value}</span>
                </div>
              );
            }

            if (isFunction(trimmedLine)) {
              const functionSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const functionPadding = isUltraShort ? "px-1.5 py-0.5" : "px-2 py-1";
              return (
                <div key={index} className={`font-mono ${functionSize} bg-gray-800/60 ${functionPadding} rounded border-l-2 border-chiliz-primary/50 text-chiliz-primary`}>
                  {trimmedLine}
                </div>
              );
            }

            if (isCodeBlock(trimmedLine)) {
              const codeSize = isUltraShort || isVeryShort ? "text-xs" : "text-sm";
              const codePadding = isUltraShort ? "px-2 py-1" : "px-3 py-2";
              return (
                <div key={index} className={`font-mono ${codeSize} bg-gray-800/80 ${codePadding} rounded-lg border border-white/5 text-green-400`}>
                  {trimmedLine.replace(/