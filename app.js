document.addEventListener('DOMContentLoaded', function () {

    // --- 1. INTRO ZAMANLAMASI (BEKLEME SORUNU ÇÖZÜMÜ) ---
    const introLayer = document.getElementById('intro-layer');
    const uiLayer = document.getElementById('ui-layer');
    const rocketWrapper = document.querySelector('.rocket-wrapper');

    // "setTimeout" yerine "animationend" kullanıyoruz.
    // Bu kod, roketin hareketi bittiği AN çalışır.
    if (rocketWrapper) {
        rocketWrapper.addEventListener('animationend', () => {
            introLayer.style.opacity = '0'; // Siyah perdeyi kaldır
            uiLayer.classList.remove('hidden-initially'); // Menüyü aç
            
            // Arka plandaki intro elementini sil
            setTimeout(() => { introLayer.style.display = 'none'; }, 1000); 
        });
    } else {
        // Eğer roket bulunamazsa güvenlik için menüyü direkt aç
        uiLayer.classList.remove('hidden-initially');
        introLayer.style.display = 'none';
    }

    // --- 2. TOKEN VE AYARLAR ---
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTY0MDMwMy1lY2U4LTQ1YTktYWZlZS1iZDljOThhZjJjZDMiLCJpZCI6MzYwNzIzLCJpYXQiOjE3NjMyNDk5ODV9.PIg-r1zWhFUXv_OI717GB2rmbnx9c4hi_043a5Unbno';

    let currentQuestionIndex = 0;
    let score = 0;
    let lives = 3; 
    let timer = 90; 
    let timerInterval;
    let viewer; 
    let isGameActive = false;

    // --- 35 ADET TÜRKÇE SORU HAVUZU ---
    const questions = [
        // --- MEVCUT SORULARIN (1-13) ---
        { text: "Bu yörünge Avrupa üzerinde çok hassas bir rot izliyor. İtalya ve Yunanistan'ı kesiyor. Peki, hemen kuzeydeki hangi ülkeyi TEĞET GEÇEREK atlıyor?", options: ["Arnavutluk", "Bulgaristan", "Makedonya"], correct: 1, path: [12.5, 42.0, 19.0, 41.5, 21.0, 40.5, 26.0, 40.5, 32.0, 40.0], color: Cesium.Color.RED },
        { text: "Bu uydu tam Ekvator (0°) ile Yengeç Dönencesi (23.5°) arasında salınıyor. Aşağıdaki Avrupa ülkelerinden hangisi bu uydunun KAPSAMA ALANI DIŞINDADIR?", options: ["İspanya", "Mısır", "Almanya"], correct: 2, path: [-20, 0, 0, 10, 10, 20, 20, 25, 30, 20, 40, 10, 60, 0], color: Cesium.Color.YELLOW },
        { text: "Bu yörünge 'Hazar Denizi' üzerinden geçip Asya'ya iniyor. Dikkatli bak! Hazar Denizine kıyısı olan hangi ülkeden GEÇMEMEKTEDİR?", options: ["Azerbaycan", "Türkmenistan", "Rusya"], correct: 0, path: [45.0, 50.0, 50.0, 45.0, 52.0, 43.0, 55.0, 40.0, 60.0, 35.0], color: Cesium.Color.CYAN },
        { text: "Bu yörünge Avrupa'dan Karadeniz'e doğru iniyor. Romanya ve Ukrayna üzerinden geçiyor. Hemen güneydeki hangi ülkeyi 'TEĞET' geçerek ıskalıyor?", options: ["Moldova", "Türkiye", "Bulgaristan"], correct: 1, path: [20.0, 47.0, 25.0, 46.0, 30.0, 45.0, 34.0, 45.0, 40.0, 44.0], color: Cesium.Color.RED },
        { text: "İskandinavya üzerinde uçan bu uydu, İsveç ve Finlandiya'yı kesiyor. Ancak Baltık Denizi'nin güneyindeki bir ülkeye hiç uğramıyor. Hangisi?", options: ["Norveç", "Polonya", "Rusya"], correct: 1, path: [10.0, 60.0, 15.0, 60.0, 25.0, 61.0, 30.0, 60.0], color: Cesium.Color.YELLOW },
        { text: "Japonya üzerinden geçen bu yörünge Asya anakarasına doğru ilerliyor. Hangi ülkenin hava sahasına GİRMEZ?", options: ["Kuzey Kore", "Güney Kore", "Çin"], correct: 1, path: [140.0, 36.0, 135.0, 38.0, 129.0, 40.0, 124.0, 41.0], color: Cesium.Color.CYAN },
        { text: "Bu hat Hindistan'ın tam ortasından geçip kuzeye çıkıyor. Himalayalar'ı aşıyor ama haritadaki o küçük ülkeye dokunmuyor. Hangisi?", options: ["Nepal", "Butan", "Çin"], correct: 1, path: [77.0, 20.0, 80.0, 25.0, 84.0, 28.0, 88.0, 32.0], color: Cesium.Color.MAGENTA },
        { text: "Güney Amerika'nın batı kıyısını takip eden bu hat, ince uzun bir ülkeyi boydan boya geçiyor. Ama hemen yanındaki denize kıyısı olmayan ülkeyi ıskalıyor. O ülke hangisi?", options: ["Şili", "Bolivya", "Peru"], correct: 1, path: [-71.0, -20.0, -71.0, -25.0, -72.0, -35.0, -73.0, -45.0], color: Cesium.Color.ORANGE },
        { text: "ABD ile Kanada sınırına çok yakın uçan bu uydu, Büyük Göller bölgesinden geçiyor. Hangi ABD eyaletini veya şehrini KESİN OLARAK ISKALAR?", options: ["New York", "Michigan", "Florida"], correct: 2, path: [-90.0, 47.0, -83.0, 44.0, -78.0, 43.0, -70.0, 44.0], color: Cesium.Color.LIME },
        { text: "Afrika Boynuzu'nu kesen bu yörünge Somali ve Etiyopya'dan geçiyor. Peki hemen güneydeki hangi turistik ülkeye UĞRAMIYOR?", options: ["Kenya", "Sudan", "Yemen"], correct: 0, path: [35.0, 10.0, 40.0, 8.0, 45.0, 6.0, 50.0, 4.0], color: Cesium.Color.RED },
        { text: "Cebelitarık Boğazı'ndan Akdeniz'e giren bu hat, Kuzey Afrika kıyılarını takip ediyor. Hangi ülkeden GEÇMEZ?", options: ["Fas", "Cezayir", "İtalya"], correct: 2, path: [-5.0, 36.0, 0.0, 36.0, 10.0, 37.0, 20.0, 32.0], color: Cesium.Color.YELLOW },
        { text: "Avustralya ile Yeni Zelanda arasından geçen bu yörünge çok tehlikeli! Yeni Zelanda'nın iki adasından hangisini vuruyor?", options: ["Kuzey Adası", "Güney Adası", "Hiçbiri"], correct: 1, path: [160.0, -35.0, 168.0, -42.0, 174.0, -45.0], color: Cesium.Color.CYAN },
        { text: "Bu yörünge tam olarak 'Başlangıç Meridyeni (0°)' üzerindedir. Aşağıdaki ülkelerden hangisi Greenwich hattı (0°) üzerinde DEĞİLDİR?", options: ["İngiltere", "Fransa", "Almanya"], correct: 2, path: [0.0, 55.0, 0.0, 48.0, 0.0, 40.0, 0.0, 30.0], color: Cesium.Color.WHITE },

        // --- YENİ EKLENEN SORULAR (14-35) ---
        { text: "Bu uydu Meksika Körfezi'nden kalkıp kuzeye, ABD'nin içlerine doğru gidiyor. Mississippi nehrini takip ediyor ama hangi eyalete UĞRAMIYOR?", options: ["Louisiana", "Tennessee", "California"], correct: 2, path: [-90.0, 29.0, -90.0, 35.0, -90.0, 40.0, -90.0, 45.0], color: Cesium.Color.LIME },
        { text: "Amazon Ormanları üzerindeki bu yörünge Brezilya'yı boydan boya geçiyor. Ancak batıdaki komşusuna hiç dokunmuyor. Hangisi?", options: ["Peru", "Kolombiya", "Şili"], correct: 2, path: [-60.0, -5.0, -55.0, -10.0, -50.0, -15.0, -45.0, -20.0], color: Cesium.Color.GREEN },
        { text: "Kanada'nın batı kıyısında, Vancouver ve Alaska arasında uçan bu hat, hangi ülkenin sınırlarını ihlal etmemeye çalışıyor?", options: ["ABD (Alaska)", "Rusya", "Meksika"], correct: 2, path: [-130.0, 50.0, -135.0, 55.0, -140.0, 60.0, -150.0, 65.0], color: Cesium.Color.CYAN },
        { text: "Karayipler üzerinde uçan bu uydu Küba ve Dominik Cumhuriyeti'ni görüyor. Peki hemen güneyde kalan kıta ülkesi hangisi?", options: ["Venezuela", "Meksika", "Kanada"], correct: 0, path: [-80.0, 22.0, -70.0, 19.0, -65.0, 18.0, -60.0, 15.0], color: Cesium.Color.ORANGE },
        { text: "Florida ile Bahamalar arasından geçen bu dar yörünge, Bermuda Şeytan Üçgeni'ne doğru ilerliyor. Hangi ülkenin başkentini teğet geçer?", options: ["Havana (Küba)", "Nassau (Bahamalar)", "Washington DC"], correct: 1, path: [-80.0, 25.0, -78.0, 26.0, -77.0, 25.0, -75.0, 24.0], color: Cesium.Color.MAGENTA },
        { text: "İber Yarımadası'nı (İspanya/Portekiz) kesen bu hat, Pireneler'e dayanıyor ama ötesine geçmiyor. Hangi büyük Avrupa ülkesine GİRİŞ YAPMAZ?", options: ["Fransa", "İspanya", "Portekiz"], correct: 0, path: [-8.0, 37.0, -5.0, 39.0, -3.0, 40.0, 0.0, 42.0], color: Cesium.Color.YELLOW },
        { text: "İtalya çizmesinin topuğundan Balkanlar'a uzanan bu çizgi, Adriyatik Denizi'ni aşıyor. Karşı kıyıda hangi ülkeyi vurur?", options: ["Arnavutluk", "İspanya", "Mısır"], correct: 0, path: [18.0, 40.0, 19.0, 41.0, 20.0, 41.5, 21.0, 42.0], color: Cesium.Color.RED },
        { text: "Birleşik Krallık (İngiltere) üzerinden geçen bu dikey yörünge, hemen batıdaki komşu adayı pas geçiyor. O ada ülkesi hangisidir?", options: ["İrlanda", "İzlanda", "Norveç"], correct: 0, path: [-1.0, 50.0, -1.5, 53.0, -2.0, 56.0, -3.0, 59.0], color: Cesium.Color.WHITE },
        { text: "Baltık Denizi'nin tam ortasından geçen bu hat, Estonya ve Letonya'yı görüyor ama kuzeydeki büyük ülkeye değmiyor. Hangisi?", options: ["Finlandiya", "Polonya", "Almanya"], correct: 0, path: [20.0, 56.0, 22.0, 57.0, 24.0, 58.0, 26.0, 59.0], color: Cesium.Color.CYAN },
        { text: "Fransa'nın güney sahillerini (Nice, Marsilya) takip eden bu yörünge, denizin hemen içindeki hangi büyük adayı ıskalar?", options: ["Korsika", "Sardinya", "Sicilya"], correct: 0, path: [5.0, 43.0, 6.0, 43.2, 7.0, 43.5, 8.0, 43.8], color: Cesium.Color.BLUE },
        { text: "Arap Yarımadası'nı çapraz kesen bu yörünge Suudi Arabistan ve Yemen'den geçiyor. Doğudaki hangi körfez ülkesini ISKALAR?", options: ["Umman", "Katar", "Suriye"], correct: 0, path: [40.0, 20.0, 45.0, 18.0, 48.0, 16.0, 50.0, 14.0], color: Cesium.Color.MAGENTA },
        { text: "Güneydoğu Asya'da Vietnam ve Tayland üzerinden geçen bu çizgi, doğudaki büyük ada ülkesine uğramıyor. Hangisi?", options: ["Filipinler", "Kamboçya", "Laos"], correct: 0, path: [100.0, 15.0, 105.0, 12.0, 108.0, 10.0, 110.0, 8.0], color: Cesium.Color.LIME },
        { text: "Çin Seddi'ne paralel giden bu yörünge Moğolistan sınırını takip ediyor. Hangi ülkenin hava sahasındadır?", options: ["Çin", "Hindistan", "Japonya"], correct: 0, path: [100.0, 40.0, 110.0, 41.0, 115.0, 40.5, 120.0, 40.0], color: Cesium.Color.RED },
        { text: "Hindistan'ın en güney ucundan (Sri Lanka yakını) geçen bu hat, Hint Okyanusu'na açılıyor. Hangi ada ülkesini sıyırıp geçer?", options: ["Sri Lanka", "Madagaskar", "Avustralya"], correct: 0, path: [79.0, 8.0, 79.5, 7.0, 80.0, 6.0, 80.5, 5.0], color: Cesium.Color.ORANGE },
        { text: "Hazar Denizi'nin doğu kıyısından (Türkmenistan) geçen bu hat, kuzeye doğru çıkarken hangi büyük ülkeye girer?", options: ["Kazakistan", "İran", "Afganistan"], correct: 0, path: [53.0, 38.0, 53.0, 40.0, 53.0, 42.0, 53.0, 45.0], color: Cesium.Color.CYAN },
        { text: "Nil Nehri boyunca (Mısır-Sudan) aşağı inen bu yörünge, batıdaki komşu ülkeye hiç girmiyor. Hangisi?", options: ["Libya", "Etiyopya", "Kızıldeniz"], correct: 0, path: [31.0, 30.0, 32.0, 25.0, 32.5, 20.0, 33.0, 15.0], color: Cesium.Color.CYAN },
        { text: "Afrika'nın en batı ucundan (Senegal) geçen bu hat, okyanusa doğru ilerliyor. Hangi ada grubuna doğru gidiyor?", options: ["Yeşil Burun Adaları", "Japonya", "Yeni Zelanda"], correct: 0, path: [-15.0, 14.0, -18.0, 15.0, -20.0, 16.0, -23.0, 17.0], color: Cesium.Color.YELLOW },
        { text: "Madagaskar adasının tam üzerinden geçen bu yörünge, Afrika ana karasındaki hangi ülkeye en yakındır?", options: ["Mozambik", "Nijerya", "Fas"], correct: 0, path: [45.0, -15.0, 47.0, -20.0, 48.0, -25.0, 50.0, -30.0], color: Cesium.Color.MAGENTA },
        { text: "Antarktika Yarımadası üzerinden geçen bu kutupsal yörünge, yukarı doğru çıkarken hangi kıtaya yaklaşır?", options: ["Güney Amerika", "Avrupa", "Asya"], correct: 0, path: [-60.0, -70.0, -65.0, -60.0, -70.0, -55.0, -75.0, -50.0], color: Cesium.Color.WHITE },
        { text: "Pasifik Okyanusu'nun ortasında, Hawaii adalarının üzerinden geçen bu hat, hangi kıtaya en uzaktır?", options: ["Avrupa", "Kuzey Amerika", "Asya"], correct: 0, path: [-160.0, 18.0, -158.0, 20.0, -155.0, 22.0, -150.0, 25.0], color: Cesium.Color.CYAN },
        { text: "Atlas Okyanusu'nu 'S' şeklinde geçen bu yörünge, Brezilya ile Afrika arasındadır. Hangi adaya daha yakındır?", options: ["Ascension", "Girit", "Kıbrıs"], correct: 0, path: [-20.0, -10.0, -15.0, -5.0, -14.0, 0.0, -10.0, 5.0], color: Cesium.Color.GREEN },
        { text: "Bering Boğazı'ndan (ABD-Rusya arası) geçen bu hat, iki kıtayı birbirinden ayırır. Hangi iki ülkenin sınırıdır?", options: ["ABD - Rusya", "Çin - Japonya", "İngiltere - Fransa"], correct: 0, path: [-168.0, 60.0, -168.5, 65.0, -169.0, 70.0, -169.5, 75.0], color: Cesium.Color.WHITE },
        { text: "Bu hat Türkiye'nin güney sahillerini (Antalya-Mersin) takip ediyor. Karşı kıyıdaki ada hangisidir?", options: ["Kıbrıs", "Girit", "Midilli"], correct: 0, path: [30.0, 36.0, 32.0, 35.5, 34.0, 35.0, 36.0, 36.0], color: Cesium.Color.RED },
        { text: "İstanbul Boğazı'ndan geçip kuzeye, Karadeniz'e çıkan bu yörünge hangi ülkeye doğru gidiyor?", options: ["Ukrayna/Rusya", "Mısır", "Yunanistan"], correct: 0, path: [29.0, 41.0, 29.1, 42.0, 30.0, 43.0, 31.0, 45.0], color: Cesium.Color.BLUE },
        { text: "Türkiye'nin doğu sınırından (Ağrı/Iğdır) geçen bu hat, hangi komşu ülkeyi sıyırıp geçer?", options: ["Ermenistan", "Yunanistan", "Bulgaristan"], correct: 0, path: [43.0, 38.0, 44.0, 39.0, 44.5, 40.0, 45.0, 41.0], color: Cesium.Color.ORANGE },
        { text: "Ege Denizi üzerindeki bu yörünge İzmir ile Atina arasındadır. Hangi denizin üzerindedir?", options: ["Ege Denizi", "Hazar Denizi", "Kızıldeniz"], correct: 0, path: [24.0, 37.0, 25.0, 38.0, 26.0, 38.5, 27.0, 39.0], color: Cesium.Color.CYAN }
    ];

    try {
        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false, timeline: false, baseLayerPicker: true,
            geocoder: false, homeButton: true, sceneModePicker: true,
            navigationHelpButton: false, infoBox: false, selectionIndicator: false,
            fullscreenButton: true, shadows: false, terrainProvider: undefined 
        });

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(35.0, 39.0, 20000000)
        });

        // GİRİŞTE DÜNYA DÖNSÜN
        viewer.clock.onTick.addEventListener(function(clock) {
            if (!isGameActive) {
                viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.0005);
            }
        });

        const startBtn = document.getElementById('startBtn');
        const loginScreen = document.getElementById('login-screen');
        const gameUI = document.getElementById('game-ui');
        const resultScreen = document.getElementById('result-screen');
        const usernameInput = document.getElementById('usernameInput');
        const timerElement = document.getElementById('timer'); 
        
        // --- DÜZELTİLDİ: BİLGİ PENCERESİ ELEMENTLERİ VE MANTIĞI ---
        const infoBtn = document.getElementById('infoBtn');
        const infoModal = document.getElementById('infoModal');
        const closeInfoBtn = document.getElementById('closeInfoBtn');

        // Butona basınca bilgi ekranını aç
        if(infoBtn && infoModal) {
            infoBtn.addEventListener('click', () => {
                infoModal.classList.remove('hidden');
                infoModal.classList.add('active');
            });
        }
        
        // Kapatma butonuna basınca gizle
        if(closeInfoBtn && infoModal) {
            closeInfoBtn.addEventListener('click', () => {
                infoModal.classList.remove('active');
                infoModal.classList.add('hidden');
            });
        }

        // --- OYUNA BAŞLA BUTONU ---
        startBtn.addEventListener('click', function() {
            const user = usernameInput.value.trim();
            if(!user) { alert("Lütfen bir isim giriniz!"); return; }

            isGameActive = true;
            questions.sort(() => Math.random() - 0.5); // Soruları karıştır
            score = 0; lives = 3; currentQuestionIndex = 0;
            
            document.getElementById('score').innerText = score;
            updateLivesUI();

            loginScreen.style.opacity = '0';
            setTimeout(() => {
                loginScreen.classList.remove('active');
                loginScreen.classList.add('hidden');
                loginScreen.style.opacity = '1';
                gameUI.classList.remove('hidden');
                gameUI.classList.add('active');
                loadQuestion(0);
                startTimer();
            }, 500);
        });

        function startTimer() {
            timer = 90; 
            if(timerElement) timerElement.innerText = timer;
            if(timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timer--;
                if(timerElement) timerElement.innerText = timer;
                if(timer <= 0) {
                    clearInterval(timerInterval);
                    alert("Süre Doldu! Operasyon Başarısız.");
                    endGame();
                }
            }, 1000);
        }

        function loadQuestion(index) {
            if(index >= questions.length) { endGame(); return; }
            const data = questions[index];
            document.getElementById('question-text').innerText = data.text;
            const optionsDiv = document.getElementById('options-container');
            optionsDiv.innerHTML = ""; 
            data.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerText = opt;
                // BUTONU YOLLA (THIS)
                btn.onclick = function() { checkAnswer(i, this); };
                optionsDiv.appendChild(btn);
            });
            drawOrbit(data.path, data.color);
        }

        function drawOrbit(pathCoords, colorVal) {
            viewer.entities.removeAll();
            const orbitEntity = viewer.entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray(pathCoords),
                    width: 8,
                    material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.2, color: colorVal }),
                    clampToGround: false
                }
            });
            
            // KAMERA UÇUŞU (Kilitlenmeden)
            viewer.flyTo(orbitEntity, {
                duration: 2.0, 
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 5000000)
            });
        }

        function checkAnswer(selectedIndex, btnElement) {
            const data = questions[currentQuestionIndex];
            const optionsDiv = document.getElementById('options-container');
            const buttons = optionsDiv.getElementsByTagName('button');

            // Butonları Kilitle
            for(let btn of buttons) { btn.classList.add('disabled-btn'); btn.disabled = true; }

            if(selectedIndex === data.correct) {
                btnElement.classList.add('correct-answer');
                score += 10;
                document.getElementById('score').innerText = score;
            } else {
                btnElement.classList.add('wrong-answer');
                buttons[data.correct].classList.add('correct-answer');
                lives--; 
                updateLivesUI(); 
                if(lives <= 0) { 
                    setTimeout(() => { alert("Tüm can haklarınız bitti!"); endGame(); }, 500);
                    return; 
                }
            }
            
            // 1.5 saniye bekle, sonraki soruya geç
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            }, 1500); 
        }

        function updateLivesUI() {
            let hearts = "";
            for(let i=0; i<lives; i++) hearts += "❤️";
            document.getElementById('lives').innerText = hearts;
        }

        function endGame() {
            clearInterval(timerInterval);
            isGameActive = false; 
            gameUI.classList.add('hidden'); 
            resultScreen.classList.remove('hidden'); 
            resultScreen.classList.add('active');
            document.getElementById('final-score').innerText = score;
            const username = document.getElementById('usernameInput').value;
            saveHighScore(username, score);
        }

    } catch (e) {
        console.error(e);
        alert("Hata: " + e.message);
    }
});

// --- LİDERLİK TABLOSU ---
function updateLeaderboard() {
    const scoreList = document.getElementById('score-list');
    const highScores = JSON.parse(localStorage.getItem('kronosferHighScores')) || [];
    scoreList.innerHTML = highScores.map(s => `<li>${s.name} : ${s.score} Puan</li>`).join('') || '<li>Henüz Kayıt Yok...</li>';
}

function saveHighScore(username, finalScore) {
    const highScores = JSON.parse(localStorage.getItem('kronosferHighScores')) || [];
    highScores.push({ name: username, score: finalScore });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5); 
    localStorage.setItem('kronosferHighScores', JSON.stringify(highScores));
    updateLeaderboard();
}

updateLeaderboard();