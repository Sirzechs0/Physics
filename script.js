document.addEventListener('DOMContentLoaded', () => {

    // ======================================================================
    // 0. LOADING SCREEN LOGIC (FIRE AND BLOOD)
    // ======================================================================
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderPercentage = document.getElementById('loaderPercentage');

    let progress = 0;
    const minDisplayTime = 2200;
    const startTime = Date.now();

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 4 + 1.4;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            loaderBar.style.width = '100%';
            loaderPercentage.textContent = '100%';
            
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsed);
            
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => { loader.style.display = 'none'; }, 1200);
            }, remainingTime + 800);
        } else {
            loaderBar.style.width = progress + '%';
            loaderPercentage.textContent = Math.floor(progress) + '%';
        }
    }, 200);

    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            clearInterval(loadingInterval);
            loaderBar.style.width = '100%';
            loaderPercentage.textContent = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => { loader.style.display = 'none'; }, 1200);
            }, 500);
        }
    }, 6000);


    // ======================================================================
    // 1. SCROLL PROGRESS BAR
    // ======================================================================
    const scrollProgress = document.getElementById('scrollProgress');


    // ======================================================================
    // 2. MARS ORBITER INTERACTIVE TIMELINE
    // ======================================================================
    const orbiterSlider = document.getElementById('orbiterSlider');
    const spacecraftMarker = document.getElementById('spacecraftMarker');
    const actualPath = document.getElementById('actualPath');
    const orbiterStatus = document.getElementById('orbiterStatus');
    const statusValue = document.getElementById('statusValue');
    const statusDescription = document.getElementById('statusDescription');

    let pathLength = 0;
    if (actualPath) {
        pathLength = actualPath.getTotalLength();
        actualPath.style.strokeDasharray = pathLength;
        actualPath.style.strokeDashoffset = pathLength;
    }

    let explosionTriggered = false;

    if (orbiterSlider && spacecraftMarker && actualPath) {
        orbiterSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            const percent = value / 100;

            const point = actualPath.getPointAtLength(pathLength * percent);
            const xPercent = (point.x / 1000) * 100;
            const yPercent = (point.y / 200) * 100;
            
            spacecraftMarker.style.left = xPercent + '%';
            spacecraftMarker.style.top = yPercent + '%';
            actualPath.style.strokeDashoffset = pathLength * (1 - percent);

            spacecraftMarker.classList.remove('danger', 'lost');
            actualPath.classList.remove('danger', 'lost');
            orbiterStatus.classList.remove('danger', 'lost');

            if (value === 0) {
                statusValue.textContent = 'Awaiting Launch';
                statusDescription.textContent = 'Drag the slider to begin the 10-month journey to Mars.';
            } else if (value < 40) {
                statusValue.textContent = 'Nominal Flight';
                statusDescription.textContent = 'The Mars Climate Orbiter is on course. All systems look good... for now.';
            } else if (value < 70) {
                statusValue.textContent = 'Subtle Drift Detected';
                statusDescription.textContent = 'Ground control notices slight trajectory deviations. Navigation software expects newton-seconds, but receives pound-force seconds.';
                spacecraftMarker.classList.add('danger');
                actualPath.classList.add('danger');
                orbiterStatus.classList.add('danger');
            } else if (value < 100) {
                statusValue.textContent = 'CRITICAL: Off Course';
                statusDescription.textContent = 'The 4.45× unit mismatch is compounding. The orbiter is descending into the Martian atmosphere.';
                spacecraftMarker.classList.add('lost');
                actualPath.classList.add('lost');
                orbiterStatus.classList.add('lost');
            } else if (value === 100) {
                statusValue.textContent = 'SIGNAL LOST — Sept 23, 1999';
                statusDescription.textContent = 'The $125 million Mars Climate Orbiter was destroyed in the Martian atmosphere. A single unit conversion could have saved it.';
                spacecraftMarker.classList.add('lost');
                actualPath.classList.add('lost');
                orbiterStatus.classList.add('lost');
                
                if (!explosionTriggered) {
                    explosionTriggered = true;
                    const spaceTrack = document.querySelector('.space-track');
                    const explosion = document.createElement('div');
                    explosion.className = 'explosion';
                    explosion.style.left = xPercent + '%';
                    explosion.style.top = yPercent + '%';
                    spaceTrack.appendChild(explosion);
                    
                    spacecraftMarker.style.opacity = '0';
                    
                    setTimeout(() => {
                        explosion.remove();
                        spacecraftMarker.style.opacity = '1';
                        explosionTriggered = false;
                    }, 3000);
                }
            }
        });
    }


    // ======================================================================
    // 3. PARALLAX BACKGROUND
    // ======================================================================
    const heroBg = document.querySelector('.hero-bg-placeholder');

    // ======================================================================
    // 4. MOBILE NAVIGATION MENU
    // ======================================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));

            const spans = hamburger.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    // ======================================================================
    // 5. NAVBAR SCROLL EFFECT
    // ======================================================================
    const navbar = document.getElementById('navbar');

    // ======================================================================
    // UNIFIED SCROLL HANDLER (progress bar + parallax + navbar state)
    // One rAF-throttled listener drives all three so scrolling only ever
    // does one layout read and one batch of style writes per frame.
    // ======================================================================
    let latestScrollY = window.pageYOffset || 0;
    let scrollTicking = false;

    function applyScrollEffects() {
        const scrollTop = latestScrollY;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (scrollProgress && scrollHeight > 0) {
            const scrollPercent = Math.min(1, Math.max(0, scrollTop / scrollHeight));
            scrollProgress.style.transform = `scaleX(${scrollPercent})`;
        }

        if (heroBg && scrollTop < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollTop * 0.3}px)`;
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 50);
        }

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        latestScrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(applyScrollEffects);
        }
    }, { passive: true });

    // Run once on load so the correct state shows even if the page
    // opens already scrolled (e.g. returning via a same-page anchor).
    applyScrollEffects();

    // ======================================================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ======================================================================
    const revealElements = document.querySelectorAll('.card, .trial-card, .section-header, .case-study-card, .notation-card, .definition-card, .significant-figures, .percent-error');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        revealOnScroll.observe(el);
    });

    // ======================================================================
    // 6b. QUOTE BLOCK REVEAL ANIMATIONS
    // ======================================================================
    const quoteBlocks = document.querySelectorAll('.reveal-quote');
    
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                quoteObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    quoteBlocks.forEach(quote => quoteObserver.observe(quote));

    // ======================================================================
    // 6c. ANIMATED METRIC STAIRCASE
    // ======================================================================
    const staircase = document.getElementById('animatedStaircase');
    const staircaseSteps = document.querySelectorAll('.staircase .step');

    if (staircase && staircaseSteps.length > 0) {
        const staircaseObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                staircaseSteps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('lit');
                    }, index * 300);
                });
                
                setTimeout(() => {
                    staircaseSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.remove('lit');
                        }, index * 150);
                    });
                }, 5000);
                
                staircaseObserver.disconnect();
            }
        }, { threshold: 0.5 });
        
        staircaseObserver.observe(staircase);
    }

    // ======================================================================
    // 7. ANIMATED TARGET DIAGRAM
    // ======================================================================
    const targetVisual = document.querySelector('.target-visual');
    const arrows = document.querySelectorAll('.target-arrow');

    if (targetVisual && arrows.length > 0) {
        const targetObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                arrows.forEach((arrow, index) => {
                    setTimeout(() => {
                        arrow.classList.add('shoot');
                    }, index * 400);
                });
                targetObserver.disconnect();
            }
        }, { threshold: 0.1 });
        
        targetObserver.observe(targetVisual);
    }

    // ======================================================================
    // 8. INTERACTIVE TRIALS (QUIZ LOGIC + SCORING)
    // ======================================================================
    const optionButtons = document.querySelectorAll('.option-btn');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const scoreValue = document.getElementById('scoreValue');
    const dracarysOverlay = document.getElementById('dracarysOverlay');
    const dracarysClose = document.getElementById('dracarysClose');
    
    const maxScore = 8;
    let totalScore = 0;
    const answeredQuestions = new Set();

    // Keyed by question ID rather than one flat list of valid strings —
    // otherwise "true" and "false" being correct answers to DIFFERENT
    // questions (q3 and q4) would let either button on either question
    // register as correct, no matter which one was actually clicked.
    const correctAnswers = {
        q1: "fundamental quantity",
        q2: "factor-label method",
        q3: "false",
        q4: "true"
    };

    // Free-response questions (q5, q6), also keyed by ID instead of
    // sniffing the input's placeholder text — so a future q7/q8 can't
    // collide with an existing check the way the placeholder trick could.
    const freeResponseAnswers = {
        q5: (answer) => ['3200', '3200m', '3,200', '3,200m'].includes(answer),
        q6: (answer) => answer.includes('6.4') && (answer.includes('10^6') || answer.includes('e6') || answer.includes('10**6'))
    };

    function addScore(points, questionId) {
        if (answeredQuestions.has(questionId)) return;
        answeredQuestions.add(questionId);
        totalScore += points;
        scoreValue.textContent = totalScore;
        
        if (totalScore === maxScore) {
            scoreDisplay.classList.add('perfect');
            setTimeout(() => {
                dracarysOverlay.classList.add('show');
            }, 800);
        }
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedText = this.textContent.trim().toLowerCase();
            const questionBlock = this.closest('.question');
            const questionId = questionBlock.dataset.questionId;
            const points = parseInt(questionBlock.dataset.points);
            
            if (correctAnswers[questionId] === selectedText) {
                this.style.backgroundColor = 'rgba(201, 162, 39, 0.12)';
                this.style.borderColor = 'var(--accent-gold)';
                this.style.color = 'var(--accent-gold-bright)';
                this.innerHTML = `${this.textContent} <i class="fas fa-check" style="float: right;"></i>`;
                addScore(points, questionId);
            } else {
                this.style.backgroundColor = 'rgba(163, 39, 31, 0.2)';
                this.style.borderColor = 'var(--accent-red)';
                this.style.color = 'var(--accent-red-bright)';
                this.innerHTML = `${this.textContent} <i class="fas fa-times" style="float: right;"></i>`;
            }

            const parentOptions = this.parentElement;
            const siblingButtons = parentOptions.querySelectorAll('.option-btn');
            siblingButtons.forEach(btn => {
                if (btn !== this) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });
        });
    });

    const checkButtons = document.querySelectorAll('.btn-check');
    
    checkButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const inputField = this.previousElementSibling;
            const userAnswer = inputField.value.trim().toLowerCase().replace(/\s+/g, '');
            const questionBlock = this.closest('.question');
            const questionId = questionBlock.dataset.questionId;
            const points = parseInt(questionBlock.dataset.points);
            
            const checkAnswer = freeResponseAnswers[questionId];
            const isCorrect = checkAnswer ? checkAnswer(userAnswer) : false;

            if (isCorrect) {
                inputField.style.borderColor = 'var(--accent-gold)';
                inputField.style.color = 'var(--accent-gold-bright)';
                inputField.value = inputField.value + " ✓";
                inputField.disabled = true;
                this.disabled = true;
                this.style.backgroundColor = 'rgba(201, 162, 39, 0.2)';
                this.style.color = 'var(--accent-gold-bright)';
                this.textContent = 'Correct!';
                addScore(points, questionId);
            } else {
                inputField.style.borderColor = 'var(--accent-red)';
                inputField.style.color = 'var(--accent-red-bright)';
                this.style.backgroundColor = 'var(--accent-red)';
                this.style.color = 'var(--text-light)';
                this.textContent = 'Try Again';
                
                setTimeout(() => {
                    this.style.backgroundColor = 'var(--accent-red)';
                    this.textContent = 'Check';
                    inputField.style.borderColor = 'var(--border-color)';
                    inputField.style.color = 'var(--text-light)';
                }, 1500);
            }
        });
    });

    if (dracarysClose) {
        dracarysClose.addEventListener('click', () => {
            dracarysOverlay.classList.remove('show');
        });
    }

    // ======================================================================
    // 9. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ======================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                if (navLinks.classList.contains('active')) {
                    hamburger.click();
                }
            }
        });
    });

});
// ============================================================================
// NEW INTERACTIVE FEATURES
// Added as a second, independent DOMContentLoaded listener so none of the
// logic above has to be touched. Where this code needs to react to the
// original quiz logic (correct/incorrect answers, perfect score), it reads
// the DOM state that logic already sets, rather than editing it directly.
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

    // ======================================================================
    // 10. SHARED HELPERS — scientific notation math + number formatting
    // ======================================================================
    function parseToScientific(value) {
        if (typeof value !== 'number' || !isFinite(value)) return null;
        if (value === 0) return { coefficient: 0, exponent: 0, isZero: true, negative: false };

        const negative = value < 0;
        const abs = Math.abs(value);
        const s = abs.toString();
        let coefficient, exponent;

        if (s.includes('e')) {
            const [mantissa, expPart] = s.split('e');
            coefficient = parseFloat(mantissa);
            exponent = parseInt(expPart, 10);
        } else {
            const [intPart, decPart = ''] = s.split('.');
            if (intPart !== '0') {
                exponent = intPart.length - 1;
                const digits = (intPart + decPart).replace(/0+$/, '') || '0';
                coefficient = parseFloat(digits[0] + (digits.length > 1 ? '.' + digits.slice(1) : ''));
            } else {
                const firstNonZero = decPart.search(/[1-9]/);
                exponent = -(firstNonZero + 1);
                const digits = decPart.slice(firstNonZero).replace(/0+$/, '') || '0';
                coefficient = parseFloat(digits[0] + (digits.length > 1 ? '.' + digits.slice(1) : ''));
            }
        }

        coefficient = parseFloat(coefficient.toPrecision(6));
        if (coefficient >= 10) { coefficient = coefficient / 10; exponent += 1; }

        return { coefficient: negative ? -coefficient : coefficient, exponent, isZero: false, negative };
    }

    function sciNotationHTML(parts) {
        if (!parts) return '';
        if (parts.isZero) return '0';
        return `${parts.coefficient} × 10<sup>${parts.exponent}</sup>`;
    }

    function formatMetricValue(num) {
        if (num === 0) return '0';
        const rounded = parseFloat(num.toPrecision(10));
        const absRounded = Math.abs(rounded);
        if (absRounded >= 1e9 || absRounded < 1e-6) {
            return sciNotationHTML(parseToScientific(rounded));
        }
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }

    function burstEmbers(x, y) {
        for (let i = 0; i < 6; i++) {
            const ember = document.createElement('div');
            ember.className = 'mini-ember';
            const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
            const distance = 30 + Math.random() * 30;
            ember.style.left = x + 'px';
            ember.style.top = y + 'px';
            ember.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            ember.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            document.body.appendChild(ember);
            setTimeout(() => ember.remove(), 700);
        }
    }

    // ======================================================================
    // 11. SOUND EFFECTS — synthesized with the Web Audio API, no audio files.
    // Muted by default; the person opts in via the audio panel.
    // ======================================================================
    const SOUND_KEY = 'targaryenPhysics.soundEnabled';
    const VOLUME_KEY = 'targaryenPhysics.masterVolume';
    let audioCtx = null;
    let soundEnabled = false;
    let masterVolume = 50; // 0–100
    try {
        soundEnabled = localStorage.getItem(SOUND_KEY) === 'true';
        const storedVol = localStorage.getItem(VOLUME_KEY);
        if (storedVol !== null) masterVolume = Math.min(100, Math.max(0, parseInt(storedVol, 10)));
    } catch (e) { /* storage unavailable, stay muted */ }

    function getAudioContext() {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return null;
            audioCtx = new Ctx();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function playTone(freq, startOffset, duration, type, peakGain) {
        if (!soundEnabled || masterVolume === 0) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            const now = ctx.currentTime + startOffset;
            const adjustedGain = (peakGain || 0.12) * (masterVolume / 100);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(adjustedGain, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + duration + 0.05);
        } catch (e) { /* Web Audio unavailable in this context — fail silently */ }
    }

    function playCorrect() {
        playTone(523.25, 0, 0.12, 'triangle', 0.1);
        playTone(783.99, 0.08, 0.18, 'triangle', 0.1);
    }

    function playIncorrect() {
        playTone(160, 0, 0.22, 'sawtooth', 0.08);
    }

    function playAchievementSound() {
        playTone(523.25, 0, 0.1, 'triangle', 0.09);
        playTone(659.25, 0.1, 0.1, 'triangle', 0.09);
        playTone(783.99, 0.2, 0.28, 'triangle', 0.1);
    }

    function playDracarysSound() {
        playTone(110, 0, 0.6, 'sawtooth', 0.1);
        playTone(220, 0.05, 0.5, 'sawtooth', 0.08);
        playTone(880, 0.15, 0.4, 'triangle', 0.09);
    }

    // ======================================================================
    // 12. SIGILS OF THE REALM — achievements, saved to localStorage
    // ======================================================================
    const ACHIEVEMENTS_KEY = 'targaryenPhysics.achievements';
    const achievementInfo = {
        converter: { title: 'Master of Conversion', icon: 'fa-ruler-combined' },
        notation: { title: 'Tamer of Dragonfire', icon: 'fa-dragon' },
        aim: { title: 'True Aim', icon: 'fa-crosshairs' },
        truth: { title: 'Keeper of Truth', icon: 'fa-vial' },
        perfect: { title: 'Trial Champion', icon: 'fa-crown' },
        archive: { title: 'Keeper of Records', icon: 'fa-book' }
    };

    let unlockedAchievements = new Set();
    try {
        const stored = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]');
        if (Array.isArray(stored)) unlockedAchievements = new Set(stored);
    } catch (e) { /* start fresh if storage is unavailable or corrupted */ }

    function refreshAchievementBadges() {
        document.querySelectorAll('.achievement-badge').forEach(badge => {
            badge.classList.toggle('unlocked', unlockedAchievements.has(badge.dataset.achievement));
        });
    }
    refreshAchievementBadges();
    updateAchievementsProgress();

    const achievementToast = document.getElementById('achievementToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastIcon = document.getElementById('toastIcon');
    let toastTimer = null;

    function showAchievementToast(id) {
        const info = achievementInfo[id];
        if (!info || !achievementToast || !toastTitle) return;
        toastTitle.textContent = info.title;
        if (toastIcon) toastIcon.className = `fas ${info.icon} toast-icon`;
        achievementToast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => achievementToast.classList.remove('show'), 4000);
    }

    function unlockAchievement(id) {
        if (unlockedAchievements.has(id)) return;
        unlockedAchievements.add(id);
        try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...unlockedAchievements])); } catch (e) { /* ignore */ }

        const badge = document.querySelector(`.achievement-badge[data-achievement="${id}"]`);
        if (badge) {
            badge.classList.add('unlocked', 'just-unlocked');
            const rect = badge.getBoundingClientRect();
            burstEmbers(rect.left + rect.width / 2, rect.top + rect.height / 2);
            setTimeout(() => badge.classList.remove('just-unlocked'), 700);
        }
        showAchievementToast(id);
        playAchievementSound();

        updateAchievementsProgress();
        maybeCelebrateAllSigils();
    }

    // ======================================================================
    // 13. METRIC CONVERTER — "The Measure of the Realm"
    // ======================================================================
    const converterValue = document.getElementById('converterValue');
    const converterUnit = document.getElementById('converterUnit');
    const converterBtn = document.getElementById('converterBtn');
    const converterHint = document.getElementById('converterHint');
    const converterSteps = document.querySelectorAll('.staircase .step');

    function runConverter() {
        if (!converterValue || !converterUnit) return;
        const rawValue = parseFloat(converterValue.value);

        if (converterValue.value.trim() === '' || !isFinite(rawValue)) {
            if (converterHint) {
                converterHint.innerHTML = '<span class="converter-error">Enter a number first — the maesters need a value to work with.</span>';
            }
            return;
        }

        const fromExp = parseInt(converterUnit.value, 10);
        const valueInBase = rawValue * Math.pow(10, fromExp);

        converterSteps.forEach((step, index) => {
            const stepExp = parseInt(step.dataset.exp, 10);
            step.classList.toggle('origin-step', stepExp === fromExp);
            const resultEl = step.querySelector('.step-result');
            if (!resultEl) return;
            const converted = valueInBase * Math.pow(10, -stepExp);
            setTimeout(() => {
                resultEl.innerHTML = formatMetricValue(converted);
                resultEl.classList.add('show');
            }, index * 70);
        });

        if (converterHint) {
            converterHint.textContent = 'Each glowing tag shows your value at that scale. Change the number or unit and convert again.';
        }

        unlockAchievement('converter');
    }

    if (converterBtn) converterBtn.addEventListener('click', runConverter);
    if (converterValue) {
        converterValue.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); runConverter(); }
        });
    }

    // ======================================================================
    // 14. SCIENTIFIC NOTATION TOOL — "Feed the Dragon a Number"
    // ======================================================================
    const notationInput = document.getElementById('notationInput');
    const notationBtn = document.getElementById('notationBtn');
    const notationResult = document.getElementById('notationResult');

    function runNotationTool() {
        if (!notationInput || !notationResult) return;
        const raw = notationInput.value.trim();
        const value = parseFloat(raw);

        if (raw === '' || !isFinite(value)) {
            notationResult.innerHTML = '<p class="notation-error">Enter a number first — try something like 45000000 or 0.00032.</p>';
            return;
        }
        if (value === 0) {
            notationResult.innerHTML = '<p class="notation-error">Zero has no meaningful scientific notation — try a number that isn\'t zero.</p>';
            return;
        }

        const parts = parseToScientific(value);
        const displayOriginal = raw.length > 24 ? value.toString() : raw;

        if (parts.exponent === 0) {
            notationResult.innerHTML = `
                <div class="notation-reveal">
                    <p class="example">${displayOriginal}</p>
                    <div class="arrow-placeholder">Already between 1 and 10 — no shift needed</div>
                    <p class="result">${sciNotationHTML(parts)}</p>
                </div>`;
        } else {
            const movingLeft = parts.exponent > 0;
            const places = Math.abs(parts.exponent);
            notationResult.innerHTML = `
                <div class="notation-reveal">
                    <p class="example">${displayOriginal}</p>
                    <div class="arrow-placeholder"><i class="fas fa-arrow-${movingLeft ? 'left' : 'right'}"></i> ${places} place${places === 1 ? '' : 's'}</div>
                    <p class="result">${sciNotationHTML(parts)}</p>
                </div>`;
        }

        unlockAchievement('notation');
    }

    if (notationBtn) notationBtn.addEventListener('click', runNotationTool);
    if (notationInput) {
        notationInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); runNotationTool(); }
        });
    }

    // ======================================================================
    // 15. TAKE AIM YOURSELF — interactive accuracy/precision target
    // ======================================================================
    const aimTarget = document.getElementById('aimTarget');
    const aimShotCount = document.getElementById('aimShotCount');
    const aimVerdict = document.getElementById('aimVerdict');
    const aimResetBtn = document.getElementById('aimResetBtn');
    const aimInstructions = document.getElementById('aimInstructions');
    const AIM_DEFAULT_INSTRUCTIONS = 'Click the target three times to fire your arrows, then see what your grouping reveals.';

    let aimShots = [];

    function placeShotMarker(xPercent, yPercent) {
        const marker = document.createElement('div');
        marker.className = 'aim-shot';
        marker.style.left = xPercent + '%';
        marker.style.top = yPercent + '%';
        aimTarget.appendChild(marker);
    }

    function handleAimClick(clientX, clientY) {
        if (!aimTarget || aimShots.length >= 3) return;
        const rect = aimTarget.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        aimShots.push({ x, y, centerX: rect.width / 2, centerY: rect.height / 2, radius: rect.width / 2 });
        placeShotMarker((x / rect.width) * 100, (y / rect.height) * 100);
        burstEmbers(clientX, clientY);

        if (aimShotCount) aimShotCount.textContent = String(aimShots.length);

        if (aimShots.length === 3) {
            if (aimInstructions) aimInstructions.textContent = 'Your three arrows have landed. Here is what they reveal:';
            setTimeout(evaluateAim, 300);
        }
    }

    if (aimTarget) {
        aimTarget.addEventListener('click', (e) => handleAimClick(e.clientX, e.clientY));
        aimTarget.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const rect = aimTarget.getBoundingClientRect();
                const jitterX = (Math.random() - 0.5) * rect.width * 0.3;
                const jitterY = (Math.random() - 0.5) * rect.height * 0.3;
                handleAimClick(rect.left + rect.width / 2 + jitterX, rect.top + rect.height / 2 + jitterY);
            }
        });
    }

    function evaluateAim() {
        const radius = aimShots[0].radius;
        const middleRadius = radius * 0.6;
        const innerRadius = radius * 0.2;

        const meanDist = aimShots.reduce((sum, s) => sum + Math.hypot(s.x - s.centerX, s.y - s.centerY), 0) / aimShots.length;
        const cx = aimShots.reduce((sum, s) => sum + s.x, 0) / aimShots.length;
        const cy = aimShots.reduce((sum, s) => sum + s.y, 0) / aimShots.length;
        const spread = aimShots.reduce((sum, s) => sum + Math.hypot(s.x - cx, s.y - cy), 0) / aimShots.length;

        const accurate = meanDist <= middleRadius;
        const precise = spread <= innerRadius;

        let tone, title, body;
        if (accurate && precise) {
            tone = 'good';
            title = 'A True Shot';
            body = 'Every arrow found the heart of the target, and they landed close together. That is what accurate AND precise measurement looks like.';
        } else if (accurate && !precise) {
            tone = 'mixed';
            title = 'Lucky, Not Reliable';
            body = 'On average your shots are near the center, but they are scattered. Accurate overall, but not precise — you could not trust any single shot alone.';
        } else if (!accurate && precise) {
            tone = 'mixed';
            title = 'Consistently Wrong';
            body = 'Your shots land close together, but far from the bullseye. Precise, but not accurate — the mark of a miscalibrated bow.';
        } else {
            tone = 'bad';
            title = 'Needs a New Bow';
            body = 'Scattered and far from center — neither accurate nor precise. Time to check both your technique and your equipment.';
        }

        if (aimVerdict) {
            aimVerdict.innerHTML = `<div class="verdict-box verdict-${tone}"><h4>${title}</h4><p>${body}</p></div>`;
        }
        if (aimResetBtn) aimResetBtn.classList.add('show');

        unlockAchievement('aim');
    }

    function resetAim() {
        aimShots = [];
        if (aimTarget) aimTarget.querySelectorAll('.aim-shot').forEach(el => el.remove());
        if (aimShotCount) aimShotCount.textContent = '0';
        if (aimVerdict) aimVerdict.innerHTML = '';
        if (aimInstructions) aimInstructions.textContent = AIM_DEFAULT_INSTRUCTIONS;
        if (aimResetBtn) aimResetBtn.classList.remove('show');
    }

    if (aimResetBtn) aimResetBtn.addEventListener('click', resetAim);

    // ======================================================================
    // 16. TRIAL ANALYSIS TOOL — percent error and precision together
    // ======================================================================
    const trial1 = document.getElementById('trial1');
    const trial2 = document.getElementById('trial2');
    const trial3 = document.getElementById('trial3');
    const acceptedValueInput = document.getElementById('acceptedValue');
    const precisionBtn = document.getElementById('precisionBtn');
    const precisionResult = document.getElementById('precisionResult');

    function runPrecisionTool() {
        if (!trial1 || !trial2 || !trial3 || !acceptedValueInput || !precisionResult) return;

        const values = [trial1, trial2, trial3].map(el => parseFloat(el.value));
        const accepted = parseFloat(acceptedValueInput.value);

        if (values.some(v => !isFinite(v)) || !isFinite(accepted)) {
            precisionResult.innerHTML = '<p class="notation-error">Fill in all three trials and the accepted value first.</p>';
            return;
        }
        if (accepted === 0) {
            precisionResult.innerHTML = '<p class="notation-error">The accepted value can\'t be zero — percent error would be undefined.</p>';
            return;
        }

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const percentError = Math.abs(mean - accepted) / Math.abs(accepted) * 100;
        const range = Math.max(...values) - Math.min(...values);
        const relativeSpread = mean !== 0 ? (range / Math.abs(mean)) * 100 : (range === 0 ? 0 : Infinity);

        const accurate = percentError <= 5;
        const precise = relativeSpread <= 5;

        let tone, title, body;
        if (accurate && precise) {
            tone = 'good';
            title = 'Trial-Worthy Data';
            body = 'Your average is close to the accepted value, and your trials agree with each other. This is the kind of data the Citadel would sign off on.';
        } else if (accurate && !precise) {
            tone = 'mixed';
            title = 'Accurate on Average';
            body = 'Your mean lands close to the accepted value, but the individual trials disagree with each other. Precision needs work — check your technique for consistency.';
        } else if (!accurate && precise) {
            tone = 'mixed';
            title = 'Consistently Off';
            body = 'Your trials agree tightly with each other, but the whole set is far from the accepted value. That pattern often points to a calibration error in the instrument.';
        } else {
            tone = 'bad';
            title = 'Needs Rework';
            body = 'The mean is far from the accepted value, and the trials disagree with each other too. Both the technique and the instrument are worth a second look.';
        }

        precisionResult.innerHTML = `
            <div class="precision-stats">
                <div>Mean<strong>${formatMetricValue(mean)}</strong></div>
                <div>Percent Error<strong>${percentError.toFixed(2)}%</strong></div>
                <div>Range<strong>${formatMetricValue(range)}</strong></div>
            </div>
            <div class="verdict-box verdict-${tone}"><h4>${title}</h4><p>${body}</p></div>
        `;

        unlockAchievement('truth');
    }

    if (precisionBtn) precisionBtn.addEventListener('click', runPrecisionTool);
    [trial1, trial2, trial3, acceptedValueInput].forEach(el => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); runPrecisionTool(); }
        });
    });

    // ======================================================================
    // 17. QUIZ SOUND + ACHIEVEMENT HOOKS
    // Attached as additional listeners on the existing quiz buttons, so the
    // original scoring logic above runs first and this only reacts to it.
    // ======================================================================
    function checkForPerfectScore() {
        const scoreValueEl = document.getElementById('scoreValue');
        if (scoreValueEl && scoreValueEl.textContent.trim() === '8') {
            unlockAchievement('perfect');
            playDracarysSound();
        }
    }

    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.innerHTML.includes('fa-check')) {
                playCorrect();
                burstEmbers(e.clientX, e.clientY);
            } else if (this.innerHTML.includes('fa-times')) {
                playIncorrect();
            }
            checkForPerfectScore();
        });
    });

    document.querySelectorAll('.btn-check').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const outcomeText = this.textContent.trim();
            if (outcomeText === 'Correct!') {
                playCorrect();
                burstEmbers(e.clientX, e.clientY);
                checkForPerfectScore();
            } else if (outcomeText === 'Try Again') {
                playIncorrect();
            }
        });
    });

    // ======================================================================
    // 18. BACK TO TOP
    // ======================================================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        let btTicking = false;
        window.addEventListener('scroll', () => {
            if (!btTicking) {
                btTicking = true;
                requestAnimationFrame(() => {
                    backToTop.classList.toggle('visible', (window.pageYOffset || document.documentElement.scrollTop) > 600);
                    btTicking = false;
                });
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

        // ======================================================================
    // 19. AUDIO CONTROL PANEL (music toggle + volume)
    // Music is ON by default. Sound effects always play at the volume set
    // by the slider — there is no separate SFX toggle anymore.
    // ======================================================================
    const audioToggle = document.getElementById('audioToggle');
    const audioPanel = document.getElementById('audioPanel');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const MUSIC_KEY = 'targaryenPhysics.musicEnabled';

    // Sound effects are always enabled; their loudness follows the volume slider.
    soundEnabled = true;

    // --- Apply stored volume ---
    if (volumeSlider && volumeValue) {
        volumeSlider.value = masterVolume;
        volumeValue.textContent = masterVolume + '%';
    }
    if (bgMusic) {
        bgMusic.volume = (masterVolume / 100) * 0.7;
    }

    // --- Panel open/close ---
    function closeAudioPanel() {
        if (audioPanel) audioPanel.classList.remove('open');
        if (audioToggle) {
            audioToggle.setAttribute('aria-expanded', 'false');
            audioToggle.setAttribute('aria-pressed', 'false');
        }
    }

    if (audioToggle && audioPanel) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = audioPanel.classList.toggle('open');
            audioToggle.setAttribute('aria-expanded', String(isOpen));
            audioToggle.setAttribute('aria-pressed', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (audioPanel.classList.contains('open') &&
                !audioPanel.contains(e.target) &&
                e.target !== audioToggle &&
                !audioToggle.contains(e.target)) {
                closeAudioPanel();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && audioPanel.classList.contains('open')) {
                closeAudioPanel();
            }
        });
    }

    // --- Volume slider ---
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            masterVolume = parseInt(this.value, 10);
            try { localStorage.setItem(VOLUME_KEY, String(masterVolume)); } catch (e) { /* ignore */ }
            if (volumeValue) volumeValue.textContent = masterVolume + '%';
            if (bgMusic) bgMusic.volume = (masterVolume / 100) * 0.7;
            updateAudioToggleIcon();
        });
    }

    // --- Music toggle ---
    function updateMusicToggleUI(isPlaying) {
        if (!musicToggle) return;
        const icon = musicToggle.querySelector('i');
        musicToggle.classList.toggle('active', isPlaying);
        musicToggle.setAttribute('aria-pressed', String(isPlaying));
        musicToggle.title = isPlaying ? 'Pause background music' : 'Play background music';
        if (icon) icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-music';
        updateAudioToggleIcon();
    }

    // User's music preference. Default is ON unless they explicitly turned it off
    // on a previous visit.
    let musicWanted = true;
    try {
        if (localStorage.getItem(MUSIC_KEY) === 'false') musicWanted = false;
    } catch (e) { /* ignore */ }

    // Autoplay fallback: browsers block audio until the user interacts with
    // the page. We try to play right away, and if that's blocked we retry on
    // the first click, key press, or touch anywhere on the page.
    function attemptMusicPlay() {
        if (!musicWanted || !bgMusic || !bgMusic.paused) return;
        bgMusic.play()
            .then(() => {
                updateMusicToggleUI(true);
                document.removeEventListener('click', attemptMusicPlay);
                document.removeEventListener('keydown', attemptMusicPlay);
                document.removeEventListener('touchstart', attemptMusicPlay);
            })
            .catch(() => {
                // Still blocked — keep the button showing the "on" intent
                updateMusicToggleUI(true);
            });
    }

    if (bgMusic && musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                musicWanted = true;
                try { localStorage.setItem(MUSIC_KEY, 'true'); } catch (e) { /* ignore */ }
                bgMusic.play()
                    .then(() => updateMusicToggleUI(true))
                    .catch(() => updateMusicToggleUI(false));
            } else {
                musicWanted = false;
                bgMusic.pause();
                updateMusicToggleUI(false);
                try { localStorage.setItem(MUSIC_KEY, 'false'); } catch (e) { /* ignore */ }
            }
        });

        if (musicWanted) {
            // Show the toggle as "on" right away (the intended state),
            // then try to actually start playback.
            updateMusicToggleUI(true);
            attemptMusicPlay();

            // Register autoplay fallback listeners.
            document.addEventListener('click', attemptMusicPlay);
            document.addEventListener('keydown', attemptMusicPlay);
            document.addEventListener('touchstart', attemptMusicPlay);
        } else {
            updateMusicToggleUI(false);
        }
    }

    // --- Master audio icon on the toggle button ---
    function updateAudioToggleIcon() {
        if (!audioToggle) return;
        const icon = audioToggle.querySelector('i');
        if (!icon) return;
        const musicPlaying = bgMusic && !bgMusic.paused;

        if (masterVolume === 0) {
            icon.className = 'fas fa-volume-xmark';
        } else if (musicPlaying) {
            icon.className = 'fas fa-volume-high';
        } else {
            icon.className = 'fas fa-volume-low';
        }
    }

    updateAudioToggleIcon();

    // ======================================================================
    // 20. THE MAESTER'S ARCHIVE — glossary panel (mirrors the audio panel's
    // open/close pattern above) plus a "Keeper of Records" sigil for
    // opening it for the first time.
    // ======================================================================
    const archiveToggle = document.getElementById('archiveToggle');
    const archivePanel = document.getElementById('archivePanel');
    const archiveCloseBtn = document.getElementById('archiveCloseBtn');

    function closeArchivePanel() {
        if (archivePanel) archivePanel.classList.remove('open');
        if (archiveToggle) archiveToggle.setAttribute('aria-expanded', 'false');
    }

    if (archiveToggle && archivePanel) {
        archiveToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = archivePanel.classList.toggle('open');
            archiveToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) {
                closeAudioPanel();
                unlockAchievement('archive');
            }
        });

        document.addEventListener('click', (e) => {
            if (archivePanel.classList.contains('open') &&
                !archivePanel.contains(e.target) &&
                e.target !== archiveToggle &&
                !archiveToggle.contains(e.target)) {
                closeArchivePanel();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && archivePanel.classList.contains('open')) {
                closeArchivePanel();
            }
        });
    }

    if (archiveCloseBtn) archiveCloseBtn.addEventListener('click', closeArchivePanel);

    // Close the archive whenever the audio panel opens, so the two never
    // end up open on top of each other in the corner of the screen.
    if (audioToggle && audioPanel) {
        audioToggle.addEventListener('click', () => {
            if (audioPanel.classList.contains('open')) closeArchivePanel();
        });
    }

    // ======================================================================
    // 21. PRINT THE FINAL DECREE
    // ======================================================================
    const printDecreeBtn = document.getElementById('printDecreeBtn');
    if (printDecreeBtn) {
        printDecreeBtn.addEventListener('click', () => window.print());
    }

    // ======================================================================
    // 22. THE REALM'S PATH — waypoint nav lights up whichever section is
    // currently in view. Clicking a dot is already handled by the
    // smooth-scroll handler earlier in this file (it matches any
    // a[href^="#"]); this block only tracks which dot should be lit.
    // ======================================================================
    const realmPathDots = document.querySelectorAll('.realm-path-dot');
    if (realmPathDots.length) {
        const trackedIds = ['hero', 'fundamentals', 'conversions', 'scientific-notation', 'accuracy', 'trials', 'performance-task'];
        const trackedSections = trackedIds.map(id => document.getElementById(id)).filter(Boolean);

        const setActiveDot = (id) => {
            realmPathDots.forEach(dot => dot.classList.toggle('active', dot.dataset.section === id));
        };

        const pathObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveDot(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

        trackedSections.forEach(section => pathObserver.observe(section));
    }

    // ======================================================================
    // 23. SHARED FEATURE DETECTION + BUTTON EMBER BURST
    // Two small media queries reused by the features below, plus a spark
    // thrown from every primary button press. Quiz buttons already have
    // their own correct/incorrect embers (section 17), so they're excluded
    // here to avoid double-bursting on a correct answer.
    // ======================================================================
    const canHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.btn:not(.btn-check), .btn-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (prefersReducedMotion.matches) return;
            burstEmbers(e.clientX, e.clientY);
        });
    });

    // ======================================================================
    // 24. HOLOGRAPHIC TILT — Kingdom cards and unlocked Sigils tilt toward
    // the cursor and catch a soft moving highlight, like a foil trading
    // card. Delegated to each grid's container (rather than bound per-card)
    // so a Sigil that unlocks later automatically picks up the effect.
    // Skipped on touch devices and when reduced motion is preferred.
    // ======================================================================
    function enableTiltDelegate(containerSelector, itemSelector, maxTilt) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.addEventListener('mousemove', (e) => {
            if (!canHoverTilt.matches || prefersReducedMotion.matches) return;
            const card = e.target.closest(itemSelector);

            container.querySelectorAll(itemSelector + '.tilting').forEach(el => {
                if (el !== card) el.classList.remove('tilting');
            });
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const tiltX = (0.5 - py) * maxTilt * 2;
            const tiltY = (px - 0.5) * maxTilt * 2;

            card.classList.add('tilt-card', 'tilting');
            card.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
            card.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
            card.style.setProperty('--glow-x', (px * 100).toFixed(1) + '%');
            card.style.setProperty('--glow-y', (py * 100).toFixed(1) + '%');
        });

        container.addEventListener('mouseleave', () => {
            container.querySelectorAll(itemSelector + '.tilting').forEach(el => el.classList.remove('tilting'));
        });
    }

    enableTiltDelegate('.seven-kingdoms-grid', '.kingdom-card', 9);
    enableTiltDelegate('.notation-grid', '.notation-card', 7);
    enableTiltDelegate('#achievementsGrid', '.achievement-badge.unlocked', 12);

    // ======================================================================
    // 25. SIGILS PROGRESS + "MASTER OF THE CITADEL" GRAND UNLOCK
    // Extends the achievement system above with a live "X / 6" readout and
    // a one-time celebration the moment every Sigil has been collected.
    // ======================================================================
    const ALL_SIGILS_KEY = 'targaryenPhysics.allSigilsCelebrated';

    function updateAchievementsProgress() {
        const total = Object.keys(achievementInfo).length;
        const count = unlockedAchievements.size;
        const fill = document.getElementById('achievementsProgressFill');
        const label = document.getElementById('achievementsProgressLabel');
        const panel = document.getElementById('achievementsPanel');

        if (fill) fill.style.width = (count / total * 100) + '%';
        if (label) label.textContent = `${count} / ${total} Sigils Collected`;
        if (panel) panel.classList.toggle('all-collected', count === total);
    }

    function maybeCelebrateAllSigils() {
        const total = Object.keys(achievementInfo).length;
        if (unlockedAchievements.size < total) return;

        let alreadyCelebrated = false;
        try { alreadyCelebrated = localStorage.getItem(ALL_SIGILS_KEY) === 'true'; } catch (e) { /* ignore */ }
        if (alreadyCelebrated) return;
        try { localStorage.setItem(ALL_SIGILS_KEY, 'true'); } catch (e) { /* ignore */ }

        setTimeout(() => {
            const panel = document.getElementById('achievementsPanel');
            if (panel) {
                const rect = panel.getBoundingClientRect();
                burstEmbers(rect.left + rect.width * 0.3, rect.top + 10);
                burstEmbers(rect.left + rect.width * 0.7, rect.top + 10);
            }
            playDracarysSound();

            if (achievementToast && toastTitle) {
                toastTitle.textContent = 'Master of the Citadel — All Sigils Collected';
                if (toastIcon) toastIcon.className = 'fas fa-award toast-icon';
                achievementToast.classList.add('show', 'grand');
                clearTimeout(toastTimer);
                toastTimer = setTimeout(() => achievementToast.classList.remove('show', 'grand'), 5000);
            }
        }, 900);
    }

    // ======================================================================
    // 26. CLICK A STEP — the metric staircase now shows a quick real-world
    // example for whichever prefix is clicked. This writes into a caption
    // line below the staircase (#staircaseHint) rather than the tiny
    // per-step tooltip, which is sized for short numbers like "3,200" and
    // has no room for a full sentence on a narrow phone screen.
    // ======================================================================
    const stepExamples = {
        '3': 'e.g. a 3.2 km jog = 3,200 m',
        '2': 'rarely used outside hectoliters or hectopascals',
        '1': 'rarely used outside dekagrams',
        '0': 'the base unit itself — no conversion needed',
        '-1': 'e.g. a 1.5 dL cup = 0.15 L',
        '-2': 'e.g. a 15 cm pencil = 0.15 m',
        '-3': 'e.g. a 5 mm bead = 0.005 m'
    };

    const staircaseHint = document.getElementById('staircaseHint');
    const staircaseStepEls = document.querySelectorAll('.staircase .step');

    function showStepExample(step) {
        const exp = step.dataset.exp;
        if (!(exp in stepExamples)) return;

        const stepLabel = step.querySelector('span');
        const prefixName = stepLabel ? stepLabel.textContent : 'unit';

        if (staircaseHint) {
            staircaseHint.textContent = `${prefixName}: ${stepExamples[exp]}`;
            staircaseHint.classList.add('active');
        }

        staircaseStepEls.forEach(el => el.classList.toggle('example-active', el === step));
    }

    staircaseStepEls.forEach(step => {
        const stepLabel = step.querySelector('span');
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', `Show an example for the ${stepLabel ? stepLabel.textContent : 'unit'} prefix`);

        step.addEventListener('click', () => showStepExample(step));
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showStepExample(step);
            }
        });
    });

    // ======================================================================
    // 27. HERO EMBER TRAIL — the fire stirs gently as the cursor moves
    // through the hero section. Skipped on touch devices and reduced
    // motion, and thinned out so it feels light rather than busy.
    // ======================================================================
    const heroSection = document.getElementById('hero');
    let lastEmberTrailTime = 0;

    function spawnTrailEmber(x, y) {
        const ember = document.createElement('div');
        ember.className = 'cursor-ember';
        ember.style.left = x + 'px';
        ember.style.top = y + 'px';
        ember.style.setProperty('--drift-x', (Math.random() * 30 - 15).toFixed(1) + 'px');
        document.body.appendChild(ember);
        setTimeout(() => ember.remove(), 1100);
    }

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            if (!canHoverTilt.matches || prefersReducedMotion.matches) return;
            const now = Date.now();
            if (now - lastEmberTrailTime < 110) return;
            lastEmberTrailTime = now;
            if (Math.random() > 0.4) return;
            spawnTrailEmber(e.clientX, e.clientY);
        });
    }

});