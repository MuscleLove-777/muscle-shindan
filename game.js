// ===== Muscle Match Quiz - game.js =====

(function () {
    'use strict';

    // ----- Data -----
    const questions = [
        {
            ja: '理想のデートは？',
            en: 'Ideal date?',
            choices: [
                { ja: 'ジムデート', en: 'Gym', scores: [2, 0, 0, 0, 1, 1] },
                { ja: 'ビーチ', en: 'Beach', scores: [0, 1, 1, 1, 1, 0] },
                { ja: '映画', en: 'Movie', scores: [0, 0, 1, 2, 0, 0] },
                { ja: 'ディナー', en: 'Dinner', scores: [0, 0, 1, 1, 0, 1] }
            ]
        },
        {
            ja: '好きなトレーニングは？',
            en: 'Favorite workout?',
            choices: [
                { ja: 'ベンチプレス', en: 'Bench Press', scores: [2, 0, 0, 0, 1, 1] },
                { ja: 'スクワット', en: 'Squat', scores: [1, 0, 1, 0, 1, 1] },
                { ja: 'デッドリフト', en: 'Deadlift', scores: [1, 0, 0, 0, 2, 1] },
                { ja: '有酸素', en: 'Cardio', scores: [0, 2, 1, 1, 0, 0] }
            ]
        },
        {
            ja: '朝食は？',
            en: 'Breakfast?',
            choices: [
                { ja: 'プロテイン', en: 'Protein Shake', scores: [1, 1, 1, 0, 0, 1] },
                { ja: '卵6個', en: '6 Eggs', scores: [2, 0, 0, 0, 2, 1] },
                { ja: 'グラノーラ', en: 'Granola', scores: [0, 0, 2, 1, 0, 0] },
                { ja: '食べない', en: 'Skip', scores: [0, 1, 0, 1, 1, 0] }
            ]
        },
        {
            ja: '休日の過ごし方は？',
            en: 'Day off?',
            choices: [
                { ja: 'ジム', en: 'Gym', scores: [2, 0, 0, 0, 1, 2] },
                { ja: '寝る', en: 'Sleep', scores: [0, 0, 1, 1, 0, 0] },
                { ja: 'アウトドア', en: 'Outdoor', scores: [0, 1, 1, 0, 2, 0] },
                { ja: 'ゲーム', en: 'Gaming', scores: [0, 1, 0, 1, 0, 0] }
            ]
        },
        {
            ja: '筋肉で一番好きな部位は？',
            en: 'Favorite muscle?',
            choices: [
                { ja: '胸', en: 'Chest', scores: [2, 0, 0, 1, 0, 1] },
                { ja: '背中', en: 'Back', scores: [1, 0, 1, 0, 1, 1] },
                { ja: '腕', en: 'Arms', scores: [1, 1, 0, 1, 1, 0] },
                { ja: '脚', en: 'Legs', scores: [0, 1, 1, 0, 1, 1] }
            ]
        }
    ];

    // scores index: [Power, Speed, Balance, Elegant, Wild, Master]
    const results = [
        {
            nameJa: 'パワータイプ',
            nameEn: 'Power Type',
            image: 'images/img1.png',
            description: 'あなたは圧倒的パワーで道を切り開く！\nYou break through with overwhelming power!',
            exercise: 'ベンチプレス300kg / 300kg Bench Press',
            shareText: 'パワータイプ'
        },
        {
            nameJa: 'スピードタイプ',
            nameEn: 'Speed Type',
            image: 'images/img2.png',
            description: '素早さと瞬発力が武器！\nSpeed and explosiveness are your weapons!',
            exercise: 'HIITトレーニング / HIIT Training',
            shareText: 'スピードタイプ'
        },
        {
            nameJa: 'バランスタイプ',
            nameEn: 'Balance Type',
            image: 'images/img3.png',
            description: '全身バランスよく鍛えられた理想体型！\nThe ideal physique, balanced from head to toe!',
            exercise: '全身サーキット / Full Body Circuit',
            shareText: 'バランスタイプ'
        },
        {
            nameJa: 'エレガントタイプ',
            nameEn: 'Elegant Type',
            image: 'images/img4.png',
            description: '美しさと強さを兼ね備えた究極形！\nThe ultimate form combining beauty and strength!',
            exercise: 'ヨガ＆ピラティス / Yoga & Pilates',
            shareText: 'エレガントタイプ'
        },
        {
            nameJa: 'ワイルドタイプ',
            nameEn: 'Wild Type',
            image: 'images/img5.png',
            description: '本能のままに鍛える野性派！\nTraining by pure instinct, wild and free!',
            exercise: 'ストロングマン / Strongman Training',
            shareText: 'ワイルドタイプ'
        },
        {
            nameJa: 'マスタータイプ',
            nameEn: 'Master Type',
            image: 'images/img6.png',
            description: '全てを極めし筋肉の神！\nThe god of muscles who has mastered everything!',
            exercise: 'オリンピックリフティング / Olympic Lifting',
            shareText: 'マスタータイプ'
        }
    ];

    // ----- State -----
    let currentQuestion = 0;
    let totalScores = [0, 0, 0, 0, 0, 0];
    let audioCtx = null;
    let isTransitioning = false;

    // ----- DOM -----
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const shareBtn = document.getElementById('share-btn');
    const progressLabel = document.getElementById('progress-label');
    const progressFill = document.getElementById('progress-fill');
    const questionJa = document.getElementById('question-text-ja');
    const questionEn = document.getElementById('question-text-en');
    const choicesDiv = document.getElementById('choices');
    const questionCard = document.getElementById('question-card');

    // ----- Audio -----
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSound(type) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'select') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.2);
            } else if (type === 'result') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);
                osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            } else if (type === 'start') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.25);
            }
        } catch (e) {
            // Audio not available
        }
    }

    // ----- Screen Transitions -----
    function showScreen(screen) {
        [startScreen, quizScreen, resultScreen].forEach(function (s) {
            s.classList.remove('active');
        });
        screen.classList.add('active');
        screen.scrollTop = 0;
    }

    // ----- Quiz Logic -----
    function renderQuestion() {
        var q = questions[currentQuestion];
        progressLabel.textContent = 'Question ' + (currentQuestion + 1) + ' / 5';
        progressFill.style.width = ((currentQuestion + 1) * 20) + '%';
        questionJa.textContent = q.ja;
        questionEn.textContent = q.en;

        choicesDiv.innerHTML = '';
        q.choices.forEach(function (choice, idx) {
            var btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = '<span class="choice-ja">' + choice.ja + '</span><span class="choice-en">' + choice.en + '</span>';
            btn.addEventListener('click', function () {
                if (isTransitioning) return;
                selectChoice(idx);
            });
            choicesDiv.appendChild(btn);
        });
    }

    function selectChoice(idx) {
        isTransitioning = true;
        initAudio();
        playSound('select');

        // Highlight selected
        var buttons = choicesDiv.querySelectorAll('.choice-btn');
        buttons[idx].classList.add('selected');

        // Add scores
        var scores = questions[currentQuestion].choices[idx].scores;
        for (var i = 0; i < 6; i++) {
            totalScores[i] += scores[i];
        }

        // Slide transition
        setTimeout(function () {
            questionCard.classList.add('slide-out-left');

            setTimeout(function () {
                currentQuestion++;
                if (currentQuestion < 5) {
                    questionCard.classList.remove('slide-out-left');
                    questionCard.classList.add('slide-in-right');
                    renderQuestion();

                    // Force reflow
                    void questionCard.offsetWidth;

                    questionCard.classList.remove('slide-in-right');
                    isTransitioning = false;
                } else {
                    showResult();
                    isTransitioning = false;
                }
            }, 350);
        }, 300);
    }

    function showResult() {
        playSound('result');

        // Find highest score
        var maxScore = 0;
        var maxIdx = 0;
        for (var i = 0; i < 6; i++) {
            if (totalScores[i] > maxScore) {
                maxScore = totalScores[i];
                maxIdx = i;
            }
        }

        var result = results[maxIdx];
        var compatibility = Math.min(70 + maxScore * 4 + Math.floor(Math.random() * 10), 99);

        document.getElementById('result-type').textContent = result.nameJa + '\n' + result.nameEn;
        document.getElementById('result-image').src = result.image;
        document.getElementById('result-description').textContent = result.description;
        document.getElementById('compat-value').textContent = compatibility + '%';
        document.getElementById('result-exercise').textContent = result.exercise;

        // Store for share
        resultScreen.dataset.shareType = result.shareText;
        resultScreen.dataset.shareCompat = compatibility;

        showScreen(resultScreen);

        // Animate compatibility bar
        setTimeout(function () {
            document.getElementById('compat-bar').style.width = compatibility + '%';
        }, 300);
    }

    // ----- Share -----
    shareBtn.addEventListener('click', function () {
        var type = resultScreen.dataset.shareType;
        var compat = resultScreen.dataset.shareCompat;
        var text = '\u3010\u7b4b\u8089\u76f8\u6027\u8a3a\u65ad\u3011\u3042\u306a\u305f\u306f\u300c' + type + '\u300d\ud83d\udcaa \u76f8\u6027\u5ea6' + compat + '%\uff01 #MuscleLove #\u7b4b\u8089\u8a3a\u65ad\nhttps://www.patreon.com/cw/MuscleLove';

        if (navigator.share) {
            navigator.share({
                title: '\u7b4b\u8089\u76f8\u6027\u8a3a\u65ad / Muscle Match Quiz',
                text: text
            }).catch(function () {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    });

    function fallbackCopy(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showCopiedToast();
            }).catch(function () {
                showCopiedToast();
            });
        } else {
            // Textarea fallback
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) { /* noop */ }
            document.body.removeChild(ta);
            showCopiedToast();
        }
    }

    function showCopiedToast() {
        var toast = document.createElement('div');
        toast.textContent = 'Copied! / コピーしました！';
        toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#00e5ff;color:#0a0a12;padding:0.7rem 1.5rem;border-radius:30px;font-weight:700;font-size:0.9rem;z-index:9999;box-shadow:0 4px 20px rgba(0,229,255,0.4);';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.transition = 'opacity 0.5s';
            toast.style.opacity = '0';
            setTimeout(function () { document.body.removeChild(toast); }, 500);
        }, 1500);
    }

    // ----- Start -----
    startBtn.addEventListener('click', function () {
        initAudio();
        playSound('start');
        currentQuestion = 0;
        totalScores = [0, 0, 0, 0, 0, 0];
        questionCard.classList.remove('slide-out-left', 'slide-in-right');
        renderQuestion();
        showScreen(quizScreen);
    });

    // ----- Retry -----
    retryBtn.addEventListener('click', function () {
        playSound('start');
        currentQuestion = 0;
        totalScores = [0, 0, 0, 0, 0, 0];
        document.getElementById('compat-bar').style.width = '0%';
        questionCard.classList.remove('slide-out-left', 'slide-in-right');
        renderQuestion();
        showScreen(quizScreen);
    });

    // Preload images
    results.forEach(function (r) {
        var img = new Image();
        img.src = r.image;
    });

})();
