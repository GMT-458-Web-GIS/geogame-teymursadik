# 🌍 GMT 458 - GeoGame: **Kronosfer**
**Project Orbit Tracker – CesiumJS Tabanlı 3D Uydu Yörünge Oyunu**

Kronosfer, GMT 458 Web GIS dersi kapsamında geliştirilen bir **3D geogame** uygulamasıdır. CesiumJS kullanılarak oluşturulan interaktif Dünya modeli üzerinde, oyuncuya farklı **uydu yörüngeleri** gösterilir ve bu yörüngeler hakkında hızlıca karar vermesini gerektiren bir oyun deneyimi sunulur. Amaç; süre baskısı altında en fazla doğru cevabı verip **en yüksek skoru** elde etmektir.

---

## 🚀 1. Projenin Amacı ve Kapsamı

Bu proje, Web GIS uygulamalarının sadece haritalardan ibaret olmadığını, aynı zamanda oyunlaştırılmış coğrafi deneyimlerle daha etkileşimli bir hale gelebileceğini göstermeyi hedefler.  
Kronosfer’de:

- 3D bir Dünya üzerinde konumlanan yörüngeler incelenir,
- Oyuncuya bu yörüngelerle ilgili çoktan seçmeli sorular sorulur,
- Her soru bir “gezegen turu” havasında ilerler,
- Süre ve can hakları oyuncunun stres seviyesini yönetmesini gerektirir,
- Sonuçlar kaydedilir ve mini bir liderlik tablosu ile yarış hissi güçlendirilir.

---

## 🌐 2. Oyun Bileşenleri

### 🔐 **Kullanıcı Girişi**
Oyuna başlamadan önce kullanıcıdan bir kullanıcı adı istenir. Bu isim hem oyunda görüntülenir hem de skor kayıtlarında kullanılır.

### 🪐 **3D CesiumJS Dünya**
Projenin kalbi olan bu bölümde:
- Oyuncu Dünya’yı fare ile döndürebilir,
- Yakınlaştırıp uzaklaştırabilir,
- Yörünge çizgisi Dünya’ya “sabitlenmiş” olarak görünür,
- Böylece oyuncu yörüngenin geçtiği coğrafi alanları inceleme fırsatı bulur.

### ❓ **Soru Paneli**
Yörünge ile ilgili 3 seçenekli sorular ekrana gelir.  
Her soru yeni bir yörünge çizgisi ile birlikte çalışır.

### ❤️ **Can – Süre – Skor Sistemi**
- **Süre:** 60 saniyeden geri sayım  
- **Can:** 2 adet  
- **Skor:** Her doğru cevap +10
- Bir nevi mini “coğrafi refleks testi” şeklinde ilerler.

### 🏆 **Liderlik Tablosu**
Oyun sonunda en yüksek 3 skor yerel depolamada tutulur ve oyuncuya gösterilir.

---

## 🖥️ 3. Arayüz Tasarımı

Uygulama iki ana ekrandan oluşur:

### 🟦 **Giriş Ekranı**
- “Kronosfer” başlığı
- Kullanıcı adı giriş alanı
- Başlat (Start) butonu

### 🌍 **Oyun Ekranı**
- Tam ekran Cesium Dünya
- Sol üstte:
  - **Süre**
  - **Skor**
  - **Can ikonları**
- Alt ortada:
  - **Aktif soru metni**
  - **3 cevap seçeneği**

---

## 🧭 4. Oyun Akışı

1. Kullanıcı giriş ekranında adını girer.
2. Start’a basınca 60 saniyelik oyun başlar.
3. Ekrana rastgele bir yörünge ve soru gelir.
4. Oyuncu cevabı seçer → yeni yörünge & yeni soru yüklenir.
5. 2 yanlış yapıldığında veya süre dolduğunda oyun sona erer.
6. Sonuç ekranında oyuncunun skoru ve ilk 3 skor gösterilir.

**Not:** Soru sayısı sabit değildir. Amaç süre bitmeden mümkün olduğunca çok doğru cevap vermektir.

---

## 🛠️ 5. Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|----------|----------------|
| **CesiumJS** | 3D Dünya, yörünge çizgileri, geogörselleştirme |
| **JavaScript** | Oyun mekaniği, sayaç, soru sistemi |
| **HTML/CSS** | Arayüz ve sayfa düzeni |
| **LocalStorage** | En iyi 3 skorun saklanması |
| **(Opsiyonel) Chart.js** | Skorların grafiksel olarak gösterilmesi |

---

## 🎮 Sonuç

Kronosfer, ders kapsamında geliştirilen fakat gerçek bir oyuna dönüşebilecek nitelikte bir **3D coğrafi oyun prototipidir**.  
Hem CesiumJS kullanımını hem de oyunlaştırılmış mekansal etkileşimi aynı proje içinde göstermektedir.

