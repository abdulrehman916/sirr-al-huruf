/**
 * ManuscriptDerivationChain — FULL MANUSCRIPT COMPLIANCE (pp.60–69)
 * Shows EVERY single intermediate stage BEFORE Esma-i Kitabet.
 * NO shortcuts. NO hidden stages. NO direct name generation.
 */
import { useMemo } from "react";
import { getBastLevel, istintak, generateEsmaLevel } from "../../lib/mizaanPostEngine";
import IstintakSteps from "./IstintakSteps";

const G = {
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  border: "rgba(212,175,55,0.30)",
  green: "#4ADE80",
  purple: "#C4B5FD",
  cyan: "#B2EBF2",
  red: "#F87171",
};

const AR = { fontFamily: "'Noto Naskh Arabic','Amiri','Scheherazade New',serif" };

function LetterWithBast({ letter, bastValue, color, showBast = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "2px", padding: "4px", borderRadius: "6px", background: showBast ? `${color}08` : "transparent", border: showBast ? `1px solid ${color}20` : "none" }}>
      <span dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.4rem", color: color, fontWeight: "600", padding: "4px 8px", borderRadius: "4px", background: `${color}10`, border: `1px solid ${color}20`, display: "inline-block", minWidth: "2rem", textAlign: "center" }}>
        {letter}
      </span>
      {showBast && bastValue && (
        <span style={{ fontSize: "0.65rem", color: G.dim, marginTop: "3px", fontFamily: "'Inter', sans-serif", fontWeight: "500" }}>
          {bastValue.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function StageContainer({ number, title, titleAr, children, color }) {
  return (
    <div style={{ marginBottom: "24px", padding: "16px", border: `2px solid ${color}40`, borderRadius: "10px", background: `${color}05` }}>
      <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ background: color, color: "#000", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "0.65rem" }}>{number}</span>
        <span>{title}</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span style={{ fontFamily: AR.fontFamily, fontSize: "0.85rem" }}>{titleAr}</span>
      </div>
      {children}
    </div>
  );
}

function Stage8Names({ expandedLetters, groupSize, names, remainder, supplementLetters, color }) {
  return (
    <div>
      <div style={{ fontSize: "0.75rem", color: G.dim, marginBottom: "12px" }}>
        Grouping {expandedLetters.length} letters into groups of {groupSize}:
      </div>
      <div style={{ display: "grid", gap: "10px" }}>
        {names.map((name, i) => {
          const startIdx = i * groupSize;
          const endIdx = Math.min(startIdx + groupSize, expandedLetters.length);
          const groupLetters = expandedLetters.slice(startIdx, endIdx);
          return (
            <div key={i} style={{ padding: "12px", border: `2px solid ${color}40`, borderRadius: "8px", background: `${color}08` }}>
              <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "6px" }}>Name {i + 1} (letters {startIdx + 1}-{endIdx}):</div>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr", marginBottom: "8px", padding: "6px", border: `1px solid ${G.cyan}30`, borderRadius: "6px", background: `${G.cyan}08` }}>
                {[...groupLetters].reverse().map((l, idx) => (
                  <span key={idx} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: G.cyan, fontWeight: "500", padding: "2px 6px", borderRadius: "4px", background: `${G.cyan}15`, border: `1px solid ${G.cyan}25`, display: "inline-block" }}>{l}</span>
                ))}
              </div>
              <div style={{ fontSize: "1.8rem", color: color, fontWeight: "bold", textAlign: "center", padding: "12px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05` }}>{name}</div>
            </div>
          );
        })}
      </div>
      {remainder && remainder.length > 0 && (
        <div style={{ marginTop: "12px", padding: "10px", border: `1px dashed ${color}40`, borderRadius: "6px", background: `${color}05` }}>
          <div style={{ fontSize: "0.75rem", color: G.dim, marginBottom: "6px" }}>Remainder letters ({remainder.length}):</div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr" }}>
            {[...remainder].reverse().map((l, i) => (
              <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: G.dim, fontWeight: "500", padding: "2px 6px", borderRadius: "4px", background: `${G.dim}15`, border: `1px solid ${G.dim}25`, display: "inline-block" }}>{l}</span>
            ))}
          </div>
          {supplementLetters && supplementLetters.length > 0 && (
            <>
              <div style={{ fontSize: "0.75rem", color: G.dim, marginTop: "10px", marginBottom: "6px" }}>Supplement from element:</div>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr" }}>
                {[...supplementLetters].reverse().map((l, i) => (
                  <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: G.green, fontWeight: "500", padding: "2px 6px", borderRadius: "4px", background: `${G.green}15`, border: `1px solid ${G.green}25`, display: "inline-block" }}>{l}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ManuscriptDerivationChain({ initialLetters, element, color = "#F5D060" }) {
  // ═══════════════════════════════════════════════════════════════
  // ESMA-I KITABET CHAIN
  // ═══════════════════════════════════════════════════════════════
  const kitabet = useMemo(() => {
    // Step 1: Initial letters with First Bast
    const letters = initialLetters || [];
    const bastValues = letters.map(l => getBastLevel(l, 1));
    const bastSum = bastValues.reduce((s, v) => s + v, 0);
    const letterCount = letters.length;
    const satirVahidTotal = bastSum + letterCount;

    // Step 2: Istintak of Satır Vahid
    const seedLetters = istintak(satirVahidTotal);

    // Step 3: Ferd/Zevc
    const isZevc = seedLetters.length % 2 === 0;
    const bastLevel = isZevc ? 4 : 5;

    // Step 4: Apply Bast to each seed
    const seedsWithBast = seedLetters.map(letter => ({
      letter,
      bastValue: getBastLevel(letter, bastLevel)
    }));

    // Step 5: Istintak each Bast result
    const expansions = seedsWithBast.map(seed => ({
      letter: seed.letter,
      bastValue: seed.bastValue,
      expansionLetters: istintak(seed.bastValue)
    }));
    const allExpansionLetters = expansions.flatMap(e => e.expansionLetters);

    // Step 6: Ferd/Zevc of expanded count
    const isExpandedZevc = allExpansionLetters.length % 2 === 0;
    const groupSize = isExpandedZevc ? 4 : 5;

    return {
      letters, bastValues, bastSum, letterCount, satirVahidTotal,
      seedLetters, isZevc, bastLevel,
      seedsWithBast, expansions, allExpansionLetters,
      expandedCount: allExpansionLetters.length,
      isExpandedZevc, groupSize
    };
  }, [initialLetters]);

  // ═══════════════════════════════════════════════════════════════
  // ESMA-I A'VAN CHAIN (uses Kitabet expansion letters as input)
  // ═══════════════════════════════════════════════════════════════
  const avan = useMemo(() => {
    // Step 1: Satır Vahid of Kitabet expansion letters
    const inputLetters = kitabet.allExpansionLetters;
    const bastValues = inputLetters.map(l => getBastLevel(l, 1));
    const bastSum = bastValues.reduce((s, v) => s + v, 0);
    const letterCount = inputLetters.length;
    const satirVahidTotal = bastSum + letterCount;

    // Step 2: Istintak
    const seedLetters = istintak(satirVahidTotal);

    // Step 3: Ferd/Zevc
    const isZevc = seedLetters.length % 2 === 0;
    const bastLevel = isZevc ? 4 : 5;

    // Step 4: Apply Bast
    const seedsWithBast = seedLetters.map(letter => ({
      letter,
      bastValue: getBastLevel(letter, bastLevel)
    }));

    // Step 5: Istintak each
    const expansions = seedsWithBast.map(seed => ({
      letter: seed.letter,
      bastValue: seed.bastValue,
      expansionLetters: istintak(seed.bastValue)
    }));
    const allExpansionLetters = expansions.flatMap(e => e.expansionLetters);

    // Step 6: Ferd/Zevc
    const isExpandedZevc = allExpansionLetters.length % 2 === 0;
    const groupSize = isExpandedZevc ? 4 : 5;

    return {
      inputLetters, bastValues, bastSum, letterCount, satirVahidTotal,
      seedLetters, isZevc, bastLevel,
      seedsWithBast, expansions, allExpansionLetters,
      expandedCount: allExpansionLetters.length,
      isExpandedZevc, groupSize
    };
  }, [kitabet.allExpansionLetters]);

  // ═══════════════════════════════════════════════════════════════
  // ESMA-I KASEM CHAIN (uses A'van expansion letters as input, always 5th Bast)
  // ═══════════════════════════════════════════════════════════════
  const kasem = useMemo(() => {
    // Step 1: Satır Vahid of A'van expansion letters
    const inputLetters = avan.allExpansionLetters;
    const bastValues = inputLetters.map(l => getBastLevel(l, 1));
    const bastSum = bastValues.reduce((s, v) => s + v, 0);
    const letterCount = inputLetters.length;
    const satirVahidTotal = bastSum + letterCount;

    // Step 2: Istintak
    const seedLetters = istintak(satirVahidTotal);

    // Step 3: Ferd/Zevc (Kasem ALWAYS uses 5th Bast regardless)
    const isZevc = seedLetters.length % 2 === 0;
    const bastLevel = 5; // Kasem rule: always 5th Bast

    // Step 4: Apply Bast
    const seedsWithBast = seedLetters.map(letter => ({
      letter,
      bastValue: getBastLevel(letter, bastLevel)
    }));

    // Step 5: Istintak each
    const expansions = seedsWithBast.map(seed => ({
      letter: seed.letter,
      bastValue: seed.bastValue,
      expansionLetters: istintak(seed.bastValue)
    }));
    const allExpansionLetters = expansions.flatMap(e => e.expansionLetters);

    // Step 6: Ferd/Zevc
    const isExpandedZevc = allExpansionLetters.length % 2 === 0;
    const groupSize = isExpandedZevc ? 4 : 5;

    return {
      inputLetters, bastValues, bastSum, letterCount, satirVahidTotal,
      seedLetters, isZevc, bastLevel,
      seedsWithBast, expansions, allExpansionLetters,
      expandedCount: allExpansionLetters.length,
      isExpandedZevc, groupSize
    };
  }, [avan.allExpansionLetters]);

  // ═══════════════════════════════════════════════════════════════
  // FINAL NAMES (ONLY after showing all derivation chains above)
  // ═══════════════════════════════════════════════════════════════
  const finalNames = useMemo(() => {
    const kitabetNames = generateEsmaLevel(kitabet.allExpansionLetters, false, element);
    const avanNames = generateEsmaLevel(avan.allExpansionLetters, false, element);
    const kasemNames = generateEsmaLevel(kasem.allExpansionLetters, true, element);
    return { kitabet: kitabetNames, avan: avanNames, kasem: kasemNames };
  }, [kitabet.allExpansionLetters, avan.allExpansionLetters, kasem.allExpansionLetters, element]);

  return (
    <div style={{ fontFamily: AR.fontFamily, direction: "rtl", textAlign: "right", marginBottom: "32px" }}>
      
      {/* ═══════════════════════════════════════════════════════════
          ESMA-I KITABET COMPLETE DERIVATION CHAIN
          ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: "40px", padding: "20px", border: `3px solid ${color}50`, borderRadius: "12px", background: `${color}08` }}>
        <h2 style={{ fontSize: "1.4rem", color, fontWeight: "bold", marginBottom: "20px", borderBottom: `2px solid ${color}40`, paddingBottom: "10px" }}>
          Esma-i Kitabet Derivation (أسماء الكتابة)
        </h2>

        <StageContainer number="١" title="Initial Letters with First Bast" titleAr="الحروف الأولية مع البسط الأول" color={color}>
          <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "12px" }}>Input letters from Mizaan-9 ({kitabet.letters.length} حرف):</div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "12px", border: `1px solid ${color}30`, borderRadius: "8px", background: `${color}08` }}>
            {kitabet.letters.map((letter, i) => (
              <LetterWithBast key={i} letter={letter} bastValue={kitabet.bastValues[i]} color={color} showBast={true} />
            ))}
          </div>
          <div style={{ marginTop: "12px", padding: "10px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.85rem", color: G.text }}>
            <div>First Bast Sum: <span style={{ fontWeight: "bold", color: G.green }}>{kitabet.bastSum.toLocaleString()}</span></div>
            <div>Letter Count: <span style={{ fontWeight: "bold", color: G.green }}>{kitabet.letterCount}</span></div>
            <div style={{ borderTop: `1px solid ${color}30`, paddingTop: "8px", fontWeight: "bold", color: G.green }}>
              Satır Vahid: {kitabet.bastSum.toLocaleString()} + {kitabet.letterCount} = <span style={{ fontSize: "1.2rem" }}>{kitabet.satirVahidTotal.toLocaleString()}</span>
            </div>
          </div>
        </StageContainer>

        <StageContainer number="٢" title="Istintak of Satır Vahid" titleAr="استنطاق سطر واحد" color={color}>
          <IstintakSteps n={kitabet.satirVahidTotal} msMarker={true} compact={false} />
          <div style={{ marginTop: "12px", padding: "8px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text }}>
            Seed count: <span style={{ fontWeight: "bold", color: G.green }}>{kitabet.seedLetters.length}</span>
          </div>
        </StageContainer>

        <StageContainer number="٣" title="Ferd/Zevc → Bast Level" titleAr="زوج/فرد → مستوى البسط" color={color}>
          <div style={{ padding: "10px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", background: kitabet.isZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", border: `1px solid ${kitabet.isZevc ? G.green : G.red}30` }}>
            <span style={{ fontSize: "1.2rem" }}>{kitabet.isZevc ? '✓' : '✗'}</span>
            <span style={{ color: kitabet.isZevc ? G.green : G.red }}>{kitabet.isZevc ? 'ZEVC (Even)' : 'FERD (Odd)'}</span>
          </div>
          <div style={{ marginTop: "10px", padding: "8px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text, fontWeight: "bold" }}>
            Selected: {kitabet.bastLevel}{kitabet.bastLevel === 4 ? ' (رابع)' : ' (خامس)'} Bast
          </div>
        </StageContainer>

        <StageContainer number="٤" title="Apply Bast to Seeds" titleAr="تطبيق البسط على البذور" color={color}>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", direction: "ltr" }}>
            {kitabet.seedsWithBast.map((seed, i) => (
              <LetterWithBast key={i} letter={seed.letter} bastValue={seed.bastValue} color={G.purple} showBast={true} />
            ))}
          </div>
        </StageContainer>

        <StageContainer number="٥" title="Istintak Each Bast" titleAr="استنطاق كل بسط" color={color}>
          <div style={{ display: "grid", gap: "10px" }}>
            {kitabet.expansions.map((exp, idx) => (
              <div key={idx} style={{ padding: "10px", border: `1px solid ${color}30`, borderRadius: "8px", background: `${color}05` }}>
                <div style={{ fontSize: "0.7rem", color: G.dim }}>Seed {idx + 1}: {exp.letter} → {exp.bastValue.toLocaleString()}</div>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr", marginTop: "6px" }}>
                  {[...exp.expansionLetters].reverse().map((l, i) => (
                    <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.1rem", color: G.purple, padding: "2px 4px", background: `${G.purple}15`, borderRadius: "3px" }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", padding: "10px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text, fontWeight: "bold" }}>
            Total: {kitabet.expandedCount} letters
          </div>
        </StageContainer>

        <StageContainer number="٦" title="Ferd/Zevc → Group Size" titleAr="زوج/فرد → حجم المجموعة" color={color}>
          <div style={{ padding: "10px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", background: kitabet.isExpandedZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", border: `1px solid ${kitabet.isExpandedZevc ? G.green : G.red}30` }}>
            {kitabet.isExpandedZevc ? 'ZEVC → Group: 4' : 'FERD → Group: 5'}
          </div>
        </StageContainer>

        <StageContainer number="٧" title="Complete Satr-ı Vahid" titleAr="سطر واحد الكامل" color={color}>
          <div style={{ padding: "12px", border: `2px solid ${color}40`, borderRadius: "8px", background: `${color}08` }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr" }}>
              {[...kitabet.allExpansionLetters].reverse().map((l, i) => (
                <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.3rem", color, padding: "4px 6px", background: `${color}15`, borderRadius: "4px" }}>{l}</span>
              ))}
            </div>
          </div>
        </StageContainer>

        <StageContainer number="٨" title="Esma-i Kitabet Names" titleAr="أسماء الكتابة" color={color}>
          <Stage8Names expandedLetters={kitabet.allExpansionLetters} groupSize={kitabet.groupSize} names={finalNames.kitabet.names} remainder={finalNames.kitabet.remainder} supplementLetters={finalNames.kitabet.supplementLetters} color={color} />
        </StageContainer>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ESMA-I A'VAN COMPLETE DERIVATION CHAIN
          ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: "40px", padding: "20px", border: `3px solid #B2EBF2`, borderRadius: "12px", background: "rgba(178,235,242,0.08)" }}>
        <h2 style={{ fontSize: "1.4rem", color: "#B2EBF2", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid rgba(178,235,242,0.40)", paddingBottom: "10px" }}>
          Esma-i A'van Derivation (أسماء الأعوان)
        </h2>

        <StageContainer number="١" title="Input: Kitabet Expansion" titleAr="المدخل: توسع الكتابة" color="#B2EBF2">
          <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "12px" }}>From Kitabet ({avan.inputLetters.length} حرف):</div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "12px", border: "1px solid rgba(178,235,242,0.30)", borderRadius: "8px", background: "rgba(178,235,242,0.08)" }}>
            {[...avan.inputLetters].reverse().map((l, i) => (
              <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: "#B2EBF2", padding: "3px 6px", background: "rgba(178,235,242,0.15)", borderRadius: "4px" }}>{l}</span>
            ))}
          </div>
        </StageContainer>

        <StageContainer number="٢" title="Satır Vahid → Istintak" titleAr="سطر واحد → استنطاق" color="#B2EBF2">
          <div style={{ fontSize: "0.85rem", color: G.text }}>Bast Sum: <span style={{ fontWeight: "bold", color: G.green }}>{avan.bastSum.toLocaleString()}</span> + Count: {avan.letterCount} = <span style={{ fontSize: "1.1rem", color: G.green }}>{avan.satirVahidTotal.toLocaleString()}</span></div>
          <IstintakSteps n={avan.satirVahidTotal} msMarker={true} compact={false} />
        </StageContainer>

        <StageContainer number="٣" title="Ferd/Zevc → Bast" titleAr="زوج/فرد → بسط" color="#B2EBF2">
          <div style={{ padding: "10px", borderRadius: "6px", fontWeight: "bold", background: avan.isZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: avan.isZevc ? G.green : G.red }}>
            {avan.isZevc ? 'ZEVC' : 'FERD'} → {avan.bastLevel}{avan.bastLevel === 4 ? ' (رابع)' : ' (خامس)'}
          </div>
        </StageContainer>

        <StageContainer number="٤" title="Apply Bast" titleAr="تطبيق البسط" color="#B2EBF2">
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", direction: "ltr" }}>
            {avan.seedsWithBast.map((seed, i) => (
              <LetterWithBast key={i} letter={seed.letter} bastValue={seed.bastValue} color="#B2EBF2" showBast={true} />
            ))}
          </div>
        </StageContainer>

        <StageContainer number="٥" title="Istintak Each" titleAr="استنطاق الكل" color="#B2EBF2">
          <div style={{ display: "grid", gap: "8px" }}>
            {avan.expansions.map((exp, idx) => (
              <div key={idx} style={{ padding: "8px", border: "1px solid rgba(178,235,242,0.30)", borderRadius: "6px", background: "rgba(178,235,242,0.05)" }}>
                <div style={{ fontSize: "0.7rem", color: G.dim }}>{exp.letter} → {exp.bastValue.toLocaleString()}</div>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2px", direction: "ltr", marginTop: "4px" }}>
                  {[...exp.expansionLetters].reverse().map((l, i) => (
                    <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1rem", color: "#B2EBF2", padding: "1px 4px", background: "rgba(178,235,242,0.15)", borderRadius: "3px" }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "8px", fontWeight: "bold", color: G.green }}>Total: {avan.expandedCount} letters</div>
        </StageContainer>

        <StageContainer number="٦" title="Group Size" titleAr="حجم المجموعة" color="#B2EBF2">
          <div style={{ padding: "8px", fontWeight: "bold", background: avan.isExpandedZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: avan.isExpandedZevc ? G.green : G.red, borderRadius: "6px" }}>
            {avan.isExpandedZevc ? 'ZEVC → 4' : 'FERD → 5'}
          </div>
        </StageContainer>

        <StageContainer number="٧" title="Satr-ı Vahid" titleAr="سطر واحد" color="#B2EBF2">
          <div style={{ padding: "10px", border: "2px solid rgba(178,235,242,0.40)", borderRadius: "8px", background: "rgba(178,235,242,0.08)" }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr" }}>
              {[...avan.allExpansionLetters].reverse().map((l, i) => (
                <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: "#B2EBF2", padding: "3px 5px", background: "rgba(178,235,242,0.15)", borderRadius: "4px" }}>{l}</span>
              ))}
            </div>
          </div>
        </StageContainer>

        <StageContainer number="٨" title="Esma-i A'van Names" titleAr="أسماء الأعوان" color="#B2EBF2">
          <Stage8Names expandedLetters={avan.allExpansionLetters} groupSize={avan.groupSize} names={finalNames.avan.names} remainder={finalNames.avan.remainder} supplementLetters={finalNames.avan.supplementLetters} color="#B2EBF2" />
        </StageContainer>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ESMA-I KASEM COMPLETE DERIVATION CHAIN
          ═══════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: "40px", padding: "20px", border: `3px solid #F5D060`, borderRadius: "12px", background: "rgba(245,208,96,0.08)" }}>
        <h2 style={{ fontSize: "1.4rem", color: "#F5D060", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid rgba(245,208,96,0.40)", paddingBottom: "10px" }}>
          Esma-i Kasem Derivation (أسماء القسم)
        </h2>

        <StageContainer number="١" title="Input: A'van Expansion" titleAr="المدخل: توسع الأعوان" color="#F5D060">
          <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "12px" }}>From A'van ({kasem.inputLetters.length} حرف):</div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "12px", border: "1px solid rgba(245,208,96,0.30)", borderRadius: "8px", background: "rgba(245,208,96,0.08)" }}>
            {[...kasem.inputLetters].reverse().map((l, i) => (
              <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: "#F5D060", padding: "3px 6px", background: "rgba(245,208,96,0.15)", borderRadius: "4px" }}>{l}</span>
            ))}
          </div>
        </StageContainer>

        <StageContainer number="٢" title="Satır Vahid → Istintak" titleAr="سطر واحد → استنطاق" color="#F5D060">
          <div style={{ fontSize: "0.85rem", color: G.text }}>Bast: <span style={{ fontWeight: "bold", color: G.green }}>{kasem.bastSum.toLocaleString()}</span> + Count: {kasem.letterCount} = <span style={{ fontSize: "1.1rem", color: G.green }}>{kasem.satirVahidTotal.toLocaleString()}</span></div>
          <IstintakSteps n={kasem.satirVahidTotal} msMarker={true} compact={false} />
        </StageContainer>

        <StageContainer number="٣" title="Kasem Rule: Always 5th Bast" titleAr="قاعدة القسم: دائمًا الخامس" color="#F5D060">
          <div style={{ padding: "10px", borderRadius: "6px", fontWeight: "bold", background: "rgba(245,208,96,0.15)", color: "#F5D060", border: "1px solid rgba(245,208,96,0.30)" }}>
            KASEM → 5th Bast (خامس) - regardless of Ferd/Zevc
          </div>
        </StageContainer>

        <StageContainer number="٤" title="Apply 5th Bast" titleAr="تطبيق البسط الخامس" color="#F5D060">
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", direction: "ltr" }}>
            {kasem.seedsWithBast.map((seed, i) => (
              <LetterWithBast key={i} letter={seed.letter} bastValue={seed.bastValue} color="#F5D060" showBast={true} />
            ))}
          </div>
        </StageContainer>

        <StageContainer number="٥" title="Istintak Each" titleAr="استنطاق الكل" color="#F5D060">
          <div style={{ display: "grid", gap: "8px" }}>
            {kasem.expansions.map((exp, idx) => (
              <div key={idx} style={{ padding: "8px", border: "1px solid rgba(245,208,96,0.30)", borderRadius: "6px", background: "rgba(245,208,96,0.05)" }}>
                <div style={{ fontSize: "0.7rem", color: G.dim }}>{exp.letter} → {exp.bastValue.toLocaleString()}</div>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2px", direction: "ltr", marginTop: "4px" }}>
                  {[...exp.expansionLetters].reverse().map((l, i) => (
                    <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1rem", color: "#F5D060", padding: "1px 4px", background: "rgba(245,208,96,0.15)", borderRadius: "3px" }}>{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "8px", fontWeight: "bold", color: G.green }}>Total: {kasem.expandedCount} letters</div>
        </StageContainer>

        <StageContainer number="٦" title="Group Size" titleAr="حجم المجموعة" color="#F5D060">
          <div style={{ padding: "8px", fontWeight: "bold", background: kasem.isExpandedZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: kasem.isExpandedZevc ? G.green : G.red, borderRadius: "6px" }}>
            {kasem.isExpandedZevc ? 'ZEVC → 4' : 'FERD → 5'}
          </div>
        </StageContainer>

        <StageContainer number="٧" title="Satr-ı Vahid" titleAr="سطر واحد" color="#F5D060">
          <div style={{ padding: "10px", border: "2px solid rgba(245,208,96,0.40)", borderRadius: "8px", background: "rgba(245,208,96,0.08)" }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr" }}>
              {[...kasem.allExpansionLetters].reverse().map((l, i) => (
                <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: "#F5D060", padding: "3px 5px", background: "rgba(245,208,96,0.15)", borderRadius: "4px" }}>{l}</span>
              ))}
            </div>
          </div>
        </StageContainer>

        <StageContainer number="٨" title="Esma-i Kasem Names" titleAr="أسماء القسم" color="#F5D060">
          <Stage8Names expandedLetters={kasem.allExpansionLetters} groupSize={kasem.groupSize} names={finalNames.kasem.names} remainder={finalNames.kasem.remainder} supplementLetters={finalNames.kasem.supplementLetters} color="#F5D060" />
        </StageContainer>
      </div>

    </div>
  );
}