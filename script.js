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
    const revealElements = document.querySelectorAll('.card, .trial-card, .section-header, .case-study-card, .notation-card, .definition-card, .significant-figures, .percent-error, .performance-task-section');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px"
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

    const correctAnswers = [
        "fundamental quantity", 
        "factor-label method",
        "false", 
        "true"   
    ];

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
            
            if (correctAnswers.includes(selectedText)) {
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
            
            let isCorrect = false;

            if (inputField.placeholder.includes('e.g.')) {
                if (userAnswer.includes('6.4') && (userAnswer.includes('10^6') || userAnswer.includes('e6') || userAnswer.includes('10**6'))) {
                    isCorrect = true;
                }
            } else {
                if (userAnswer === '3200' || userAnswer === '3200m' || userAnswer === '3,200' || userAnswer === '3,200m') {
                    isCorrect = true;
                }
            }

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