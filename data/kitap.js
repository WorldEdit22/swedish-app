// Dil bilgisi kitabı: bölümlerin listesi; her bölüm bloklardan oluşan bir sayfa (js/guideview.js).
// Metinlerde *x* kalın görünür. İlk bölüm alfabedir. Örnek çiftlerinde ilki İsveççe, ikincisi Türkçedir.

export const KITAP = [
  {
    id: 'harfler',
    icon: '🔤',
    title: 'Harfler ve sesler',
    sub: '29 harf ve zor sesler',
    blocks: [{ alphabet: true }],
  },
  {
    id: 'sira',
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
];
