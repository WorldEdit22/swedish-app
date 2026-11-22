// The Swedish alphabet for the alphabet window: every letter with its name (as a
// pronunciation hint), how it sounds in Turkish terms, and an example word.
// `ut` overrides the example's computed hint when the rules get it wrong.
// COMBOS are the letter groups and rules that trip up Turkish speakers.

export const LETTERS = [
  { ch: 'A', name: 'a:', sound: 'Türkçedeki a gibi. Uzun a: daha derin ve yuvarlak söylenir.', ex: ['dag', 'gün'] },
  { ch: 'B', name: 'be:', sound: 'Türkçedeki b gibi.', ex: ['bil', 'araba'] },
  { ch: 'C', name: 'se:', sound: 'e, i, y önünde s, başka yerlerde k gibi okunur. Az kullanılır.', ex: ['cykel', 'bisiklet'], ut: 'sükel' },
  { ch: 'D', name: 'de:', sound: 'Türkçedeki d gibi.', ex: ['dörr', 'kapı'] },
  { ch: 'E', name: 'e:', sound: "Uzun e: kapalı bir e, neredeyse i'ye yakın. Kısa e, Türkçedeki e gibi.", ex: ['het', 'sıcak'] },
  { ch: 'F', name: 'ef', sound: 'Türkçedeki f gibi.', ex: ['fisk', 'balık'] },
  { ch: 'G', name: 'ge:', sound: 'Genelde Türkçedeki g gibi. e, i, y, ä, ö önünde y gibi okunur.', ex: ['gata', 'sokak'] },
  { ch: 'H', name: 'ho:', sound: 'Türkçedeki h gibi, ama daha hafif.', ex: ['hund', 'köpek'] },
  { ch: 'I', name: 'i:', sound: 'Türkçedeki i gibi.', ex: ['is', 'buz'] },
  { ch: 'J', name: 'yi:', sound: 'Türkçedeki y gibi okunur.', ex: ['ja', 'evet'] },
  { ch: 'K', name: 'ko:', sound: 'Genelde Türkçedeki k gibi. e, i, y, ä, ö önünde yumuşak bir ş gibi okunur.', ex: ['katt', 'kedi'] },
  { ch: 'L', name: 'el', sound: 'Türkçedeki l gibi.', ex: ['lampa', 'lamba'] },
  { ch: 'M', name: 'em', sound: 'Türkçedeki m gibi.', ex: ['mat', 'yemek'] },
  { ch: 'N', name: 'en', sound: 'Türkçedeki n gibi.', ex: ['natt', 'gece'] },
  { ch: 'O', name: 'u:', sound: 'Uzun o çoğu zaman u gibi okunur (sol = su:l). Kısa o bazen o gibidir.', ex: ['sol', 'güneş'] },
  { ch: 'P', name: 'pe:', sound: 'Türkçedeki p gibi.', ex: ['penna', 'kalem'] },
  { ch: 'Q', name: 'kü:', sound: 'k gibi okunur. Çok az kullanılır.', ex: ['Qatar', 'Katar'] },
  { ch: 'R', name: 'er', sound: 'Türkçedeki r gibi, dilin ucuyla.', ex: ['röd', 'kırmızı'] },
  { ch: 'S', name: 'es', sound: 'Türkçedeki s gibi.', ex: ['salt', 'tuz'] },
  { ch: 'T', name: 'te:', sound: 'Türkçedeki t gibi.', ex: ['tåg', 'tren'] },
  { ch: 'U', name: 'ü:', sound: "Uzun u, ü'ye benzer (hus = hü:s). Kısa u, ö'ye yakındır (buss = bös).", ex: ['hus', 'ev'] },
  { ch: 'V', name: 've:', sound: 'Türkçedeki v gibi.', ex: ['vatten', 'su'] },
  { ch: 'W', name: 'dubbelve:', sound: 'v gibi okunur. Çok az kullanılır.', ex: ['webb', 'internet sitesi'] },
  { ch: 'X', name: 'eks', sound: 'ks gibi okunur.', ex: ['taxi', 'taksi'] },
  { ch: 'Y', name: 'ü:', sound: "Türkçedeki ü gibi, ama dudaklar daha gergin ve i'ye daha yakın.", ex: ['by', 'köy'] },
  { ch: 'Z', name: 'se:ta', sound: 's gibi okunur. Çok az kullanılır.', ex: ['zebra', 'zebra'], ut: 'se:bra' },
  { ch: 'Å', name: 'o:', sound: 'Türkçedeki o gibi; uzunken dudaklar daha yuvarlak.', ex: ['år', 'yıl'] },
  { ch: 'Ä', name: 'e:', sound: 'Türkçedeki e gibi; r önünde daha açık.', ex: ['äta', 'yemek yemek'] },
  { ch: 'Ö', name: 'ö:', sound: 'Türkçedeki ö gibi.', ex: ['öga', 'göz'] },
];

export const COMBOS = [
  {
    title: 'sj, skj, stj, -tion ve e, i, y, ä, ö önünde sk → ş',
    sound: 'Türkçede tam karşılığı yok. Dudakları öne doğru yuvarla ve ş der gibi, ama daha boğuk ve yumuşak söyle.',
    ex: [['sju', 'yedi'], ['sked', 'kaşık'], ['station', 'istasyon']],
  },
  {
    title: 'tj, kj ve e, i, y, ä, ö önünde k → ş',
    sound: "Dilin ortası damağa yaklaşır; ş'den daha ince ve yumuşaktır. ç değildir.",
    ex: [['tjugo', 'yirmi'], ['kyrka', 'kilise'], ['kök', 'mutfak']],
  },
  {
    title: 'e, i, y, ä, ö önünde g → y',
    sound: "Bu ünlülerin önünde g, y'ye dönüşür.",
    ex: [['göra', 'yapmak'], ['ge', 'vermek']],
  },
  {
    title: 'j, dj, gj, hj, lj → y',
    sound: 'Bu harf grupları kelime başında y gibi okunur; d, g, h ve l duyulmaz.',
    ex: [['ja', 'evet'], ['djur', 'hayvan'], ['hjälp', 'yardım'], ['ljus', 'ışık']],
  },
  {
    title: 'rs → ş; rt, rd, rn',
    sound: "r ile s yan yana gelince birleşip ş olur. rt, rd ve rn'de de r ile sonraki harf kaynaşır.",
    ex: [['först', 'önce'], ['kort', 'kart']],
  },
  {
    title: 'ng ve gn',
    sound: 'ng genizden gelen tek bir sestir; g ayrıca duyulmaz. gn, ngn gibi okunur.',
    ex: [['lång', 'uzun'], ['regn', 'yağmur']],
  },
  {
    title: 'Uzun ve kısa ünlüler',
    sound: 'Ünlüden sonra tek ünsüz varsa ünlü uzundur (glas = gla:s), çift ünsüz varsa kısadır (glass = glas). Okunuşta ":" uzun sesi gösterir.',
    ex: [['glas', 'bardak'], ['glass', 'dondurma']],
  },
  {
    title: 'o çoğu zaman u gibi',
    sound: 'o harfi çoğu kelimede u gibi okunur.',
    ex: [['sol', 'güneş'], ['bok', 'kitap']],
  },
  {
    title: 'u: uzunken ü, kısayken ö',
    sound: "Uzun u, ü'ye benzer; kısa u, ö'ye yakındır.",
    ex: [['hus', 'ev'], ['buss', 'otobüs']],
  },
  {
    title: 'Vurgu',
    sound: 'Vurgu çoğu kelimede ilk hecededir. Bazı alıntı kelimelerde sondadır (station).',
    ex: [['flicka', 'kız'], ['station', 'istasyon']],
  },
  {
    title: 'Okunmayan harfler',
    sound: "-ig sonundaki g ve det'teki t genelde okunmaz.",
    ex: [['rolig', 'eğlenceli'], ['det', 'o, bu']],
  },
];
