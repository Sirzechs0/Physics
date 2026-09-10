document.addEventListener('DOMContentLoaded', () => {

    // ======================================================================
    // 0. LOADING SCREEN LOGIC (FIRE AND BLOOD)
    // ======================================================================
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderPercentage = document.getElementById('loaderPercentage');

    let progress = 0;
    const minDisplayTime = 4500;
    const startTime = Date.now();

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 3 + 0.8;
        
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
    }, 10000);


    // ======================================================================
    // 1. SCROLL PROGRESS BAR
    // ======================================================================
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });


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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            let scrollY = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    });

    // ======================================================================
    // 4. MOBILE NAVIGATION MENU
    // ======================================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // ======================================================================
    // 5. NAVBAR SCROLL EFFECT
    // ======================================================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 4rem';
            navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(230, 0, 0, 0.2)';
        } else {
            navbar.style.padding = '1.5rem 4rem';
            navbar.style.backgroundColor = 'rgba(10, 10, 12, 0.85)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        }
    });

    // ======================================================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ======================================================================
    const revealElements = document.querySelectorAll('.card, .trial-card, .section-header, .case-study-card, .notation-card, .definition-card, .significant-figures, .percent-error, .performance-task-section');

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
                this.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                this.style.borderColor = '#00ff00';
                this.style.color = '#00ff00';
                this.innerHTML = `${this.textContent} <i class="fas fa-check" style="float: right;"></i>`;
                addScore(points, questionId);
            } else {
                this.style.backgroundColor = 'rgba(230, 0, 0, 0.2)';
                this.style.borderColor = '#e60000';
                this.style.color = '#e60000';
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
                inputField.style.borderColor = '#00ff00';
                inputField.style.color = '#00ff00';
                inputField.value = inputField.value + " ✓";
                inputField.disabled = true;
                this.disabled = true;
                this.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                this.style.color = '#00ff00';
                this.textContent = 'Correct!';
                addScore(points, questionId);
            } else {
                inputField.style.borderColor = '#e60000';
                inputField.style.color = '#e60000';
                this.style.backgroundColor = '#e60000';
                this.style.color = '#fff';
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