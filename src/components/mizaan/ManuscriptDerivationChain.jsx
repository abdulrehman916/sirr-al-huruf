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
  const stage1 = useMemo(() => {
    const letters = initialLetters || [];
    const bastValues = letters.map(l => getBastLevel(l, 1));
    const bastSum = bastValues.reduce((s, v) => s + v, 0);
    const letterCount = letters.length;
    const satirVahidTotal = bastSum + letterCount;
    return { letters, bastValues, bastSum, letterCount, satirVahidTotal };
  }, [initialLetters]);

  const stage2 = useMemo(() => {
    const seedLetters = istintak(stage1.satirVahidTotal);
    return { seedLetters, count: seedLetters.length };
  }, [stage1.satirVahidTotal]);

  const stage3 = useMemo(() => {
    const isZevc = stage2.count % 2 === 0;
    const bastLevel = isZevc ? 4 : 5;
    return { isZevc, bastLevel, count: stage2.count };
  }, [stage2.count]);

  const stage4 = useMemo(() => {
    const seedsWithBast = stage2.seedLetters.map(letter => {
      const bastValue = getBastLevel(letter, stage3.bastLevel);
      return { letter, bastValue };
    });
    return { seedsWithBast };
  }, [stage2.seedLetters, stage3.bastLevel]);

  const stage5 = useMemo(() => {
    const expansions = stage4.seedsWithBast.map(seed => ({
      letter: seed.letter,
      bastValue: seed.bastValue,
      expansionLetters: istintak(seed.bastValue)
    }));
    const allExpansionLetters = expansions.flatMap(e => e.expansionLetters);
    return { expansions, allExpansionLetters, count: allExpansionLetters.length };
  }, [stage4.seedsWithBast]);

  const stage6 = useMemo(() => {
    const isExpandedZevc = stage5.count % 2 === 0;
    const groupSize = isExpandedZevc ? 4 : 5;
    return { isExpandedZevc, groupSize, count: stage5.count };
  }, [stage5.count]);

  const stage8 = useMemo(() => {
    const esmaData = generateEsmaLevel(stage5.allExpansionLetters, false, element);
    return esmaData;
  }, [stage5.allExpansionLetters, element]);

  return (
    <div style={{ fontFamily: AR.fontFamily, direction: "rtl", textAlign: "right", marginBottom: "32px" }}>
      <StageContainer number="١" title="Initial Letters with First Bast" titleAr="الحروف الأولية مع البسط الأول" color={color}>
        <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "12px" }}>Input letters from Mizaan-9 ({stage1.letters.length} حرف):</div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr", padding: "12px", border: `1px solid ${color}30`, borderRadius: "8px", background: `${color}08` }}>
          {stage1.letters.map((letter, i) => (
            <LetterWithBast key={i} letter={letter} bastValue={stage1.bastValues[i]} color={color} showBast={true} />
          ))}
        </div>
        <div style={{ marginTop: "12px", padding: "10px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.85rem", color: G.text }}>
          <div style={{ marginBottom: "6px" }}>First Bast Sum: <span style={{ fontWeight: "bold", color: G.green }}>{stage1.bastSum.toLocaleString()}</span></div>
          <div style={{ marginBottom: "6px" }}>Letter Count: <span style={{ fontWeight: "bold", color: G.green }}>{stage1.letterCount}</span></div>
          <div style={{ borderTop: `1px solid ${color}30`, paddingTop: "8px", fontWeight: "bold", color: G.green }}>
            Satır Vahid Total: {stage1.bastSum.toLocaleString()} + {stage1.letterCount} = <span style={{ fontSize: "1.2rem", marginLeft: "8px" }}>{stage1.satirVahidTotal.toLocaleString()}</span>
          </div>
        </div>
      </StageContainer>

      <StageContainer number="٢" title="Istintak of Satır Vahid Total" titleAr="استنطاق مجموع سطر واحد" color={color}>
        <IstintakSteps n={stage1.satirVahidTotal} msMarker={true} compact={false} />
        <div style={{ marginTop: "12px", padding: "8px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text }}>
          Seed letter count: <span style={{ fontWeight: "bold", color: G.green }}>{stage2.count}</span>
        </div>
      </StageContainer>

      <StageContainer number="٣" title="Ferd/Zevc Determination" titleAr="تحديد زوج أو فرد" color={color}>
        <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "8px" }}>Seed count: {stage3.count}</div>
        <div style={{ padding: "10px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", background: stage3.isZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", border: `1px solid ${stage3.isZevc ? G.green : G.red}30` }}>
          <span style={{ fontSize: "1.2rem" }}>{stage3.isZevc ? '✓' : '✗'}</span>
          <span style={{ color: stage3.isZevc ? G.green : G.red }}>{stage3.isZevc ? 'ZEVC (زوج) - Even' : 'FERD (فرد) - Odd'}</span>
        </div>
        <div style={{ marginTop: "10px", padding: "8px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text }}>
          <div>Manuscript rule:</div>
          <div style={{ marginTop: "4px" }}>Zevc (even) → <span style={{ fontWeight: "bold", color: G.green }}>4th Bast</span></div>
          <div style={{ marginTop: "4px" }}>Ferd (odd) → <span style={{ fontWeight: "bold", color: G.green }}>5th Bast</span></div>
          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${color}30`, fontWeight: "bold", color: G.green }}>
            Selected: {stage3.bastLevel}{stage3.bastLevel === 4 ? ' (رابع)' : stage3.bastLevel === 5 ? ' (خامس)' : ''} Bast
          </div>
        </div>
      </StageContainer>

      <StageContainer number="٤" title="Apply Bast to Each Seed Letter" titleAr="تطبيق البسط على كل حرف بذري" color={color}>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", direction: "ltr", marginBottom: "12px" }}>
          {stage4.seedsWithBast.map((seed, i) => (
            <LetterWithBast key={i} letter={seed.letter} bastValue={seed.bastValue} color={G.purple} showBast={true} />
          ))}
        </div>
        <div style={{ fontSize: "0.75rem", color: G.dim, padding: "8px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05` }}>
          Each seed letter receives {stage3.bastLevel}{stage3.bastLevel === 4 ? ' (رابع)' : (stage3.bastLevel === 5 ? ' (خامس)' : '')} Bast value
        </div>
      </StageContainer>

      <StageContainer number="٥" title="Istintak of Each Bast Result" titleAr="استنطاق كل نتيجة بسط" color={color}>
        <div style={{ display: "grid", gap: "10px" }}>
          {stage5.expansions.map((exp, idx) => (
            <div key={idx} style={{ padding: "10px", border: `1px solid ${color}30`, borderRadius: "8px", background: `${color}05` }}>
              <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "6px" }}>Seed {idx + 1}: {exp.letter} → Bast {exp.bastValue.toLocaleString()}</div>
              <div style={{ fontSize: "0.7rem", color: G.dim, marginBottom: "4px" }}>Istintak({exp.bastValue.toLocaleString()}):</div>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "3px", direction: "ltr", padding: "6px", border: `1px solid ${G.purple}30`, borderRadius: "6px", background: `${G.purple}08` }}>
                {[...exp.expansionLetters].reverse().map((l, i) => (
                  <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.2rem", color: G.purple, fontWeight: "500", padding: "2px 6px", borderRadius: "4px", background: `${G.purple}15`, border: `1px solid ${G.purple}25`, display: "inline-block" }}>{l}</span>
                ))}
              </div>
              <div style={{ fontSize: "0.65rem", color: G.dim, marginTop: "4px" }}>Expansion: {exp.expansionLetters.length} letters</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px", padding: "10px", border: `1px solid ${color}30`, borderRadius: "6px", background: `${color}05`, fontSize: "0.8rem", color: G.text }}>
          Total expansion letters: <span style={{ fontWeight: "bold", color: G.green }}>{stage5.count}</span>
        </div>
      </StageContainer>

      <StageContainer number="٦" title="Ferd/Zevc of Expanded Count" titleAr="تحديد زوج أو فرد للموسعة" color={color}>
        <div style={{ fontSize: "0.8rem", color: G.text, marginBottom: "8px" }}>Expanded letter count: {stage6.count}</div>
        <div style={{ padding: "10px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", background: stage6.isExpandedZevc ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", border: `1px solid ${stage6.isExpandedZevc ? G.green : G.red}30` }}>
          <span style={{ fontSize: "1.2rem" }}>{stage6.isExpandedZevc ? '✓' : '✗'}</span>
          <span style={{ color: stage6.isExpandedZevc ? G.green : G.red }}>{stage6.isExpandedZevc ? 'ZEVC (زوج) - Even → Group size: 4' : 'FERD (فرد) - Odd → Group size: 5'}</span>
        </div>
      </StageContainer>

      <StageContainer number="٧" title="Concatenate All Expansion Letters" titleAr="دمج كل الحروف في سطر واحد" color={color}>
        <div style={{ fontSize: "0.75rem", color: G.dim, marginBottom: "8px" }}>Complete Satr-ı Vahid letter sequence ({stage5.count} حرف):</div>
        <div style={{ padding: "12px", border: `2px solid ${color}40`, borderRadius: "8px", background: `${color}08`, marginBottom: "8px" }}>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4px", direction: "ltr" }}>
            {[...stage5.allExpansionLetters].reverse().map((l, i) => (
              <span key={i} dir="rtl" lang="ar" style={{ fontFamily: AR.fontFamily, fontSize: "1.4rem", color: color, fontWeight: "600", padding: "4px 8px", borderRadius: "4px", background: `${color}15`, border: `1px solid ${color}25`, display: "inline-block" }}>{l}</span>
            ))}
          </div>
        </div>
      </StageContainer>

      <StageContainer number="٨" title="Group into Esma-i Kitabet Names" titleAr="تجميع في أسماء الكتابة" color={color}>
        <Stage8Names expandedLetters={stage5.allExpansionLetters} groupSize={stage6.groupSize} names={stage8.names} remainder={stage8.remainder} supplementLetters={stage8.supplementLetters} color={color} />
      </StageContainer>
    </div>
  );
}