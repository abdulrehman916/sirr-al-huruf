/**
 * ARABIC LETTER DISPLAY COMPONENT
 * Shows Arabic glyph as primary, Malayalam as secondary description
 * NEVER displays Malayalam as the primary value
 */

import React from "react";

const G = {
  arabic: "#F5D060",
  malayalam: "rgba(34,197,94,0.80)",
  dim: "rgba(212,175,55,0.55)"
};

/**
 * Display a single Arabic letter with optional Malayalam description
 */
export function ArabicLetterDisplay({ letter, malayalam, name, size = "lg" }) {
  if (!letter) return null;

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl",
    xl: "text-8xl"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span 
        className={`font-amiri font-bold ${sizeClasses[size]}`}
        style={{ color: G.arabic }}
        dir="rtl"
      >
        {letter}
      </span>
      {malayalam && (
        <span className="font-malayalam-sm" style={{ color: G.malayalam }}>
          {malayalam}
        </span>
      )}
      {name && (
        <span className="font-inter text-xs" style={{ color: G.dim }}>
          {name}
        </span>
      )}
    </div>
  );
}

/**
 * Display lunar mansion with Arabic name primary
 */
export function LunarMansionDisplay({ arabic, name, malayalam, number }) {
  return (
    <div className="flex items-center gap-3">
      {number && (
        <span className="font-inter text-xs px-2 py-1 rounded" style={{ background: G.dim + "33", color: G.dim }}>
          #{number}
        </span>
      )}
      <div className="flex flex-col">
        <span className="font-amiri text-2xl font-bold" style={{ color: G.arabic }} dir="rtl">
          {arabic || name}
        </span>
        {name && arabic && (
          <span className="font-inter text-xs" style={{ color: G.dim }}>
            {name}
          </span>
        )}
        {malayalam && (
          <span className="font-malayalam-sm" style={{ color: G.malayalam }}>
            {malayalam}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Display zodiac sign with Arabic name primary
 */
export function ZodiacSignDisplay({ arabic, name, malayalam }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-amiri text-xl font-bold" style={{ color: G.arabic }} dir="rtl">
        {arabic || name}
      </span>
      {name && arabic && (
        <span className="font-inter text-xs" style={{ color: G.dim }}>
          {name}
        </span>
      )}
      {malayalam && (
        <span className="font-malayalam-sm" style={{ color: G.malayalam }}>
          {malayalam}
        </span>
      )}
    </div>
  );
}

/**
 * Parse and display Arabic text with Malayalam translation
 */
export function ArabicTextWithTranslation({ arabic, malayalam, className = "" }) {
  if (!arabic && !malayalam) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {arabic && (
        <p className="font-amiri text-lg text-right" style={{ color: G.arabic }} dir="rtl">
          {arabic}
        </p>
      )}
      {malayalam && (
        <p className="font-malayalam-sm" style={{ color: G.malayalam }}>
          {malayalam}
        </p>
      )}
    </div>
  );
}