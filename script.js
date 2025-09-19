document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const erizo1NameInput = document.getElementById('erizo1-name');
    const erizo2NameInput = document.getElementById('erizo2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    const erizo1NameDisplay = document.getElementById('erizo1-name-display');
    const erizo2NameDisplay = document.getElementById('erizo2-name-display');
    const erizo1Sprite = document.getElementById('erizo1-sprite');
    const erizo2Sprite = document.getElementById('erizo2-sprite');

    const erizo1HungerBarFill = document.getElementById('erizo1-hunger-fill');
    const erizo2HungerBarFill = document.getElementById('erizo2-hunger-fill');
    const erizo1EnergyBarFill = document.getElementById('erizo1-energy-fill');
    const erizo2EnergyBarFill = document.getElementById('erizo2-energy-fill');
    const erizo1CleanBarFill = document.getElementById('erizo1-clean-fill');
    const erizo2CleanBarFill = document.getElementById('erizo2-clean-fill');
    
    const feedBtn1 = document.getElementById('feed-btn-1');
    const feedBtn2 = document.getElementById('feed-btn-2');
    const cleanBtn1 = document.getElementById('clean-btn-1');
    const cleanBtn2 = document.getElementById('clean-btn-2');
    const sleepBtn1 = document.getElementById('sleep-btn-1');
    const sleepBtn2 = document.getElementById('sleep-btn-2');

    const walkFramesRight = [
        'sprites/inicio_caminar.png',
        'sprites/segundo_paso.png',
        'sprites/ultimo_paso.png'
    ];
    const walkFramesLeft = [
        'sprites/inicio_caminar_izq.png',
        'sprites/segundo_paso_izq.png',
        'sprites/ultimo_paso_izq.png'
    ];
    
    const eatFrames = [
        'sprites/comer1.png',
        'sprites/comer2.png',
        'sprites/comer3.png'
    ];

    const cleanFrames = [
        'sprites/bañarse.png',
        'sprites/bañarse2.png'
    ];

    const sleepFrames = [
        'sprites/dormido.png',
        'sprites/dormido2.png'
    ];

    const erizo1 = {
        element: erizo1Sprite,
        x: 0,
        direction: 1,
        currentFrame: 0,
        isMoving: false,
        animationInterval: null,
        moveInterval: null,
        nameDisplay: erizo1NameDisplay,
        hunger: 100,
        hungerBar: erizo1HungerBarFill,
        energy: 100,
        energyBar: erizo1EnergyBarFill,
        clean: 100,
        cleanBar: erizo1CleanBarFill,
        isDoingAction: false
    };

    const erizo2 = {
        element: erizo2Sprite,
        x: 0,
        direction: -1,
        currentFrame: 0,
        isMoving: false,
        animationInterval: null,
        moveInterval: null,
        nameDisplay: erizo2NameDisplay,
        hunger: 100,
        hungerBar: erizo2HungerBarFill,
        energy: 100,
        energyBar: erizo2EnergyBarFill,
        clean: 100,
        cleanBar: erizo2CleanBarFill,
        isDoingAction: false
    };

    const erizos = [erizo1, erizo2];

    const showWelcomeScreen = () => {
        erizo1NameInput.value = '';
        erizo2NameInput.value = '';
        welcomeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    };

    const updateErizoSprite = (erizo, frames) => {
        erizo.element.src = frames[erizo.currentFrame];
    };

    const moveErizo = (erizo) => {
        const windowWidth = window.innerWidth;
        const erizoWidth = erizo.element.offsetWidth;
        const moveAmount = 5;

        erizo.x += erizo.direction * moveAmount;

        if (erizo.x + erizoWidth > windowWidth / 2 + 280 || erizo.x < -windowWidth / 2 + 200) {
            erizo.direction *= -1;
        }

        erizo.element.style.transform = `translateX(${erizo.x}px)`;
    };

    const startActionAnimation = (erizo, frames, duration, actionClass, frameDuration = 200, onComplete) => {
        erizo.isMoving = false;
        clearInterval(erizo.moveInterval);
        clearInterval(erizo.animationInterval);

        erizo.isDoingAction = true;
        
        erizo.element.classList.add(actionClass);
        erizo.element.src = frames[0];

        let frameIndex = 1;
        const animationInterval = setInterval(() => {
            erizo.element.src = frames[frameIndex];
            frameIndex = (frameIndex + 1) % frames.length;
        }, frameDuration);

        setTimeout(() => {
            clearInterval(animationInterval);
            erizo.isDoingAction = false;
            
            erizo.element.classList.remove(actionClass);
            
            erizo.element.src = 'sprites/normal_frente.png';
            startRandomMovement(erizo);
            if (onComplete) onComplete();
        }, duration);
    };

    const updateErizoStat = (erizo, stat, value) => {
        erizo[stat] = Math.max(0, Math.min(100, erizo[stat] + value));
        erizo[`${stat}Bar`].style.width = `${erizo[stat]}%`;
    };

    if (feedBtn1) {
        feedBtn1.addEventListener('click', () => {
            if (!erizo1.isDoingAction) {
                startActionAnimation(erizo1, eatFrames, 5000, 'eating', 200, () => {
                    updateErizoStat(erizo1, 'hunger', 30);
                });
            }
        });
    }

    if (feedBtn2) {
        feedBtn2.addEventListener('click', () => {
            if (!erizo2.isDoingAction) {
                startActionAnimation(erizo2, eatFrames, 5000, 'eating', 200, () => {
                    updateErizoStat(erizo2, 'hunger', 30);
                });
            }
        });
    }

    if (cleanBtn1) {
        cleanBtn1.addEventListener('click', () => {
            if (!erizo1.isDoingAction) {
                startActionAnimation(erizo1, cleanFrames, 3000, 'cleaning', 200, () => {
                    updateErizoStat(erizo1, 'clean', 40);
                });
            }
        });
    }

    if (cleanBtn2) {
        cleanBtn2.addEventListener('click', () => {
            if (!erizo2.isDoingAction) {
                startActionAnimation(erizo2, cleanFrames, 3000, 'cleaning', 200, () => {
                    updateErizoStat(erizo2, 'clean', 40);
                });
            }
        });
    }

    if (sleepBtn1) {
        sleepBtn1.addEventListener('click', () => {
            if (!erizo1.isDoingAction) {
                startActionAnimation(erizo1, sleepFrames, 6000, 'sleeping', 500, () => {
                    updateErizoStat(erizo1, 'energy', 50);
                });
            }
        });
    }

    if (sleepBtn2) {
        sleepBtn2.addEventListener('click', () => {
            if (!erizo2.isDoingAction) {
                startActionAnimation(erizo2, sleepFrames, 6000, 'sleeping', 500, () => {
                    updateErizoStat(erizo2, 'energy', 50);
                });
            }
        });
    }
    
    const startRandomMovement = (erizo) => {
        if (erizo.isDoingAction) return;

        clearInterval(erizo.moveInterval);
        clearInterval(erizo.animationInterval);
        erizo.isMoving = false;
        erizo.element.src = 'sprites/normal_frente.png';

        const shouldMove = Math.random() < 0.7;

        if (shouldMove) {
            erizo.isMoving = true;
            erizo.direction = Math.random() < 0.5 ? 1 : -1;

            erizo.animationInterval = setInterval(() => {
                erizo.currentFrame = (erizo.currentFrame + 1) % walkFramesRight.length;
                updateErizoSprite(erizo, erizo.direction === 1 ? walkFramesRight : walkFramesLeft);
            }, 150);

            erizo.moveInterval = setInterval(() => {
                moveErizo(erizo);
            }, 50);

            const moveDuration = Math.random() * (5000 - 2000) + 2000;
            setTimeout(() => {
                erizo.isMoving = false;
                clearInterval(erizo.moveInterval);
                clearInterval(erizo.animationInterval);
                erizo.element.src = 'sprites/normal_frente.png';
                setTimeout(() => startRandomMovement(erizo), Math.random() * (3000 - 1000) + 1000);
            }, moveDuration);

        } else {
            const waitDuration = Math.random() * (5000 - 2000) + 2000;
            setTimeout(() => startRandomMovement(erizo), waitDuration);
        }
    };

    const startStatsDecrease = () => {
        erizos.forEach(erizo => {
            setInterval(() => {
                if (!erizo.isDoingAction) {
                    updateErizoStat(erizo, 'hunger', -1);
                    updateErizoStat(erizo, 'energy', -1);
                    updateErizoStat(erizo, 'clean', -1);
                }
            }, 3000);
        });
    };
    
    const showGameScreen = (name1, name2) => {
        erizo1NameDisplay.textContent = `${name1}`;
        erizo2NameDisplay.textContent = `${name2}`;
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        erizo1.hunger = 100;
        erizo2.hunger = 100;
        
        erizo1HungerBarFill.style.width = '100%';
        erizo2HungerBarFill.style.width = '100%';

        const changeNamesBtn = document.getElementById('change-names-btn');
        if (changeNamesBtn) {
            changeNamesBtn.addEventListener('click', () => {
                const confirmation = confirm('¿Estás seguro de que quieres cambiar los nombres? Se perderá el progreso actual.');
                
                if (confirmation) {
                    localStorage.removeItem('erizo1Name');
                    localStorage.removeItem('erizo2Name');
                    
                    erizos.forEach(erizo => {
                        clearInterval(erizo.moveInterval);
                        clearInterval(erizo.animationInterval);
                    });
                    showWelcomeScreen();
                }
            });
        }
        
        erizo1.x = -150;
        erizo2.x = 150;
        erizo1.element.style.transform = `translateX(${erizo1.x}px)`;
        erizo2.element.style.transform = `translateX(${erizo2.x}px)`;

        erizos.forEach(startRandomMovement);
        startStatsDecrease();
    };

    const savedName1 = localStorage.getItem('erizo1Name');
    const savedName2 = localStorage.getItem('erizo2Name');

    if (savedName1 && savedName2) {
        showGameScreen(savedName1, savedName2);
    } else {
        showWelcomeScreen();
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            const erizo1Name = erizo1NameInput.value.trim();
            const erizo2Name = erizo2NameInput.value.trim();

            if (erizo1Name === '' || erizo2Name === '') {
                alert('Por favor, ingresa los nombres de tus dos erizos.');
                return;
            }

            localStorage.setItem('erizo1Name', erizo1Name);
            localStorage.setItem('erizo2Name', erizo2Name);

            showGameScreen(erizo1Name, erizo2Name);
        });
    }
});