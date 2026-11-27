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
      { p: 'Dikkat: -el ya da -er ile biten en-kelimeler, son heceleri vurgusuzsa yalnızca *-n* alır: nyckel → nyckel*n*, syster → syster*n*. Son hecesi vurgusuz ve -el, -er ya da -en ile biten ett-kelimelerde ise kelimenin son e\'si düşer: vatten → vatt*net*, fönster → fönst*ret*, socker → sock*ret*.' },
      { p: 'Araya sıfat girerse önüne *den* ya da *det* de gelir: den stora bil*en* (*Çifte belirlilik* bölümüne bak).' },
      {
        ex: [
          ['Var är toalett*en*?', 'Tuvalet nerede?'],
          ['Vi har en bil. Bil*en* är gammal.', 'Bir arabamız var. Araba eski.'],
          ['Kan du stänga fönst*ret*?', 'Pencereyi kapatabilir misin?'],
        ],
      },
      { tip: 'Türkçede bilinen şeyi bir ek yalnızca nesnede gösterir: kitab*ı* okudum. Öznede ek yoktur: Kitap güzel. İsveççede belirli hâl cümlenin her yerinde kullanılır, öznede de: "Bok är bra" değil, Bok*en* är bra (Kitap güzel).' },
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
      { p: 'İpuçları: -a ile biten en-kelimeler genelde *-or* alır (skola → skolor). Birçok kısa en-kelime *-ar* alır (dag → dagar). Son hecesi vurgulu, yabancı kökenli kelimeler genelde *-er* alır (telefon → telefoner); bu gruptaki ünlüyle biten kelimeler yalnızca *-r* alır (sko → skor). Ett-kelimelerden ünlüyle bitenler genelde *-n* alır, ünsüzle bitenler ise çoğu zaman hiç ek almaz (barn → barn).' },
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
      { p: 'Kısaca: en-kelimeyle ek gelmez, ett-kelimeyle *-t*, çoğulda *-a* gelir. *liten* düzensizdir: ett-kelimeyle *litet*, çoğulda *små* olur.' },
      { p: 'Bazı sıfatlarda -t eki *-tt* olur: ny → ny*tt*, röd → rö*tt*, vit → vi*tt*, god → go*tt*. *svart* gibi ünsüz + t ile bitenler değişmez: ett svart hus. *bra* (iyi) hiç değişmez: ett bra jobb, bra filmer.' },
      { p: 'Sıfat *är* fiilinden sonra gelse de uyum aynıdır: ett stor*t* hus → Huset är stor*t*. Sıfat belirli hâldeki bir ismin önüne gelirse (den stora bilen) kural başkadır: *Çifte belirlilik* bölümüne bak.' },
      {
        ex: [
          ['Vi har ett stor*t* kök.', 'Büyük bir mutfağımız var.'],
          ['Barnen är trött*a*.', 'Çocuklar yorgun.'],
          ['Det är kall*t* idag.', 'Bugün hava soğuk.'],
          ['Kaffet är go*tt*.', 'Kahve güzel.'],
        ],
      },
      { tip: '*är* fiilinden sonra da uyumu unutma: "Vi är trött" değil, "Vi är trött*a*". *Det är*\'den sonra sıfat tek başına geliyorsa (arkasında isim yoksa) -t alır: Det är dyr*t*! (Pahalı!)' },
    ],
  },
  {
    id: 'cifte',
    chapter: 'İsimler ve sıfatlar',
    icon: '✌️',
    title: 'Çifte belirlilik',
    sub: 'den stora bilen: önde den, sonda -en',
    blocks: [
      { p: 'Türkçede "büyük bir araba" ile "büyük araba" arasındaki farkı yalnızca *bir* gösterir. İsveççede bilinen bir şeyden söz ederken sıfat varsa iki işaret birden gerekir: önde *den*, sonda belirli hâl eki. Sıfat da hep *-a* alır.' },
      {
        table: {
          head: ['', 'Sıfatsız', 'Sıfatla'],
          rows: [
            ['en-kelime', 'bil*en*', '*den* stor*a* bil*en*'],
            ['ett-kelime', 'hus*et*', '*det* stor*a* hus*et*'],
            ['Çoğul', 'bilar*na*', '*de* stor*a* bilar*na*'],
          ],
        },
      },
      { p: '*de* "dom" diye okunur. *liten* burada da düzensizdir: den *lilla* bilen, det *lilla* huset, de *små* barnen.' },
      { p: 'Önde *min*, *din*, *vår* gibi bir iyelik ya da *Annas* gibi -s ekli bir isim varsa *den* gelmez, isim de ek almaz; sıfat yine *-a* alır: min stor*a* bil, Annas ny*a* jobb. Çünkü *min* ya da *Annas* hangi şeyden söz ettiğini zaten belli eder; ikinci bir işarete gerek kalmaz.' },
      {
        ex: [
          ['Jag tar *den* röd*a* jacka*n*.', 'Kırmızı montu alıyorum.'],
          ['Vi bor i *det* gul*a* hus*et*.', 'Sarı evde oturuyoruz.'],
          ['*De* små barn*en* sover.', 'Küçük çocuklar uyuyor.'],
          ['Det här är *min* ny*a* bil.', 'Bu benim yeni arabam.'],
        ],
      },
      { tip: 'Sıfat varsa iki parçayı da kullan: "stora bilen" ya da "den stora bil" değil, *den* stora bil*en*. Ama iyelikten sonra ikisi de düşer: "min stora bilen" değil, *min* stora bil.' },
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
    id: 'genitif',
    chapter: 'İsimler ve sıfatlar',
    icon: '👜',
    title: 'Sahiplik eki -s',
    sub: "Annas bil: Anna'nın arabası",
    blocks: [
      { p: "Türkçede sahibi *-nin* ekiyle gösteririz, sahip olunan şey de ek alır: Anna*'nın* araba*sı*. İsveççede yalnızca sahibin sonuna *-s* gelir, ikinci isim hiç değişmez: Anna*s* bil." },
      {
        table: {
          head: ['Sahip', 'İsveççe', 'Türkçe'],
          rows: [
            ['Erik', 'Erik*s* jobb', "Erik'in işi"],
            ['pappa', 'pappa*s* bil', 'babamın arabası'],
            ['barnen', 'barnen*s* rum', 'çocukların odası'],
          ],
        },
      },
      { p: "Kesme işareti konmaz: Türkçede Anna'nın yazarız, İsveççede yalnızca *Annas*. İsim belirli hâldeyse -s, belirli hâl ekinden sonra gelir: barn*en* → barnen*s*. Sahibin adı zaten -s, -x ya da -z ile bitiyorsa ek gelmez: Lars bil, Deniz bil." },
      { p: '-s\'den sonra gelen isim belirli hâl almaz, önüne *den* de gelmez: "Annas bilen" değil, *Annas bil*. Tıpkı *min bil* (arabam) gibi: *Annas* hangi arabadan söz ettiğini zaten belli eder, ikinci bir işarete gerek kalmaz.' },
      {
        ex: [
          ['Det här är *Annas* bil.', "Bu, Anna'nın arabası."],
          ['Stockholm är *Sveriges* huvudstad.', "Stockholm, İsveç'in başkentidir."],
          ['Idag är det *mammas* födelsedag.', 'Bugün annemin doğum günü.'],
          ['Vad är *dagens* rätt?', 'Günün yemeği ne?'],
        ],
      },
      { tip: 'İki Türkçe alışkanlığı bırak: ikinci isme ek koyma ve kesme işareti kullanma. "Anna\'s bilen" değil, *Annas bil*.' },
    ],
  },
  {
    id: 'bilesik',
    chapter: 'İsimler ve sıfatlar',
    icon: '🧩',
    title: 'Birleşik isimler',
    sub: 'kaffekopp, arbetsdag: iki isim tek kelime olur',
    blocks: [
      { p: 'Türkçede iki isim yan yana gelir ve ikincisi ek alır: kahve fincan*ı*. İsveççede iki isim *bitişik* yazılır ve ek almaz: kaffe + kopp → *kaffekopp*. Türkçedeki gibi asıl şey sondaki kelimedir, öndeki onu açıklar. Ayrı yazılan *en kopp kaffe* ise "bir fincan kahve" demektir.' },
      { p: 'Birleşik ismin en mi ett mi aldığını ve çoğulunu *son parça* belirler:' },
      {
        table: {
          head: ['Parçalar', 'Birleşik isim', 'Türkçe'],
          rows: [
            ['ett barn + en vagn', '*en* barnvagn', 'bebek arabası'],
            ['en telefon + ett nummer', '*ett* telefonnummer', 'telefon numarası'],
          ],
        },
      },
      { p: 'Bazen iki parça arasına bir *-s-* girer: kväll + mat → kväll*s*mat (akşam yemeği). Öndeki kelimenin sonundaki -e de bazen düşer: arbete + dag → arbet*s*dag (iş günü). Kesin bir kural yoktur, ama ilk parça kendisi birleşikse ya da *-ing*, *-het* ile bitiyorsa -s- çoğu zaman gelir: fotboll*s*match (futbol maçı), parkering*s*plats.' },
      {
        ex: [
          ['Vad är ditt *telefonnummer*?', 'Telefon numaran ne?'],
          ['Det var en lång *arbetsdag*.', 'Uzun bir iş günüydü.'],
          ['Jag hittar ingen *parkeringsplats*.', 'Park yeri bulamıyorum.'],
          ['Vi äter *kvällsmat* klockan sex.', 'Saat altıda akşam yemeği yiyoruz.'],
        ],
      },
      { tip: 'Birleşik ismi ayırarak yazma, anlam değişebilir: *sjuksköterska* "hemşire" demektir, *sjuk sköterska* ise "hasta bir hemşire".' },
    ],
  },
  {
    id: 'turetme',
    chapter: 'İsimler ve sıfatlar',
    icon: '🛠️',
    title: 'Kelime türetme',
    sub: 'lärare, frihet… ve svensk mi, svenska mı?',
    blocks: [
      { p: 'Türkçede eklerle yeni kelimeler türetiriz: kahve*ci*, güzel*lik*. İsveççede de böyle ekler vardır:' },
      {
        table: {
          head: ['Ek', 'Ne yapar?', 'Örnek'],
          rows: [
            ['*-are*', 'fiilden kişi', 'lära → *lärare* (öğretmen)'],
            ['*-ning*', 'fiilden isim', 'betala → *betalning* (ödeme)'],
            ['*-het*', 'sıfattan isim', 'fri → *frihet* (özgürlük)'],
            ['*-lig*', 'isimden sıfat', 'dag → *daglig* (günlük)'],
            ['*-isk*', 'isimden sıfat', 'typ → *typisk* (tipik)'],
          ],
        },
      },
      { p: 'Milliyet adlarına dikkat: Türkçede *Türk* hem kişidir hem sıfat (Türk kahvesi). İsveççede kişi *turk*, sıfat *turkisk* olur: turkisk mat (Türk yemeği). *svensk* ise hem kişi hem sıfattır. *svenska* hem dil (İsveççe) hem de İsveçli bir kadındır; *turkiska* da öyle.' },
      {
        table: {
          head: ['', 'İsveç', 'Türkiye'],
          rows: [
            ['Kişi', 'en svensk', 'en turk'],
            ['Kadın', 'en svenska', 'en turkiska'],
            ['Sıfat', 'svensk', 'turkisk'],
            ['Dil', 'svenska', 'turkiska'],
          ],
        },
      },
      {
        ex: [
          ['Min man är *svensk*.', 'Kocam İsveçli.'],
          ['Jag talar *turkiska* och lite *svenska*.', 'Türkçe ve biraz İsveççe konuşuyorum.'],
          ['Vill du ha *turkiskt* kaffe?', 'Türk kahvesi ister misin?'],
          ['Min syster är *lärare*.', 'Kız kardeşim öğretmen.'],
        ],
      },
      { tip: 'Dil ve milliyet adlarını küçük harfle yaz: *svenska*, *turkiska*, *en turk*. Ülke adları ise büyük harfle başlar: Sverige, Turkiet.' },
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
    id: 'sig',
    chapter: 'Küçük kelimeler',
    icon: '🪞',
    title: 'Kendi: sig ve själv',
    sub: 'tvätta sig, lära sig, Jag gjorde det själv',
    blocks: [
      { p: 'Türkçede "kendini" deriz ya da fiile bir ek koyarız: yıka*n*mak, giyi*n*mek. İsveççede fiilden sonra bir zamir gelir. *jag*, *du*, *vi* ve *ni* için bu zamir nesne biçimiyle aynıdır: mig, dig, oss, er. *han*, *hon*, *den*, *det* ve *de* için ise ayrı bir kelime vardır: *sig* ("sey" diye okunur).' },
      {
        table: {
          head: ['', 'tvätta sig (yıkanmak)'],
          rows: [
            ['jag', 'tvättar *mig*'],
            ['du', 'tvättar *dig*'],
            ['han, hon', 'tvättar *sig*'],
            ['vi', 'tvättar *oss*'],
            ['ni', 'tvättar *er*'],
            ['de', 'tvättar *sig*'],
          ],
        },
      },
      { p: 'Bazı fiiller hep böyle kullanılır, Türkçedeki karşılıklarında "kendi" olmasa bile: *lära sig* (öğrenmek), *känna sig* (kendini … hissetmek), *sätta sig* (oturmak), *klä på sig* (giyinmek), *skynda sig* (acele etmek).' },
      { p: '*själv* "kendim, kendin" demektir: işi başkası değil, kişinin kendisi yapar. Çoğulda *själva* olur: Vi gjorde det själva. (Kendimiz yaptık.) *mig själv*, *sig själv* ise vurgulu "kendimi, kendini" demektir: Han tänker bara på sig själv. (Yalnızca kendini düşünüyor.)' },
      {
        ex: [
          ['Jag *lär mig* svenska.', 'İsveççe öğreniyorum.'],
          ['Jag *känner mig* lite trött.', 'Kendimi biraz yorgun hissediyorum.'],
          ['*Sätt dig* här!', 'Buraya otur!'],
          ['Ta hand om *dig*!', 'Kendine iyi bak!'],
          ['Jag gjorde det *själv*.', 'Kendim yaptım.'],
        ],
      },
      { tip: '*han*, *hon* ve *de* için *sig* kullan, *honom*, *henne* ya da *dem* değil: Anna tittar på *sig* i spegeln (Anna aynada kendine bakıyor), ama Anna tittar på *henne* (başka bir kadına bakıyor). Öznenin kendi şeyleri için de *sin* kullanılır: *İyelik* bölümüne bak.' },
    ],
  },
  {
    id: 'belirsiz',
    chapter: 'Küçük kelimeler',
    icon: '👉',
    title: 'Bu, biri, hiç, hepsi',
    sub: 'den här, någon, ingen, alla, många…',
    blocks: [
      { p: 'Türkçede *bu araba*, *bu ev*, *bu evler* deriz: *bu* isme göre değişmez. İsveççede bu tür kelimeler en-kelimeye, ett-kelimeye ve çoğula göre biçim alır:' },
      {
        table: {
          head: ['', 'en-kelime', 'ett-kelime', 'Çoğul'],
          rows: [
            ['bu', 'den här', 'det här', 'de här'],
            ['bir, bazı', 'någon', 'något', 'några'],
            ['hiç, hiçbir', 'ingen', 'inget', 'inga'],
          ],
        },
      },
      { p: '*den här* ile isim belirli hâl alır: den här bil*en* (bu araba), det här hus*et* (bu ev). "Şu, o" için *den där* denir.' },
      { p: 'Tek başına *någon* "biri", *något* "bir şey" demektir; soruda "hiç" anlamı da taşır. *ingen* "hiç kimse", *inget* "hiçbir şey" demektir. *ingen*, *inte någon* ile aynıdır: Jag har inga pengar = Jag har inte några pengar (Hiç param yok).' },
      { p: '*alla* "herkes, hepsi", *allt* "her şey" demektir. *varje* (her) hiç değişmez: varje dag. Türkçedeki "çok" ve "az" için ikişer kelime vardır: sayılamayan şeylerle *mycket* ve *lite* (mycket tid, lite socker), sayılabilenlerle *många* ve *få* (många barn, få bilar).' },
      {
        ex: [
          ['Vad kostar *den här* jackan?', 'Bu mont ne kadar?'],
          ['Är det *någon* hemma?', 'Evde kimse var mı?'],
          ['*Ingen* vet var nycklarna är.', 'Anahtarların nerede olduğunu kimse bilmiyor.'],
          ['Det var *många* människor där.', 'Orada çok insan vardı.'],
          ['Jag dricker kaffe *varje* dag.', 'Her gün kahve içerim.'],
        ],
      },
      { tip: 'Türkçede "Kimse gelmedi" deriz: hem *kimse* hem olumsuz fiil. İsveççede *ingen* zaten olumsuzdur, yanına *inte* gelmez: "Ingen kom inte" değil, *Ingen* kom.' },
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
      { p: 'Gün ve ay adlarıyla da *på* ve *i* kullanılır: *Saat ve takvim* bölümüne bak.' },
      {
        ex: [
          ['Jag bor *i* Sverige.', "İsveç'te yaşıyorum."],
          ['Mamma är *på* jobbet.', 'Annem işte.'],
          ['Vi åker *till* Turkiet *på* lördag.', "Cumartesi Türkiye'ye gidiyoruz."],
          ['Jag är *hos* läkaren.', 'Doktordayım.'],
        ],
      },
      { tip: "Hareket varsa *till* kullan: Jag är *i* Stockholm (Stockholm'dayım), ama Jag åker *till* Stockholm (Stockholm'a gidiyorum). Ev, burası ve orası için edat yerine ayrı kelimeler vardır: *Yer ve yön* bölümüne bak." },
    ],
  },
  {
    id: 'yer',
    chapter: 'Küçük kelimeler',
    icon: '🧭',
    title: 'Yer ve yön',
    sub: 'här ve hit, hemma ve hem: nerede mi, nereye mi?',
    blocks: [
      { p: 'Türkçede yeri *-de*, yönü *-e* ekiyle ayırırız: burada / buraya, evde / eve. İsveççede bazı yer kelimelerinin de iki biçimi vardır: biri bir yerde olmak, öteki bir yere gitmek içindir.' },
      {
        table: {
          head: ['Nerede? (-de)', 'Nereye? (-e)', 'Türkçe'],
          rows: [
            ['här', 'hit', 'burada / buraya'],
            ['där', 'dit', 'orada / oraya'],
            ['hemma', 'hem', 'evde / eve'],
            ['inne', 'in', 'içeride / içeri'],
            ['ute', 'ut', 'dışarıda / dışarı'],
            ['uppe', 'upp', 'yukarıda / yukarı'],
            ['nere', 'ner', 'aşağıda / aşağı'],
          ],
        },
      },
      { p: 'Fiile bak: *gå*, *komma*, *åka* gibi hareket fiilleriyle ikinci sütun gelir (Kom hit!), *vara*, *bo*, *sitta* gibi fiillerle birinci sütun (Jag är här).' },
      { p: 'Konum için şu edatlar kullanılır: *framför* (önünde), *bakom* (arkasında), *bredvid* (yanında), *mellan* (arasında), *under* (altında), *över* (üstünde, ama değmeden; değiyorsa *på*). Türkçede altında / altına diye ek değişir; İsveççede *under* aynı kalır, farkı fiil gösterir: Väskan ligger under bordet. (Çanta masanın altında.) Lägg väskan under bordet! (Çantayı masanın altına koy!)' },
      {
        ex: [
          ['Kom *hit*!', 'Buraya gel!'],
          ['Hur kommer jag *dit*?', 'Oraya nasıl giderim?'],
          ['När kommer du *hem*?', 'Eve ne zaman geliyorsun?'],
          ['Barnen leker *ute*.', 'Çocuklar dışarıda oynuyor.'],
          ['Bilen står *bakom* huset.', 'Araba evin arkasında.'],
        ],
      },
      { tip: 'Türkçe düşün: "-e" diyorsan (eve, buraya, dışarı) *hem*, *hit*, *ut*; "-de" diyorsan (evde, burada, dışarıda) *hemma*, *här*, *ute*. "Jag är hem" yanlış, *Jag är hemma* doğru.' },
    ],
  },
  {
    id: 'sayilar',
    chapter: 'Küçük kelimeler',
    icon: '🔢',
    title: 'Sayılar',
    sub: 'en, två, tre… ve första, andra',
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
      { p: 'Sayarken *ett* denir: ett, två, tre. İsmin önünde ise "bir" isme uyar: en bil, ett hus. Yaş için *år* (yıl) kullanılır: Jag är trettio år. (Otuz yaşındayım.)' },
      { p: 'Sıra sayıları için Türkçedeki *-inci* gibi tek bir ek yoktur. İlk ikisi düzensizdir: *första* (birinci), *andra* (ikinci). Sonra şöyle gider: tredje, fjärde, femte, sjätte, sjunde, åttonde, nionde, tionde. En-kelimeyle de ett-kelimeyle de aynı kalırlar. Tarihte de sıra sayısı kullanılır: den tredje maj (3 Mayıs).' },
      {
        ex: [
          ['Jag har *två* barn.', 'İki çocuğum var.'],
          ['Hur gammal är du? – Jag är *trettiofem*.', 'Kaç yaşındasın? – Otuz beş.'],
          ['Min son går i *tredje* klass.', 'Oğlum üçüncü sınıfa gidiyor.'],
          ['Det är *första* gången jag är i Sverige.', "İsveç'e ilk kez geliyorum."],
        ],
      },
      { tip: '*andra* "ikinci" demektir ama "başka, diğer" de demektir: de andra (diğerleri). Hangisi olduğunu cümleden anlarsın. Saat için *Saat ve takvim* bölümüne bak.' },
    ],
  },
  {
    id: 'saat',
    chapter: 'Küçük kelimeler',
    icon: '🕐',
    title: 'Saat ve takvim',
    sub: 'halv tre, kvart i fyra, på måndag, för två år sedan',
    blocks: [
      { p: 'Saati sormanın iki yolu vardır: *Vad är klockan?* ya da *Hur mycket är klockan?* Cevap: Klockan är tre. "Saat üçte" için ek ya da edat gerekmez: Vi ses klockan tre. (Saat üçte görüşürüz.)' },
      {
        table: {
          head: ['Saat', 'İsveççe', 'Türkçe'],
          rows: [
            ['3.10', 'tio *över* tre', 'üçü on geçiyor'],
            ['3.15', 'kvart *över* tre', 'üçü çeyrek geçiyor'],
            ['3.25', 'fem *i halv* fyra', 'üçü yirmi beş geçiyor'],
            ['3.30', '*halv* fyra', 'üç buçuk'],
            ['3.45', 'kvart *i* fyra', 'dörde çeyrek var'],
          ],
        },
      },
      { p: '*över* "geçiyor", *i* ise "var" demektir. Yarımdan beş dakika önce ve sonra *halv*\'e göre söylenir: fem i halv fyra (3.25), fem över halv fyra (3.35).' },
      { p: 'Gün ve ay adları küçük harfle yazılır. Günlerle *på*, aylarla *i* kullanılır: på måndag (önümüzdeki pazartesi), i juli (temmuzda). Geçen pazartesi ise *i måndags* olur. Geçmiş ve gelecek için: *förra veckan* (geçen hafta), *nästa vecka* (gelecek hafta), *om en vecka* (bir hafta sonra), *för två år sedan* (iki yıl önce).' },
      {
        ex: [
          ['Hur mycket är klockan? – Kvart *i* fyra.', 'Saat kaç? – Dörde çeyrek var.'],
          ['Jag slutar jobba *halv* fem.', 'Dört buçukta işten çıkıyorum.'],
          ['Vi ses *på* måndag!', 'Pazartesi görüşürüz!'],
          ['Bussen går *om* tio minuter.', 'Otobüs on dakika sonra kalkıyor.'],
          ['Vi flyttade hit *för* två år *sedan*.', 'İki yıl önce buraya taşındık.'],
        ],
      },
      { tip: 'En sık yapılan hata: *halv tre* "üç buçuk" değil, "iki buçuk" demektir. İsveççede yarım saat, bir sonraki saate göre söylenir: halv tre = üçe yarım saat var.' },
    ],
  },
  {
    id: 'gruplar',
    chapter: 'Fiiller ve zamanlar',
    icon: '🗂️',
    title: 'Fiil grupları',
    sub: 'tala, köpa, bo, skriva: dört grup, dört biçim',
    blocks: [
      { p: 'İsveççede fiiller dört gruba ayrılır. İlk üç grupta bir fiilin grubunu bilirsen öteki biçimlerini de bilirsin. Her fiilin dört temel biçimi vardır:' },
      {
        table: {
          head: ['Mastar', 'Şimdiki', 'Geçmiş', 'Supinum'],
          rows: [
            ['tala', 'tala*r*', 'tala*de*', 'tala*t*'],
            ['köpa', 'köp*er*', 'köp*te*', 'köp*t*'],
            ['bo', 'bo*r*', 'bo*dde*', 'bo*tt*'],
            ['skriva', 'skriv*er*', '*skrev*', '*skrivit*'],
          ],
        },
      },
      {
        list: [
          '*1. grup* (tala): şimdiki zamanı *-ar* ile biter: jobba, titta, prata. En büyük gruptur; dile yeni giren fiiller de bu gruba girer.',
          '*2. grup* (köpa): şimdiki zamanı *-er*, geçmişi *-de* ya da *-te* ile biter: ringa, läsa.',
          '*3. grup* (bo): tek heceli kısa fiiller: tro, må. (Ama en sık kullanılan kısa fiillerin çoğu düzensizdir: gå, se, ta, ha, få.)',
          '*4. grup* (skriva): düzensiz fiiller. Çoğu geçmişte ek almaz, içindeki ünlü değişir; supinumu çoğu zaman *-it* ile biter: dricka, komma.',
        ],
      },
      { p: 'Bu biçimlerin ne zaman kullanıldığını *Şimdiki zaman*, *Geçmiş zaman* ve *har + supinum* bölümleri anlatır.' },
      {
        ex: [
          ['Jag *pratar* med mamma varje dag.', 'Annemle her gün konuşurum.'],
          ['Vi *köpte* en ny soffa igår.', 'Dün yeni bir kanepe aldık.'],
          ['Vi *bodde* i Ankara förut.', "Eskiden Ankara'da otururduk."],
          ['Jag har *skrivit* till läraren.', 'Öğretmene yazdım.'],
        ],
      },
      { tip: 'Yeni bir fiili şimdiki ve geçmiş biçimiyle birlikte ezberle: köpa, köper, köpte. Tek heceli olmayan bir fiilin şimdiki zamanı *-ar* ile bitiyorsa fiil 1. gruptadır; *-er* ile bitiyorsa 2. ya da 4. grupta olabilir, bunu geçmiş biçimi gösterir. 4. gruptaki fiilleri supinumuyla da ezberle: skriva, skrev, skrivit.' },
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
    id: 'hade',
    chapter: 'Fiiller ve zamanlar',
    icon: '⏮️',
    title: 'hade + supinum',
    sub: 'Jag hade ätit: Türkçedeki -mişti',
    blocks: [
      { p: 'Türkçede "yemiştim, gelmişti" deriz: geçmişteki bir andan da önce olmuş bir şeyi anlatırız. İsveççede bunun için *hade* + supinum kullanılır: Jag *hade ätit*. (Yemiştim.)' },
      { p: "*hade*, *har*'ın geçmiş biçimidir ve herkes için aynıdır: jag hade, du hade, vi hade. Supinum hiç değişmez, yalnızca *har* yerine *hade* gelir. Supinum biçimleri için *har + supinum* bölümüne bak." },
      {
        table: {
          head: ['Türkçe', 'İsveççe'],
          rows: [
            ['yedim (şimdi tokum)', 'jag *har* ätit'],
            ['yemiştim', 'jag *hade* ätit'],
            ['gelmişti', 'han *hade* kommit'],
            ['görmemiştim', 'jag *hade inte* sett'],
          ],
        },
      },
      { p: 'Çoğu zaman iki olay vardır: biri geçmişte olur, öteki ondan da önce olmuştur. Bu yüzden *när* (-dığında) ve *redan* (çoktan) ile sık kullanılır: När vi kom, *hade* filmen redan *börjat*. (Geldiğimizde film çoktan başlamıştı.)' },
      { p: "Türkçede uzak geçmiş için de \"-mişti\" deriz: Buraya 2015'te gelmiştim. Arada ikinci bir geçmiş olay yoksa İsveççede düz geçmiş zaman kullanılır: Jag kom hit 2015." },
      { p: 'Arkasından supinum gelmezse *hade* "vardı" demektir: Jag hade en katt. (Bir kedim vardı.)' },
      {
        ex: [
          ['Jag *hade* aldrig *sett* snö förut.', 'Daha önce hiç kar görmemiştim.'],
          ['Han *hade* glömt sina nycklar.', 'Anahtarlarını unutmuştu.'],
          ['De bjöd på mat, men jag *hade* redan *ätit*.', 'Yemek ikram ettiler ama ben çoktan yemiştim.'],
        ],
      },
      { tip: '*hade*\'den sonra geçmiş biçim değil, supinum gelir: "Jag hade åt" değil, Jag hade *ätit*. *har*\'dan sonra da aynısı olur.' },
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
    id: 'aliskanlik',
    chapter: 'Fiiller ve zamanlar',
    icon: '🔄',
    title: 'Alışkanlıklar ve süren işler',
    sub: 'brukar, brukade, håller på att, satt och läste',
    blocks: [
      { p: 'Türkçede alışkanlığı geniş zamanla söyleriz: Sabahları çay içerim. İsveççede şimdiki zaman da kullanılabilir, ama alışkanlık için çok sık *brukar* + mastar kullanılır. *brukar* fiile "genelde" anlamı katar ve arkasından *att* gelmez: Jag *brukar* dricka te på morgonen.' },
      { p: 'Geçmişteki alışkanlık için *brukade* kullanılır. Türkçedeki *-erdi* gibidir: Vi *brukade* åka till Turkiet varje sommar. (Her yaz Türkiye\'ye giderdik.)' },
      { p: 'Bir işin tam şu an sürdüğünü, henüz bitmediğini vurgulamak için *håller på att* + mastar kullanılır.' },
      { p: 'Süren bir işi anlatmanın bir yolu da iki fiili *och* ile bağlamaktır. İlki kişinin nasıl durduğunu söyler: *sitta* (oturmak), *stå* (ayakta durmak), *ligga* (yatmak). İkincisi ne yaptığını söyler. İki fiil aynı zamanda olur ve aynı zaman biçimini alır: Hon *satt och läste*. (Oturmuş okuyordu.)' },
      {
        ex: [
          ['Jag *brukar* ta bussen till jobbet.', 'İşe genelde otobüsle giderim.'],
          ['Vi *brukade* bada här när vi var små.', 'Küçükken burada yüzerdik.'],
          ['Vänta lite, jag *håller på att* laga mat.', 'Biraz bekle, şu an yemek yapıyorum.'],
          ['Han *satt och* tittade på tv hela kvällen.', 'Bütün akşam oturup televizyon izledi.'],
        ],
      },
      { tip: 'Türkçedeki her "-iyor" için *håller på att* gerekmez: Jag läser en bok (Bir kitap okuyorum) yeterlidir. *håller på att* yalnızca işin tam şu an sürdüğünü vurgular.' },
    ],
  },
  {
    id: 'partikel',
    chapter: 'Fiiller ve zamanlar',
    icon: '🧲',
    title: 'Partikelli fiiller',
    sub: 'gå ut, stänga av, tycka om: vurgu küçük kelimede',
    blocks: [
      { p: 'Bazı fiillerin yanına küçük bir kelime gelir: *ut*, *av*, *om*, *upp*, *ihåg*. Bu kelimeye *partikel* denir. Fiil ile partikel birlikte tek bir anlam taşır; bu anlam fiilin kendi anlamından çok farklı olabilir:' },
      {
        table: {
          head: ['Fiil', 'Anlamı', 'Partikelle', 'Anlamı'],
          rows: [
            ['gå', 'gitmek', 'gå *ut*', 'dışarı çıkmak'],
            ['stänga', 'kapatmak (kapıyı)', 'stänga *av*', 'kapatmak (cihazı)'],
            ['tycka', 'düşünmek', 'tycka *om*', 'sevmek'],
            ['ge', 'vermek', 'ge *upp*', 'vazgeçmek'],
            ['komma', 'gelmek', 'komma *ihåg*', 'hatırlamak'],
          ],
        },
      },
      { p: 'Partikel vurgulu söylenir, fiil ise hafif kalır. Vurgu anlamı değiştirebilir: *om* vurguluysa *tycka om* "sevmek" olur. Vurgusuz *om* ise "hakkında" anlamına gelen bir edattır: Vad tycker du om filmen? (Film hakkında ne düşünüyorsun?)' },
      { p: 'Ana cümlede *inte* fiil ile partikelin arasına girer: Jag tycker *inte* om fisk. (Balık sevmem.)' },
      {
        ex: [
          ['Ska vi *gå ut* ikväll?', 'Bu akşam dışarı çıkalım mı?'],
          ['Glöm inte att *stänga av* spisen!', 'Ocağı kapatmayı unutma!'],
          ['Barnen *tycker om* glass.', 'Çocuklar dondurma sever.'],
          ['Jag *kommer* inte *ihåg* hans namn.', 'Adını hatırlamıyorum.'],
        ],
      },
      { tip: 'Partikeli atlama: "Jag tycker kaffe" yanlıştır, Jag tycker *om* kaffe doğrudur. Yeni bir partikelli fiili hep partikeliyle birlikte, tek bir kelime gibi ezberle: tycka om, gå ut, komma ihåg.' },
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
