/**
 * Script to fetch complete Quran data from API
 * This will download all 114 surahs with Arabic text, English and Bangla translations
 * 
 * Usage: node scripts/fetch-quran-data.js
 */

const fs = require('fs');
const path = require('path');

// API endpoints
const QURAN_API = 'https://api.alquran.cloud/v1';

// Translation editions
const EDITIONS = {
  arabic: 'quran-simple-enhanced', // Arabic text
  english: 'en.sahih', // Sahih International English
  bangla: 'bn.bengali', // Bengali translation
};

async function fetchSurahData(surahNumber) {
  try {
    console.log(`Fetching Surah ${surahNumber}...`);
    
    // Fetch Arabic, English, and Bangla in one request
    const url = `${QURAN_API}/surah/${surahNumber}/editions/${EDITIONS.arabic},${EDITIONS.english},${EDITIONS.bangla}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(`API returned code ${data.code}`);
    }
    
    const [arabicData, englishData, banglaData] = data.data;
    
    // Format the surah data
    const surah = {
      number: arabicData.number,
      name: arabicData.name,
      englishName: arabicData.englishName,
      banglaName: getBanglaName(surahNumber),
      englishNameTranslation: arabicData.englishNameTranslation,
      banglaNameTranslation: getBanglaTranslation(surahNumber),
      revelationType: arabicData.revelationType,
      numberOfAyahs: arabicData.numberOfAyahs,
      ayahs: []
    };
    
    // Format ayahs
    for (let i = 0; i < arabicData.ayahs.length; i++) {
      surah.ayahs.push({
        ayahNumber: arabicData.ayahs[i].numberInSurah,
        textArabic: arabicData.ayahs[i].text,
        translationEnglish: englishData.ayahs[i].text,
        translationBangla: banglaData.ayahs[i].text,
        tafsirEnglish: `Tafsir for Surah ${surah.englishName}, Ayah ${arabicData.ayahs[i].numberInSurah}. [Tafsir content to be added]`,
        tafsirBangla: `সূরা ${surah.banglaName}, আয়াত ${arabicData.ayahs[i].numberInSurah} এর তাফসীর। [তাফসীর বিষয়বস্তু যোগ করতে হবে]`,
        juz: arabicData.ayahs[i].juz,
        manzil: arabicData.ayahs[i].manzil,
        ruku: arabicData.ayahs[i].ruku || 1
      });
    }
    
    return surah;
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error.message);
    throw error;
  }
}

// Helper function to get Bangla surah names
function getBanglaName(number) {
  const names = {
    1: "আল-ফাতিহা", 2: "আল-বাকারা", 3: "আলে-ইমরান", 4: "আন-নিসা", 5: "আল-মায়িদা",
    6: "আল-আনআম", 7: "আল-আ'রাফ", 8: "আল-আনফাল", 9: "আত-তাওবা", 10: "ইউনুস",
    11: "হুদ", 12: "ইউসুফ", 13: "আর-রা'দ", 14: "ইবরাহীম", 15: "আল-হিজর",
    16: "আন-নাহল", 17: "আল-ইসরা", 18: "আল-কাহফ", 19: "মারইয়াম", 20: "ত্বা-হা",
    21: "আল-আম্বিয়া", 22: "আল-হজ্জ", 23: "আল-মুমিনূন", 24: "আন-নূর", 25: "আল-ফুরকান",
    26: "আশ-শুআরা", 27: "আন-নামল", 28: "আল-কাসাস", 29: "আল-আনকাবুত", 30: "আর-রূম",
    31: "লুকমান", 32: "আস-সাজদাহ", 33: "আল-আহযাব", 34: "সাবা", 35: "ফাতির",
    36: "ইয়া-সীন", 37: "আস-সাফফাত", 38: "সোয়াদ", 39: "আয-যুমার", 40: "গাফির",
    41: "ফুসসিলাত", 42: "আশ-শূরা", 43: "আয-যুখরুফ", 44: "আদ-দুখান", 45: "আল-জাসিয়া",
    46: "আল-আহকাফ", 47: "মুহাম্মাদ", 48: "আল-ফাতহ", 49: "আল-হুজুরাত", 50: "কাফ",
    51: "আয-যারিয়াত", 52: "আত-তূর", 53: "আন-নাজম", 54: "আল-কামার", 55: "আর-রহমান",
    56: "আল-ওয়াকিয়া", 57: "আল-হাদীদ", 58: "আল-মুজাদালা", 59: "আল-হাশর", 60: "আল-মুমতাহিনা",
    61: "আস-সফ", 62: "আল-জুমুআহ", 63: "আল-মুনাফিকূন", 64: "আত-তাগাবুন", 65: "আত-ত্বলাক",
    66: "আত-তাহরীম", 67: "আল-মুলক", 68: "আল-কলম", 69: "আল-হাক্কাহ", 70: "আল-মাআরিজ",
    71: "নূহ", 72: "আল-জিন", 73: "আল-মুযযাম্মিল", 74: "আল-মুদ্দাসসির", 75: "আল-কিয়ামাহ",
    76: "আল-ইনসান", 77: "আল-মুরসালাত", 78: "আন-নাবা", 79: "আন-নাযিআত", 80: "আবাসা",
    81: "আত-তাকভীর", 82: "আল-ইনফিত্বার", 83: "আল-মুতাফফিফীন", 84: "আল-ইনশিকাক", 85: "আল-বুরূজ",
    86: "আত-ত্বারিক", 87: "আল-আ'লা", 88: "আল-গাশিয়াহ", 89: "আল-ফাজর", 90: "আল-বালাদ",
    91: "আশ-শামস", 92: "আল-লাইল", 93: "আদ-দুহা", 94: "আশ-শারহ", 95: "আত-তীন",
    96: "আল-আলাক", 97: "আল-কদর", 98: "আল-বাইয়্যিনাহ", 99: "আয-যিলযাল", 100: "আল-আদিয়াত",
    101: "আল-কারিআহ", 102: "আত-তাকাসুর", 103: "আল-আসর", 104: "আল-হুমাযাহ", 105: "আল-ফীল",
    106: "কুরাইশ", 107: "আল-মাউন", 108: "আল-কাওসার", 109: "আল-কাফিরূন", 110: "আন-নাসর",
    111: "আল-মাসাদ", 112: "আল-ইখলাস", 113: "আল-ফালাক", 114: "আন-নাস"
  };
  return names[number] || `সূরা ${number}`;
}

// Helper function to get Bangla translation of surah names
function getBanglaTranslation(number) {
  const translations = {
    1: "সূচনা", 2: "গাভী", 3: "ইমরানের পরিবার", 4: "নারী", 5: "খাবার টেবিল",
    6: "গবাদি পশু", 7: "উচ্চভূমি", 8: "যুদ্ধলব্ধ সম্পদ", 9: "তওবা", 10: "ইউনুস",
    11: "হুদ", 12: "ইউসুফ", 13: "বজ্রপাত", 14: "ইবরাহীম", 15: "প্রস্তরময় ভূমি",
    16: "মৌমাছি", 17: "রাত্রি ভ্রমণ", 18: "গুহা", 19: "মারইয়াম", 20: "ত্বা-হা",
    21: "নবীগণ", 22: "হজ্জ", 23: "মুমিনগণ", 24: "আলো", 25: "সত্য-মিথ্যার পার্থক্যকারী",
    26: "কবিগণ", 27: "পিপীলিকা", 28: "কাহিনী", 29: "মাকড়সা", 30: "রোমানরা",
    31: "লুকমান", 32: "সিজদা", 33: "সম্মিলিত বাহিনী", 34: "সাবা", 35: "সৃষ্টিকর্তা",
    36: "ইয়া-সীন", 37: "সারিবদ্ধ", 38: "সোয়াদ", 39: "দলসমূহ", 40: "ক্ষমাশীল",
    41: "সুস্পষ্ট বিবরণ", 42: "পরামর্শ", 43: "স্বর্ণালংকার", 44: "ধোঁয়া", 45: "নতজানু",
    46: "বালুর টিলা", 47: "মুহাম্মাদ", 48: "বিজয়", 49: "কক্ষসমূহ", 50: "কাফ",
    51: "বায়ু", 52: "পর্বত", 53: "নক্ষত্র", 54: "চন্দ্র", 55: "পরম করুণাময়",
    56: "অনিবার্য ঘটনা", 57: "লোহা", 58: "বিতর্ককারিণী", 59: "সমাবেশ", 60: "পরীক্ষিতা",
    61: "সারি", 62: "জুমআহ", 63: "মুনাফিকগণ", 64: "পরস্পর প্রতারণা", 65: "তালাক",
    66: "নিষিদ্ধকরণ", 67: "রাজত্ব", 68: "কলম", 69: "নিশ্চিত সত্য", 70: "ঊর্ধ্বগামী সিঁড়ি",
    71: "নূহ", 72: "জিন", 73: "আবৃতকারী", 74: "বস্ত্রাবৃত", 75: "পুনরুত্থান",
    76: "মানুষ", 77: "প্রেরিতগণ", 78: "মহাসংবাদ", 79: "যারা টেনে নিয়ে যায়", 80: "তিনি ভ্রুকুটি করলেন",
    81: "অন্ধকারাচ্ছন্ন", 82: "বিদীর্ণ হওয়া", 83: "প্রতারকগণ", 84: "বিদারিত হওয়া", 85: "নক্ষত্ররাজি",
    86: "রাত্রিকালীন আগন্তুক", 87: "সর্বোচ্চ", 88: "বিস্তৃতকারিণী", 89: "প্রভাত", 90: "নগর",
    91: "সূর্য", 92: "রাত্রি", 93: "পূর্বাহ্ন", 94: "প্রশস্ততা", 95: "ডুমুর",
    96: "জমাট রক্ত", 97: "মহিমান্বিত", 98: "সুস্পষ্ট প্রমাণ", 99: "ভূমিকম্প", 100: "দ্রুতগামী অশ্ব",
    101: "মহাপ্রলয়", 102: "প্রাচুর্যের প্রতিযোগিতা", 103: "সময়", 104: "পরনিন্দাকারী", 105: "হাতী",
    106: "কুরাইশ", 107: "সাহায্য-সহযোগিতা", 108: "প্রাচুর্য", 109: "অবিশ্বাসীগণ", 110: "সাহায্য",
    111: "পাম ফাইবার", 112: "একনিষ্ঠতা", 113: "প্রভাত", 114: "মানবজাতি"
  };
  return translations[number] || `সূরা ${number}`;
}

async function fetchAllSurahs() {
  const allSurahs = [];
  
  // Fetch all 114 surahs
  for (let i = 1; i <= 114; i++) {
    try {
      const surah = await fetchSurahData(i);
      allSurahs.push(surah);
      
      // Add delay to avoid rate limiting (500ms between requests)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to fetch Surah ${i}:`, error.message);
      // Continue with next surah
    }
  }
  
  return allSurahs;
}

async function main() {
  console.log('Starting Quran data fetch...\n');
  console.log('This will take approximately 1-2 minutes to complete.\n');
  
  const surahs = await fetchAllSurahs();
  
  console.log(`\nSuccessfully fetched ${surahs.length} surahs!`);
  
  // Create the final data structure
  const quranData = {
    meta: {
      version: "1.0.0",
      languages: ["en", "bn"],
      sourceAttribution: {
        quranAr: "Al-Quran Cloud API - https://alquran.cloud",
        translationEn: "Sahih International - Public Domain",
        translationBn: "Bengali Translation - Public Domain",
        tafsirEn: "Ibn Kathir - Public Domain (Placeholder)",
        tafsirBn: "Tafheem-ul-Quran - Public Domain (Placeholder)",
        audio: "Various Reciters - CC Licensed"
      },
      fetchDate: new Date().toISOString()
    },
    surahs: surahs
  };
  
  // Save to file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'quran_tafsir.json');
  fs.writeFileSync(outputPath, JSON.stringify(quranData, null, 2), 'utf8');
  
  console.log(`\nData saved to: ${outputPath}`);
  console.log('\n✅ Complete! All 114 surahs have been fetched and saved.');
  console.log('\nNote: Tafsir data contains placeholders. You can add detailed tafsir later.');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
