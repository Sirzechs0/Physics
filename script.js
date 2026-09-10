document.addEventListener('DOMContentLoaded', () => {

    // ======================================================================
    // 1. PARALLAX BACKGROUND (DRAGONSTONE)
    // ======================================================================
    const heroBg = document.querySelector('.hero-bg-placeholder');
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        // Only run if we are at the top of the page
        if (window.scrollY < window.innerHeight) {
            let scrollY = window.pageYOffset;
            // Move the background at 30% of the scroll speed
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    });

    // ======================================================================
    // 2. MOBILE NAVIGATION MENU
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
    // 3. NAVBAR SCROLL EFFECT
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
    // 4. SCROLL REVEAL ANIMATIONS (General)
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
    // 5. ANIMATED TARGET DIAGRAM (FIXED)
    // ======================================================================
    const targetVisual = document.querySelector('.target-visual');
    const arrows = document.querySelectorAll('.target-arrow');

    if (targetVisual && arrows.length > 0) {
        const targetObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                arrows.forEach((arrow, index) => {
                    setTimeout(() => {
                        arrow.classList.add('shoot');
                    }, index * 400); // Staggered delay for each arrow
                });
                targetObserver.disconnect(); // Stop observing once triggered
            }
        }, { threshold: 0.1 }); // Lowered threshold so it triggers earlier
        
        targetObserver.observe(targetVisual);
    }

    // ======================================================================
    // 6. INTERACTIVE TRIALS (QUIZ LOGIC)
    // ======================================================================
    const optionButtons = document.querySelectorAll('.option-btn');
    
    const correctAnswers = [
        "fundamental quantity", 
        "factor-label method",
        "false", 
        "true"   
    ];

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedText = this.textContent.trim().toLowerCase();
            
            if (correctAnswers.includes(selectedText)) {
                this.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                this.style.borderColor = '#00ff00';
                this.style.color = '#00ff00';
                this.innerHTML = `${this.textContent} <i class="fas fa-check" style="float: right;"></i>`;
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

    // ======================================================================
    // 7. DRACARYS REVEAL (Case Study)
    // ======================================================================
    const dracarysBtn = document.getElementById('dracarysBtn');
    const hiddenReveal = document.getElementById('hiddenReveal');

    if (dracarysBtn && hiddenReveal) {
        dracarysBtn.addEventListener('click', () => {
            dracarysBtn.style.opacity = '0';
            dracarysBtn.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                dracarysBtn.style.display = 'none';
                hiddenReveal.classList.add('show');
            }, 400);
        });
    }

    // ======================================================================
    // 8. SMOOTH SCROLLING FOR ANCHOR LINKS
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