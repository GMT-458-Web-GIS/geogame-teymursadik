document.addEventListener('DOMContentLoaded', function () {

    // --- YENİ AKILLI SİSTEM (SÜRE HESABI YOK) ---
    const introLayer = document.getElementById('intro-layer');
    const uiLayer = document.getElementById('ui-layer');
    const rocketWrapper = document.querySelector('.rocket-wrapper'); // Roketi seçtik

    // JavaScript'e diyoruz ki: "Roket animasyonu bittiği (animationend) an bu kodu çalıştır"
    rocketWrapper.addEventListener('animationend', () => {
        
        // 1. Siyah perdeyi kaldır
        introLayer.style.opacity = '0'; 
        
        // 2. Menüyü getir
        uiLayer.classList.remove('hidden-initially'); 
        
        // 3. Intro katmanını tamamen sil (Arkada durmasın)
        setTimeout(() => { 
            introLayer.style.display = 'none'; 
        }, 1000); // Sadece opacity geçişi (fade-out) için 1 saniye bekle
    });


    // --- 2. TOKEN VE AYARLAR ---
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTY0MDMwMy1lY2U4LTQ1YTktYWZlZS1iZDljOThhZjJjZDMiLCJpZCI6MzYwNzIzLCJpYXQiOjE3NjMyNDk5ODV9.PIg-r1zWhFUXv_OI717GB2rmbnx9c4hi_043a5Unbno';

    let currentQuestionIndex = 0;
    let score = 0;
    let lives = 3; 
    let timer = 90; 
    let timerInterval;
    let viewer; 
    let isGameActive = false;

    // --- SORULAR ---
    const questions = [
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
        { text: "Bu yörünge tam olarak 'Başlangıç Meridyeni (0°)' üzerindedir. Aşağıdaki ülkelerden hangisi Greenwich hattı (0°) üzerinde DEĞİLDİR?", options: ["İngiltere", "Fransa", "Almanya"], correct: 2, path: [0.0, 55.0, 0.0, 48.0, 0.0, 40.0, 0.0, 30.0], color: Cesium.Color.WHITE }
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

        // --- OYUNA BAŞLA BUTONU ---
        startBtn.addEventListener('click', function() {
            const user = usernameInput.value.trim();
            if(!user) { alert("İsim giriniz!"); return; }

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
                    alert("Süre Doldu!");
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
            // UÇAN KAMERA (FlyTo)
            viewer.flyTo(orbitEntity, {
                duration: 2.0, 
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 5000000)
            });
        }

        // --- GELİŞMİŞ CEVAP KONTROLÜ (BEKLEMELİ) ---
        function checkAnswer(selectedIndex, btnElement) {
            const data = questions[currentQuestionIndex];
            const optionsDiv = document.getElementById('options-container');
            const buttons = optionsDiv.getElementsByTagName('button');

            // Butonları kilitle
            for(let btn of buttons) { btn.classList.add('disabled-btn'); btn.disabled = true; }

            if(selectedIndex === data.correct) {
                btnElement.classList.add('correct-answer');
                score += 10;
                document.getElementById('score').innerText = score;
            } else {
                btnElement.classList.add('wrong-answer');
                buttons[data.correct].classList.add('correct-answer'); // Doğruyu göster
                lives--; 
                updateLivesUI(); 
                if(lives <= 0) { 
                    setTimeout(() => { alert("Tüm can haklarınız bitti!"); endGame(); }, 500);
                    return; 
                }
            }

            // 1.5 Saniye Bekle ve Geç
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