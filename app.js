// ==================== DATOS DE USUARIO ====================
let userData = {
    name: '',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalWorkouts: 0,
    totalSets: 0,
    totalWeight: 0,
    streak: 0,
    longestStreak: 0,
    lastWorkoutDate: null
};

// ==================== PROGRESO DE EJERCICIOS ====================
let exerciseProgress = {};
let attendedDays = {};
let currentWorkout = null;
let currentExerciseIndex = 0;
let currentSeriesStatus = {};
let currentTab = 'home';

// Temporizador
let timerInterval = null;
let timerSeconds = 60;

// Música (playlist de entrenamiento)
const workoutPlaylist = [
    { name: 'Power Up', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '3:24' },
    { name: 'Energy Boost', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '3:42' },
    { name: 'Maximum Effort', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '4:01' },
    { name: 'Victory Lap', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: '3:58' }
];
let currentTrack = 0;
let audioPlayer = null;
let isPlaying = false;

// Días de semana
const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const weekDaysSpanish = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ==================== RUTINA SEMANAL ====================
const weeklyRoutine = {
    lunes: {
        name: 'PUSH',
        subtitle: 'Pecho, Hombro, Tríceps',
        gradient: '#8b5cf6',
        exercises: [
            { id: 'press_inclinado', name: 'Press inclinado', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'press_plano', name: 'Press plano', sets: 3, targetReps: '6-8', lastWeight: 0, history: [] },
            { id: 'press_militar', name: 'Press militar', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'elevaciones', name: 'Elevaciones laterales', sets: 3, targetReps: '12', lastWeight: 0, history: [] },
            { id: 'fondos', name: 'Fondos', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'extension_triceps', name: 'Extensión tríceps', sets: 3, targetReps: '10-12', lastWeight: 0, history: [] }
        ]
    },
    martes: {
        name: 'PULL',
        subtitle: 'Espalda, Bíceps',
        gradient: '#a855f7',
        exercises: [
            { id: 'remo_t', name: 'Remo T', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'jalon_polea', name: 'Jalón en polea', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'remo_polea', name: 'Remo en polea', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'curl_biceps', name: 'Curl bíceps', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'curl_martillo', name: 'Curl martillo', sets: 3, targetReps: '10-12', lastWeight: 0, history: [] }
        ]
    },
    miércoles: {
        name: 'LEGS',
        subtitle: 'Pierna Completa',
        gradient: '#c084fc',
        exercises: [
            { id: 'prensa', name: 'Prensa o sentadilla', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'peso_muerto', name: 'Peso muerto', sets: 3, targetReps: '6-8', lastWeight: 0, history: [] },
            { id: 'femoral', name: 'Femoral', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'extension_cuadriceps', name: 'Extensión cuádriceps', sets: 3, targetReps: '12', lastWeight: 0, history: [] },
            { id: 'gemelos', name: 'Gemelos', sets: 4, targetReps: '15', lastWeight: 0, history: [] }
        ]
    },
    jueves: {
        name: 'CARDIO',
        subtitle: 'Recuperación Activa',
        gradient: '#facc15',
        exercises: [
            { id: 'bicicleta', name: 'Bicicleta', sets: 1, targetReps: '60-120 min', lastWeight: 0, history: [] }
        ]
    },
    viernes: {
        name: 'UPPER',
        subtitle: 'Parte Superior',
        gradient: '#eab308',
        exercises: [
            { id: 'press_inclinado_v2', name: 'Press inclinado', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'remo_t_v2', name: 'Remo T', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'jalon_v2', name: 'Jalón', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'elevaciones_v2', name: 'Elevaciones laterales', sets: 3, targetReps: '12', lastWeight: 0, history: [] },
            { id: 'fondos_v2', name: 'Fondos', sets: 3, targetReps: '8-10', lastWeight: 0, history: [] },
            { id: 'curl_biceps_v2', name: 'Curl bíceps', sets: 3, targetReps: '10', lastWeight: 0, history: [] }
        ]
    },
    sábado: {
        name: 'LOWER',
        subtitle: 'Pierna Fuerza',
        gradient: '#a855f7',
        exercises: [
            { id: 'hack_squat', name: 'Hack squat', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'zancadas', name: 'Zancadas', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'femoral_v2', name: 'Femoral', sets: 3, targetReps: '10', lastWeight: 0, history: [] },
            { id: 'extension_v2', name: 'Extensión', sets: 3, targetReps: '12', lastWeight: 0, history: [] },
            { id: 'gemelos_v2', name: 'Gemelos', sets: 4, targetReps: '15', lastWeight: 0, history: [] }
        ]
    }
};

// ==================== CARGA Y GUARDADO ====================
function loadAllData() {
    const savedUser = localStorage.getItem('gympro_user');
    if (savedUser) userData = JSON.parse(savedUser);
    
    const savedProgress = localStorage.getItem('gympro_progress');
    if (savedProgress) {
        exerciseProgress = JSON.parse(savedProgress);
        for (let day in weeklyRoutine) {
            weeklyRoutine[day].exercises.forEach(ex => {
                if (exerciseProgress[ex.id]) {
                    ex.lastWeight = exerciseProgress[ex.id].lastWeight || 0;
                    ex.history = exerciseProgress[ex.id].history || [];
                }
            });
        }
    }
    
    const savedAttended = localStorage.getItem('gympro_attended');
    if (savedAttended) attendedDays = JSON.parse(savedAttended);
    
    const savedSession = localStorage.getItem('gympro_session');
    if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session && session.date === new Date().toDateString()) {
            currentWorkout = session.currentWorkout;
            currentExerciseIndex = session.currentExerciseIndex;
            currentSeriesStatus = session.currentSeriesStatus;
        }
    }
    
    updateUserDisplay();
}

function saveAllData() {
    localStorage.setItem('gympro_user', JSON.stringify(userData));
    localStorage.setItem('gympro_progress', JSON.stringify(exerciseProgress));
    localStorage.setItem('gympro_attended', JSON.stringify(attendedDays));
    
    if (currentWorkout) {
        localStorage.setItem('gympro_session', JSON.stringify({
            date: new Date().toDateString(),
            currentWorkout: currentWorkout,
            currentExerciseIndex: currentExerciseIndex,
            currentSeriesStatus: currentSeriesStatus
        }));
    }
}

// ==================== SISTEMA DE XP Y NIVEL ====================
function addXP(amount) {
    userData.xp += amount;
    while (userData.xp >= userData.xpToNextLevel) {
        userData.xp -= userData.xpToNextLevel;
        userData.level++;
        userData.xpToNextLevel = Math.floor(userData.xpToNextLevel * 1.2);
        showToast(`🎉 ¡SUBISTE A NIVEL ${userData.level}!`, 2500);
    }
    updateUserDisplay();
    saveAllData();
}

function updateUserDisplay() {
    document.getElementById('userNameDisplay').innerText = userData.name || 'Atleta';
    document.getElementById('levelBadge').innerHTML = `Nv ${userData.level}`;
}

// ==================== SOBRECARGA PROGRESIVA ====================
function getSuggestion(exercise) {
    if (!exercise.history || exercise.history.length === 0) {
        return "🏋️ Registra tu primer peso para comenzar tu progreso";
    }
    const last = exercise.history[exercise.history.length - 1];
    const targetMax = parseInt(exercise.targetReps.split('-')[1]) || 12;
    if (last.reps >= targetMax) {
        return `⚡ ¡Aumenta a ${Math.ceil(last.weight * 1.05)} kg!`;
    }
    return `📊 Mantén ${last.weight} kg y busca ${Math.min(last.reps + 2, targetMax)} reps`;
}

// ==================== REGISTRO DE SERIE ====================
function registerSet(exerciseId, weight, reps) {
    if (!exerciseProgress[exerciseId]) {
        exerciseProgress[exerciseId] = { history: [], lastWeight: 0, bestWeight: 0 };
    }
    const progress = exerciseProgress[exerciseId];
    const isPR = weight > (progress.bestWeight || 0);
    
    progress.history.push({ date: new Date().toISOString(), weight, reps });
    progress.lastWeight = weight;
    if (isPR) progress.bestWeight = weight;
    
    userData.totalSets++;
    userData.totalWeight += weight;
    addXP(isPR ? 25 : 10);
    
    if (isPR) showToast(`🏆 ¡RÉCORD! ${weight} kg`, 1500);
    saveAllData();
}

// ==================== TEMPORIZADOR ====================
function showTimer(seconds = 60) {
    timerSeconds = seconds;
    updateTimerDisplay();
    document.getElementById('timerModal').classList.add('active');
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerSeconds <= 0) {
            stopTimer();
            showToast('⏰ ¡Descanso terminado! Continúa', 2000);
        } else {
            timerSeconds--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').innerHTML = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function adjustTimer(seconds) {
    timerSeconds = Math.max(0, timerSeconds + seconds);
    updateTimerDisplay();
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('timerModal').classList.remove('active');
}

// ==================== MÚSICA ====================
function initAudio() {
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.loop = false;
        audioPlayer.addEventListener('ended', () => playNextTrack());
    }
}

function playTrack(index) {
    initAudio();
    currentTrack = index;
    audioPlayer.src = workoutPlaylist[currentTrack].url;
    audioPlayer.play();
    isPlaying = true;
    showToast(`🎵 Reproduciendo: ${workoutPlaylist[currentTrack].name}`, 1500);
    renderCurrentView();
}

function togglePlayPause() {
    if (!audioPlayer) initAudio();
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        if (audioPlayer.src) {
            audioPlayer.play();
            isPlaying = true;
        } else {
            playTrack(0);
        }
    }
    renderCurrentView();
}

function playNextTrack() {
    currentTrack = (currentTrack + 1) % workoutPlaylist.length;
    playTrack(currentTrack);
}

function playPreviousTrack() {
    currentTrack = (currentTrack - 1 + workoutPlaylist.length) % workoutPlaylist.length;
    playTrack(currentTrack);
}

// ==================== ENTRENAMIENTO ====================
function startWorkout() {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayKey = weekDays[dayIndex === 0 ? 5 : dayIndex - 1];
    const routine = weeklyRoutine[dayKey];
    
    if (!routine) {
        showToast('🏖️ Día de descanso. ¡Recupérate!', 1500);
        return;
    }
    
    const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    if (!attendedDays[dateStr]) {
        attendedDays[dateStr] = true;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
        userData.streak = attendedDays[yesterdayStr] ? userData.streak + 1 : 1;
        if (userData.streak > userData.longestStreak) userData.longestStreak = userData.streak;
        userData.totalWorkouts++;
        addXP(50);
        saveAllData();
    }
    
    if (currentWorkout) {
        document.getElementById('workoutTitle').innerHTML = routine.name;
        document.getElementById('workoutScreen').classList.add('active');
        renderCurrentExercise();
    } else {
        currentWorkout = JSON.parse(JSON.stringify(routine));
        currentExerciseIndex = 0;
        currentSeriesStatus = {};
        currentWorkout.exercises.forEach((ex, idx) => {
            currentSeriesStatus[idx] = { completedSets: [], currentSet: 1, weight: ex.lastWeight || 0, reps: 0 };
        });
        document.getElementById('workoutTitle').innerHTML = currentWorkout.name;
        document.getElementById('workoutScreen').classList.add('active');
        renderCurrentExercise();
        saveAllData();
    }
}

function renderCurrentExercise() {
    const ex = currentWorkout.exercises[currentExerciseIndex];
    const status = currentSeriesStatus[currentExerciseIndex];
    const totalSets = ex.sets;
    const completedCount = status.completedSets.length;
    
    let seriesHtml = '';
    for (let i = 1; i <= totalSets; i++) {
        let btnClass = 'series-btn';
        if (status.completedSets.includes(i)) btnClass += ' completed';
        else if (status.currentSet === i) btnClass += ' active';
        seriesHtml += `<button class="${btnClass}" onclick="selectSeries(${i})">Serie ${i}</button>`;
    }
    
    const html = `
        <div class="current-exercise-card">
            <div class="exercise-big-name">${ex.name}</div>
            <div class="exercise-stats" style="margin-bottom: 1rem;">🎯 ${totalSets} × ${ex.targetReps}</div>
            
            <div class="weight-controls">
                <input type="number" id="currentWeight" class="weight-input" placeholder="Peso (kg)" value="${status.weight || ''}" step="2.5">
                <input type="number" id="currentReps" class="reps-input" placeholder="Reps" value="${status.reps || ''}">
            </div>
            
            <div class="suggestion-bubble">
                💡 ${getSuggestion(ex)}
            </div>
            
            <div class="series-container">
                ${seriesHtml}
            </div>
            
            <button class="btn-primary" onclick="completeCurrentSet()">
                ${status.currentSet <= totalSets && !status.completedSets.includes(status.currentSet) ? '✅ COMPLETAR SERIE' : '➡️ SIGUIENTE EJERCICIO'}
            </button>
            
            <button class="rest-timer-btn" style="margin-top: 1rem;" onclick="showTimer(60)">
                ⏱️ Descanso 1 min
            </button>
        </div>
    `;
    
    document.getElementById('workoutContent').innerHTML = html;
}

function selectSeries(seriesNum) {
    const status = currentSeriesStatus[currentExerciseIndex];
    if (!status.completedSets.includes(seriesNum)) {
        status.currentSet = seriesNum;
        renderCurrentExercise();
    }
}

function completeCurrentSet() {
    const ex = currentWorkout.exercises[currentExerciseIndex];
    const status = currentSeriesStatus[currentExerciseIndex];
    const totalSets = ex.sets;
    const weight = parseFloat(document.getElementById('currentWeight')?.value) || 0;
    const reps = parseInt(document.getElementById('currentReps')?.value) || 0;
    
    status.weight = weight;
    status.reps = reps;
    
    if (status.currentSet <= totalSets && !status.completedSets.includes(status.currentSet)) {
        if (weight > 0 && reps > 0) {
            registerSet(ex.id, weight, reps);
            ex.lastWeight = weight;
            ex.history = exerciseProgress[ex.id]?.history || [];
        }
        
        status.completedSets.push(status.currentSet);
        status.completedSets.sort();
        
        showToast(`✅ Serie ${status.currentSet} completada`, 800);
        
        let nextSet = status.currentSet + 1;
        while (nextSet <= totalSets && status.completedSets.includes(nextSet)) nextSet++;
        
        if (nextSet <= totalSets) status.currentSet = nextSet;
        else status.currentSet = totalSets + 1;
        
        renderCurrentExercise();
        saveAllData();
    } 
    else if (status.completedSets.length === totalSets) {
        if (currentExerciseIndex + 1 < currentWorkout.exercises.length) {
            showToast(`🎉 Siguiente: ${currentWorkout.exercises[currentExerciseIndex + 1].name}`, 1200);
            currentExerciseIndex++;
            renderCurrentExercise();
            saveAllData();
        } else {
            closeWorkout();
            showToast(`🎉 ¡FELICIDADES ${userData.name}! ¡DÍA COMPLETADO! 🏆`, 3000);
            addXP(100);
        }
    }
}

function closeWorkout() {
    currentWorkout = null;
    localStorage.removeItem('gympro_session');
    document.getElementById('workoutScreen').classList.remove('active');
    renderCurrentView();
}

// ==================== NOTIFICACIONES ====================
function showToast(message, duration = 2000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ==================== VISTAS ====================
function renderCurrentView() {
    const container = document.getElementById('app');
    const today = new Date();
    const dayIndex = today.getDay();
    const dayKey = weekDays[dayIndex === 0 ? 5 : dayIndex - 1];
    const routine = weeklyRoutine[dayKey];
    
    if (currentTab === 'home') {
        container.innerHTML = `
            <div class="hero-card" style="background: linear-gradient(135deg, ${routine?.gradient || '#8b5cf6'}, #6b21a5);">
                <div class="hero-day">${weekDaysSpanish[dayIndex === 0 ? 5 : dayIndex - 1].toUpperCase()}</div>
                <div class="hero-routine">${routine ? routine.name : 'DESCANSO'}</div>
                <div class="hero-exercises">${routine ? routine.subtitle : 'Tómate un descanso activo'}</div>
                <button class="btn-primary" onclick="startWorkout()">INICIAR ENTRENAMIENTO</button>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span class="card-title">📈 Progreso Semanal</span>
                </div>
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>🔥 Racha: ${userData.streak} días</span>
                        <span>🏆 Récord: ${userData.longestStreak}</span>
                    </div>
                    <div class="progress-bar" style="height: 6px; background: var(--gray-700); border-radius: 3px;">
                        <div style="width: ${(userData.streak / Math.max(1, userData.longestStreak) * 100)}%; height: 100%; background: var(--purple-primary); border-radius: 3px;"></div>
                    </div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-circle">
                    <div class="stat-value">${userData.totalWorkouts}</div>
                    <div style="font-size: 0.75rem;">Entrenamientos</div>
                </div>
                <div class="stat-circle">
                    <div class="stat-value">${userData.totalSets}</div>
                    <div style="font-size: 0.75rem;">Series totales</div>
                </div>
                <div class="stat-circle">
                    <div class="stat-value">${Math.round(userData.totalWeight)}</div>
                    <div style="font-size: 0.75rem;">Kg levantados</div>
                </div>
                <div class="stat-circle">
                    <div class="stat-value">${userData.level}</div>
                    <div style="font-size: 0.75rem;">Nivel</div>
                </div>
            </div>
        `;
    }
    else if (currentTab === 'progress') {
        let html = '<div class="card"><div class="card-header"><span class="card-title">📊 Progreso por Ejercicio</span></div><div class="card-content">';
        for (let day in weeklyRoutine) {
            weeklyRoutine[day].exercises.forEach(ex => {
                const prog = exerciseProgress[ex.id];
                if (prog?.history?.length) {
                    const last = prog.history[prog.history.length - 1];
                    html += `
                        <div style="margin: 1rem 0; padding: 1rem; background: var(--gray-700); border-radius: 20px;">
                            <div style="font-weight: 600;">${ex.name}</div>
                            <div style="font-size: 0.875rem;">Último: ${last.weight}kg x ${last.reps} reps</div>
                            <div style="font-size: 0.75rem; opacity: 0.7;">Mejor: ${prog.bestWeight || 0}kg</div>
                        </div>
                    `;
                }
            });
        }
        html += '</div></div>';
        container.innerHTML = html || '<div class="card"><div class="card-content"><p>Completa entrenamientos para ver tu progreso</p></div></div>';
    }
    else if (currentTab === 'exercises') {
        let html = '<div class="card"><div class="card-header"><span class="card-title">🏋️ Todos los Ejercicios</span></div><div class="card-content">';
        for (let day in weeklyRoutine) {
            html += `<div style="margin: 1rem 0;"><div style="font-weight: 700; color: var(--purple-primary); margin-bottom: 0.5rem;">${weeklyRoutine[day].name}</div>`;
            weeklyRoutine[day].exercises.forEach(ex => {
                html += `<div class="exercise-row"><span class="exercise-name">${ex.name}</span><span class="exercise-stats">${ex.sets} × ${ex.targetReps}</span></div>`;
            });
            html += `</div>`;
        }
        html += '</div></div>';
        container.innerHTML = html;
    }
    else if (currentTab === 'music') {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🎵 Playlist de Entrenamiento</span>
                </div>
                <div class="card-content">
                    <div style="text-align: center; padding: 1rem;">
                        <div style="font-size: 3rem; margin-bottom: 0.5rem;">${isPlaying ? '🔊' : '⏸️'}</div>
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${isPlaying ? (workoutPlaylist[currentTrack]?.name || 'GYM PRO Radio') : 'Pausado'}</div>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
                            <button class="rest-timer-btn" onclick="playPreviousTrack()">⏮️</button>
                            <button class="btn-primary" style="width: auto; padding: 0.75rem 1.5rem;" onclick="togglePlayPause()">${isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}</button>
                            <button class="rest-timer-btn" onclick="playNextTrack()">⏭️</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">📋 Lista de reproducción</span></div>
                <div class="card-content">
                    ${workoutPlaylist.map((track, idx) => `
                        <div class="exercise-row" onclick="playTrack(${idx})" style="cursor: pointer;">
                            <span>${track.name}</span>
                            <span style="font-size: 0.75rem;">${track.duration}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (currentTab === 'settings') {
        container.innerHTML = `
            <div class="card">
                <div class="card-header"><span class="card-title">⚙️ Configuración</span></div>
                <div class="card-content">
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.875rem;">👤 Nombre</label>
                        <input type="text" id="settingsName" value="${userData.name || ''}" style="width: 100%; padding: 0.75rem; margin-top: 0.25rem; border-radius: 12px; border: none; background: var(--gray-700); color: var(--white);">
                        <button class="rest-timer-btn" style="margin-top: 0.5rem; width: 100%;" onclick="updateSettingsName()">Guardar</button>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="font-size: 0.875rem;">🎨 Tema</label>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <button class="rest-timer-btn ${!document.body.classList.contains('light') ? 'active' : ''}" onclick="setTheme('dark')">🌙 Oscuro</button>
                            <button class="rest-timer-btn ${document.body.classList.contains('light') ? 'active' : ''}" onclick="setTheme('light')">☀️ Claro</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.875rem;">📊 Estadísticas</div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                            <span>Racha actual: ${userData.streak} días</span>
                            <span>Mejor racha: ${userData.longestStreak} días</span>
                        </div>
                        <div class="progress-bar" style="margin-top: 0.5rem; height: 6px;">
                            <div style="width: ${(userData.xp / userData.xpToNextLevel * 100)}%; height: 100%; background: var(--yellow-primary); border-radius: 3px;"></div>
                        </div>
                        <div style="font-size: 0.75rem;">XP: ${userData.xp}/${userData.xpToNextLevel}</div>
                    </div>
                    <button class="rest-timer-btn" style="width: 100%; background: #ef4444; color: white;" onclick="resetAllData()">🔄 Reiniciar todo</button>
                </div>
            </div>
        `;
    }
}

function updateSettingsName() {
    const input = document.getElementById('settingsName');
    if (input.value.trim()) {
        userData.name = input.value.trim();
        updateUserDisplay();
        saveAllData();
        showToast(`✅ Nombre actualizado: ${userData.name}`, 1500);
        renderCurrentView();
    }
}

function setTheme(theme) {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('gympro_theme', theme);
    renderCurrentView();
}

function resetAllData() {
    if (confirm('⚠️ ¿Borrar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.clear();
        location.reload();
    }
}

function setWelcomeName() {
    const input = document.getElementById('welcomeName');
    if (input.value.trim()) {
        userData.name = input.value.trim();
        updateUserDisplay();
        saveAllData();
        document.getElementById('welcomeModal').classList.remove('active');
        renderCurrentView();
        showToast(`👋 Bienvenido ${userData.name}!`, 2000);
    }
}

// ==================== NAVEGACIÓN ====================
function initNavigation() {
    document.querySelectorAll('.tab-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.tab-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentTab = item.dataset.tab;
            renderCurrentView();
        });
    });
}

// ==================== PWA ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBanner').style.display = 'block';
});

function promptInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            document.getElementById('installBanner').style.display = 'none';
        });
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// ==================== INICIALIZACIÓN ====================
function init() {
    const savedTheme = localStorage.getItem('gympro_theme');
    if (savedTheme === 'light') document.body.classList.add('light');
    loadAllData();
    initNavigation();
    renderCurrentView();
    if (!userData.name) document.getElementById('welcomeModal').classList.add('active');
}

init();