# Turizm Danışmanlık Platformu — Teknik Tasarım

## 1. Amaç

Türkiye pazarındaki yeni yatırımcılar ve mevcut işletmeler için turizm, konaklama ve yeme-içme danışmanlık hizmetlerini tanıtan; yüz yüze eğitimleri, kurulum hizmetlerini ve ekipman planlama yetkinliğini sergileyen iki dilli bir web uygulaması geliştirilecektir.

İlk sürümün temel dönüşüm hedefi, ziyaretçinin uygun hizmeti anlayıp nitelikli bir danışmanlık talebi göndermesidir.

## 2. İlk Faz Kapsamı

### Dahil

- Türkçe ve İngilizce kurumsal web sitesi
- Yeni yatırım ve mevcut işletme odaklı hizmet anlatımları
- Otel, restoran, kafe, düğün salonu ve balo/etkinlik salonu sektör sayfaları
- Uçtan uca kurulum, operasyon danışmanlığı, ekipman planlama ve yüz yüze eğitim hizmetleri
- Sanity tabanlı içerik yönetimi
- İki aşamalı danışmanlık talep formu
- Taleplerin PostgreSQL'e kaydedilmesi
- İşletmeye ve başvuru sahibine e-posta bildirimi
- SEO, KVKK, güvenlik ve spam koruması

### Hariç

- WhatsApp entegrasyonu
- Müşteri üyeliği ve müşteri paneli
- Talep yönetim paneli
- Video veya doküman tabanlı eğitim platformu
- Sınav ve sertifika sistemi
- Dosya yükleme
- E-ticaret ve doğrudan ekipman satışı

## 3. Marka ve Görsel Yön

- Öncelikli pazar Türkiye'dir.
- Geçici marka adı `Mihenk` olacaktır; nihai ad daha sonra değiştirilebilir.
- Marka karakteri seçkin, güven veren ve köklüdür.
- Ana görsel yön koyu yeşil, sıcak altın ve nötr krem tonlarından oluşur.
- Dil profesyonel, açık ve sonuç odaklı olacaktır.
- İçerik ve marka adı Sanity üzerinden değiştirilebilir olacaktır.

## 4. Sayfa Yapısı

- Ana Sayfa
- Hizmetler
  - Yeni işletme kurulumu
  - Mevcut işletme geliştirme
  - Operasyon danışmanlığı
  - Ekipman planlama ve seçimi
  - Yüz yüze personel eğitimleri
- Sektörler
  - Otel
  - Restoran
  - Kafe
  - Düğün salonu
  - Balo ve etkinlik salonu
- Eğitimler
- Ekipmanlar
- Projeler / Referanslar
- Hakkımızda
- İletişim ve Danışmanlık Talebi
- KVKK ve Gizlilik

Türkçe ve İngilizce sayfalar `/tr/...` ve `/en/...` adresleri altında yayımlanacaktır.

## 5. Teknik Mimari

Uygulama modüler monolit olarak geliştirilecektir. Ayrı frontend, backend veya mikroservis oluşturulmayacaktır.

### Teknolojiler

- Next.js ve TypeScript
- Sanity CMS
- PostgreSQL
- Prisma
- next-intl
- Zod
- Resend
- Cloudflare Turnstile
- Vercel

### Mimari Yaklaşım

Özellik bazlı modüler yapı ile sadeleştirilmiş Clean Architecture uygulanacaktır:

- `presentation`: Sayfalar, bileşenler, formlar ve sunucu giriş noktaları
- `application`: Kullanım senaryoları ve uygulama akışları
- `domain`: İş kuralları, varlıklar ve bağımlılık arayüzleri
- `infrastructure`: Prisma, Sanity, e-posta ve dış servis adaptörleri

Bağımlılıklar dış katmanlardan iç katmanlara doğru olacaktır. Domain ve application katmanları Prisma, Sanity veya Resend'e doğrudan bağımlı olmayacaktır.

## 6. Önerilen Dizin Yapısı

```text
src/
├── app/
│   └── [locale]/
├── modules/
│   └── consultation/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── sanity/
│   ├── schemas/
│   ├── queries/
│   └── client/
├── shared/
├── components/
└── i18n/

prisma/
└── schema.prisma
```

## 7. Sanity İçerik Modeli

Sanity aşağıdaki içerikleri yönetecektir:

- Site ayarları ve marka bilgileri
- Menü ve alt bilgi
- Ana sayfa bölümleri
- Hizmetler
- Sektörler
- Yüz yüze eğitimler
- Ekipman kategorileri
- Projeler ve referanslar
- Hakkımızda
- İletişim bilgileri
- SEO alanları
- KVKK ve gizlilik metinleri

Türkçe ve İngilizce alanlar aynı içerik kaydında tutulacaktır. Bir dilin zorunlu alanları eksikse ilgili dil sürümü yayımlanmayacaktır. Otomatik çeviri yapılmayacaktır.

Kişisel bilgiler ve danışmanlık talepleri Sanity'de tutulmayacaktır.

## 8. Danışmanlık Formu

### Aşama 1 — Proje Bilgileri

- Başvuru türü: Yeni yatırım / Mevcut işletme
- İşletme türü
- İstenen hizmet
- Şehir
- İşletmenin mevcut durumu
- Kapasite veya yaklaşık metrekare
- Hedef açılış/çalışma tarihi
- Tahmini bütçe aralığı
- Talep açıklaması

### Aşama 2 — İletişim Bilgileri

- Ad soyad
- Şirket adı, isteğe bağlı
- Telefon
- E-posta
- Tercih edilen iletişim yöntemi
- KVKK onayı

### Gönderim Akışı

1. Veriler istemci ve sunucu tarafında doğrulanır.
2. Turnstile doğrulaması ve hız sınırı uygulanır.
3. Talep benzersiz başvuru numarasıyla PostgreSQL'e kaydedilir.
4. İşletmeye yeni talep e-postası gönderilir.
5. Başvuru sahibine talebin alındığı e-postası gönderilir.
6. Kullanıcıya başarılı gönderim ekranı gösterilir.

E-posta gönderimi başarısız olursa kaydedilmiş talep silinmez. Hata, kişisel veri içermeyen yapılandırılmış bir kayıtla izlenir.

## 9. Güvenlik ve Gizlilik

- Sunucu tarafı doğrulama zorunludur.
- KVKK onayı olmadan talep kabul edilmez.
- Kişisel bilgiler uygulama loglarına yazılmaz.
- Gizli anahtarlar yalnızca sunucu ortam değişkenlerinde tutulur.
- Form uç noktasında hız sınırı uygulanır.
- Turnstile ile otomatik gönderimler azaltılır.
- Kullanıcıya sistem veya veritabanı hata ayrıntıları gösterilmez.
- Sanity yazma anahtarları tarayıcıya açılmaz.

## 10. SEO ve Erişilebilirlik

- Her dil için ayrı başlık, açıklama ve sosyal paylaşım alanları bulunur.
- Dil alternatifleri `hreflang` ile belirtilir.
- Anlamlı başlık sırası, klavye kullanımı, görünür odak ve form etiketleri uygulanır.
- Görsellerde alternatif metin kullanılır.
- Hizmet ve sektör içerikleri yapılandırılmış URL'lere sahip olur.

## 11. Hata Yönetimi

- Beklenen doğrulama hataları alan bazında gösterilir.
- Beklenmeyen hatalarda genel ve güvenli bir mesaj gösterilir.
- Sanity içeriği bulunamazsa uygun 404 sayfası gösterilir.
- E-posta hatası talep kaydını geri almaz.
- Veritabanı kaydı başarısızsa e-posta gönderilmez ve kullanıcı tekrar deneyebilir.

## 12. Doğrulama Yaklaşımı

Proje kuralı gereği otomatik test case yazılmayacaktır. Uygulama; TypeScript kontrolü, lint, üretim derlemesi ve kritik kullanıcı akışlarının tarayıcı üzerinden manuel doğrulanmasıyla kontrol edilecektir.

## 13. Graphify Kullanımı

- Her görevden önce `AGENTS.md` ve varsa `learnt.md` okunur.
- İlk kod iskeletinden sonra Graphify haritası oluşturulur.
- Her görevde önce mevcut Graphify haritası sorgulanır.
- Mimariyi etkileyen değişikliklerden sonra harita güncellenir.
- Geniş proje taraması yerine Graphify üzerinden ilgili modül ve semboller belirlenir.

## 14. Sonraki Fazlar

- Talep yönetim paneli
- Talep durumları, notlar ve filtreleme
- Müşteri hesabı ve proje takibi
- Tedarikçi ve teklif yönetimi
- Gerektiğinde WhatsApp bildirimi

Bu özellikler ilk faz mimarisini bozmadan ayrı modüller olarak eklenebilecektir.
