// Dil bilgisi kitabı: bölümlerin listesi; her bölüm bloklardan oluşan bir sayfa (js/guideview.js).
// Metinlerde *x* kalın görünür. İlk bölüm alfabedir. Örnek çiftlerinde ilki İsveççe, ikincisi Türkçedir.

export const KITAP = [
  {
    id: 'harfler',
    chapter: 'Sesler ve harfler',
    icon: '🔤',
    title: 'Harfler ve sesler',
    sub: '29 harf ve zor sesler',
    blocks: [{ alphabet: true }],
  },
  {
    id: 'unlu',
    chapter: 'Sesler ve harfler',
    icon: '📏',
    title: 'Uzun ve kısa ünlüler',
    sub: 'tak ve tack: uzunluk anlamı değiştirir',
    blocks: [
      { p: 'Türkçede bir ünlüyü uzun ya da kısa söylemek anlamı pek değiştirmez. İsveççede değiştirir: *tak* (tavan) ile *tack* (teşekkürler) ayrı kelimelerdir. Neyse ki uzunluğu çoğu zaman yazıdan anlayabilirsin:' },
      {
        list: [
          'Vurgulu ünlüden sonra tek ünsüz varsa ya da ünlü kelimenin sonundaysa ünlü *uzundur*: tak, glas, bo.',
          'Arkasında iki ünsüz varsa (çift ya da farklı) ünlü genelde *kısadır*: tack, glass, hund. Ama rd ve rn önünde çoğu zaman uzundur: barn, bord.',
          'Vurgusuz hecelerdeki ünlüler hep kısadır: flick*a*, skol*a*.',
        ],
      },
      { p: 'Kısa ünlüden sonra ünsüz biraz uzar, tıpkı Türkçedeki *elli* ve *anne* gibi: *villa* "vil-la" diye okunur, *vila* ise "vi:la" diye.' },
      {
        table: {
          head: ['Uzun', 'Türkçe', 'Kısa', 'Türkçe'],
          rows: [
            ['tak', 'tavan', 'tack', 'teşekkürler'],
            ['glas', 'bardak', 'glass', 'dondurma'],
            ['vila', 'dinlenmek', 'villa', 'müstakil ev'],
            ['ful', 'çirkin', 'full', 'dolu'],
          ],
        },
      },
      { p: 'İstisna: kelime sonundaki m genelde tek yazılır, n de birçok küçük kelimede. Bu yüzden *han*, *hon*, *vem*, *hem* tek ünsüze rağmen kısa okunur. Ek gelince çift harf ortaya çıkar: hem → hem*m*a, rum → rum*m*et.' },
      { p: 'Ek, kökteki ünlünün uzunluğunu genelde değiştirmez: stor → stor*t*, läsa → läs*te*; ünlü iki ünsüze rağmen uzun kalır. Ama bazı sıfatlarda ett-kelimeyle gelen -t eki -tt olur ve ünlü kısalır (*Sıfat uyumu* bölümüne bak): röd → rö*tt*, vit → vi*tt*, ny → ny*tt*.' },
      {
        ex: [
          ['*Tack* för maten!', 'Yemek için teşekkürler!'],
          ['Jag vill *vila* lite.', 'Biraz dinlenmek istiyorum.'],
          ['Vi bor i en *villa*.', 'Müstakil bir evde oturuyoruz.'],
          ['Taket är *vitt*.', 'Tavan beyaz.'],
        ],
      },
      { tip: 'Bir ünlüyü nasıl okuyacağını bilmiyorsan arkasındaki ünsüzleri say. Yanlış uzunluk başka bir kelime çıkarır: *Tack!* derken a\'yı uzatırsan "tavan" demiş olursun.' },
    ],
  },
  {
    id: 'unsuz',
    chapter: 'Sesler ve harfler',
    icon: '👄',
    title: 'Yumuşayan ve kaynaşan ünsüzler',
    sub: 'k, g, sk ünlüye göre değişir; r ise kaynaşır',
    blocks: [
      { p: "İsveççede *k*, *g* ve *sk*'nin nasıl okunacağı arkalarından gelen ünlüye bağlıdır. Bu kural için ünlüler iki gruba ayrılır: sert ünlüler (a, o, u, å) ve yumuşak ünlüler (e, i, y, ä, ö)." },
      {
        table: {
          head: ['', 'a, o, u, å önünde', 'e, i, y, ä, ö önünde'],
          rows: [
            ['k', 'k: ko (inek)', 'ş: kör (sürüyor)'],
            ['g', 'g: gå (gitmek)', 'y: göra (yapmak)'],
            ['sk', 'sk: skal (kabuk)', 'ş: sked (kaşık)'],
          ],
        },
      },
      { p: 'Yumuşak ünlüler Türkçedeki ince ünlülere benzer. Türkçede de *kedi*\'deki k, *kaş*\'taki k\'den biraz incedir; İsveççede bu fark çok daha büyüktür.' },
      { p: 'Kural kelimenin (ya da vurgulu hecenin) başında geçerlidir. Kelime içinde k ve g genelde sert kalır (tycker, pojke), ek gelince de değişmez: dag → dag*en*, bok → bok*en*. Birkaç sık kelime de kurala uymaz, k sert okunur: *kille* (oğlan), *kex* (bisküvi), *keps* (kasket).' },
      { p: 'r, arkasından gelen *s*, *t*, *d* ya da *n* ile kaynaşır: dilin ucu geriye kıvrılır ve r ayrıca duyulmaz. rs neredeyse ş olur: kors (haç). rt, rd, rn de tek ses gibidir: kort (kart), bord (masa), barn (çocuk). Bu, iki kelime arasında da olur: har du, "ha:dü" gibi okunur.' },
      {
        ex: [
          ['Kan jag få en *sked*?', 'Bir kaşık alabilir miyim?'],
          ['Vad ska vi *göra* idag?', 'Bugün ne yapalım?'],
          ['*Kycklingen* är god.', 'Tavuk lezzetli.'],
          ['*Förstår* du?', 'Anlıyor musun?'],
          ['Kan jag betala med *kort*?', 'Kartla ödeyebilir miyim?'],
        ],
      },
      { tip: 'Yeni bir kelimenin başında k, g ya da sk görünce hemen arkasındaki ünlüye bak: e, i, y, ä, ö ise yumuşak oku. Ek gelince ses değişmez. İstisnaları (kille gibi) tek tek öğren.' },
    ],
  },
  {
    id: 'sira',
    chapter: 'Cümle',
    icon: '🔀',
    title: 'Kelime sırası: fiil ikinci sırada',
    sub: 'İsveççede fiil hep ikinci yerde durur',
    blocks: [
      { p: 'Türkçede fiil cümlenin sonuna gider. İsveççede ise ana cümlede fiil her zaman *ikinci sırada* durur.' },
      { p: '"İkinci sıra" ikinci kelime demek değildir, ikinci *öğe* demektir. İlk öğe tek kelime ya da bir kelime grubu olabilir: *Jag* (ben), *Min syster* (kız kardeşim), *Idag* (bugün).' },
      {
        table: {
          head: ['', 'Türkçe', 'İsveççe'],
          rows: [
            ['Fiil', 'sonda', 'ikinci sırada'],
            ['Başta zaman varsa', 'fiil yine sonda', 'fiil yine ikinci, özne arkasında'],
          ],
        },
      },
      { p: 'Cümleye özneyle değil de başka bir şeyle (örneğin zamanla) başlarsan fiil yine ikinci sırada kalır. Bu yüzden özne fiilin arkasına geçer:' },
      {
        ex: [
          ['Jag *dricker* kaffe idag.', 'Ben bugün kahve içiyorum.'],
          ['Idag *dricker* jag kaffe.', 'Bugün kahve içiyorum.'],
          ['Imorgon *åker* vi till Stockholm.', "Yarın Stockholm'a gidiyoruz."],
        ],
      },
      { tip: 'Kontrol et: fiilden önce yalnızca tek bir öğe var mı? Varsa cümle doğrudur. "Idag jag dricker kaffe" yanlıştır, çünkü fiilden önce iki öğe var.' },
    ],
  },
  {
    id: 'vara',
    chapter: 'Cümle',
    icon: '🟰',
    title: '"Olmak" ve "var"',
    sub: 'är, det finns ve har',
    blocks: [
      { p: 'Türkçede "olmak" şimdiki zamanda görünmez; işi ekler ve *var* görür. İsveççede her biri için ayrı bir fiil vardır:' },
      {
        table: {
          head: ['Türkçe', 'İsveççe'],
          rows: [
            ['Evde*yim*.', 'Jag *är* hemma.'],
            ['Evde kahve *var*.', 'Det *finns* kaffe hemma.'],
            ['Araba*m var*.', 'Jag *har* en bil.'],
          ],
        },
      },
      { p: '*är* (mastarı *vara*) herkes için aynıdır: jag är, du är, vi är. Hiçbir zaman atlanmaz: "Jag trött" değil, "Jag *är* trött".' },
      { p: '*det finns* "var" demektir; olumsuzu *det finns inte* ya da *det finns ingen*, sorusu *finns det…?* olur. "Benim … var" için ise *har* kullanılır: Jag har inte tid. (Vaktim yok.)' },
      { p: '*det finns* ile *det är* farklıdır. *det finns* bir şeyin var olduğunu söyler: Det finns mat i kylen. (Buzdolabında yemek var.) *det är* ise "bu / o …dır" demektir: Det är min man. (Bu benim kocam.) Bilinen birinin ya da bir şeyin yerini de *är* söyler, tıpkı Türkçede "var" demediğimiz gibi: Mamma är i köket. (Annem mutfakta.)' },
      {
        ex: [
          ['Jag *är* lite trött idag.', 'Bugün biraz yorgunum.'],
          ['*Finns det* en bank här i närheten?', 'Buralarda bir banka var mı?'],
          ['Det *finns* ingen mjölk kvar.', 'Hiç süt kalmamış.'],
          ['*Har* du tid imorgon?', 'Yarın vaktin var mı?'],
        ],
      },
      { tip: 'Türkçedeki *var* ile İsveççedeki *var* aynı kelime değildir. İsveççede *var* "idi" (Jag var hemma: Evdeydim) ya da "nerede" demektir. Türkçedeki "var" için *det finns*, "-im var" için *har* kullan.' },
    ],
  },
  {
    id: 'soru',
    chapter: 'Cümle',
    icon: '❓',
    title: 'Sorular',
    sub: 'Fiil başa geçer; vad, var, när, hur…',
    blocks: [
      { p: 'Türkçede soru için *mi* eki kullanılır: Geliyor musun? İsveççede soru eki yoktur. Evet/hayır sorusunda fiil en başa geçer: Du kommer → *Kommer* du?' },
      { p: 'Soru kelimesi varsa önce soru kelimesi, sonra fiil, sonra özne gelir: Var *bor* du? (Nerede oturuyorsun?)' },
      {
        table: {
          head: ['İsveççe', 'Türkçe'],
          rows: [
            ['vad', 'ne'],
            ['var', 'nerede'],
            ['vart', 'nereye'],
            ['när', 'ne zaman'],
            ['hur', 'nasıl'],
            ['varför', 'neden'],
            ['vem', 'kim'],
            ['vilken / vilket / vilka', 'hangi'],
            ['hur mycket', 'ne kadar'],
          ],
        },
      },
      {
        ex: [
          ['*Kommer* du imorgon?', 'Yarın geliyor musun?'],
          ['*Har* du barn?', 'Çocuğun var mı?'],
          ['Vad *heter* du?', 'Adın ne?'],
          ['Var *kommer* du ifrån?', 'Nerelisin?'],
          ['Hur mycket *kostar* den?', 'Bu ne kadar?'],
        ],
      },
      { tip: 'Soru kelimesinden sonra özne değil, fiil gelir: "Var du bor?" değil, "Var *bor* du?". *var* (nerede) ile *vart* (nereye) farkı da Türkçedeki -de / -e farkı gibidir: Vart ska du? (Nereye gidiyorsun?)' },
    ],
  },
  {
    id: 'inte',
    chapter: 'Cümle',
    icon: '🚫',
    title: "inte'nin yeri",
    sub: 'Ana cümlede fiilden sonra, yan cümlede fiilden önce',
    blocks: [
      { p: 'Türkçede olumsuzluk fiilin içindeki bir ektir: anla*mı*yorum. İsveççede ayrı bir kelimedir: *inte*. Nereye geleceği cümlenin türüne bağlıdır.' },
      {
        table: {
          head: ['Cümle', 'Sıra'],
          rows: [
            ['Ana cümle', 'özne + fiil + *inte*'],
            ['İki fiil', 'özne + kan + *inte* + mastar'],
            ['Başta zaman', 'Idag + fiil + özne + *inte*'],
            ['Yan cümle', 'att + özne + *inte* + fiil'],
          ],
        },
      },
      { p: 'Ana cümlede *inte* fiilden sonra gelir; iki fiil varsa ilkinden sonra. Yan cümlede ise (att, som, när, om, eftersom ile başlayan cümle parçası) fiilden önce gelir.' },
      { p: '*aldrig* (asla), *alltid* (hep) ve *också* (de) da aynı yere gelir: Jag röker aldrig.' },
      {
        ex: [
          ['Jag förstår *inte*.', 'Anlamıyorum.'],
          ['Hon vill *inte* äta.', 'Yemek istemiyor.'],
          ['Idag jobbar jag *inte*.', 'Bugün çalışmıyorum.'],
          ['Han säger att han *inte* har tid.', 'Vakti olmadığını söylüyor.'],
        ],
      },
      { tip: 'Yan cümlede ana cümle sırasını kullanma: "…att han har inte tid" değil, "…att han *inte* har tid". att, som, när, om, eftersom gördüğünde *inte* fiilden önce gelir.' },
    ],
  },
  {
    id: 'enett',
    chapter: 'İsimler ve sıfatlar',
    icon: '🏷️',
    title: 'en ve ett',
    sub: 'Her isim ya en ya da ett alır',
    blocks: [
      { p: 'Türkçede isimlerin cinsi yoktur; "bir" her isimle aynıdır. İsveççede ise iki ayrı "bir" vardır: *en* ve *ett*. Her isim bunlardan yalnızca birini alır.' },
      {
        table: {
          head: ['en-kelime', 'ett-kelime'],
          rows: [
            ['*en* bil (araba)', '*ett* hus (ev)'],
            ['*en* kopp (fincan)', '*ett* glas (bardak)'],
            ['*en* stol (sandalye)', '*ett* bord (masa)'],
            ['*en* dag (gün)', '*ett* år (yıl)'],
          ],
        },
      },
      { p: 'Hangi ismin hangisini aldığını gösteren bir kural yoktur. İyi haber: isimlerin yaklaşık dörtte üçü *en* alır. Emin değilsen *en* kullan; çoğu zaman doğru çıkar.' },
      { p: 'Cins önemlidir, çünkü başka kelimeler de ona göre değişir: belirli hâl (bil*en*, hus*et*), sıfat (ett stor*t* hus) ve "benim" (min bil, mi*tt* hus). Bunları sonraki bölümlerde göreceksin.' },
      {
        ex: [
          ['Jag vill ha *en* kopp kaffe.', 'Bir fincan kahve istiyorum.'],
          ['Kan jag få *ett* glas vatten?', 'Bir bardak su alabilir miyim?'],
          ['Vi har *ett* hus och *en* bil.', 'Bir evimiz ve bir arabamız var.'],
        ],
      },
      { tip: 'Türkçede "bir"i çoğu zaman söylemeyiz: "Kitap okuyorum." İsveççede sayılabilen tek bir şeyden önce *en* ya da *ett* gerekir: Jag läser *en* bok. Meslekten önce ise gelmez: Hon är läkare. Sıfat varsa gelir: Hon är *en* duktig läkare. Yeni bir ismi de hep *en* ya da *ett* ile birlikte ezberle: "bil" değil, "en bil".' },
    ],
  },
  {
    id: 'belirli',
    chapter: 'İsimler ve sıfatlar',
    icon: '🎯',
    title: '"Belirli" eki',
    sub: 'bilen, huset: bilinen şey için ismin sonuna ek',
    blocks: [
      { p: 'Türkçede hangi şeyden söz ettiğimizi çoğu zaman bağlamdan anlarız. İsveççede bunu ismin sonuna gelen bir ek gösterir. Buna belirli hâl denir: en bil (bir araba) → bil*en* (araba, yani bildiğimiz araba).' },
      { p: 'Daha önce söz edilen, herkesin bildiği ya da tek olan şey belirli hâl alır: sol*en* (güneş).' },
      {
        table: {
          head: ['', 'en-kelime', 'ett-kelime'],
          rows: [
            ['Ünsüzle biten', 'bil → bil*en*', 'hus → hus*et*'],
            ['Ünlüyle biten', 'skola → skola*n*', 'äpple → äpple*t*'],
          ],
        },
      },
      { p: 'Dikkat: -el ve -er ile biten en-kelimeler yalnızca *-n* alır: nyckel → nyckel*n*, syster → syster*n*. Son hecesi vurgusuz ve -el, -er ya da -en ile biten ett-kelimelerde ise kelimenin son e\'si düşer: vatten → vatt*net*, fönster → fönst*ret*, socker → sock*ret*.' },
      { p: 'Araya sıfat girerse belirlilik iki kez gösterilir: önde *den* (ett-kelimede *det*), sonda yine ek. Sıfat ise *-a* alır: *den* stora bil*en*, *det* stora hus*et*.' },
      {
        ex: [
          ['Var är toalett*en*?', 'Tuvalet nerede?'],
          ['Vi har en bil. Bil*en* är gammal.', 'Bir arabamız var. Araba eski.'],
          ['Hur mycket kostar *den* röda jacka*n*?', 'Kırmızı mont ne kadar?'],
        ],
      },
      { tip: 'Sıfat varsa iki parçayı da kullan: "stora bilen" ya da "den stora bil" değil, *den* stora bil*en*.' },
    ],
  },
  {
    id: 'cogul',
    chapter: 'İsimler ve sıfatlar',
    icon: '🍎',
    title: 'Beş çoğul grubu',
    sub: '-or, -ar, -er, -n ya da hiç ek yok',
    blocks: [
      { p: 'Türkçede tek bir çoğul eki vardır: -ler / -lar. İsveççede ise beş grup vardır. Kelimenin grubunu çoğu zaman sonundan tahmin edebilirsin, ama en güvenlisi çoğulu da kelimeyle birlikte öğrenmektir.' },
      {
        table: {
          head: ['Ek', 'Tekil', 'Çoğul', 'Belirli çoğul'],
          rows: [
            ['*-or*', 'en flicka (kız)', 'flickor', 'flickorna'],
            ['*-ar*', 'en bil (araba)', 'bilar', 'bilarna'],
            ['*-er*', 'en park (park)', 'parker', 'parkerna'],
            ['*-n*', 'ett äpple (elma)', 'äpplen', 'äpplena'],
            ['ek yok', 'ett hus (ev)', 'hus', 'husen'],
          ],
        },
      },
      { p: 'İpuçları: -a ile biten en-kelimeler genelde *-or* alır (skola → skolor). Birçok kısa en-kelime *-ar* alır (dag → dagar). Son hecesi vurgulu, yabancı kökenli kelimeler genelde *-er* alır (telefon → telefoner); bu gruptaki ünlüyle biten kelimeler yalnızca *-r* alır (sko → skor). Ünlüyle biten ett-kelimeler *-n* alır, ünsüzle bitenler genelde hiç ek almaz (barn → barn).' },
      {
        ex: [
          ['Vi har två bil*ar*.', 'İki arabamız var.'],
          ['Var är mina sko*r*?', 'Ayakkabılarım nerede?'],
          ['Jag köper tre äpple*n*.', 'Üç elma alıyorum.'],
          ['Barn*en* leker i parken.', 'Çocuklar parkta oynuyor.'],
        ],
      },
      { tip: 'Türkçede sayıdan sonra isim tekil kalır: iki araba. İsveççede çoğul olur: två bil*ar*, tre äpple*n*. "Två bil" yanlıştır.' },
    ],
  },
  {
    id: 'sifat',
    chapter: 'İsimler ve sıfatlar',
    icon: '🎨',
    title: 'Sıfat uyumu',
    sub: 'stor, stort, stora: sıfat ismine uyar',
    blocks: [
      { p: 'Türkçede sıfat hiç değişmez: büyük araba, büyük ev, büyük evler. İsveççede sıfat, ait olduğu isme uyar ve ek alır.' },
      {
        table: {
          head: ['', 'en-kelime', 'ett-kelime', 'Çoğul'],
          rows: [
            ['büyük', 'stor', 'stor*t*', 'stor*a*'],
            ['güzel', 'fin', 'fin*t*', 'fin*a*'],
            ['yeni', 'ny', 'ny*tt*', 'ny*a*'],
            ['küçük', 'liten', 'lit*et*', '*små*'],
          ],
        },
      },
      { p: 'Kısaca: en-kelimeyle ek gelmez, ett-kelimeyle *-t*, çoğulda *-a* gelir. Belirli hâlde de sıfat hep *-a* alır: den stor*a* bilen. *liten* düzensizdir: çoğulda *små*, belirli hâlde *lilla* olur (den lilla bilen).' },
      { p: 'Sıfat *är* fiilinden sonra gelse de uyum aynıdır: ett stor*t* hus → Huset är stor*t*.' },
      {
        ex: [
          ['Vi har ett stor*t* kök.', 'Büyük bir mutfağımız var.'],
          ['Barnen är trött*a*.', 'Çocuklar yorgun.'],
          ['Det är kall*t* idag.', 'Bugün hava soğuk.'],
        ],
      },
      { tip: '*är* fiilinden sonra da uyumu unutma: "Vi är trött" değil, "Vi är trött*a*". *Det är*\'den sonra sıfat tek başına geliyorsa (arkasında isim yoksa) -t alır: Det är dyr*t*! (Pahalı!)' },
    ],
  },
  {
    id: 'karsilastirma',
    chapter: 'İsimler ve sıfatlar',
    icon: '⚖️',
    title: 'Karşılaştırma',
    sub: 'daha ve en: billigare, billigast',
    blocks: [
      { p: 'Türkçede karşılaştırma için *daha* ve *en* kullanılır: daha ucuz, en ucuz. İsveççede çoğu zaman sıfatın sonuna bir ek gelir: *-are* (daha) ve *-ast* (en).' },
      {
        table: {
          head: ['', '*-are* (daha)', '*-ast* (en)'],
          rows: [
            ['billig (ucuz)', 'billigare', 'billigast'],
            ['dyr (pahalı)', 'dyrare', 'dyrast'],
            ['varm (sıcak)', 'varmare', 'varmast'],
          ],
        },
      },
      { p: 'Sık kullanılan bazı sıfatlar düzensizdir:' },
      {
        table: {
          head: ['', 'daha', 'en'],
          rows: [
            ['bra (iyi)', 'bättre', 'bäst'],
            ['dålig (kötü)', 'sämre', 'sämst'],
            ['stor (büyük)', 'större', 'störst'],
            ['liten (küçük)', 'mindre', 'minst'],
            ['gammal (yaşlı)', 'äldre', 'äldst'],
          ],
        },
      },
      { p: 'Uzun sıfatlarla *mer* (daha) ve *mest* (en) kullanılır: mer intressant. "-den daha" için *än* denir: Taxi är dyrare *än* buss (Taksi otobüsten pahalı).' },
      {
        ex: [
          ['Den här är billig*are*.', 'Bu daha ucuz.'],
          ['Min man är *äldre* än jag.', 'Kocam benden büyük.'],
          ['Vilken är *bäst*?', 'Hangisi en iyi?'],
          ['Din svenska blir *bättre* och *bättre*!', 'İsveççen gittikçe iyileşiyor!'],
        ],
      },
      { tip: 'Türkçedeki "-den" yüzünden *från* deme; karşılaştırmada hep *än* kullanılır: "billigare från" değil, "billigare *än*". İki işareti birden de koyma: "mer billigare" yanlış, yalnızca "billigare".' },
    ],
  },
  {
    id: 'zamir',
    chapter: 'Küçük kelimeler',
    icon: '🙋',
    title: 'Zamirler',
    sub: 'jag, du, han, hon… ve mig, dig, honom…',
    blocks: [
      { p: 'Türkçede zamiri çoğu zaman söylemeyiz, çünkü fiilin eki kişiyi gösterir: geliyor*um*. İsveççede fiil kişiye göre değişmez, bu yüzden zamir hep söylenir: *Jag* kommer.' },
      {
        table: {
          head: ['', 'Özne', 'Nesne'],
          rows: [
            ['ben', 'jag', 'mig'],
            ['sen', 'du', 'dig'],
            ['o (erkek)', 'han', 'honom'],
            ['o (kadın)', 'hon', 'henne'],
            ['o (şey)', 'den / det', 'den / det'],
            ['biz', 'vi', 'oss'],
            ['siz', 'ni', 'er'],
            ['onlar', 'de', 'dem'],
          ],
        },
      },
      { p: 'Nesne biçimi Türkçedeki "beni, bana" gibidir: Ring *mig*! (Beni ara!) Okunuşa dikkat: *mig* ve *dig* "mey, dey" gibi, *de* ve *dem* ise "dom" gibi okunur.' },
      { p: 'Türkçedeki "o" herkes ve her şey içindir. İsveççede erkek için *han*, kadın için *hon*, şeyler için *den* (en-kelime) ya da *det* (ett-kelime) denir. Kibar "siz" de pek kullanılmaz: herkese, patrona ve doktora bile *du* denir.' },
      {
        ex: [
          ['*Jag* förstår inte.', 'Anlamıyorum.'],
          ['Kan du hjälpa *mig*?', 'Bana yardım edebilir misin?'],
          ['Var är nyckeln? – *Den* ligger på bordet.', 'Anahtar nerede? – Masanın üstünde.'],
        ],
      },
      { tip: 'Türkçedeki gibi zamiri atlama: "Kommer imorgon" değil, "*Jag* kommer imorgon". Fiil kişiyi göstermez; işi kimin yaptığını zamir söyler.' },
    ],
  },
  {
    id: 'iyelik',
    chapter: 'Küçük kelimeler',
    icon: '🔑',
    title: 'İyelik (min/mitt/mina, sin)',
    sub: 'benim, senin, onun: ismin önünde ayrı kelime',
    blocks: [
      { p: 'Türkçede iyelik bir ektir: araba*m*. İsveççede ismin önüne gelen ayrı bir kelimedir: *min* bil. Bu kelime de ismin cinsine ve sayısına uyar.' },
      {
        table: {
          head: ['', 'en-kelime', 'ett-kelime', 'Çoğul'],
          rows: [
            ['benim', 'min', 'mi*tt*', 'min*a*'],
            ['senin', 'din', 'di*tt*', 'din*a*'],
            ['bizim', 'vår', 'vår*t*', 'vår*a*'],
            ['sizin', 'er', 'er*t*', 'er*a*'],
          ],
        },
      },
      { p: '*hans* (onun, erkek), *hennes* (onun, kadın) ve *deras* (onların) hiç değişmez: hans bil, hans hus, hans barn.' },
      { p: 'Bir incelik: şey cümlenin öznesine aitse "onun" yerine *sin* (ett-kelimede *sitt*, çoğulda *sina*) denir. Türkçedeki "kendi" gibidir.' },
      {
        ex: [
          ['Var är *min* telefon?', 'Telefonum nerede?'],
          ['*Våra* barn går i skolan.', 'Çocuklarımız okula gidiyor.'],
          ['Erik ringer *sin* mamma.', 'Erik (kendi) annesini arıyor.'],
          ['Erik ringer *hans* mamma.', 'Erik onun (başka bir adamın) annesini arıyor.'],
        ],
      },
      { tip: 'İyelikten sonra isim belirli hâl almaz: "min bilen" değil, *min* bil. Ama iyelik isme uyar: "min hus" değil, *mitt* hus.' },
    ],
  },
  {
    id: 'edat',
    chapter: 'Küçük kelimeler',
    icon: '📍',
    title: 'Edatlar',
    sub: 'i, på, till, från, med: Türkçedeki -de, -e, -den, ile',
    blocks: [
      { p: 'Türkçede yer ve yön ekle gösterilir: ev*de*, ev*e*, ev*den*. İsveççede ise ismin önüne ayrı bir kelime gelir. Bunlara edat denir.' },
      {
        table: {
          head: ['Edat', 'Türkçe', 'Örnek'],
          rows: [
            ['*i*', '-de (içinde)', 'i Sverige, i köket'],
            ['*på*', '-de (üstünde, iş yerinde)', 'på bordet, på jobbet'],
            ['*hos*', '-de (birinin yanında)', 'hos läkaren'],
            ['*till*', '-e', 'till Stockholm'],
            ['*från*', '-den', 'från Turkiet'],
            ['*med*', 'ile', 'med barnen'],
          ],
        },
      },
      { p: '*i* mi, *på* mı? *i* bir şeyin içi için: i huset, i parken, i Sverige. *på* bir yüzeyin üstü ve birçok yer için: på bordet, på jobbet, på banken. Tam bir kuralı yoktur; ifadeyle birlikte ezberle.' },
      { p: 'Zamanda günlerle *på* (på lördag: cumartesi günü), aylarla *i* kullanılır (i maj).' },
      {
        ex: [
          ['Jag bor *i* Sverige.', "İsveç'te yaşıyorum."],
          ['Mamma är *på* jobbet.', 'Annem işte.'],
          ['Vi åker *till* Turkiet *på* lördag.', "Cumartesi Türkiye'ye gidiyoruz."],
          ['Jag är *hos* läkaren.', 'Doktordayım.'],
        ],
      },
      { tip: "Hareket varsa *till* kullan: Jag är *i* Stockholm (Stockholm'dayım), ama Jag åker *till* Stockholm (Stockholm'a gidiyorum). Ev için ayrı kelimeler vardır: *hemma* (evde), *hem* (eve): Jag är hemma. / Jag går hem." },
    ],
  },
  {
    id: 'sayilar',
    chapter: 'Küçük kelimeler',
    icon: '🔢',
    title: 'Sayılar ve saat',
    sub: 'en, två, tre… ve halv tre, kvart över',
    blocks: [
      {
        table: {
          head: null,
          rows: [
            ['1 en / ett', '6 sex'],
            ['2 två', '7 sju'],
            ['3 tre', '8 åtta'],
            ['4 fyra', '9 nio'],
            ['5 fem', '10 tio'],
          ],
        },
      },
      { p: '11–20: elva, tolv, tretton, fjorton, femton, sexton, sjutton, arton, nitton, tjugo. Onluklar: trettio, fyrtio, femtio, sextio, sjuttio, åttio, nittio. 100 hundra, 1000 tusen. Büyük sayılar Türkçedeki gibi sırayla söylenir ve bitişik yazılır: 25 *tjugofem* (yirmi beş).' },
      { p: 'Saati sormak için: *Vad är klockan?* Cevap: Klockan är tre (Saat üç). Çeyrekler ve yarımlar şöyle söylenir:' },
      {
        table: {
          head: ['Saat', 'İsveççe', 'Türkçe'],
          rows: [
            ['3.10', 'tio över tre', 'üçü on geçiyor'],
            ['3.15', '*kvart över* tre', 'üçü çeyrek geçiyor'],
            ['3.30', '*halv* fyra', 'üç buçuk'],
            ['3.45', '*kvart i* fyra', 'dörde çeyrek var'],
            ['3.50', 'tio i fyra', 'dörde on var'],
          ],
        },
      },
      {
        ex: [
          ['Vad är klockan?', 'Saat kaç?'],
          ['Klockan är *halv tre*.', 'Saat iki buçuk.'],
          ['Vi ses *kvart över* sju.', 'Yediyi çeyrek geçe görüşürüz.'],
          ['Jag har *två* barn.', 'İki çocuğum var.'],
        ],
      },
      { tip: 'En sık yapılan hata: *halv tre* "üç buçuk" değil, "iki buçuk" demektir. İsveççede yarım saat, bir sonraki saate göre söylenir: halv tre = üçe yarım saat var.' },
    ],
  },
  {
    id: 'simdiki',
    chapter: 'Fiiller ve zamanlar',
    icon: '▶️',
    title: 'Şimdiki zaman: herkes için tek biçim',
    sub: 'jag talar, du talar, vi talar: kişi eki yok',
    blocks: [
      { p: 'Türkçede fiil kişiye göre değişir: konuşuyorum, konuşuyorsun, konuşuyoruz. İsveççede şimdiki zamanın tek biçimi vardır ve herkes için aynıdır: jag tala*r*, du tala*r*, vi tala*r*. Kişiyi yalnızca zamir gösterir.' },
      { p: 'Bu biçim hem "şu an" hem "genelde" demektir: Jag dricker kaffe = Kahve içiyorum / Kahve içerim. Bir zaman sözüyle yakın geleceği de anlatır: Jag kommer imorgon (Yarın geliyorum).' },
      {
        table: {
          head: ['', 'Mastar', 'Şimdiki zaman'],
          rows: [
            ['konuşmak', 'tala', 'tala*r*'],
            ['yaşamak', 'bo', 'bo*r*'],
            ['okumak', 'läsa', 'läs*er*'],
            ['satın almak', 'köpa', 'köp*er*'],
            ['olmak', 'vara', '*är*'],
          ],
        },
      },
      { p: "Mastarı -a ile biten fiillerin bir kısmı *-r* alır (tala → talar), bir kısmı -a'yı atıp *-er* alır (läsa → läser). Hangisi olduğunu fiille birlikte öğren. Kısa fiiller *-r* alır (bo → bor)." },
      {
        ex: [
          ['Jag tala*r* lite svenska.', 'Biraz İsveççe konuşuyorum.'],
          ['Vi bo*r* i Göteborg.', "Göteborg'da yaşıyoruz."],
          ['Han jobb*ar* på ett sjukhus.', 'Bir hastanede çalışıyor.'],
        ],
      },
      { tip: 'Mastarı olduğu gibi kullanma: "Jag tala svenska" değil, "Jag tala*r* svenska". Şimdiki zaman neredeyse hep *-r* ile biter. Birkaç fiil -r almaz: kan, vill, ska, måste, *vet* (bilmek) ve finns, hoppas gibi -s ile biten fiiller.' },
    ],
  },
  {
    id: 'gecmis',
    chapter: 'Fiiller ve zamanlar',
    icon: '⏪',
    title: 'Geçmiş zaman',
    sub: '-ade, -de, -te ve düzensiz fiiller',
    blocks: [
      { p: 'Geçmiş zaman da herkes için tek biçimdir: jag jobbade, du jobbade, vi jobbade. Türkçedeki "-di"li geçmişe karşılık gelir: çalıştım, çalıştın, çalıştık.' },
      {
        table: {
          head: ['Ek', 'Şimdiki', 'Geçmiş'],
          rows: [
            ['*-ade*', 'jobbar', 'jobb*ade*'],
            ['*-de*', 'ringer', 'ring*de*'],
            ['*-te*', 'köper', 'köp*te*'],
            ['*-dde*', 'bor', 'bo*dde*'],
          ],
        },
      },
      { p: 'Şimdiki zamanda -ar alan fiiller *-ade* alır. -er alanlarda Türkçedeki "aldı / attı" farkına benzer bir kural vardır: k, p, s, t seslerinden sonra *-te* (köpte, läste), ötekilerden sonra *-de* (ringde). Kısa fiiller *-dde* alır (bodde).' },
      { p: 'En çok kullanılan fiillerin çoğu düzensizdir; bunları tek tek ezberle:' },
      {
        table: {
          head: ['', 'Şimdiki', 'Geçmiş'],
          rows: [
            ['olmak', 'är', '*var*'],
            ['gitmek', 'går', '*gick*'],
            ['yemek', 'äter', '*åt*'],
            ['içmek', 'dricker', '*drack*'],
            ['gelmek', 'kommer', '*kom*'],
            ['yapmak', 'gör', '*gjorde*'],
          ],
        },
      },
      {
        ex: [
          ['Igår jobb*ade* jag hela dagen.', 'Dün bütün gün çalıştım.'],
          ['Vi åk*te* till Stockholm i somras.', "Geçen yaz Stockholm'a gittik."],
          ['Jag *åt* frukost klockan sju.', 'Saat yedide kahvaltı yaptım.'],
          ['Det *var* jättegott!', 'Çok lezzetliydi!'],
        ],
      },
      { tip: 'Düzensiz fiillere düzenli ek koyma: "gådde" değil *gick*, "ätade" değil *åt*. Bir de *var* iki ayrı kelimedir: "idi" ve "nerede". Var du hemma? (Evde miydin?) / Var är du? (Neredesin?)' },
    ],
  },
  {
    id: 'perfekt',
    chapter: 'Fiiller ve zamanlar',
    icon: '✅',
    title: 'har + supinum',
    sub: 'Jag har ätit: sonucu şimdi önemli olan geçmiş',
    blocks: [
      { p: 'Geçmişi anlatmanın ikinci yolu *har* + supinumdur. Supinum, fiilin *har* ile birlikte kullanılan özel bir biçimidir: Jag *har ätit* (Yedim, yani şimdi tokum).' },
      { p: 'Ne zaman olduğu söylenmiyorsa ve sonuç şimdi önemliyse kullanılır: bir şeyi yaptın mı, hiç yaptın mı, bitti mi? Zaman belliyse (igår, förra veckan) düz geçmiş zaman kullanılır: Jag *åt* pizza igår.' },
      {
        table: {
          head: ['Mastar', 'Geçmiş', 'Supinum'],
          rows: [
            ['jobba', 'jobbade', 'jobb*at*'],
            ['köpa', 'köpte', 'köp*t*'],
            ['bo', 'bodde', 'bo*tt*'],
            ['äta', 'åt', 'ät*it*'],
            ['vara', 'var', 'var*it*'],
            ['göra', 'gjorde', 'gjor*t*'],
          ],
        },
      },
      { p: 'Düzenli fiillerde supinum geçmişten kolayca çıkar: -ade → *-at*, -de ve -te → *-t*, -dde → *-tt*. Düzensizlerin birçoğu *-it* ile biter: ätit, druckit, kommit.' },
      {
        ex: [
          ['Tack, jag *har* redan *ätit*.', 'Sağ ol, ben zaten yedim.'],
          ['*Har* du *varit* i Turkiet?', "Türkiye'ye hiç gittin mi?"],
          ['Jag *har bott* i Sverige i tre år.', "Üç yıldır İsveç'te yaşıyorum."],
        ],
      },
      { tip: "Türkçede \"Üç yıldır İsveç'te yaşıyorum\" deriz. İsveççede bir şeyin ne kadar süredir sürdüğünü söylerken *har* + supinum gerekir: Jag *har bott* här i tre år. Bu anlamda \"Jag bor här i tre år\" yanlıştır." },
    ],
  },
  {
    id: 'gelecek',
    chapter: 'Fiiller ve zamanlar',
    icon: '🔜',
    title: 'Gelecek: ska / kommer att',
    sub: 'Plan için ska, tahmin için kommer att',
    blocks: [
      { p: 'İsveççede gelecek zaman için bir ek yoktur. Bunun yerine üç yol kullanılır:' },
      {
        table: {
          head: ['Biçim', 'Ne için?'],
          rows: [
            ['*ska* + mastar', 'plan, karar, söz'],
            ['*kommer att* + mastar', 'tahmin: olacağını düşündüğün şey'],
            ['şimdiki zaman + zaman sözü', 'yakın ve belli planlar'],
          ],
        },
      },
      { p: 'Mastar, fiilin sözlükteki biçimidir: åka, regna, äta. *ska* ve *kommer att* herkes için aynıdır: jag ska, du ska, vi ska.' },
      { p: '"Ska vi …?" Türkçedeki "-elim mi?" gibidir; bir öneride bulunurken çok kullanılır.' },
      {
        ex: [
          ['Vi *ska* åka till Turkiet i sommar.', "Bu yaz Türkiye'ye gideceğiz."],
          ['*Ska* vi fika?', 'Kahve içelim mi?'],
          ['Det *kommer att* regna imorgon.', 'Yarın yağmur yağacak.'],
          ['Jag jobbar imorgon.', 'Yarın çalışıyorum.'],
        ],
      },
      { tip: '*ska* kelimesinden sonra *att* gelmez: "Jag ska att åka" değil, "Jag *ska* åka". Bu üç yoldan yalnızca *kommer att* ile *att* gelir. *kommer* tek başına "geliyor" demektir: Han kommer imorgon (Yarın geliyor).' },
    ],
  },
  {
    id: 'emir',
    chapter: 'Kipler ve edilgen',
    icon: '📢',
    title: 'Emir kipi',
    sub: 'Fiilin en kısa biçimi: Vänta! Ät! Kom!',
    blocks: [
      { p: 'Emir kipiyle birine bir şey yapmasını söyleriz: Gel! Bekle! Türkçede olduğu gibi İsveççede de emir, fiilin en kısa biçimidir.' },
      {
        table: {
          head: ['Mastar', 'Şimdiki', 'Emir'],
          rows: [
            ['vänta (beklemek)', 'väntar', '*Vänta!*'],
            ['ringa (aramak)', 'ringer', '*Ring!*'],
            ['äta (yemek)', 'äter', '*Ät!*'],
            ['komma (gelmek)', 'kommer', '*Kom!*'],
            ['gå (gitmek)', 'går', '*Gå!*'],
            ['vara (olmak)', 'är', '*Var!*'],
          ],
        },
      },
      { p: 'Kural: şimdiki zamanı *-ar* ile biten fiillerde emir mastarla aynıdır (vänta → Vänta!). Ötekilerde mastarın sonundaki *-a* düşer (äta → Ät!). Kısa fiiller değişmez (gå → Gå!).' },
      { p: 'Olumsuz emirde *inte* fiilden sonra gelir: Glöm *inte*! (Unutma!) Daha kibar olmak için soru sorulur: Kan du stänga dörren? (Kapıyı kapatabilir misin?)' },
      {
        ex: [
          ['*Vänta* lite!', 'Biraz bekle!'],
          ['*Ring* mig ikväll!', 'Bu akşam beni ara!'],
          ['*Kom* in!', 'İçeri gel!'],
          ['*Var* försiktig!', 'Dikkatli ol!'],
        ],
      },
      { tip: 'Mastarı emir gibi kullanma: "Äta!" değil, *Ät!*; "Komma!" değil, *Kom!* Şimdiki zamanı -ar ile biten fiillerde ve kısa fiillerde mastar ile emir aynıdır: Vänta! Titta! (Bak!) Gå!' },
    ],
  },
  {
    id: 'modal',
    chapter: 'Kipler ve edilgen',
    icon: '💪',
    title: 'Yardımcı fiiller (kan, vill, måste…)',
    sub: 'kan, vill, måste, får + mastar, att olmadan',
    blocks: [
      { p: 'Türkçede "-ebilmek", "-meli" gibi anlamları ekler verir: gel*ebil*irim, gel*meli*yim. İsveççede bunlar ayrı fiillerdir. Arkalarından mastar gelir, arada *att* olmaz: Jag *kan komma*.' },
      {
        table: {
          head: ['', 'Anlamı', 'Örnek'],
          rows: [
            ['*kan*', '-ebilmek, bilmek', 'kan komma'],
            ['*vill*', 'istemek', 'vill äta'],
            ['*måste*', 'zorunda olmak', 'måste gå'],
            ['*får*', 'izni olmak', 'får parkera'],
            ['*ska*', 'plan, -ecek', 'ska åka'],
            ['*brukar*', 'genelde yapmak', 'brukar jobba'],
          ],
        },
      },
      { p: 'Bu fiiller de herkes için aynıdır: jag kan, du kan, vi kan. *inte* yardımcı fiilden sonra gelir: Jag kan *inte* komma.' },
      { p: 'Dikkat: *får inte* "yasak" demektir: Man får inte röka här (Burada sigara içmek yasak). "Gerek yok" için *behöver inte* denir: Du behöver inte komma (Gelmene gerek yok).' },
      {
        ex: [
          ['Jag *kan* inte komma idag.', 'Bugün gelemem.'],
          ['*Vill* du ha kaffe?', 'Kahve ister misin?'],
          ['Jag *måste* gå nu.', 'Şimdi gitmem lazım.'],
          ['*Får* jag sitta här?', 'Buraya oturabilir miyim?'],
        ],
      },
      { tip: 'Bir şey isterken *vill ha* de: "Jag vill kaffe" değil, "Jag *vill ha* kaffe". Bir eylem isterken mastar yeter: Jag vill *sova* (Uyumak istiyorum).' },
    ],
  },
  {
    id: 'baglac',
    chapter: 'Uzun cümleler',
    icon: '🔗',
    title: 'Bağlaçlar ve yan cümleler',
    sub: 'och, men, för… ve att, som, när, om, eftersom',
    blocks: [
      { p: 'Bağlaçlar iki cümleyi birleştirir. İsveççede iki türü vardır. Aşağıdakiler iki ana cümleyi bağlar ve arkalarından normal sıra gelir: Jag är trött, *men* jag måste jobba.' },
      {
        table: {
          head: ['Ana cümleleri bağlar', 'Türkçe'],
          rows: [
            ['och', 've'],
            ['men', 'ama'],
            ['eller', 'ya da'],
            ['för', 'çünkü'],
            ['så', 'bu yüzden'],
          ],
        },
      },
      { p: 'Öteki bağlaçlar bir yan cümle başlatır. Türkçede bu işi çoğu zaman ekler yapar (gel*ince*, gelir*se*); İsveççede ise yan cümlenin başına bir kelime gelir.' },
      {
        table: {
          head: ['Yan cümle başlatır', 'Türkçe'],
          rows: [
            ['att', '-dığını'],
            ['som', '-an, -en'],
            ['när', '-ince, -dığında'],
            ['om', '-se, eğer'],
            ['eftersom', '-dığı için'],
            ['därför att', 'çünkü'],
          ],
        },
      },
      {
        ex: [
          ['Mannen *som* bor här heter Erik.', 'Burada oturan adamın adı Erik.'],
          ['Jag stannar hemma *eftersom* jag är sjuk.', 'Hasta olduğum için evde kalıyorum.'],
          ['*Om* det regnar, stannar vi hemma.', 'Yağmur yağarsa evde kalırız.'],
        ],
      },
      { tip: 'Yan cümle başa gelirse bütünüyle birinci öğe sayılır, bu yüzden ana cümlenin fiili hemen arkasından gelir: "När jag kommer hem, jag äter" değil, "När jag kommer hem, *äter* jag".' },
    ],
  },
];
