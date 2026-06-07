# Faal Chob Automated Processing System

## Overview
This system automatically processes uploaded Faal Chob card screenshots to:
1. Extract Arabic combination codes (e.g., ددج, ا ب د)
2. Extract Persian result text from the screenshot
3. Generate Arabic translations
4. Generate Malayalam translations
5. Update the translation files

## How It Works

### Backend Function: `extractFaalChobText`
Located at: `functions/extractFaalChobText`

**Input:** Array of screenshot URLs
**Process:**
1. Uses LLM (Gemini Flash) to extract text from each screenshot
2. Detects the 3-letter Arabic combination (e.g., "ددج")
3. Extracts Persian text (main text, Danyal, Sadiq, verse)
4. Generates Arabic translation
5. Generates Malayalam translation

**Output:** JSON with extracted data and translations for each screenshot

### Admin Upload Page
**URL:** `/admin/faal-chob-upload`

**Features:**
- Upload multiple screenshots at once
- View processing results
- See success/failure counts
- Download extracted translations

## Usage

### Step 1: Upload Screenshots
1. Navigate to `/admin/faal-chob-upload`
2. Click "Select screenshots" or drag files
3. Select card images (PNG, JPG, WebP)
4. Click "Upload & Process"

### Step 2: Review Results
The system will display:
- ✅ Successful extractions with combination codes
- ⏭️ Skipped cards (no text detected)
- ❌ Failed processing attempts

### Step 3: Update Translation Files
After processing, the extracted data is returned in this format:

```json
{
  "combination": "ددج",
  "gridPos": 44,
  "persian": {
    "text": "ای صاحب فال بدان و آگاه باش...",
    "danyal": "ای صاحب فال...",
    "sadiq": "ای صاحب فال..."
  },
  "arabic": {
    "text": "يا صاحب الفال...",
    "danyal": "يا صاحب الفال...",
    "sadiq": "يا صاحب الفال..."
  },
  "malayalam": {
    "text": "ഹേ ഫാൽ ഉടമേ...",
    "danyal": "ഹേ ഫാൽ ഉടമേ...",
    "sadiq": "ഹേ ഫാൽ ഉടമേ..."
  }
}
```

### Step 4: Update lib/faalChobTranslations.js
Copy the generated translations to the translation file:

```javascript
export const FAAL_CHOB_AR = {
  44: {
    text: "يا صاحب الفال...",
    danyal: "يا صاحب الفال...",
    sadiq: "يا صاحب الفال..."
  }
};

export const FAAL_CHOB_ML = {
  44: {
    text: "ഹേ ഫാൽ ഉടമേ...",
    danyal: "ഹേ ഫാൽ ഉടമേ...",
    sadiq: "ഹേ ഫാൽ ഉടമേ..."
  }
};
```

## Key Features

### Automatic Combination Detection
- Reads 3-letter Arabic codes directly from screenshots
- Handles variations: "ددج", "د د ج", "د‌دج"
- Matches to grid positions 1-64

### Smart Text Extraction
- Extracts verse text (Quran verses at top)
- Extracts main Persian text
- Extracts Danyal section (دانیال)
- Extracts Sadiq section (صادق)

### Translation Generation
- Arabic: Formal spiritual Arabic matching the traditional tone
- Malayalam: Natural Malayalam translation preserving meaning
- Both maintain the structure (text, danyal, sadiq)

### Duplicate Prevention
- System detects already-processed cards
- Skips cards with identical content
- Prevents duplicate translations

## File Structure

```
functions/
  └─ extractFaalChobText     # Backend processing function

pages/
  └─ AdminFaalChobUpload     # Admin upload interface

lib/
  └─ faalChobTranslations.js # Translation data (AR + ML)

entities/
  └─ FaalChob.json          # Main card database
```

## Tips for Best Results

### Screenshot Quality
- ✅ Clear, well-lit images
- ✅ Full card visible
- ✅ Text readable and in focus
- ✅ Minimal shadows or glare

### What to Avoid
- ❌ Blurry or dark images
- ❌ Cropped text
- ❌ Extreme angles
- ❌ Reflections covering text

## Troubleshooting

### "No combination detected"
- Ensure the 3-letter code is clearly visible
- Check image quality and lighting
- Try retaking the screenshot

### "No matching card found"
- Verify the combination uses valid letters (ا ب ج د only)
- Check that all 3 letters are visible
- Ensure no invalid characters (ت, چ, etc.)

### Translation Quality Issues
- Review generated translations before publishing
- Manual editing may be needed for nuanced text
- Consider cultural and spiritual context

## Integration with FaalHikmah Component

The `FaalHikmah` component automatically uses translations from `lib/faalChobTranslations.js`:

1. User selects language (Arabic 🇸🇦 or Malayalam 🇮🇳)
2. Component looks up translation by gridPos
3. Displays translated text, Danyal, and Sadiq sections
4. Falls back to Persian if translation missing

## Future Enhancements

Potential improvements:
- Direct database updates (auto-save translations)
- Batch export to CSV/JSON
- Translation review/approval workflow
- Support for additional languages
- OCR confidence scoring
- Manual correction interface

---

**Note:** This system is designed to assist with translation work, not replace human review. Always verify translations for accuracy and spiritual appropriateness before publishing.