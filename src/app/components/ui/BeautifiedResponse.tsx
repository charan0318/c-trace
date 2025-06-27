import React from "react";

'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface BeautifiedResponseProps {
  text: string;
}

const BeautifiedResponse: React.FC<BeautifiedResponseProps> = ({ text }) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lines = text.split("\n").filter(l => l.trim());

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, id]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isHeader = (line: string) => line.match(/^(###|##|#|\*\*|Key Details|Summary|Detected Functions|Contract Details|Functions Available)/i);
  const isKeyValue = (line: string) => line.includes(": ") && !line.startsWith("http") && !line.startsWith("```");
  const isFunction = (line: string) => /[a-z]+\([a-zA-Z0-9_,\s]*\)/.test(line) && !line.startsWith("http");
  const isCodeBlock = (line: string) => line.startsWith("```") || line.includes("contract") || line.includes("function");
  const isBulletPoint = (line: string) => line.match(/^\s*[-*+•]\s/);
  const isNumberedList = (line: string) => line.match(/^\s*\d+\.\s/);
  const isAddress = (line: string) => /0x[a-fA-F0-9]{40}/.test(line);
  const isUrl = (line: string) => line.match(/https?:\/\/[^\s]+/);

  // Calculate dynamic padding based on content
  const contentLength = text.length;
  const lineCount = lines.length;
  const isUltraShort = contentLength < 50 && lineCount <= 1;
  const isVeryShort = contentLength < 100 && lineCount <= 2;
  const isShortContent = contentLength < 200 && lineCount <= 3;
  const isMediumContent = contentLength < 500 && lineCount <= 8;

  const getPadding = () => {
    if (isMobile) {
      if (isUltraShort) return "p-3";
      if (isVeryShort) return "p-3";
      if (isShortContent) return "p-4";
      return "p-4";
    } else {
      if (isUltraShort) return "p-4";
      if (isVeryShort) return "p-5";
      if (isShortContent) return "p-6";
      if (isMediumContent) return "p-6";
      return "p-8";
    }
  };

  const getSpacing = () => {
    if (isMobile) {
      if (isUltraShort || isVeryShort) return "space-y-1";
      if (isShortContent) return "space-y-2";
      return "space-y-2";
    } else {
      if (isUltraShort || isVeryShort) return "space-y-2";
      if (isShortContent) return "space-y-3";
      if (isMediumContent) return "space-y-4";
      return "space-y-4";
    }
  };

  const renderLine = (line: string, index: number) => {
    const trimmedLine = line.trim();
    const copyId = `line-${index}`;
    const isCopied = copiedItems.has(copyId);

    // Long content collapsing for mobile
    const isLongLine = trimmedLine.length > (isMobile ? 80 : 120);
    const isExpanded = expandedSections.has(index);
    const shouldCollapse = isLongLine && isMobile && !isHeader(trimmedLine);

    if (isHeader(trimmedLine)) {
      const cleanHeader = trimmedLine.replace(/^(###|##|#|\*\*)\s*/, '').replace(/\*\*$/, '');
      return (
        <div key={index} className="flex items-start justify-between gap-2 group">
          <h3 className={`font-bold text-chiliz-primary flex-1 ${
            isMobile ? 'text-sm' : 'text-base md:text-lg'
          }`}>
            {cleanHeader}
          </h3>
          <button
            onClick={() => copyToClipboard(cleanHeader, copyId)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
          >
            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      );
    }

    if (isKeyValue(trimmedLine)) {
      const [key, ...valueParts] = trimmedLine.split(': ');
      const value = valueParts.join(': ');
      return (
        <div key={index} className="flex items-start justify-between gap-2 group">
          <div className="flex-1 min-w-0">
            <div className={`flex flex-col ${isMobile ? 'gap-1' : 'sm:flex-row sm:gap-2'}`}>
              <span className={`font-semibold text-white/90 ${isMobile ? 'text-xs' : 'text-sm'} shrink-0`}>
                {key}:
              </span>
              <span className={`text-white/70 break-words ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {shouldCollapse && !isExpanded ? `${value.substring(0, 60)}...` : value}
              </span>
            </div>
            {shouldCollapse && (
              <button
                onClick={() => toggleSection(index)}
                className="text-chiliz-primary text-xs mt-1 hover:text-chiliz-primary/80 transition-colors touch-manipulation"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          <button
            onClick={() => copyToClipboard(value, copyId)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
          >
            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      );
    }

    if (isFunction(trimmedLine)) {
      return (
        <div key={index} className="flex items-start justify-between gap-2 group">
          <code className={`font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded flex-1 break-all ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            {shouldCollapse && !isExpanded ? `${trimmedLine.substring(0, 50)}...` : trimmedLine}
          </code>
          {shouldCollapse && (
            <button
              onClick={() => toggleSection(index)}
              className="text-chiliz-primary text-xs hover:text-chiliz-primary/80 transition-colors touch-manipulation"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(trimmedLine, copyId)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
          >
            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      );
    }

    if (isCodeBlock(trimmedLine)) {
      return (
        <div key={index} className="flex items-start justify-between gap-2 group">
          <pre className={`bg-gray-900/60 p-2 md:p-3 rounded-lg font-mono text-green-300 overflow-x-auto flex-1 ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            <code className="break-words">
              {shouldCollapse && !isExpanded ? `${trimmedLine.substring(0, 60)}...` : trimmedLine}
            </code>
          </pre>
          {shouldCollapse && (
            <button
              onClick={() => toggleSection(index)}
              className="text-chiliz-primary text-xs hover:text-chiliz-primary/80 transition-colors touch-manipulation"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(trimmedLine, copyId)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
          >
            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      );
    }

    if (isAddress(trimmedLine)) {
      const addressMatch = trimmedLine.match(/0x[a-fA-F0-9]{40}/);
      if (addressMatch) {
        const address = addressMatch[0];
        return (
          <div key={index} className="flex items-start justify-between gap-2 group">
            <div className="flex-1 min-w-0">
              <code className={`font-mono text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded break-all ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {isMobile ? `${address.substring(0, 10)}...${address.substring(-8)}` : address}
              </code>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => copyToClipboard(address, copyId)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
              >
                {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => window.open(`/explorer?q=${address}`, '_blank')}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      }
    }

    if (isUrl(trimmedLine)) {
      const urlMatch = trimmedLine.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const url = urlMatch[0];
        return (
          <div key={index} className="flex items-start justify-between gap-2 group">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-400 hover:text-blue-300 underline break-all flex-1 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              {isMobile && url.length > 40 ? `${url.substring(0, 40)}...` : url}
            </a>
            <button
              onClick={() => copyToClipboard(url, copyId)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
            >
              {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        );
      }
    }

    if (isBulletPoint(trimmedLine)) {
      const content = trimmedLine.replace(/^\s*[-*+•]\s/, '');
      return (
        <div key={index} className="flex items-start gap-2 group">
          <span className="text-chiliz-primary mt-1 flex-shrink-0">•</span>
          <span className={`text-white/80 flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {shouldCollapse && !isExpanded ? `${content.substring(0, 60)}...` : content}
          </span>
          {shouldCollapse && (
            <button
              onClick={() => toggleSection(index)}
              className="text-chiliz-primary text-xs hover:text-chiliz-primary/80 transition-colors touch-manipulation"
            >
              {isExpanded ? 'Less' : 'More'}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(content, copyId)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
          >
            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      );
    }

    if (isNumberedList(trimmedLine)) {
      const match = trimmedLine.match(/^\s*(\d+)\.\s(.+)$/);
      if (match) {
        const [, number, content] = match;
        return (
          <div key={index} className="flex items-start gap-2 group">
            <span className="text-chiliz-primary font-semibold flex-shrink-0">{number}.</span>
            <span className={`text-white/80 flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {shouldCollapse && !isExpanded ? `${content.substring(0, 60)}...` : content}
            </span>
            {shouldCollapse && (
              <button
                onClick={() => toggleSection(index)}
                className="text-chiliz-primary text-xs hover:text-chiliz-primary/80 transition-colors touch-manipulation"
              >
                {isExpanded ? 'Less' : 'More'}
              </button>
            )}
            <button
              onClick={() => copyToClipboard(content, copyId)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
            >
              {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        );
      }
    }

    // Default paragraph
    return (
      <div key={index} className="flex items-start justify-between gap-2 group">
        <p className={`text-white/80 leading-relaxed flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {shouldCollapse && !isExpanded ? `${trimmedLine.substring(0, 80)}...` : trimmedLine}
        </p>
        {shouldCollapse && (
          <button
            onClick={() => toggleSection(index)}
            className="text-chiliz-primary text-xs hover:text-chiliz-primary/80 transition-colors touch-manipulation"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        )}
        <button
          onClick={() => copyToClipboard(trimmedLine, copyId)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/50 hover:text-white/80 transition-all duration-200 touch-manipulation"
        >
          {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    );
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl ${getPadding()}`}>
      <div className={getSpacing()}>
        {lines.map((line, index) => renderLine(line, index))}
      </div>
    </div>
  );
};

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