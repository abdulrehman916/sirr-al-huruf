import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow:     "rgba(212,175,55,0.22)",
  text:     "#F5D060",
  dim:      "rgba(212,175,55,0.55)",
};

const QASAM_TEXT = `Bismillahirrahmanirrahîm.

Azimetün min Allahi ve resulihi Süleyman ibni Davud Aleyhümüsselam. İla mülikil cinni veşşeytani vel mürdeti vel afarite cünudi iblisi ecmain. Aksemtü aleyküm eyyetühel ervahür ruhaniyeti vel avanil ardiyyete en tecibu daveti ve tahzuru makami ve teşimmu duhani ve takzu havaici ve hiye(17). Bi izzeti Berhetihin Berhetihin. Keririn Keririn. Tetlihin Tetlihin. Turânin Turânin. Mezcelin Mezcelin. Bezcelin Bezcelin. Terkâbin Terkâbin. Berheşin Berheşin. Galmeşin Galmeşin. Hutûrin Hutûrin. Kalnehûdin Kalnehûdin. Berşânin Barşânin. Kezhirin Kezhirin. Nemuşelhin Nemuşelhin. Berhayûlen Berhayûlen. Beşkeylahin Beşkeylahin. Kazmecin Kazmecin. Engalelitin Engalelitin. Kabâratin Kabâratin. Gayâhen Gâyahen. Keydehûlen Keydehûlen. Şemhâhirin Şemhâhirin. Şemhahirin Şemhahirin. Şemhahîrin Şemhahîrin.(18) Bikehtahûnihin Bikehtahûnihin. Beşârişin Beşârişin. Tunîşin Tunîşin. Şemhabarûhin Şemhabarûhin. Allahümme bi hakkı kehkehicin yağtaşin bi lat sağ şağavilin. emvilin celedin mehcemen helmecin vurudihin mehfeyacin bi izzetike illa ahazte semihim ve ebsarihim sübhane men leyse kemislihi şeyün ve hüves semiül Basir ve bi hakkı(19) Ecibü eyyetühel mülikil vel avan bi hakkı hazihil esmai aleyküm vetaatiha ledeyküm ve bi hakkı men kale lissemavati vel ardi i'tiya tavanen kerhen kaleta eteyna tai ine lillahi Rabbil alemin. Ecibu vesmeu ve atiu vela tekunü minellezine kalu semina ve atânâ ve hüm la yesmaune. Ecib Ya Cebrâil Aleyhisselam ve Ya İsrâfil Aleyhisselam ve Ya Mikâil Aleyhisselam ve Ya Azrâil Aleyhisselam(20) ve ente ya emlakil müvekkiline bi hazel vefk(21) Aksemtü Aleyküm bil meklekil azim münzilelvahi aler resuli min muradikatil azameti ila levhil Mahfuz. İlla ma ecebtüm azimeti hazihi veh zurtüm hâdimi hazel yevmül müvekkiline bi yevmil(22) El Meliki(23) ve hâdimihi meleki(24) Ve hüddami hazel vefk(25) Bi hakkı(26) ma fiha min sırri vel esrari ve nurül envari Heyyen Heyyen. Elvahen Elvahen.. Elacele Elacele. Essate Essate.`;

const FOOTNOTES = [
  { num: 17, text: "Burada okunan Esma'nin adedine bağlı olarak, Vefk içine yerleştirilen sayı kadar okunmaktadır." },
  { num: 18, text: "Üç farklı Şemhahirin sözü ilk bakışta hep aynı kelime gibi görünebilir. Harflerin üzerlerindeki aksan işaretlerine dikkat edilmelidir." },
  { num: 19, text: "Burada vefkin hane adedi kadar olan \"Esmaül Avan\" okunur." },
  { num: 20, text: "Burada vefkin çevresindeki dört başmeleğin isimleri sayılmaktadır fakat bir amaca uygun olarak vefkin dört tarafına da aynı meleğin ismi yazılmışsa sadece o meleğin ismi okunur. Ayrıca aşağıda da görülecek olduğu gibi, belli bir amaçla, Vefk çevresindeki melek isimleri farklı bir sıralamada yazılırlarsa, burada okunurken de o sıralamada okunmalıdırlar." },
  { num: 21, text: "Bu noktada sekiz ulvî hâdimin isimleri zikredilir." },
  { num: 22, text: "Okumanın yapıldığı günün ismi Arapça zikredilecek." },
  { num: 23, text: "Vefk'in yapıldığı vaktin gezegeninin ismi Arapça zikredilecek." },
  { num: 24, text: "Ulvî ve Sulfî hâdim isimleri, vefkin içinde okunan ve vefkin yapıldığı güne ait olan hâdim isimleridir." },
  { num: 25, text: "Burada vefke ait olan hüddam isimleri zikredilir." },
  { num: 26, text: "Vefkin okunuşu sırasında hüddam isimleri çıkartılmış ise, burada bu isimlerin tamamı zikredilmelidir." },
];

const HATIRLATMA = `Hatırlatma: Okunan dua adedi, aynı gün, aynı hafta günü veya uygun astrolojik vakitlerde yapılmalıdır. Eğer dualar 3, 7 veya 9 gün içerisinde tamamlanamazsa, 9 günlük bir çalışma sürecine yayılır ve ilk gün okuması tamamlanamazsa, 9. günde tamamlanmalıdır. Esmaları olan ve vefkin sekiz noktasından çıkarılan Ulvî ve Sulfî hâdim isimleri ile vefkin ekteren ekleri ile gereken titreşimi kazanarak ulvî ve sulfî hâdimlere ulaşılır. Bu çalışma da aynen okunacaklardır.`;

const HADIM_ISIMLERI = `Hâdim İsimleri Hakkında: Hâdim isimleri, anlamları, nitelikleri ve esma ile ayetler kategorisinde olup olmadıkları tartışmalı bir konudur. Bazı alimler, bunların potansiyelini gerçekleştirmek için gerekli olan ilham edilmiş isimler olduğunu düşünürler. Vefk'in amacı hâdim isimleri üretmek değilse, o vefk esma değildir ve hâdim özellikleri taşımaz. Vefkten türetilen isimlerin kullanıma uygun olup olmadığı sorgulanır. Bütün vefklerden çıkartılan hâdim isimleri aslında hâdimlerin gerçek isimleridir. Fakat önemsiz de değildirler. Bu sözler, istenen işi yapacak olan hâdimleri active edecek olan ses kodlarıdır. Ses kodları vefkin yapısına ve kullanılan ayet veya esmaya göre şekillenirler. Âil, Yûşin, Tayşın ve Tatil ekleri ile gereken titreşimi kazanarak ulvî ve sulfî hâdimlere ulaşırlar. Dolayısıyla, yukarda örnek olarak yazdığım uydurma kelimelerle ya da yaygın bir şarkı ile yapılan bir saçma vefekten çıkan kodlarla da hiç bir hâdim uyarilamaz. Çünkü onun arkasında Astral gücü, birikimi olan bir ayet veya esma olmadığı gibi niyet ve iç dürtü de yoktur.`;

const VEFK_KONTROL = `Bitmiş Bir Vefkin Kontrolü: Doğru olarak yapılan bir vefkin bütün satır, sütun ve çaprazlarının toplamı, vefk yapılan sayıyı verir. Dört köşesinin toplamı da her açıdan aynı sayıyı vermelidir.`;

export default function MsQasam() {
  const [showFootnotes, setShowFootnotes] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 space-y-4"
      style={{
        background: "linear-gradient(145deg, rgba(8,16,38,0.98) 0%, rgba(4,10,24,0.99) 100%)",
        borderColor: G.borderHi,
        boxShadow: `0 0 28px ${G.glow}`,
      }}
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h2
          className="font-inter font-bold tracking-[0.20em] uppercase"
          style={{ color: G.text, fontSize: "1.1rem", letterSpacing: "0.25em" }}
        >
          QASAM
        </h2>
        <div
          className="mx-auto"
          style={{
            width: 48,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${G.borderHi}, transparent)`,
          }}
        />
      </div>

      {/* OKUNACAK DUA Heading */}
      <h3
        className="font-inter font-bold tracking-[0.15em] uppercase text-center"
        style={{ color: "rgba(212,175,55,0.80)", fontSize: "0.85rem" }}
      >
        OKUNACAK DUA
      </h3>

      {/* Main Qasam Text */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(212,175,55,0.04)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <p
          className="font-amiri text-base leading-[2.2] text-center"
          dir="rtl"
          style={{
            color: "rgba(245,235,210,0.88)",
            whiteSpace: "pre-wrap",
            textShadow: "0 0 12px rgba(212,175,55,0.12)",
          }}
        >
          {QASAM_TEXT}
        </p>
      </div>

      {/* Footnotes Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowFootnotes(!showFootnotes)}
          className="inline-flex items-center gap-1.5 font-inter text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-xl border transition-all"
          style={{
            color: G.dim,
            borderColor: "rgba(212,175,55,0.20)",
            background: showFootnotes ? "rgba(212,175,55,0.08)" : "transparent",
          }}
        >
          {showFootnotes ? "Dipnotları Gizle" : "Dipnotları Göster"}
          <ChevronDown
            className="w-3 h-3"
            style={{
              transform: showFootnotes ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Footnotes */}
      <AnimatePresence>
        {showFootnotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-4 space-y-2 overflow-hidden"
            style={{
              background: "rgba(212,175,55,0.03)",
              border: "1px solid rgba(212,175,55,0.10)",
            }}
          >
            <p
              className="font-inter text-[9px] uppercase tracking-widest mb-3"
              style={{ color: G.dim }}
            >
              Dipnotlar
            </p>
            {FOOTNOTES.map((fn) => (
              <div key={fn.num} className="flex gap-2">
                <span
                  className="font-inter text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{ color: G.text }}
                >
                  ({fn.num})
                </span>
                <p
                  className="font-inter text-[10px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  {fn.text}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supplementary Notes Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="inline-flex items-center gap-1.5 font-inter text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-xl border transition-all"
          style={{
            color: G.dim,
            borderColor: "rgba(212,175,55,0.20)",
            background: showNotes ? "rgba(212,175,55,0.08)" : "transparent",
          }}
        >
          {showNotes ? "Açıklamaları Gizle" : "Açıklamaları Göster"}
          <ChevronDown
            className="w-3 h-3"
            style={{
              transform: showNotes ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Supplementary Notes */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-4 space-y-4 overflow-hidden"
            style={{
              background: "rgba(212,175,55,0.03)",
              border: "1px solid rgba(212,175,55,0.10)",
            }}
          >
            {/* HATIRLATMA */}
            <div className="space-y-1.5">
              <p
                className="font-inter text-[10px] uppercase tracking-widest"
                style={{ color: G.text }}
              >
                HATIRLATMA
              </p>
              <p
                className="font-inter text-[10px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {HATIRLATMA}
              </p>
            </div>

            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)`,
              }}
            />

            {/* HÂDİM İSİMLERİ HAKKINDA */}
            <div className="space-y-1.5">
              <p
                className="font-inter text-[10px] uppercase tracking-widest"
                style={{ color: G.text }}
              >
                HÂDİM İSİMLERİ HAKKINDA
              </p>
              <p
                className="font-inter text-[10px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {HADIM_ISIMLERI}
              </p>
            </div>

            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)`,
              }}
            />

            {/* BİTMİŞ BİR VEFKİN KONTROLÜ */}
            <div className="space-y-1.5">
              <p
                className="font-inter text-[10px] uppercase tracking-widest"
                style={{ color: G.text }}
              >
                BİTMİŞ BİR VEFKİN KONTROLÜ
              </p>
              <p
                className="font-inter text-[10px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {VEFK_KONTROL}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}