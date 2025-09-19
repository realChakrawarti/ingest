export const SESSION_COOKIE_NAME = "__session";

export const Routes = {
  DASHBOARD: "/dashboard",
  ROOT: "/",
} as const;

export const Regex = {
  YOUTUBE_USER_CHANNEL:
    /https?:\/\/(?:www\.)?youtube\.com\/(?:(@[a-zA-Z0-9_-]+)(?:\/.*)?|channel\/([a-zA-Z0-9_-]+)(?:\/.*)?)/,
  YOUTUBE_VIDEO_LINK:
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/,
};

export const LOCAL_USER_SETTINGS = "local-user-settings";

// Refer: https://stackoverflow.com/questions/71192605/how-do-i-get-youtube-shorts-from-youtube-api-data-v3/76602819#76602819
export const YouTubePrefix = {
  ALL_UPLOADS: "UU",
  LIVE_STREAMS: "UULV",
  POPULAR_LIVE_STREAMS: "UUPV",
  POPULAR_SHORTS: "UUPS",
  POPULAR_VIDEOS: "UULP",
  SHORTS: "UUSH",
  VIDEOS: "UULF",
} as const;

export const videoLanguages = [
  {
    label: "Default",
    value: "",
  },
  {
    label: "Abkhazian",
    value: "ab",
  },
  {
    label: "Afar",
    value: "aa",
  },
  {
    label: "Afrikaans",
    value: "af",
  },
  {
    label: "Akan",
    value: "ak",
  },
  {
    label: "Akkadian",
    value: "akk",
  },
  {
    label: "Albanian",
    value: "sq",
  },
  {
    label: "American Sign Language",
    value: "ase",
  },
  {
    label: "Amharic",
    value: "am",
  },
  {
    label: "Arabic",
    value: "ar",
  },
  {
    label: "Aramaic",
    value: "arc",
  },
  {
    label: "Armenian",
    value: "hy",
  },
  {
    label: "Assamese",
    value: "as",
  },
  {
    label: "Aymara",
    value: "ay",
  },
  {
    label: "Azerbaijani",
    value: "az",
  },
  {
    label: "Bambara",
    value: "bm",
  },
  {
    label: "Bangla",
    value: "bn",
  },
  {
    label: "Bangla (India)",
    value: "bn-IN",
  },
  {
    label: "Bashkir",
    value: "ba",
  },
  {
    label: "Basque",
    value: "eu",
  },
  {
    label: "Belarusian",
    value: "be",
  },
  {
    label: "Bhojpuri",
    value: "bh",
  },
  {
    label: "Bislama",
    value: "bi",
  },
  {
    label: "Bodo",
    value: "brx",
  },
  {
    label: "Bosnian",
    value: "bs",
  },
  {
    label: "Breton",
    value: "br",
  },
  {
    label: "Bulgarian",
    value: "bg",
  },
  {
    label: "Burmese",
    value: "my",
  },
  {
    label: "Cantonese",
    value: "yue",
  },
  {
    label: "Cantonese (Hong Kong)",
    value: "yue-HK",
  },
  {
    label: "Catalan",
    value: "ca",
  },
  {
    label: "Cherokee",
    value: "chr",
  },
  {
    label: "Chinese",
    value: "zh",
  },
  {
    label: "Chinese (China)",
    value: "zh-CN",
  },
  {
    label: "Chinese (Hong Kong)",
    value: "zh-HK",
  },
  {
    label: "Chinese (Simplified)",
    value: "zh-Hans",
  },
  {
    label: "Chinese (Singapore)",
    value: "zh-SG",
  },
  {
    label: "Chinese (Taiwan)",
    value: "zh-TW",
  },
  {
    label: "Chinese (Traditional)",
    value: "zh-Hant",
  },
  {
    label: "Choctaw",
    value: "cho",
  },
  {
    label: "Coptic",
    value: "cop",
  },
  {
    label: "Corsican",
    value: "co",
  },
  {
    label: "Cree",
    value: "cr",
  },
  {
    label: "Croatian",
    value: "hr",
  },
  {
    label: "Czech",
    value: "cs",
  },
  {
    label: "Danish",
    value: "da",
  },
  {
    label: "Dogri",
    value: "doi",
  },
  {
    label: "Dutch",
    value: "nl",
  },
  {
    label: "Dutch (Belgium)",
    value: "nl-BE",
  },
  {
    label: "Dutch (Netherlands)",
    value: "nl-NL",
  },
  {
    label: "Dzongkha",
    value: "dz",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "English (Australia)",
    value: "en-AU",
  },
  {
    label: "English (Canada)",
    value: "en-CA",
  },
  {
    label: "English (India)",
    value: "en-IN",
  },
  {
    label: "English (Ireland)",
    value: "en-IE",
  },
  {
    label: "English (United Kingdom)",
    value: "en-GB",
  },
  {
    label: "English (United States)",
    value: "en-US",
  },
  {
    label: "Esperanto",
    value: "eo",
  },
  {
    label: "Estonian",
    value: "et",
  },
  {
    label: "Ewe",
    value: "ee",
  },
  {
    label: "Faroese",
    value: "fo",
  },
  {
    label: "Fijian",
    value: "fj",
  },
  {
    label: "Filipino",
    value: "fil",
  },
  {
    label: "Finnish",
    value: "fi",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "French (Belgium)",
    value: "fr-BE",
  },
  {
    label: "French (Canada)",
    value: "fr-CA",
  },
  {
    label: "French (France)",
    value: "fr-FR",
  },
  {
    label: "French (Switzerland)",
    value: "fr-CH",
  },
  {
    label: "Fulah",
    value: "ff",
  },
  {
    label: "Galician",
    value: "gl",
  },
  {
    label: "Ganda",
    value: "lg",
  },
  {
    label: "Georgian",
    value: "ka",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "German (Austria)",
    value: "de-AT",
  },
  {
    label: "German (Germany)",
    value: "de-DE",
  },
  {
    label: "German (Switzerland)",
    value: "de-CH",
  },
  {
    label: "Greek",
    value: "el",
  },
  {
    label: "Guarani",
    value: "gn",
  },
  {
    label: "Gujarati",
    value: "gu",
  },
  {
    label: "Gusii",
    value: "guz",
  },
  {
    label: "Haitian Creole",
    value: "ht",
  },
  {
    label: "Hakka Chinese",
    value: "hak",
  },
  {
    label: "Hakka Chinese (Taiwan)",
    value: "hak-TW",
  },
  {
    label: "Haryanvi",
    value: "bgc",
  },
  {
    label: "Hausa",
    value: "ha",
  },
  {
    label: "Hawaiian",
    value: "haw",
  },
  {
    label: "Hebrew",
    value: "iw",
  },
  {
    label: "Hindi",
    value: "hi",
  },
  {
    label: "Hindi (Latin)",
    value: "hi-Latn",
  },
  {
    label: "Hiri Motu",
    value: "ho",
  },
  {
    label: "Hungarian",
    value: "hu",
  },
  {
    label: "Icelandic",
    value: "is",
  },
  {
    label: "Igbo",
    value: "ig",
  },
  {
    label: "Indonesian",
    value: "id",
  },
  {
    label: "Interlingua",
    value: "ia",
  },
  {
    label: "Interlingue",
    value: "ie",
  },
  {
    label: "Inuktitut",
    value: "iu",
  },
  {
    label: "Inupiaq",
    value: "ik",
  },
  {
    label: "Irish",
    value: "ga",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "Japanese",
    value: "ja",
  },
  {
    label: "Javanese",
    value: "jv",
  },
  {
    label: "Kalaallisut",
    value: "kl",
  },
  {
    label: "Kalenjin",
    value: "kln",
  },
  {
    label: "Kamba",
    value: "kam",
  },
  {
    label: "Kannada",
    value: "kn",
  },
  {
    label: "Kashmiri",
    value: "ks",
  },
  {
    label: "Kazakh",
    value: "kk",
  },
  {
    label: "Khmer",
    value: "km",
  },
  {
    label: "Kikuyu",
    value: "ki",
  },
  {
    label: "Kinyarwanda",
    value: "rw",
  },
  {
    label: "Klingon",
    value: "tlh",
  },
  {
    label: "Konkani",
    value: "kok",
  },
  {
    label: "Korean",
    value: "ko",
  },
  {
    label: "Kurdish",
    value: "ku",
  },
  {
    label: "Kyrgyz",
    value: "ky",
  },
  {
    label: "Ladino",
    value: "lad",
  },
  {
    label: "Lao",
    value: "lo",
  },
  {
    label: "Latin",
    value: "la",
  },
  {
    label: "Latvian",
    value: "lv",
  },
  {
    label: "Lingala",
    value: "ln",
  },
  {
    label: "Lithuanian",
    value: "lt",
  },
  {
    label: "Lower Sorbian",
    value: "dsb",
  },
  {
    label: "Luba-Katanga",
    value: "lu",
  },
  {
    label: "Luo",
    value: "luo",
  },
  {
    label: "Luxembourgish",
    value: "lb",
  },
  {
    label: "Luyia",
    value: "luy",
  },
  {
    label: "Macedonian",
    value: "mk",
  },
  {
    label: "Maithili",
    value: "mai",
  },
  {
    label: "Malagasy",
    value: "mg",
  },
  {
    label: "Malay",
    value: "ms",
  },
  {
    label: "Malay (Singapore)",
    value: "ms-SG",
  },
  {
    label: "Malayalam",
    value: "ml",
  },
  {
    label: "Maltese",
    value: "mt",
  },
  {
    label: "Manipuri",
    value: "mni",
  },
  {
    label: "Māori",
    value: "mi",
  },
  {
    label: "Marathi",
    value: "mr",
  },
  {
    label: "Masai",
    value: "mas",
  },
  {
    label: "Meru",
    value: "mer",
  },
  {
    label: "Min Nan Chinese",
    value: "nan",
  },
  {
    label: "Min Nan Chinese (Taiwan)",
    value: "nan-TW",
  },
  {
    label: "Mixe",
    value: "mxp",
  },
  {
    label: "Mizo",
    value: "lus",
  },
  {
    label: "Mongolian",
    value: "mn",
  },
  {
    label: "Mongolian (Mongolian)",
    value: "mn-Mong",
  },
  {
    label: "Nauru",
    value: "na",
  },
  {
    label: "Navajo",
    value: "nv",
  },
  {
    label: "Nepali",
    value: "ne",
  },
  {
    label: "Nigerian Pidgin",
    value: "pcm",
  },
  {
    label: "North Ndebele",
    value: "nd",
  },
  {
    label: "Northern Sotho",
    value: "nso",
  },
  {
    label: "Norwegian",
    value: "no",
  },
  {
    label: "Occitan",
    value: "oc",
  },
  {
    label: "Odia",
    value: "or",
  },
  {
    label: "Oromo",
    value: "om",
  },
  {
    label: "Papiamento",
    value: "pap",
  },
  {
    label: "Pashto",
    value: "ps",
  },
  {
    label: "Persian",
    value: "fa",
  },
  {
    label: "Persian (Afghanistan)",
    value: "fa-AF",
  },
  {
    label: "Persian (Iran)",
    value: "fa-IR",
  },
  {
    label: "Polish",
    value: "pl",
  },
  {
    label: "Portuguese",
    value: "pt",
  },
  {
    label: "Portuguese (Brazil)",
    value: "pt-BR",
  },
  {
    label: "Portuguese (Portugal)",
    value: "pt-PT",
  },
  {
    label: "Punjabi",
    value: "pa",
  },
  {
    label: "Quechua",
    value: "qu",
  },
  {
    label: "Romanian",
    value: "ro",
  },
  {
    label: "Romanian (Moldova)",
    value: "mo",
  },
  {
    label: "Romansh",
    value: "rm",
  },
  {
    label: "Rundi",
    value: "rn",
  },
  {
    label: "Russian",
    value: "ru",
  },
  {
    label: "Russian (Latin)",
    value: "ru-Latn",
  },
  {
    label: "Samoan",
    value: "sm",
  },
  {
    label: "Sango",
    value: "sg",
  },
  {
    label: "Sanskrit",
    value: "sa",
  },
  {
    label: "Santali",
    value: "sat",
  },
  {
    label: "Sardinian",
    value: "sc",
  },
  {
    label: "Scottish Gaelic",
    value: "gd",
  },
  {
    label: "Serbian",
    value: "sr",
  },
  {
    label: "Serbian (Cyrillic)",
    value: "sr-Cyrl",
  },
  {
    label: "Serbian (Latin)",
    value: "sr-Latn",
  },
  {
    label: "Serbo-Croatian",
    value: "sh",
  },
  {
    label: "Sherdukpen",
    value: "sdp",
  },
  {
    label: "Shona",
    value: "sn",
  },
  {
    label: "Sicilian",
    value: "scn",
  },
  {
    label: "Sindhi",
    value: "sd",
  },
  {
    label: "Sinhala",
    value: "si",
  },
  {
    label: "Slovak",
    value: "sk",
  },
  {
    label: "Slovenian",
    value: "sl",
  },
  {
    label: "Somali",
    value: "so",
  },
  {
    label: "South Ndebele",
    value: "nr",
  },
  {
    label: "Southern Sotho",
    value: "st",
  },
  {
    label: "Spanish",
    value: "es",
  },
  {
    label: "Spanish (Latin America)",
    value: "es-419",
  },
  {
    label: "Spanish (Mexico)",
    value: "es-MX",
  },
  {
    label: "Spanish (Spain)",
    value: "es-ES",
  },
  {
    label: "Spanish (United States)",
    value: "es-US",
  },
  {
    label: "Sundanese",
    value: "su",
  },
  {
    label: "Swahili",
    value: "sw",
  },
  {
    label: "Swati",
    value: "ss",
  },
  {
    label: "Swedish",
    value: "sv",
  },
  {
    label: "Tagalog",
    value: "tl",
  },
  {
    label: "Tajik",
    value: "tg",
  },
  {
    label: "Tamil",
    value: "ta",
  },
  {
    label: "Tatar",
    value: "tt",
  },
  {
    label: "Telugu",
    value: "te",
  },
  {
    label: "Thai",
    value: "th",
  },
  {
    label: "Tibetan",
    value: "bo",
  },
  {
    label: "Tigrinya",
    value: "ti",
  },
  {
    label: "Tok Pisin",
    value: "tpi",
  },
  {
    label: "Toki Pona",
    value: "tok",
  },
  {
    label: "Tongan",
    value: "to",
  },
  {
    label: "Tsonga",
    value: "ts",
  },
  {
    label: "Tswana",
    value: "tn",
  },
  {
    label: "Turkish",
    value: "tr",
  },
  {
    label: "Turkmen",
    value: "tk",
  },
  {
    label: "Twi",
    value: "tw",
  },
  {
    label: "Ukrainian",
    value: "uk",
  },
  {
    label: "Upper Sorbian",
    value: "hsb",
  },
  {
    label: "Urdu",
    value: "ur",
  },
  {
    label: "Uyghur",
    value: "ug",
  },
  {
    label: "Uzbek",
    value: "uz",
  },
  {
    label: "Venda",
    value: "ve",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
  {
    label: "Volapük",
    value: "vo",
  },
  {
    label: "Võro",
    value: "vro",
  },
  {
    label: "Welsh",
    value: "cy",
  },
  {
    label: "Western Frisian",
    value: "fy",
  },
  {
    label: "Wolaytta",
    value: "wal",
  },
  {
    label: "Wolof",
    value: "wo",
  },
  {
    label: "Xhosa",
    value: "xh",
  },
  {
    label: "Yiddish",
    value: "yi",
  },
  {
    label: "Yoruba",
    value: "yo",
  },
  {
    label: "Zulu",
    value: "zu",
  },
];
