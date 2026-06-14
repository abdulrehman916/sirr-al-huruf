/**
 * PLANETARY HOURS - PDF KNOWLEDGE BASE
 * Extracted from uploaded PDF books only
 * STRICTLY ISOLATED: Astro Clock module only
 * 
 * Contains Sa'd/Nahs status, elements, suitable/unsuitable actions
 * from Havâss'ın Derinlikleri and other uploaded PDFs.
 */

// Planetary hour properties from PDF knowledge base
export const PLANETARY_HOUR_RULES = {
  saturn: {
    name_en: "Saturn",
    name_ml: "ശനി",
    name_ar: "زحل",
    symbol: "♄",
    element: "Earth",
    element_ml: "ഭൂമി",
    nature: "Nahs Akbar",
    nature_ml: "അനുചിതം (നഹ്സ് അക്ബർ)",
    suitableActions: {
      en: [
        "Land purchase and real estate",
        "Construction and building",
        "Agriculture and farming",
        "Mining and excavation",
        "Long-term investments",
        "Inheritance matters",
        "Spiritual discipline and austerity",
        "Binding and restricting enemies"
      ],
      ml: [
        "ഭൂമി വാങ്ങലും റിയൽ എസ്റ്റേറ്റ്",
        "നിർമ്മാണവും കെട്ടിട നിർമ്മാണം",
        "കൃഷിയും കാർഷിക പ്രവർത്തനങ്ങൾ",
        "ഖനനവും കുഴിച്ചിലും",
        "ദീർഘകാല നിക്ഷേപങ്ങൾ",
        "അവകാശ സംബന്ധമായ കാര്യങ്ങൾ",
        "ആദ്ധ്യാത്മിക ശിക്ഷണവും തപസ്സ്",
        "ശത്രുക്കളെ ബന്ധിക്കൽ"
      ]
    },
    unsuitableActions: {
      en: [
        "Marriage and engagement",
        "Love and romance",
        "Social gatherings",
        "Entertainment and festivities",
        "Starting new partnerships",
        "Travel for pleasure",
        "Medical treatment (except chronic)",
        "Education and learning"
      ],
      ml: [
        "വിവാഹവും നിശ്ചയം",
        "പ്രണയവും രതി",
        "സാമൂഹിക സമ്മേളനങ്ങൾ",
        "വിനോദവും ആഘോഷങ്ങൾ",
        "പുതിയ പങ്കാളിത്തങ്ങൾ",
        "വിനോദ യാത്രകൾ",
        "ചികിത്സ (ദീർഘകാല രോഗങ്ങൾ ഒഴികെ)",
        "വിദ്യാഭ്യാസവും പഠനം"
      ]
    },
    source: "Havâss'ın Derinlikleri p.50-51, 88-92",
    pdfNotes: {
      en: "Saturn hour is Nahs Akbar. Suitable for earth work, construction, binding enemies. Avoid social, romantic, educational activities.",
      ml: "ശനി മണിക്കൂർ നഹ്സ് അക്ബർ. ഭൂമി, നിർമ്മാണം, ശത്രുക്കളെ ബന്ധിക്കൽ എന്നിവയ്ക്ക് ഉചിതം. സാമൂഹിക, പ്രണയ, വിദ്യാഭ്യാസ പ്രവർത്തനങ്ങൾ ഒഴിവാക്കുക."
    }
  },
  
  jupiter: {
    name_en: "Jupiter",
    name_ml: "വ്യാഴം",
    name_ar: "المشتري",
    symbol: "♃",
    element: "Air",
    element_ml: "വായു",
    nature: "Sa'd Akbar",
    nature_ml: "ഉത്തമം (സഅദ് അക്ബർ)",
    suitableActions: {
      en: [
        "Education and learning",
        "Spiritual work and worship",
        "Legal matters and courts",
        "Teaching and preaching",
        "Wealth and financial growth",
        "Travel for knowledge",
        "Publishing and writing",
        "Charity and good deeds"
      ],
      ml: [
        "വിദ്യാഭ്യാസവും പഠനം",
        "ആദ്ധ്യാത്മിക പ്രവർത്തനങ്ങളും ആരാധന",
        "നിയമ കാര്യങ്ങളും കോടതി",
        "പഠിപ്പിക്കലും പ്രസംഗിക്കലും",
        "സമ്പത്തും സാമ്പത്തിക വളർച്ച",
        "ജ്ഞാനത്തിനായുള്ള യാത്രകൾ",
        "പ്രസിദ്ധീകരണവും എഴുത്ത്",
        "ധർമ്മവും നല്ല പ്രവർത്തനങ്ങൾ"
      ]
    },
    unsuitableActions: {
      en: [
        "Harmful magic",
        "Deception and fraud",
        "Violence and aggression",
        "Gambling and speculation",
        "Breaking contracts",
        "Disrespecting elders"
      ],
      ml: [
        "ഹാനികരമായ മാന്ത്രികത",
        "വഞ്ചനയും തട്ടിപ്പും",
        "അതിക്രമവും ആക്രമണം",
        "ചൂതാട്ടവും ഊഹക്കച്ചവടം",
        "കരാറുകൾ ലംഘിക്കൽ",
        "മൂത്തവരെ അവഗണിക്കൽ"
      ]
    },
    source: "Havâss'ın Derinlikleri p.52-55, 126-130",
    pdfNotes: {
      en: "Jupiter hour is Sa'd Akbar (major benefic). Most excellent for education, spirituality, legal matters, and wealth.",
      ml: "വ്യാഴം മണിക്കൂർ സഅദ് അക്ബർ (പ്രധാന ഉത്തമം). വിദ്യാഭ്യാസം, ആദ്ധ്യാത്മികത, നിയമ കാര്യങ്ങൾ, സമ്പത്ത് എന്നിവയ്ക്ക് ഏറ്റവും ഉത്തമം."
    }
  },
  
  mars: {
    name_en: "Mars",
    name_ml: "ചൊവ്വ",
    name_ar: "المريخ",
    symbol: "♂",
    element: "Fire",
    element_ml: "തീ",
    nature: "Nahs Akbar",
    nature_ml: "അനുചിതം (നഹ്സ് അക്ബർ)",
    suitableActions: {
      en: [
        "Conflict and battle",
        "Sports and competition",
        "Surgery and cutting",
        "Metalwork and forging",
        "Courage and bravery",
        "Defeating enemies",
        "Physical strength training",
        "Emergency actions"
      ],
      ml: [
        "സംഘർഷവും യുദ്ധം",
        "കായിക മത്സരങ്ങളും മത്സരങ്ങൾ",
        "ശസ്ത്രക്രിയയും മുറിക്കൽ",
        "ലോഹപ്പണിയും ഉലക്ക",
        "ധൈര്യവും ധീരത",
        "ശത്രുക്കളെ തോൽപ്പിക്കൽ",
        "ശാരീരിക ശക്തി പരിശീലനം",
        "അടിയന്തര പ്രവർത്തനങ്ങൾ"
      ]
    },
    unsuitableActions: {
      en: [
        "Marriage and love",
        "Peaceful negotiations",
        "Education and study",
        "Healing and recovery",
        "Social gatherings",
        "Financial investments"
      ],
      ml: [
        "വിവാഹവും പ്രണയം",
        "സമാധാന കൂടിയാലോചനകൾ",
        "വിദ്യാഭ്യാസവും പഠനം",
        "രോഗശാന്തിയും സുഖം",
        "സാമൂഹിക സമ്മേളനങ്ങൾ",
        "സാമ്പത്തിക നിക്ഷേപങ്ങൾ"
      ]
    },
    source: "Havâss'ın Derinlikleri p.56-58, 131-135",
    pdfNotes: {
      en: "Mars hour is Nahs Akbar. Suitable for conflict, surgery, metalwork. Avoid marriage, peace, education, healing.",
      ml: "ചൊവ്വ മണിക്കൂർ നഹ്സ് അക്ബർ. സംഘർഷം, ശസ്ത്രക്രിയ, ലോഹപ്പണി എന്നിവയ്ക്ക് ഉചിതം. വിവാഹം, സമാധാനം, വിദ്യാഭ്യാസം, രോഗശാന്തി ഒഴിവാക്കുക."
    }
  },
  
  sun: {
    name_en: "Sun",
    name_ml: "സൂര്യൻ",
    name_ar: "الشمس",
    symbol: "☉",
    element: "Fire",
    element_ml: "തീ",
    nature: "Sa'd Asghar",
    nature_ml: "ഉത്തമം (സഅദ് അസ്ഗർ)",
    suitableActions: {
      en: [
        "Leadership and authority",
        "Government and officials",
        "Fame and recognition",
        "Success and victory",
        "Health and vitality",
        "Creative work",
        "Children and offspring",
        "Gold and precious items"
      ],
      ml: [
        "നേതൃത്വവും അധികാരം",
        "സർക്കാരും ഉദ്യോഗസ്ഥർ",
        "പ്രശസ്തിയും അംഗീകാരം",
        "വിജയവും വിജയം",
        "ആരോഗ്യവും ഊർജ്ജം",
        "സൃഷ്ടിപരമായ പ്രവർത്തനങ്ങൾ",
        "കുട്ടികളും സന്തതികൾ",
        "പൊന്നും വിലപ്പെട്ട വസ്തുക്കൾ"
      ]
    },
    unsuitableActions: {
      en: [
        "Secret work",
        "Deception",
        "Humility and servitude",
        "Poverty and loss",
        "Isolation"
      ],
      ml: [
        "രഹസ്യ പ്രവർത്തനങ്ങൾ",
        "വഞ്ചന",
        "വിനയവും സേവനം",
        "ദാരിദ്ര്യവും നഷ്ടം",
        "ഏകാന്തത"
      ]
    },
    source: "Havâss'ın Derinlikleri p.59-62, 136-142",
    pdfNotes: {
      en: "Sun hour is Sa'd Asghar (minor benefic). Excellent for leadership, success, health, and recognition.",
      ml: "സൂര്യൻ മണിക്കൂർ സഅദ് അസ്ഗർ (ലഘു ഉത്തമം). നേതൃത്വം, വിജയം, ആരോഗ്യം, അംഗീകാരം എന്നിവയ്ക്ക് മികച്ചത്."
    }
  },
  
  venus: {
    name_en: "Venus",
    name_ml: "ശുക്രൻ",
    name_ar: "الزهرة",
    symbol: "♀",
    element: "Water",
    element_ml: "വെള്ളം",
    nature: "Sa'd Akbar",
    nature_ml: "ഉത്തമം (സഅദ് അക്ബർ)",
    suitableActions: {
      en: [
        "Love and romance",
        "Marriage and engagement",
        "Beauty and adornment",
        "Music and arts",
        "Friendship and socializing",
        "Pleasure and enjoyment",
        "Fertility and conception",
        "Luxury and comfort"
      ],
      ml: [
        "പ്രണയവും രതി",
        "വിവാഹവും നിശ്ചയം",
        "സൗന്ദര്യവും അലങ്കാരം",
        "സംഗീതവും കലകൾ",
        "സൗഹൃദവും സാമൂഹികവൽക്കരണം",
        "ആനന്ദവും ആസ്വാദനം",
        "ഫലഭൂയിഷ്ഠതയും ഗർഭധാരണം",
        "പ്രീതിയും സുഖം"
      ]
    },
    unsuitableActions: {
      en: [
        "Violence and harm",
        "Separation and divorce",
        "Ugliness and filth",
        "Poverty and austerity",
        "Conflict and fighting"
      ],
      ml: [
        "അതിക്രമവും ദോഷം",
        "വേർപിരിയലും വിവാഹ മോചനം",
        "അഴകില്ലായ്മയും അഴുക്ക്",
        "ദാരിദ്ര്യവും തപസ്സ്",
        "സംഘർഷവും പോരാട്ടം"
      ]
    },
    source: "Havâss'ın Derinlikleri p.63-65, 143-148",
    pdfNotes: {
      en: "Venus hour is Sa'd Akbar. Most excellent for love, marriage, beauty, arts, and pleasure.",
      ml: "ശുക്രൻ മണിക്കൂർ സഅദ് അക്ബർ. പ്രണയം, വിവാഹം, സൗന്ദര്യം, കലകൾ, ആനന്ദം എന്നിവയ്ക്ക് ഏറ്റവും ഉത്തമം."
    }
  },
  
  mercury: {
    name_en: "Mercury",
    name_ml: "ബുധൻ",
    name_ar: "عطارد",
    symbol: "☿",
    element: "Air",
    element_ml: "വായു",
    nature: "Sa'd Asghar",
    nature_ml: "ഉത്തമം (സഅദ് അസ്ഗർ)",
    suitableActions: {
      en: [
        "Writing and communication",
        "Business and trade",
        "Travel and journeys",
        "Learning and teaching",
        "Contracts and agreements",
        "Technology and devices",
        "Mathematics and calculation",
        "Negotiation and diplomacy"
      ],
      ml: [
        "എഴുത്തും ആശയവിനിമയം",
        "ബിസിനസ്സും വ്യാപാരം",
        "യാത്രകളും യാത്രകൾ",
        "പഠിക്കലും പഠിപ്പിക്കൽ",
        "കരാറുകളും ഉടമ്പടികൾ",
        "സാങ്കേതികവിദ്യയും ഉപകരണങ്ങൾ",
        "ഗണിതവും കണക്കുകൂട്ടൽ",
        "കൂടിയാലോചനയും നയതന്ത്രം"
      ]
    },
    unsuitableActions: {
      en: [
        "Silence and secrecy",
        "Ignorance",
        "Deception in contracts",
        "Poor communication",
        "Stubbornness"
      ],
      ml: [
        "മൗനവും രഹസ്യം",
        "അജ്ഞത",
        "കരാറുകളിൽ വഞ്ചന",
        "മോശം ആശയവിനിമയം",
        "വാശി"
      ]
    },
    source: "Havâss'ın Derinlikleri p.66-68, 149-155",
    pdfNotes: {
      en: "Mercury hour is Sa'd Asghar. Excellent for writing, business, travel, learning, and contracts.",
      ml: "ബുധൻ മണിക്കൂർ സഅദ് അസ്ഗർ. എഴുത്ത്, ബിസിനസ്സ്, യാത്ര, പഠനം, കരാറുകൾ എന്നിവയ്ക്ക് മികച്ചത്."
    }
  },
  
  moon: {
    name_en: "Moon",
    name_ml: "ചന്ദ്രൻ",
    name_ar: "القمر",
    symbol: "☽",
    element: "Water",
    element_ml: "വെള്ളം",
    nature: "Sa'd Akbar",
    nature_ml: "ഉത്തമം (സഅദ് അക്ബർ)",
    suitableActions: {
      en: [
        "Love and marriage",
        "Reconciliation",
        "Spiritual work",
        "Dreams and visions",
        "Women and mothers",
        "Emotions and feelings",
        "Public and crowds",
        "Food and drink"
      ],
      ml: [
        "പ്രണയവും വിവാഹം",
        "രഞ്ജിപ്പിക്കൽ",
        "ആദ്ധ്യാത്മിക പ്രവർത്തനങ്ങൾ",
        "സ്വപ്നങ്ങളും ദർശനങ്ങൾ",
        "സ്ത്രീകളും അമ്മമാർ",
        "വികാരങ്ങളും വികാരങ്ങൾ",
        "പൊതുജനങ്ങളും കൂട്ടം",
        "ഭക്ഷണവും പാനീയം"
      ]
    },
    unsuitableActions: {
      en: [
        "Hardness and cruelty",
        "Separation",
        "Dryness",
        "Isolation",
        "Fire and burning"
      ],
      ml: [
        "കടുപ്പവും ക്രൂരത",
        "വേർപിരിയൽ",
        "വരൾച്ച",
        "ഏകാന്തത",
        "തീയും കത്തൽ"
      ]
    },
    source: "Havâss'ın Derinlikleri p.69-71, 156-162",
    pdfNotes: {
      en: "Moon hour is Sa'd Akbar. Most excellent for love, marriage, reconciliation, spiritual work, and women.",
      ml: "ചന്ദ്രൻ മണിക്കൂർ സഅദ് അക്ബർ. പ്രണയം, വിവാഹം, രഞ്ജിപ്പിക്കൽ, ആദ്ധ്യാത്മിക പ്രവർത്തനങ്ങൾ, സ്ത്രീകൾ എന്നിവയ്ക്ക് ഏറ്റവും ഉത്തമം."
    }
  }
};

// Helper function to get rules for a planet
export function getPlanetHourRules(planetKey) {
  return PLANETARY_HOUR_RULES[planetKey] || null;
}

// Helper function to get all planet rules
export function getAllPlanetRules() {
  return PLANETARY_HOUR_RULES;
}