// Patterns, most useful first (the ORDER at the end is the "most useful" ranking).
//
// Each pattern has one block in the app and one or more variants: different
// common ways to say the same thing. A variant has
//   sv / tr  how it is shown (Swedish, Turkish)
//   ex       fixed example sentences [swedish, turkish]
//   t        templates [swedish, turkish] combined with your words (see js/combine.js)
//   slot     which words fit the gap (type:kind|kind, "!count" for countable words only).
//            Defaults to the pattern's slot.
//   note     optional tip, in Turkish

export const GROUPS = { everyday: 'Günlük', verbs: 'Fiiller ve zamanlar', connectors: 'Bağlaçlar', order: 'Cümle düzeni' };

const FOOD = 'food|ingr|drink';
const NOUN_THINGS = `noun:${FOOD}|thing`;
const PLACES = 'noun:place|room|area|country|agency|home';
const DESC = 'adj:desc|any|color';

const EVERYDAY = [
  {
    id: 'want', sv: 'Jag vill ha ___', tr: '___ istiyorum', slot: NOUN_THINGS,
    variants: [
      {
        sv: 'Jag vill ha ___', tr: '___ istiyorum',
        note: 'Bir şey isterken "vill ha" denir; "ha" (sahip olmak) atlanmaz.',
        ex: [['Jag vill ha vatten.', 'Su istiyorum.'], ['Jag vill ha en kopp kaffe.', 'Bir fincan kahve istiyorum.']],
        t: [['Jag vill ha {w:en}.', '{bir}{w} istiyorum.'], ['Jag vill inte ha {w:en}.', '{w} istemiyorum.'], ['Vill du ha {w:en}?', '{w} ister misin?']],
      },
      {
        sv: 'Kan jag få ___?', tr: '___ alabilir miyim?',
        note: 'Kibar ve çok yaygın: kafede, dükkânda, sofrada.',
        ex: [['Kan jag få notan?', 'Hesabı alabilir miyim?'], ['Kan jag få lite vatten?', 'Biraz su alabilir miyim?']],
        t: [['Kan jag få {w:en}?', '{bir}{w} alabilir miyim?']],
      },
      {
        sv: 'Jag skulle vilja ha ___', tr: '___ rica ediyorum',
        note: 'En kibar şekli.',
        ex: [['Jag skulle vilja ha ett glas vatten.', 'Bir bardak su rica ediyorum.']],
        t: [['Jag skulle vilja ha {w:en}.', '{bir}{w} rica ediyorum.']],
      },
      {
        sv: '___, tack', tr: '___, lütfen',
        note: '"tack" hem "teşekkürler" hem "lütfen" yerine kullanılır.',
        ex: [['En kaffe, tack.', 'Bir kahve, lütfen.'], ['Notan, tack.', 'Hesap, lütfen.']],
        t: [['{w:en}, tack.', '{bir}{w}, lütfen.']],
      },
    ],
  },
  {
    id: 'finns', sv: 'Finns det ___?', tr: '___ var mı?', slot: `noun:${FOOD}|thing|place|issue|fixture|event|deal|weather|animal|wild|treat`,
    variants: [
      {
        sv: 'Finns det ___?', tr: '___ var mı?',
        note: 'Bir şeyin olup olmadığını sorarken: "finns det" = var mı.',
        ex: [['Finns det wifi här?', 'Burada kablosuz internet var mı?'], ['Finns det mjölk?', 'Süt var mı?']],
        t: [['Finns det {w:en}?', '{w} var mı?'], ['Finns det {w:en} här?', 'Burada {w} var mı?']],
      },
      {
        sv: 'Det finns ___', tr: '___ var',
        ex: [['Det finns kaffe i köket.', 'Mutfakta kahve var.'], ['Det finns en bank här.', 'Burada bir banka var.']],
        t: [['Det finns {w:en} här.', 'Burada {bir}{w} var.']],
      },
      {
        sv: 'Det finns ingen / inget ___', tr: '___ yok',
        note: 'en-kelime: ingen, ett-kelime: inget.',
        ex: [['Det finns ingen mjölk.', 'Süt yok.'], ['Det finns inget problem.', 'Sorun yok.']],
        t: [['Det finns {ingen} {w} här.', 'Burada {w} yok.']],
      },
    ],
  },
  {
    id: 'where', sv: 'Var är ___?', tr: '___ nerede?', slot: 'noun:place|thing|room|area|fixture|agency',
    variants: [
      {
        sv: 'Var är ___?', tr: '___ nerede?',
        note: 'Bilinen bir şey sorulur, bu yüzden isim belirli hâl alır: toaletten.',
        ex: [['Var är toaletten?', 'Tuvalet nerede?'], ['Var är min telefon?', 'Telefonum nerede?']],
        t: [['Var är {w:def}?', '{w} nerede?']],
      },
      {
        sv: 'Var ligger ___?', tr: '___ nerede (bulunuyor)?', slot: 'noun:place|area|agency',
        note: 'Binalar ve yerler için "ligger" (yatıyor) denir.',
        ex: [['Var ligger stationen?', 'İstasyon nerede?']],
        t: [['Var ligger {w:def}?', '{w} nerede?']],
      },
      {
        sv: 'Var är närmaste ___?', tr: 'En yakın ___ nerede?', slot: 'noun:place',
        note: '"närmaste" ile isim belirli hâl almaz: närmaste apotek.',
        ex: [['Var är närmaste apotek?', 'En yakın eczane nerede?']],
        t: [['Var är närmaste {w}?', 'En yakın {w} nerede?']],
      },
    ],
  },
  {
    id: 'price', sv: 'Hur mycket kostar ___?', tr: '___ ne kadar?', slot: `noun:${FOOD}|thing|vehicle`,
    variants: [
      {
        sv: 'Hur mycket kostar ___?', tr: '___ ne kadar?',
        ex: [['Hur mycket kostar den?', 'Bu ne kadar?'], ['Vad kostar biljetten?', 'Bilet kaç para?']],
        t: [['Hur mycket kostar {w:def}?', '{w} ne kadar?'], ['Vad kostar {w:def}?', '{w} kaç para?']],
      },
      {
        sv: 'Det kostar … kronor', tr: '… kron',
        ex: [['Det kostar femtio kronor.', 'Elli kron.'], ['Det är för dyrt.', 'Çok pahalı.']],
        t: [],
      },
    ],
  },
  {
    id: 'iam', sv: 'Jag är ___', tr: '___-im', slot: 'adj:feel|any',
    variants: [
      {
        sv: 'Jag är ___', tr: '___-im / -ım / -um / -üm',
        note: '"är" her kişide aynıdır: jag är, du är, vi är.',
        ex: [['Jag är trött.', 'Yorgunum.'], ['Jag är hungrig.', 'Açım.']],
        t: [['Jag är {w}.', '{w:(y)Im}.'], ['Jag är lite {w} idag.', 'Bugün biraz {w:(y)Im}.']],
      },
      {
        sv: 'Jag är ___ (meslek)', tr: '___-im (meslek)', slot: 'noun:role',
        note: 'Meslek ve milliyetten önce "en/ett" gelmez: Jag är läkare.',
        ex: [['Jag är lärare.', 'Öğretmenim.'], ['Min man är svensk.', 'Kocam İsveçli.']],
        t: [['Jag är {w}.', '{w:(y)Im}.'], ['Är du {w}?', '{w:_mIsIn}?']],
      },
      {
        sv: 'Är du ___?', tr: '___ misin?',
        note: 'Soru için fiil başa gelir: Du är → Är du?',
        ex: [['Är du hungrig?', 'Aç mısın?'], ['Är du säker?', 'Emin misin?']],
        t: [['Är du {w}?', '{w:_mIsIn}?']],
      },
      {
        sv: 'Jag är inte ___', tr: '___ değilim',
        note: '"inte" fiilden sonra gelir.',
        ex: [['Jag är inte trött.', 'Yorgun değilim.']],
        t: [['Jag är inte {w}.', '{w} değilim.']],
      },
      {
        sv: 'Vi är ___', tr: '___-iz',
        note: 'Çoğulda sıfat -a alır: trött → trötta.',
        ex: [['Vi är trötta.', 'Yorgunuz.'], ['Vi är glada.', 'Mutluyuz.']],
        t: [['Vi är {w:a}.', '{w:(y)Iz}.']],
      },
    ],
  },
  {
    id: 'itis', sv: 'Det är ___', tr: '(Bu) ___', slot: DESC,
    variants: [
      {
        sv: 'Det är ___', tr: '___',
        note: '"det" ile sıfat -t alır: kall → Det är kallt.',
        ex: [['Det är gott!', 'Lezzetli!'], ['Det är kallt idag.', 'Bugün hava soğuk.']],
        t: [['Det är {w:t}.', '{w}.'], ['Det är väldigt {w:t}.', 'Çok {w}.']],
      },
      {
        sv: 'Det är lite ___', tr: 'Biraz ___',
        ex: [['Det är lite dyrt.', 'Biraz pahalı.']],
        t: [['Det är lite {w:t}.', 'Biraz {w}.']],
      },
      {
        sv: 'Så ___!', tr: 'Ne kadar ___!',
        ex: [['Så fint!', 'Ne kadar güzel!'], ['Så gott!', 'Ne kadar lezzetli!']],
        t: [['Så {w:t}!', 'Ne kadar {w}!']],
      },
      {
        sv: 'Det är inte så ___', tr: 'O kadar ___ değil',
        ex: [['Det är inte så dyrt.', 'O kadar pahalı değil.']],
        t: [['Det är inte så {w:t}.', 'O kadar {w} değil.']],
      },
    ],
  },
  {
    id: 'understand', sv: 'Jag förstår inte', tr: 'Anlamıyorum',
    variants: [
      {
        sv: 'Jag förstår inte', tr: 'Anlamıyorum',
        ex: [['Jag förstår inte.', 'Anlamıyorum.'], ['Förstår du?', 'Anlıyor musun?']],
        t: [],
      },
      {
        sv: 'Kan du prata långsammare?', tr: 'Daha yavaş konuşur musun?',
        note: 'İsveçliler buna çok iyi karşılık verir; çekinmeden sor.',
        ex: [['Kan du prata långsammare, tack?', 'Daha yavaş konuşur musun, lütfen?'], ['Kan du upprepa?', 'Tekrar eder misin?']],
        t: [],
      },
      {
        sv: 'Jag pratar lite ___', tr: 'Biraz ___ konuşuyorum', slot: 'noun:lang',
        note: 'Dil adları "en/ett" almaz ve küçük harfle yazılır.',
        ex: [['Jag pratar lite svenska.', 'Biraz İsveççe konuşuyorum.'], ['Pratar du turkiska?', 'Türkçe konuşuyor musun?']],
        t: [['Jag pratar lite {w}.', 'Biraz {w} konuşuyorum.'], ['Pratar du {w}?', '{w} konuşuyor musun?']],
      },
    ],
  },
  {
    id: 'name', sv: 'Jag heter ___', tr: 'Benim adım ___',
    variants: [
      {
        sv: 'Jag heter ___', tr: 'Benim adım ___',
        ex: [['Jag heter Ayşe.', 'Benim adım Ayşe.'], ['Vad heter du?', 'Adın ne?']],
        t: [],
      },
      {
        sv: 'Trevligt att träffas', tr: 'Tanıştığımıza memnun oldum',
        ex: [['Trevligt att träffas!', 'Tanıştığımıza memnun oldum!'], ['Detsamma!', 'Ben de!']],
        t: [],
      },
      {
        sv: 'Hur gammal är du?', tr: 'Kaç yaşındasın?',
        note: 'Yaş söylerken "år" (yıl) denir: Jag är trettio år.',
        ex: [['Hur gammal är du?', 'Kaç yaşındasın?'], ['Jag är trettio år.', 'Otuz yaşındayım.']],
        t: [],
      },
    ],
  },
  {
    id: 'have', sv: 'Jag har ___', tr: '___-im var', slot: `noun:${FOOD}|thing|family|vehicle|abstract|event|info|ailment|animal`,
    variants: [
      {
        sv: 'Jag har ___', tr: '___-im var',
        note: 'Türkçedeki "-im var" yerine İsveççede "har" (sahibim) denir.',
        ex: [['Jag har två barn.', 'İki çocuğum var.'], ['Har du syskon?', 'Kardeşin var mı?']],
        t: [['Jag har {w:en}.', '{bir}{w:(I)m} var.'], ['Har du {w:en}?', '{w:(I)n} var mı?']],
      },
      {
        sv: 'Jag har ingen / inget ___', tr: '___-im yok',
        note: 'en-kelime: ingen, ett-kelime: inget. Konuşmada "Jag har inte tid" de denir.',
        ex: [['Jag har ingen bil.', 'Arabam yok.'], ['Jag har inte tid.', 'Vaktim yok.']],
        t: [['Jag har {ingen} {w}.', '{w:(I)m} yok.']],
      },
    ],
  },
  {
    id: 'need', sv: 'Jag behöver ___', tr: '___-e ihtiyacım var', slot: `noun:${FOOD}|thing|abstract|help`,
    variants: [
      {
        sv: 'Jag behöver ___', tr: '___-e ihtiyacım var',
        ex: [['Jag behöver hjälp.', 'Yardıma ihtiyacım var.'], ['Jag behöver en läkare.', 'Bir doktora ihtiyacım var.']],
        t: [['Jag behöver {w:en}.', '{w:(y)A} ihtiyacım var.'], ['Behöver du {w:en}?', '{w:(y)A} ihtiyacın var mı?']],
      },
      {
        sv: 'Jag behöver inte ___', tr: '___-e ihtiyacım yok',
        ex: [['Jag behöver ingen påse, tack.', 'Poşete ihtiyacım yok, teşekkürler.']],
        t: [['Jag behöver inte {w:en}.', '{w:(y)A} ihtiyacım yok.']],
      },
    ],
  },
  {
    id: 'this', sv: 'den här ___', tr: 'bu ___', slot: `noun:${FOOD}|thing|place|vehicle|room|area|fixture|animal`,
    variants: [
      {
        sv: 'den här / det här ___', tr: 'bu ___',
        note: 'en-kelime: den här, ett-kelime: det här. Arkasından belirli hâl gelir: den här bilen.',
        ex: [['Den här boken är bra.', 'Bu kitap iyi.'], ['Det här huset är stort.', 'Bu ev büyük.']],
        t: [['{denhar} {w:def} är bra.', 'Bu {w} iyi.'], ['Hur mycket kostar {denhar} {w:def}?', 'Bu {w} ne kadar?']],
      },
      {
        sv: 'den där / det där ___', tr: 'şu ___',
        ex: [['Jag vill ha den där tröjan.', 'Şu kazağı istiyorum.']],
        t: [['Jag vill ha {den} där {w:def}.', 'Şu {w:(y)I} istiyorum.']],
      },
      {
        sv: 'de här ___', tr: 'bu ___-ler', slot: 'noun:thing|vehicle|animal!count',
        note: 'Çoğulda "de här" ve çoğulun belirli hâli: de här böckerna.',
        ex: [['De här skorna är nya.', 'Bu ayakkabılar yeni.']],
        t: [['De här {w:pld} är bra.', 'Bu {w:lAr} iyi.']],
      },
    ],
  },
  {
    id: 'my', sv: 'min / mitt ___', tr: '___-im', slot: 'noun:thing|family|room|vehicle|animal',
    variants: [
      {
        sv: 'min / mitt ___', tr: '___-im',
        note: 'en-kelime: min, ett-kelime: mitt, çoğul: mina. İsim belirli hâl almaz: min bil.',
        ex: [['Var är min telefon?', 'Telefonum nerede?'], ['Det här är mitt hus.', 'Bu benim evim.']],
        t: [['Var är {min} {w}?', '{w:(I)m} nerede?'], ['Det här är {min} {w}.', 'Bu benim {w:(I)m}.']],
      },
      {
        sv: 'din / ditt ___', tr: '___-in',
        ex: [['Vad heter din mamma?', 'Annenin adı ne?']],
        t: [['Var är {din} {w}?', '{w:(I)n} nerede?'], ['Är det här {din} {w}?', 'Bu senin {w:(I)n_mI}?']],
      },
      {
        sv: 'hans / hennes ___', tr: '___-i (onun)',
        note: 'hans = onun (erkek), hennes = onun (kadın). Bunlar değişmez.',
        ex: [['Hans bil är ny.', 'Onun arabası yeni.']],
        t: [['Var är hennes {w}?', '{w:(s)I} nerede?']],
      },
    ],
  },
  {
    id: 'goingto', sv: 'Jag ska till ___', tr: '___-e gidiyorum', slot: PLACES,
    variants: [
      {
        sv: 'Jag ska till ___', tr: '___-e gidiyorum',
        note: '"ska" plan bildirir. Araçla gitmek "åka", yürüyerek "gå".',
        ex: [['Jag ska till jobbet.', 'İşe gidiyorum.'], ['Vi åker till Turkiet i sommar.', "Bu yaz Türkiye'ye gidiyoruz."]],
        t: [['Jag ska {w:to}.', '{w:(y)A} gidiyorum.'], ['Ska du {w:to}?', '{w:(y)A_mI} gidiyorsun?'], ['Jag åker {w:to} imorgon.', 'Yarın {w:(y)A} gidiyorum.']],
      },
    ],
  },
  {
    id: 'at', sv: 'Jag är på / i ___', tr: '___-deyim', slot: PLACES,
    variants: [
      {
        sv: 'Jag är på / i ___', tr: '___-deyim',
        note: '"på" ve "i" ikisi de "-de" demek. Binalar ve kurumlar için çoğu zaman "på" (på banken), içine girilen yerler için "i" (i parken). Ezberlemek en iyisi.',
        ex: [['Jag är hemma.', 'Evdeyim.'], ['Jag är på jobbet.', 'İşteyim.']],
        t: [['Jag är {w:at}.', '{w:DA(y)Im}.'], ['Är du {w:at}?', '{w:DA_mIsIn}?'], ['Vi ses {w:at}.', '{w:DA} görüşürüz.']],
      },
      {
        sv: 'Jag bor i ___', tr: '___-de yaşıyorum', slot: 'noun:country',
        ex: [['Jag bor i Sverige.', "İsveç'te yaşıyorum."], ['Var bor du?', 'Nerede oturuyorsun?']],
        t: [['Jag bor {w:at}.', '{w:DA} yaşıyorum.'], ['Bor du {w:at}?', '{w:DA_mI} yaşıyorsun?']],
      },
    ],
  },
  {
    id: 'isit', sv: 'Är det ___?', tr: '___ mı?', slot: DESC,
    variants: [
      {
        sv: 'Är det ___?', tr: '___ mı? / mi? / mu? / mü?',
        note: 'Soru için fiil başa gelir: Det är → Är det?',
        ex: [['Är det långt?', 'Uzak mı?'], ['Är det dyrt?', 'Pahalı mı?']],
        t: [['Är det {w:t}?', '{w:_mI}?'], ['Är det inte för {w:t}?', 'Fazla {w} değil mi?']],
      },
    ],
  },
  {
    id: 'thanks', sv: 'Tack för ___', tr: '___ için teşekkürler', slot: 'noun:help|event|treat|meal|gift',
    variants: [
      {
        sv: 'Tack för ___', tr: '___ için teşekkürler',
        note: 'İsim belirli hâl alır: Tack för maten.',
        ex: [['Tack för maten!', 'Yemek için teşekkürler!'], ['Tack för hjälpen.', 'Yardımın için teşekkürler.']],
        t: [['Tack för {w:def}!', '{w} için teşekkürler!']],
      },
      {
        sv: 'Tack för senast', tr: 'Geçen sefer için teşekkürler',
        note: 'İsveçliler bir sonraki görüşmede son buluşma için böyle teşekkür eder.',
        ex: [['Tack för senast!', 'Geçen sefer için teşekkürler!']],
        t: [],
      },
    ],
  },
  {
    id: 'seeyou', sv: 'Vi ses ___', tr: '___ görüşürüz',
    variants: [
      {
        sv: 'Vi ses ___!', tr: '___ görüşürüz!', slot: '*:soon',
        ex: [['Vi ses imorgon!', 'Yarın görüşürüz!'], ['Vi ses snart!', 'Yakında görüşürüz!']],
        t: [['Vi ses {w}!', '{w} görüşürüz!']],
      },
      {
        sv: 'Vi ses på ___!', tr: '___ görüşürüz!', slot: 'noun:day',
        note: 'Günlerle "på" denir: på måndag.',
        ex: [['Vi ses på fredag!', 'Cuma görüşürüz!']],
        t: [['Vi ses {w:at}!', '{w} görüşürüz!']],
      },
      {
        sv: 'Vi ses i ___!', tr: '___-de görüşürüz!', slot: 'noun:month',
        note: 'Aylarla "i" denir ve ay adları küçük harfle yazılır: i januari.',
        ex: [['Vi ses i juni!', 'Haziranda görüşürüz!']],
        t: [['Vi ses {w:at}!', '{w:DA} görüşürüz!']],
      },
      {
        sv: 'varje ___', tr: 'her ___', slot: 'noun:period|day|daytime',
        ex: [['Jag tränar varje vecka.', 'Her hafta spor yapıyorum.'], ['Vi fikar varje dag.', 'Her gün kahve molası veriyoruz.']],
        t: [['Jag tränar varje {w}.', 'Her {w} spor yapıyorum.']],
      },
    ],
  },
  {
    id: 'clock', sv: 'Klockan är ___', tr: 'Saat ___', slot: '*:hour',
    variants: [
      {
        sv: 'Klockan är ___', tr: 'Saat ___',
        ex: [['Vad är klockan?', 'Saat kaç?'], ['Klockan är tre.', 'Saat üç.']],
        t: [['Klockan är {w}.', 'Saat {w}.']],
      },
      {
        sv: 'klockan ___', tr: 'saat ___-de',
        ex: [['Vi ses klockan sju.', 'Saat yedide görüşürüz.']],
        t: [['Vi ses klockan {w}.', 'Saat {w:DA} görüşürüz.'], ['Jag börjar jobba klockan {w}.', 'Saat {w:DA} işe başlıyorum.']],
      },
      {
        sv: 'halv ___ / kvart över ___', tr: 'buçuk / çeyrek geçe',
        note: 'Dikkat: "halv fyra" dörde yarım saat kala, yani üç buçuk demektir.',
        ex: [['Klockan är halv fyra.', 'Saat üç buçuk.'], ['Klockan är kvart över två.', 'Saat ikiyi çeyrek geçiyor.']],
        t: [],
      },
    ],
  },
  {
    id: 'howto', sv: 'Hur kommer jag till ___?', tr: '___-e nasıl giderim?', slot: 'noun:place|area|country|agency',
    variants: [
      {
        sv: 'Hur kommer jag till ___?', tr: '___-e nasıl giderim?',
        ex: [['Hur kommer jag till stationen?', 'İstasyona nasıl giderim?']],
        t: [['Hur kommer jag {w:to}?', '{w:(y)A} nasıl giderim?']],
      },
      {
        sv: 'Är det långt till ___?', tr: '___ uzak mı?',
        ex: [['Är det långt till centrum?', 'Şehir merkezi uzak mı?']],
        t: [['Är det långt {w:to}?', '{w} uzak mı?']],
      },
      {
        sv: 'Hur lång tid tar det till ___?', tr: '___-e ne kadar sürer?',
        ex: [['Hur lång tid tar det till flygplatsen?', 'Havalimanına ne kadar sürer?']],
        t: [['Hur lång tid tar det {w:to}?', '{w:(y)A} ne kadar sürer?']],
      },
    ],
  },
  {
    id: 'looking', sv: 'Jag letar efter ___', tr: '___ arıyorum', slot: 'noun:place|thing',
    variants: [
      {
        sv: 'Jag letar efter ___', tr: '___ arıyorum',
        ex: [['Jag letar efter ett apotek.', 'Bir eczane arıyorum.']],
        t: [['Jag letar efter {w:en}.', '{bir}{w} arıyorum.']],
      },
      {
        sv: 'Jag letar efter ___-en', tr: '___-i arıyorum',
        note: 'Belli bir şey için belirli hâl: nyckeln = anahtar (o anahtar).',
        ex: [['Jag letar efter nyckeln.', 'Anahtarı arıyorum.'], ['Jag hittar inte min väska.', 'Çantamı bulamıyorum.']],
        t: [['Jag letar efter {w:def}.', '{w:(y)I} arıyorum.'], ['Jag hittar inte {w:def}.', '{w:(y)I} bulamıyorum.']],
      },
      {
        sv: 'Var kan jag köpa ___?', tr: '___ nereden alabilirim?', slot: NOUN_THINGS,
        ex: [['Var kan jag köpa en biljett?', 'Bilet nereden alabilirim?']],
        t: [['Var kan jag köpa {w:en}?', '{w} nereden alabilirim?']],
      },
    ],
  },
  {
    id: 'from', sv: 'Jag kommer från ___', tr: '___-den geliyorum', slot: 'noun:country|place|room|home',
    variants: [
      {
        sv: 'Jag kommer från ___', tr: '___-den geliyorum',
        note: 'Hem nereli olduğunu hem de nereden geldiğini söyler.',
        ex: [['Jag kommer från Turkiet.', "Türkiye'den geliyorum."], ['Jag kommer från jobbet.', 'İşten geliyorum.']],
        t: [['Jag kommer {w:from}.', '{w:DAn} geliyorum.']],
      },
      {
        sv: 'Var kommer du ifrån?', tr: 'Nerelisin?',
        ex: [['Var kommer du ifrån?', 'Nerelisin?'], ['Jag är från Istanbul.', "İstanbul'luyum."]],
        t: [],
      },
    ],
  },
  {
    id: 'hurts', sv: 'Jag har ont i ___', tr: '___-im ağrıyor', slot: 'noun:body',
    variants: [
      {
        sv: 'Jag har ont i ___', tr: '___-im ağrıyor',
        note: 'Vücut kısmı belirli hâl alır: ont i huvudet.',
        ex: [['Jag har ont i huvudet.', 'Başım ağrıyor.'], ['Jag har ont i magen.', 'Midem ağrıyor.']],
        t: [['Jag har ont i {w:def}.', '{w:(I)m} ağrıyor.'], ['Har du ont i {w:def}?', '{w:(I)n} ağrıyor mu?']],
      },
      {
        sv: 'Det gör ont i ___', tr: '___-im acıyor',
        ex: [['Det gör ont här.', 'Burası acıyor.']],
        t: [['Det gör ont i {w:def}.', '{w:(I)m} acıyor.']],
      },
    ],
  },
  {
    id: 'by', sv: 'Jag åker ___', tr: '___-le gidiyorum', slot: 'noun:ride',
    variants: [
      {
        sv: 'Jag åker ___', tr: '___-le gidiyorum',
        note: 'Araç adı yalın kalır: Jag åker buss. Bisiklet için "cykla", uçak için "flyga" denir.',
        ex: [['Jag åker buss till jobbet.', 'İşe otobüsle gidiyorum.'], ['Vi åker tåg.', 'Trenle gidiyoruz.']],
        t: [['Jag åker {w}.', '{w:(y)lA} gidiyorum.'], ['Åker du {w}?', '{w:(y)lA_mI} gidiyorsun?']],
      },
      {
        sv: 'Jag tar ___', tr: '___-e biniyorum',
        ex: [['Jag tar bussen.', 'Otobüse biniyorum.']],
        t: [['Jag tar {w:def}.', '{w:(y)A} biniyorum.']],
      },
    ],
  },
  {
    id: 'withwithout', sv: 'med / utan ___', tr: '___-li / ___-siz', slot: 'noun:ingr',
    variants: [
      {
        sv: 'utan ___', tr: '___-siz',
        ex: [['Kaffe utan socker, tack.', 'Şekersiz kahve, lütfen.']],
        t: [['Utan {w}, tack.', '{w:sIz}, lütfen.'], ['Finns det {w} i den?', 'İçinde {w} var mı?']],
      },
      {
        sv: 'med ___', tr: '___-li',
        ex: [['Te med mjölk, tack.', 'Sütlü çay, lütfen.']],
        t: [['Med {w}, tack.', '{w:lI} olsun, lütfen.']],
      },
    ],
  },
  {
    id: 'like', sv: 'Jag gillar ___', tr: '___ severim', slot: 'noun:food|drink|hobby|animal',
    variants: [
      {
        sv: 'Jag gillar ___', tr: '___ severim',
        note: 'Genel olarak sevdiğin şeyler çoğul söylenir: Jag gillar hundar. Sayılamayanlar yalın: Jag gillar kaffe.',
        ex: [['Jag gillar svensk mat.', 'İsveç yemeklerini severim.'], ['Gillar du fisk?', 'Balık sever misin?']],
        t: [['Jag gillar {w:gen}.', '{w} severim.'], ['Gillar du {w:gen}?', '{w} sever misin?']],
      },
      {
        sv: 'Jag älskar ___', tr: '___-e bayılıyorum',
        ex: [['Jag älskar kanelbullar!', 'Tarçınlı çöreklere bayılıyorum!']],
        t: [['Jag älskar {w:gen}!', '{w:(y)A} bayılıyorum!']],
      },
      {
        sv: 'Jag tycker om ___', tr: '___-den hoşlanırım',
        ex: [['Jag tycker om musik.', 'Müzikten hoşlanırım.']],
        t: [['Jag tycker om {w:gen}.', '{w:DAn} hoşlanırım.']],
      },
      {
        sv: 'Jag gillar inte ___', tr: '___ sevmem',
        ex: [['Jag gillar inte kaffe.', 'Kahve sevmem.']],
        t: [['Jag gillar inte {w:gen}.', '{w} sevmem.']],
      },
    ],
  },
  {
    id: 'think', sv: 'Jag tycker att det är ___', tr: 'Bence ___', slot: DESC,
    variants: [
      {
        sv: 'Jag tycker att det är ___', tr: 'Bence ___',
        note: '"tycka" fikir bildirir; "tänka" düşünme eylemidir.',
        ex: [['Jag tycker att det är bra.', 'Bence iyi.'], ['Vad tycker du?', 'Sen ne düşünüyorsun?']],
        t: [['Jag tycker att det är {w:t}.', 'Bence {w}.'], ['Tycker du att det är {w:t}?', 'Sence {w:_mI}?']],
      },
      {
        sv: 'Det ser ___ ut', tr: '___ görünüyor',
        note: 'Sıfat "ser" ile "ut" arasına girer.',
        ex: [['Det ser gott ut!', 'Lezzetli görünüyor!']],
        t: [['Det ser {w:t} ut.', '{w} görünüyor.']],
      },
      {
        sv: 'Jag tror att …', tr: 'Sanırım …',
        ex: [['Jag tror att han kommer.', 'Sanırım o gelecek.'], ['Jag tror det.', 'Sanırım öyle.']],
        t: [],
      },
    ],
  },
  {
    id: 'more', sv: '___-are / mest ___', tr: 'daha ___ / en ___', slot: 'adj:comp',
    variants: [
      {
        sv: '___-are', tr: 'daha ___',
        note: 'Karşılaştırma -are ile: billig → billigare. Düzensizler: bra → bättre, stor → större.',
        ex: [['Har ni något billigare?', 'Daha ucuz bir şey var mı?'], ['Det är bättre.', 'Daha iyi.']],
        t: [['Den här är {w:komp}.', 'Bu daha {w}.'], ['Har du något {w:komp}?', 'Daha {w} bir şey var mı?']],
      },
      {
        sv: '___-are än ___', tr: '___-den daha ___',
        ex: [['Det är kallare än igår.', 'Dünden daha soğuk.']],
        t: [['Det är {w:komp} än igår.', 'Dünden daha {w}.']],
      },
      {
        sv: '___-ast', tr: 'en ___',
        ex: [['Vilken är bäst?', 'Hangisi en iyi?']],
        t: [['Den här är {w:superl}.', 'Bu en {w}.']],
      },
    ],
  },
  {
    id: 'nextlast', sv: 'förra / nästa ___', tr: 'geçen / gelecek ___', slot: 'noun:period|day',
    variants: [
      {
        sv: 'förra ___', tr: 'geçen ___',
        note: '"förra" ile isim belirli hâl alır: förra veckan.',
        ex: [['Jag var i Turkiet förra månaden.', "Geçen ay Türkiye'deydim."]],
        t: [['Jag var här förra {w:def}.', 'Geçen {w} buradaydım.']],
      },
      {
        sv: 'nästa ___', tr: 'gelecek ___',
        note: '"nästa" ile isim yalın kalır: nästa vecka.',
        ex: [['Vi ses nästa vecka!', 'Gelecek hafta görüşürüz!']],
        t: [['Vi ses nästa {w}.', 'Gelecek {w} görüşürüz.']],
      },
      {
        sv: 'den här ___', tr: 'bu ___',
        ex: [['Jag är ledig den här veckan.', 'Bu hafta izinliyim.']],
        t: [['Jag är ledig {denhar} {w:def}.', 'Bu {w} izinliyim.']],
      },
    ],
  },
  {
    id: 'howmany', sv: 'Hur många ___?', tr: 'Kaç ___?', slot: 'noun:thing|family|vehicle|animal!count',
    variants: [
      {
        sv: 'Hur många ___?', tr: 'Kaç ___?',
        note: 'Türkçede sayıdan sonra isim tekil kalır; İsveççede çoğul olur: två barn, tre bilar.',
        ex: [['Hur många barn har du?', 'Kaç çocuğun var?'], ['Hur många år har du bott här?', 'Kaç yıldır burada oturuyorsun?']],
        t: [['Hur många {w:pl} har du?', 'Kaç {w:(I)n} var?'], ['Hur många {w:pl} behöver du?', 'Kaç {w} lazım?']],
      },
      {
        sv: 'Det tar ___', tr: '___ sürer', slot: 'noun:unit!count',
        note: 'Süre söylerken: Det tar två timmar = İki saat sürer.',
        ex: [['Det tar tio minuter.', 'On dakika sürer.']],
        t: [['Det tar två {w:pl}.', 'İki {w} sürer.'], ['Det tar några {w:pl}.', 'Birkaç {w} sürer.']],
      },
      {
        sv: 'två ___, tack', tr: 'iki ___, lütfen', slot: 'noun:measure!count',
        ex: [['Ett kilo tomater, tack.', 'Bir kilo domates, lütfen.']],
        t: [['Två {w:pl}, tack.', 'İki {w}, lütfen.']],
      },
    ],
  },
  {
    id: 'whatcalled', sv: 'Vad heter ___ på svenska?', tr: '___ İsveççede ne?',
    variants: [
      {
        sv: 'Vad heter det på svenska?', tr: 'Bunun İsveççesi ne?',
        note: 'Öğrenirken en faydalı soru.',
        ex: [['Vad heter det på svenska?', 'Bunun İsveççesi ne?'], ['Hur säger man "teşekkürler" på svenska?', '"Teşekkürler" İsveççede nasıl denir?']],
        t: [],
      },
      {
        sv: 'Vad betyder ___?', tr: '___ ne demek?',
        ex: [['Vad betyder "fika"?', '"Fika" ne demek?'], ['Hur stavas det?', 'Nasıl yazılıyor?']],
        t: [],
      },
    ],
  },
];

export const PATTERNS = [...EVERYDAY.map((p) => ({ ...p, group: 'everyday' }))];

// "Most useful" order: how often each pattern comes up when talking with Swedes.
export const ORDER = [
  'want', 'finns', 'where', 'price', 'iam', 'itis', 'understand', 'name', 'have', 'need',
  'this', 'my', 'goingto', 'at', 'isit', 'thanks', 'seeyou', 'clock', 'howto', 'looking',
  'from', 'hurts', 'by', 'withwithout', 'like', 'think', 'more', 'nextlast', 'howmany', 'whatcalled',
];
PATTERNS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
