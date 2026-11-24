// Yardım: her özellik için kısa bir rehber; konuların listesi, her konu sade bloklardan oluşan bir sayfa (js/guideview.js).
// Konularda örnek yoktur. Metinlerde *x* kalın görünür.

export const YARDIM = {
  intro: 'Her gün biraz İsveççe öğren: en yaygın kelimeler ve kalıplar. Uygulamanın bir bölümünü öğrenmek için bir konuya dokun.',
  sections: [
    {
      id: 'practice',
      icon: '🎯',
      title: 'Çalışma',
      sub: 'Doğru zamanda geri gelen kartlar',
      blocks: [
        { p: 'Üstten *Çalış*\'a geç. Kartlar tek tek gelir. Cevabı içinden söyle, sonra *Cevabı göster*\'e dokun.' },
        { p: 'Nasıl gittiğini söyle: *Bilemedim*, *Zor* ya da *Kolay*. Her düğme kartın ne zaman geri geleceğini gösterir. Bilemediğin kart çabuk gelir, kolay olan çok sonra.' },
        { list: ['Yanlış düğmeye mi bastın? *Geri al* cevabı geri alır.', 'Üstteki düğme yönü değiştirir: *TR → SV* (İsveççesini söyle) ya da *SV → TR* (anlamını bul).'] },
        { tip: 'Her yönde günde 15 yeni kart gelir. Bitince *Daha fazla yeni kart* 15 kart daha verir.' },
      ],
    },
    {
      id: 'browse',
      icon: '🧱',
      title: 'Göz at',
      sub: 'Konulara göre kelimeler ve kalıplar',
      blocks: [
        { p: '*Göz at*\'ta *Kelimeler* ve *Kalıplar* sekmelerinde bütün bloklar durur. Arama kutusunun altındaki düğmelerle *Kelimeler*\'de kelime türü, *Kalıplar*\'da kalıp grubu seç. Menüyle listeyi sırala, örneğin *Konuya göre*.' },
        { p: 'Bir bloğa dokununca seçilir, tekrar dokununca seçim kalkar. *Temizle* bu sekmedeki bütün seçimleri kaldırır.' },
        { p: 'Örnek cümleler yazılırken seçtiğin bloklar kullanılır. O yüzden şu an öğrendiğin kelimeleri seç.' },
      ],
    },
    {
      id: 'windows',
      icon: 'ℹ️',
      title: 'ⓘ penceresi',
      sub: 'Örnekler ve cevabı düzeltmek',
      blocks: [
        { p: 'Bir bloktaki ⓘ simgesine dokun, penceresi açılır. Kelimeyi ya da kalıbı ve örnek cümleleri gösterir. Duymak için hoparlöre dokun.' },
        { p: '*Seçiminden* altındaki cümleler seçtiğin bloklarla kurulur.' },
        { p: 'Penceredeki *Çalışma* bölümü kelimeyi her yönde ne kadar bildiğini gösterir. Düzeltmek için *Yeni*, *Bilemedim*, *Zor* ya da *Kolay*\'a dokun. Yanlış bastıysan işe yarar.' },
      ],
    },
    {
      id: 'search',
      icon: '🔍',
      title: 'Arama ve tarama',
      sub: 'Kelime bul, fotoğraf oku',
      blocks: [
        { p: '*Göz at*\'ta arama kutusuna Türkçe ya da İsveççe yaz. Liste yalnızca uyanları gösterir.' },
        { p: 'Arama kutusunun yanındaki kamera düğmesi İsveççe bir metnin fotoğrafını tarar, örneğin bir kitap sayfasını. Sonra herhangi bir cümleye dokunup açıklamasını görebilirsin.' },
        { tip: 'Tarama için ücretsiz bir Gemini anahtarı gerekir. Anahtarı *Ayarlar*\'dan eklersin; yapay zekâ konusuna bak.' },
      ],
    },
    {
      id: 'translate',
      icon: '💬',
      title: 'Çevir',
      sub: 'Üstteki konuşma balonu',
      blocks: [
        { p: 'Konuşma balonu bir çeviri penceresi açar. Yaz ya da yapıştır, Türkçe ile İsveççe arasında yazarken çevrilir.' },
        { p: 'Yönü çevirmek için değiştirme düğmesini kullan. Balon her kelime, kalıp ve tarama penceresinin başlığında da var, yani okurken çevirebilirsin.' },
      ],
    },
    {
      id: 'book',
      icon: '📖',
      title: 'Dil bilgisi kitabı',
      sub: 'Üstteki açık kitap',
      blocks: [
        { p: 'Üstteki açık kitap kısa bir dil bilgisi kitabı açar. Önce harfler ve sesler gelir, sonra her seferinde tek bir konu.' },
        { p: 'Her İsveççe cümlenin yanında bir hoparlör var. Kitap düğmesi her kelime, kalıp ve tarama penceresinin başlığında da var.' },
        { tip: 'Merak ettiğinde aç. Sırayla okumak zorunda değilsin.' },
      ],
    },
    {
      id: 'ai',
      icon: '✨',
      title: 'Yapay zekâ ile örnekler',
      sub: 'İsteğe bağlı, ücretsiz, Ayarlar\'dan kurulur',
      blocks: [
        { p: 'Hazır örnekler her zaman, internetsiz de çalışır. *Ayarlar*\'dan ücretsiz bir yapay zekâ kurarsan ⓘ penceresinde *Daha fazla örnek* düğmesi de çıkar.' },
        { p: '*Ayarlar*\'da bir sağlayıcı seç ve anahtarını yapıştır. Çalışıp çalışmadığını *Dene* ile kontrol et. Anahtar bu telefonda kalır.' },
        { tip: 'Google Gemini önerilendir. Fotoğraf tarama da onu kullanır.' },
      ],
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Ayarlar',
      sub: 'Üstteki dişli',
      blocks: [
        {
          list: [
            '*Bloklarda İsveççeyi göster*: kendini sınamak için kapat. Türkçeyi oku, İsveççesini söyle, sonra ⓘ ile kontrol et.',
            '*Okunuşu göster*: kelimelerin altında Türkçe harflerle nasıl okunduğunu gösterir.',
            '*Yedeği kopyala* ilerlemeni metin olarak kopyalar. Arada bir Notlar\'a yapıştır; gerekirse *Geri yükle* ile geri getirirsin.',
          ],
        },
      ],
    },
    {
      id: 'routine',
      icon: '🗓️',
      title: 'İyi bir düzen',
      sub: 'Her gün biraz yeter',
      blocks: [
        { p: 'Günde 5 ile 10 dakika çalış. Kısa ve düzenli olmak, uzun ve seyrek olmaktan iyidir.' },
        { p: 'Hayatta bir kelime karşına çıkınca *Göz at*\'ta bul ve konusuna bak.' },
        { tip: 'Merak ettiğinde dil bilgisi kitabını aç. Acele yok.' },
      ],
    },
  ],
};
