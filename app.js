document.addEventListener('DOMContentLoaded', function () {
    
    // 1. TOKEN
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTY0MDMwMy1lY2U4LTQ1YTktYWZlZS1iZDljOThhZjJjZDMiLCJpZCI6MzYwNzIzLCJpYXQiOjE3NjMyNDk5ODV9.PIg-r1zWhFUXv_OI717GB2rmbnx9c4hi_043a5Unbno';

    let currentQuestionIndex = 0;
    let score = 0;
    let lives = 2;
    let timer = 60;
    let timerInterval;
    let viewer; 

    // SORULAR
    const questions = [
        {
            text: "Kutuplar üzerinden geçen bu kırmızı yörünge hangisidir?",
            options: ["Ekvatoral", "Kutupsal (Polar)", "GEO"],
            correct: 1,
            path: [30, 85, 30, 60, 30, 30, 30, 0, 30, -30, 30, -60, 30, -85],
            color: Cesium.Color.RED
        },
        {
            text: "Ekvatoru takip eden bu sarı yörünge nedir?",
            options: ["LEO", "MEO", "Ekvatoral"],
            correct: 2,
            path: [-120, 0, -80, 0, -40, 0, 0, 0, 40, 0, 80, 0, 120, 0],
            color: Cesium.Color.YELLOW
        },
        {
            text: "Türkiye (36-42 Enlem) üzerinden geçen bu mavi yörünge nedir?",
            options: ["Göktürk-1", "GPS", "Haberleşme"],
            correct: 0,
            path: [25, 20, 30, 35, 35, 45, 40, 55],
            color: Cesium.Color.CYAN
        }
    ];

    try {
        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false, timeline: false, baseLayerPicker: true,
            geocoder: false, homeButton: true, sceneModePicker: true,
            navigationHelpButton: false, infoBox: false, selectionIndicator: false,
            fullscreenButton: true, shadows: false, terrainProvider: undefined 
        });

        // Kamerayı başlangıçta ayarla
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(35.0, 39.0, 20000000)
        });

        // HTML Elemanları (Artık hata vermeyecek çünkü HTML'e ekledik)
        const startBtn = document.getElementById('startBtn');
        const loginScreen = document.getElementById('login-screen');
        const gameUI = document.getElementById('game-ui');
        const resultScreen = document.getElementById('result-screen');
        const usernameInput = document.getElementById('usernameInput');
        const timerElement = document.getElementById('timer'); 

        // Başlat
        startBtn.addEventListener('click', function() {
            const user = usernameInput.value.trim();
            if(!user) { alert("İsim giriniz!"); return; }

            loginScreen.classList.remove('active');
            loginScreen.classList.add('hidden');
            gameUI.classList.remove('hidden');
            gameUI.classList.add('active');

            loadQuestion(0);
            startTimer();
        });

        function startTimer() {
            timer = 60;
            if(timerElement) timerElement.innerText = timer;
            
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
                btn.onclick = () => checkAnswer(i);
                optionsDiv.appendChild(btn);
            });

            drawOrbit(data.path, data.color);
        }

        function drawOrbit(pathCoords, colorVal) {
            viewer.entities.removeAll();
            viewer.entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray(pathCoords),
                    width: 8,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.2, color: colorVal
                    }),
                    clampToGround: false
                }
            });
            // KAMERA KİLİDİ (ZoomTo) KALDIRILDI
        }

        function checkAnswer(selectedIndex) {
            const data = questions[currentQuestionIndex];
            if(selectedIndex === data.correct) {
                score += 10;
                document.getElementById('score').innerText = score;
            } else {
                lives--;
                let hearts = "";
                for(let i=0; i<lives; i++) hearts += "❤️";
                document.getElementById('lives').innerText = hearts;
                if(lives <= 0) { endGame(); return; }
            }
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }

        function endGame() {
            clearInterval(timerInterval);
            gameUI.classList.add('hidden'); 
            resultScreen.classList.remove('hidden'); 
            resultScreen.classList.add('active');
            document.getElementById('final-score').innerText = score;
        }

    } catch (e) {
        console.error(e);
        alert("Hata: " + e.message);
    }
});