document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    }
    
    if (currentPage === 'missions.html') {
        initMissionsPage();
    }
    
    if (currentPage === 'planets.html') {
        initPlanetsPage();
    }
});

function initHomePage() {
    const planets = document.querySelectorAll('.planet');
    const spaceship = document.getElementById('spaceship');
    const shipControl = document.getElementById('ship-control');
    const keyIndicator = document.getElementById('key-indicator');
    
    const planetPositions = [
        { left: 20, top: 50 },
        { left: 70, top: 150 },
        { left: 40, top: 250 }
    ];
    
    planets.forEach((planet, index) => {
        if (planetPositions[index]) {
            planet.style.left = `${planetPositions[index].left}%`;
            planet.style.top = `${planetPositions[index].top}px`;
        }
    });
    
    if (shipControl) {
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            shipControl.style.left = `${x}%`;
            shipControl.style.top = `${y}%`;
            
            if (spaceship) {
                spaceship.style.left = `${50 + (x - 50) * 0.1}%`;
                spaceship.style.top = `${50 + (y - 50) * 0.1}%`;
            }
            
            planets.forEach((planet, index) => {
                const rect = planet.getBoundingClientRect();
                const planetCenterX = rect.left + rect.width / 2;
                const planetCenterY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - planetCenterX;
                const distanceY = e.clientY - planetCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150 * 3;
                    const angle = Math.atan2(distanceY, distanceX);
                    
                    const currentLeft = parseFloat(planet.style.left) || planetPositions[index].left;
                    const currentTop = parseFloat(planet.style.top) || planetPositions[index].top;
                    
                    planet.style.left = `${currentLeft - Math.cos(angle) * force}%`;
                    planet.style.top = `${currentTop - Math.sin(angle) * force}px`;
                } else {
                    const currentLeft = parseFloat(planet.style.left) || planetPositions[index].left;
                    const currentTop = parseFloat(planet.style.top) || planetPositions[index].top;
                    
                    const targetLeft = planetPositions[index].left;
                    const targetTop = planetPositions[index].top;
                    
                    planet.style.left = `${currentLeft + (targetLeft - currentLeft) * 0.05}%`;
                    planet.style.top = `${currentTop + (targetTop - currentTop) * 0.05}px`;
                }
            });
        });
    }
    
    const keysPressed = {};
    let shipX = 50;
    let shipY = 50;
    
    document.addEventListener('keydown', function(e) {
        if (keysPressed[e.key]) return;
        
        keysPressed[e.key] = true;
        updateKeyIndicator();
        moveShipWithKeys();
        
        if (keyIndicator) {
            const keyName = e.key === ' ' ? 'ПРОБЕЛ' : e.key.toUpperCase();
            keyIndicator.textContent = `Нажата клавиша: ${keyName}`;
            keyIndicator.style.color = '#00d4ff';
        }
    });
    
    document.addEventListener('keyup', function(e) {
        keysPressed[e.key] = false;
        updateKeyIndicator();
        
        if (keyIndicator && Object.values(keysPressed).every(v => !v)) {
            keyIndicator.textContent = 'Нажмите любую клавишу для активации';
            keyIndicator.style.color = '#a0d2ff';
        }
    });
    
    function updateKeyIndicator() {
        let indicatorText = 'Нажаты клавиши: ';
        let hasKeys = false;
        
        for (const key in keysPressed) {
            if (keysPressed[key]) {
                const keyName = key === ' ' ? 'ПРОБЕЛ' : key.toUpperCase();
                indicatorText += keyName + ' ';
                hasKeys = true;
            }
        }
        
        if (hasKeys && keyIndicator) {
            keyIndicator.textContent = indicatorText;
            keyIndicator.style.color = '#00d4ff';
        }
    }
    
    function moveShipWithKeys() {
        const speed = 3;
        
        if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W'] || keysPressed['ц'] || keysPressed['Ц']) {
            shipY = Math.max(10, shipY - speed);
        }
        if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S'] || keysPressed['ы'] || keysPressed['Ы']) {
            shipY = Math.min(90, shipY + speed);
        }
        if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A'] || keysPressed['ф'] || keysPressed['Ф']) {
            shipX = Math.max(10, shipX - speed);
        }
        if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D'] || keysPressed['в'] || keysPressed['В']) {
            shipX = Math.min(90, shipX + speed);
        }
        
        if (shipControl) {
            shipControl.style.left = `${shipX}%`;
            shipControl.style.top = `${shipY}%`;
        }
        
        if (keysPressed[' ']) {
            if (shipControl) {
                shipControl.style.transform = `translate(-50%, -50%) scale(1.3)`;
                shipControl.style.color = '#ff5500';
                shipControl.innerHTML = '<i class="fas fa-rocket"></i><div class="flame"></div>';
                
                const flame = shipControl.querySelector('.flame');
                if (flame) {
                    flame.style.position = 'absolute';
                    flame.style.bottom = '-15px';
                    flame.style.left = '50%';
                    flame.style.transform = 'translateX(-50%)';
                    flame.style.width = '20px';
                    flame.style.height = '25px';
                    flame.style.background = 'linear-gradient(to bottom, #ff5500, #ffaa00, transparent)';
                    flame.style.borderRadius = '50%';
                }
            }
        } else {
            if (shipControl) {
                shipControl.style.transform = `translate(-50%, -50%) scale(1)`;
                shipControl.style.color = '#00d4ff';
                shipControl.innerHTML = '<i class="fas fa-space-shuttle"></i>';
            }
        }
    }
    
    const stars = document.querySelector('.stars');
    if (stars) {
        function createStar() {
            const star = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 2 + 1;
            
            star.style.position = 'absolute';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${size * 2}px #fff`;
            star.style.opacity = '0';
            star.style.transition = `opacity ${duration}s ease-in-out`;
            
            stars.appendChild(star);
            
            setTimeout(() => {
                star.style.opacity = '0.8';
                
                setTimeout(() => {
                    star.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (star.parentNode === stars) {
                            stars.removeChild(star);
                        }
                    }, duration * 500);
                }, duration * 500);
            }, 10);
        }
        
        for (let i = 0; i < 30; i++) {
            setTimeout(createStar, i * 100);
        }
        
        setInterval(createStar, 300);
    }
}

function initMissionsPage() {
    const missionCards = document.querySelectorAll('.mission-card');
    const currentYearElement = document.getElementById('current-year');
    const prevButton = document.getElementById('prev-mission');
    const nextButton = document.getElementById('next-mission');
    const launchRocket = document.getElementById('launch-rocket');
    const launchFlames = document.getElementById('launch-flames');
    const launchProgress = document.getElementById('launch-progress');
    const launchPower = document.getElementById('launch-power');
    const launchHeight = document.getElementById('launch-height');
    
    let currentMissionIndex = 0;
    const missionYears = Array.from(missionCards).map(card => parseInt(card.dataset.year));
    
    function updateActiveMission(index) {
        missionCards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.classList.remove('active');
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.9)';
            }
        });
        
        if (currentYearElement) {
            currentYearElement.textContent = missionYears[index];
        }
        
        currentMissionIndex = index;
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMissionIndex = (currentMissionIndex - 1 + missionCards.length) % missionCards.length;
            updateActiveMission(currentMissionIndex);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMissionIndex = (currentMissionIndex + 1) % missionCards.length;
            updateActiveMission(currentMissionIndex);
        });
    }
    
    let wheelTimeout;
    document.addEventListener('wheel', function(e) {
        if (wheelTimeout) return;
        
        if (e.deltaY > 0) {
            currentMissionIndex = (currentMissionIndex + 1) % missionCards.length;
        } else {
            currentMissionIndex = (currentMissionIndex - 1 + missionCards.length) % missionCards.length;
        }
        
        updateActiveMission(currentMissionIndex);
        
        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 300);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            currentMissionIndex = (currentMissionIndex + 1) % missionCards.length;
            updateActiveMission(currentMissionIndex);
        } else if (e.key === 'ArrowLeft') {
            currentMissionIndex = (currentMissionIndex - 1 + missionCards.length) % missionCards.length;
            updateActiveMission(currentMissionIndex);
        }
    });
    
    updateActiveMission(0);
    
    let launchInterval;
    let power = 0;
    let height = 0;
    let isLaunching = false;
    let spacePressed = false;
    
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !spacePressed && !isLaunching) {
            e.preventDefault();
            spacePressed = true;
            isLaunching = true;
            power = 0;
            height = 0;
            
            launchInterval = setInterval(() => {
                if (power < 100) {
                    power += 2;
                    height += power * 0.2;
                    
                    if (launchPower) launchPower.textContent = `${power}%`;
                    if (launchHeight) launchHeight.textContent = `${height.toFixed(1)} км`;
                    if (launchProgress) launchProgress.style.width = `${power}%`;
                    
                    if (launchFlames) {
                        launchFlames.style.height = `${power / 2}px`;
                        launchFlames.style.width = `${10 + power / 5}px`;
                        launchFlames.style.opacity = '1';
                    }
                    
                    if (launchRocket) {
                        const bottomOffset = power * 3;
                        launchRocket.style.transform = `translateY(-${bottomOffset}px)`;
                        launchRocket.style.color = power > 50 ? '#ffaa00' : '#ff5500';
                        
                        const shake = Math.sin(power * 0.3) * 3;
                        launchRocket.style.transform = `translateY(-${bottomOffset}px) translateX(${shake}px)`;
                    }
                } else {
                    clearInterval(launchInterval);
                    
                    if (launchRocket) {
                        launchRocket.style.transform = `translateY(-500px)`;
                        launchRocket.style.transition = 'transform 2s ease-out';
                        launchRocket.style.opacity = '0.5';
                    }
                    
                    if (launchFlames) {
                        launchFlames.style.opacity = '0';
                        launchFlames.style.transition = 'opacity 1s ease-out';
                    }
                    
                    setTimeout(() => {
                        isLaunching = false;
                        spacePressed = false;
                        
                        if (launchRocket) {
                            launchRocket.style.transform = `translateY(0)`;
                            launchRocket.style.transition = 'transform 0.5s ease-in';
                            launchRocket.style.opacity = '1';
                            launchRocket.style.color = '#ff5500';
                        }
                        
                        if (launchFlames) {
                            launchFlames.style.height = `0px`;
                            launchFlames.style.width = `20px`;
                            launchFlames.style.opacity = '0';
                            launchFlames.style.transition = 'none';
                        }
                        
                        if (launchProgress) launchProgress.style.width = `0%`;
                        if (launchPower) launchPower.textContent = `0%`;
                        if (launchHeight) launchHeight.textContent = `0 км`;
                    }, 3000);
                }
            }, 50);
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.code === 'Space' && spacePressed) {
            spacePressed = false;
            
            if (isLaunching && power < 100) {
                clearInterval(launchInterval);
                isLaunching = false;
                
                setTimeout(() => {
                    if (launchProgress) launchProgress.style.width = `0%`;
                    if (launchFlames) {
                        launchFlames.style.height = `0px`;
                        launchFlames.style.width = `20px`;
                        launchFlames.style.opacity = '0';
                    }
                    if (launchRocket) {
                        launchRocket.style.transform = `translateY(0)`;
                        launchRocket.style.color = '#ff5500';
                    }
                    if (launchPower) launchPower.textContent = `0%`;
                    if (launchHeight) launchHeight.textContent = `0 км`;
                }, 500);
            }
        }
    });
    
    if (launchRocket) {
        launchRocket.addEventListener('click', function() {
            if (!isLaunching) {
                const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' });
                document.dispatchEvent(spaceEvent);
            }
        });
    }
}

function initPlanetsPage() {
    const solarSystem = document.getElementById('solar-system');
    const rotationAngleElement = document.getElementById('rotation-angle');
    const planetName = document.getElementById('detail-planet-name');
    const planetDescription = document.getElementById('detail-planet-description');
    const planetDiameter = document.getElementById('detail-planet-diameter');
    const planetDistance = document.getElementById('detail-planet-distance');
    const planetPeriod = document.getElementById('detail-planet-period');
    const planetTemperature = document.getElementById('detail-planet-temperature');
    const planetImage = document.getElementById('detail-planet-image');
    
    const planetsData = [
        {
            name: "Меркурий",
            color: "#8c8c8c",
            diameter: "4,879 км",
            distance: "57.9 млн км",
            period: "88 дней",
            temperature: "-173°C до 427°C",
            description: "Самая маленькая и ближайшая к Солнцу планета. Не имеет спутников и атмосферы."
        },
        {
            name: "Венера",
            color: "#ffcc00",
            diameter: "12,104 км",
            distance: "108.2 млн км",
            period: "225 дней",
            temperature: "462°C",
            description: "Вторая планета от Солнца. Имеет плотную атмосферу из углекислого газа и серной кислоты."
        },
        {
            name: "Земля",
            color: "#4a90e2",
            diameter: "12,742 км",
            distance: "149.6 млн км",
            period: "365.25 дней",
            temperature: "-88°C до 58°C",
            description: "Третья планета от Солнца, единственная известная планета с жизнью. Имеет один естественный спутник - Луну."
        },
        {
            name: "Марс",
            color: "#e24a4a",
            diameter: "6,779 км",
            distance: "227.9 млн км",
            period: "687 дней",
            temperature: "-153°C до 20°C",
            description: "Четвертая планета от Солнца, известная как Красная планета. Имеет два спутника - Фобос и Деймос."
        },
        {
            name: "Юпитер",
            color: "#e8b384",
            diameter: "139,820 км",
            distance: "778.5 млн км",
            period: "12 лет",
            temperature: "-108°C",
            description: "Самая большая планета Солнечной системы. Газовая планета с ярко выраженными полосами и Большим Красным Пятном."
        },
        {
            name: "Сатурн",
            color: "#f4d3a1",
            diameter: "116,460 км",
            distance: "1.43 млрд км",
            period: "29.5 лет",
            temperature: "-139°C",
            description: "Шестая планета от Солнца, известная своими впечатляющими кольцами, состоящими из льда и камней."
        },
        {
            name: "Уран",
            color: "#a1e6f4",
            diameter: "50,724 км",
            distance: "2.87 млрд км",
            period: "84 года",
            temperature: "-197°C",
            description: "Седьмая планета от Солнца. Ледяной гигант, который вращается на боку относительно плоскости орбиты."
        },
        {
            name: "Нептун",
            color: "#4a7ce2",
            diameter: "49,244 км",
            distance: "4.5 млрд км",
            period: "165 лет",
            temperature: "-201°C",
            description: "Восьмая и самая дальняя планета от Солнца. Известна сильными ветрами и Большим Темным Пятном."
        }
    ];
    
    planetsData.forEach((planet, index) => {
        const planetElement = document.createElement('div');
        planetElement.className = 'solar-planet';
        planetElement.dataset.planetIndex = index;
        
        const orbitRadius = 120 + index * 40;
        const angle = (index * 45) * Math.PI / 180;
        const planetSize = 30 - index * 2;
        
        planetElement.style.position = 'absolute';
        planetElement.style.top = '50%';
        planetElement.style.left = '50%';
        planetElement.style.width = `${planetSize}px`;
        planetElement.style.height = `${planetSize}px`;
        planetElement.style.marginLeft = `-${planetSize / 2}px`;
        planetElement.style.marginTop = `-${planetSize / 2}px`;
        planetElement.style.borderRadius = '50%';
        planetElement.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, ${darkenColor(planet.color, 30)})`;
        planetElement.style.cursor = 'pointer';
        planetElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        planetElement.style.transition = 'all 0.3s ease';
        
        updatePlanetPosition(planetElement, orbitRadius, angle);
        
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.dataset.orbitIndex = index;
        orbit.style.position = 'absolute';
        orbit.style.top = '50%';
        orbit.style.left = '50%';
        orbit.style.width = `${orbitRadius * 2}px`;
        orbit.style.height = `${orbitRadius * 2}px`;
        orbit.style.marginLeft = `-${orbitRadius}px`;
        orbit.style.marginTop = `-${orbitRadius}px`;
        orbit.style.borderRadius = '50%';
        orbit.style.border = '1px dashed rgba(0, 212, 255, 0.3)';
        orbit.style.pointerEvents = 'none';
        
        solarSystem.appendChild(orbit);
        solarSystem.appendChild(planetElement);
        
        planetElement.addEventListener('mouseenter', function() {
            showPlanetDetails(index);
            planetElement.style.boxShadow = `0 0 20px ${planet.color}`;
            planetElement.style.transform = `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px) scale(1.3)`;
        });
        
        planetElement.addEventListener('mouseleave', function() {
            planetElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
            planetElement.style.transform = `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px) scale(1)`;
        });
        
        planetElement.addEventListener('click', function() {
            showPlanetDetails(index);
        });
    });
    
    function updatePlanetPosition(planetElement, orbitRadius, angle) {
        planetElement.style.transform = `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px)`;
    }
    
    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    function showPlanetDetails(index) {
        const planet = planetsData[index];
        
        if (planetName) planetName.textContent = planet.name;
        if (planetDescription) planetDescription.textContent = planet.description;
        if (planetDiameter) planetDiameter.textContent = planet.diameter;
        if (planetDistance) planetDistance.textContent = planet.distance;
        if (planetPeriod) planetPeriod.textContent = planet.period;
        if (planetTemperature) planetTemperature.textContent = planet.temperature;
        if (planetImage) {
            planetImage.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, ${darkenColor(planet.color, 30)})`;
            planetImage.style.boxShadow = `0 0 20px ${planet.color}`;
        }
    }
    
    let rotationAngle = 0;
    const solarPlanets = document.querySelectorAll('.solar-planet');
    const orbits = document.querySelectorAll('.orbit');
    
    function rotateSolarSystem() {
        if (rotationAngleElement) {
            rotationAngleElement.textContent = `${rotationAngle}°`;
        }
        
        orbits.forEach((orbit, index) => {
            const orbitRadius = 120 + index * 40;
            orbit.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;
        });
        
        solarPlanets.forEach((planet, index) => {
            const orbitRadius = 120 + index * 40;
            const baseAngle = (index * 45) * Math.PI / 180;
            const rotatedAngle = baseAngle + rotationAngle * Math.PI / 180;
            
            const isHovered = planet.style.boxShadow.includes('20px');
            const scale = isHovered ? 1.3 : 1;
            
            planet.style.transform = `translate(${Math.cos(rotatedAngle) * orbitRadius}px, ${Math.sin(rotatedAngle) * orbitRadius}px) scale(${scale})`;
        });
    }
    
    const keysPressedPlanets = {};
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
            keysPressedPlanets['rotateLeft'] = true;
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
            keysPressedPlanets['rotateRight'] = true;
        } else if (e.key === ' ') {
            rotationAngle = 0;
            rotateSolarSystem();
        }
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
            keysPressedPlanets['rotateLeft'] = false;
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
            keysPressedPlanets['rotateRight'] = false;
        }
    });
    
    function animateRotation() {
        if (keysPressedPlanets['rotateLeft']) {
            rotationAngle -= 2;
            rotateSolarSystem();
        }
        if (keysPressedPlanets['rotateRight']) {
            rotationAngle += 2;
            rotateSolarSystem();
        }
        requestAnimationFrame(animateRotation);
    }
    
    animateRotation();
    
    const gravityContainer = document.getElementById('gravity-container');
    const gravityObjects = document.querySelectorAll('.gravity-object');
    const gravityForceElement = document.getElementById('gravity-force');
    const gravityDistanceElement = document.getElementById('gravity-distance');
    
    let draggedObject = null;
    let offsetX = 0;
    let offsetY = 0;
    
    const initialPositions = [
        { left: 50, top: 50 },
        { left: 250, top: 100 },
        { left: 150, top: 250 },
        { left: 300, top: 200 }
    ];
    
    gravityObjects.forEach((obj, index) => {
        if (initialPositions[index]) {
            obj.style.left = `${initialPositions[index].left}px`;
            obj.style.top = `${initialPositions[index].top}px`;
        }
        obj.style.position = 'absolute';
        
        obj.addEventListener('mousedown', startDrag);
    });
    
    function startDrag(e) {
        e.preventDefault();
        draggedObject = this;
        
        const rect = draggedObject.getBoundingClientRect();
        const containerRect = gravityContainer.getBoundingClientRect();
        
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        draggedObject.style.zIndex = '100';
        draggedObject.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!draggedObject) return;
        
        const containerRect = gravityContainer.getBoundingClientRect();
        const objectWidth = draggedObject.offsetWidth;
        const objectHeight = draggedObject.offsetHeight;
        
        let x = e.clientX - containerRect.left - offsetX;
        let y = e.clientY - containerRect.top - offsetY;
        
        x = Math.max(0, Math.min(x, containerRect.width - objectWidth));
        y = Math.max(0, Math.min(y, containerRect.height - objectHeight));
        
        draggedObject.style.left = `${x}px`;
        draggedObject.style.top = `${y}px`;
        
        calculateGravityForces();
    }
    
    function stopDrag() {
        if (draggedObject) {
            draggedObject.style.zIndex = '1';
            draggedObject.style.cursor = 'grab';
        }
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        draggedObject = null;
    }
    
    function calculateGravityForces() {
        const objects = document.querySelectorAll('.gravity-object');
        let totalForce = 0;
        let totalDistance = 0;
        let count = 0;
        
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const obj1 = objects[i];
                const obj2 = objects[j];
                
                const rect1 = obj1.getBoundingClientRect();
                const rect2 = obj2.getBoundingClientRect();
                
                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;
                
                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                
                const mass1 = parseInt(obj1.dataset.mass) || 10;
                const mass2 = parseInt(obj2.dataset.mass) || 10;
                
                const force = distance > 0 ? (mass1 * mass2) / (distance * distance / 10000) : 0;
                
                totalForce += force;
                totalDistance += distance;
                count++;
                
                drawGravityLine(x1, y1, x2, y2, force, i, j);
            }
        }
        
        if (count > 0) {
            if (gravityForceElement) gravityForceElement.textContent = (totalForce / count).toFixed(2);
            if (gravityDistanceElement) gravityDistanceElement.textContent = (totalDistance / count).toFixed(0);
        }
    }
    
    function drawGravityLine(x1, y1, x2, y2, force, i, j) {
        const oldLine = document.getElementById(`gravity-line-${i}-${j}`);
        if (oldLine) oldLine.remove();
        
        const line = document.createElement('div');
        line.id = `gravity-line-${i}-${j}`;
        line.className = 'gravity-line';
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        line.style.position = 'absolute';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.width = `${length}px`;
        line.style.height = '2px';
        line.style.backgroundColor = `rgba(0, 212, 255, ${Math.min(force / 50, 0.7)})`;
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.zIndex = '0';
        line.style.pointerEvents = 'none';
        
        gravityContainer.appendChild(line);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
            gravityObjects.forEach((obj, index) => {
                if (initialPositions[index]) {
                    obj.style.left = `${initialPositions[index].left}px`;
                    obj.style.top = `${initialPositions[index].top}px`;
                }
            });
            
            document.querySelectorAll('.gravity-line').forEach(line => line.remove());
            
            if (gravityForceElement) gravityForceElement.textContent = '0';
            if (gravityDistanceElement) gravityDistanceElement.textContent = '0';
        }
    });
    
    calculateGravityForces();
    showPlanetDetails(0);
}