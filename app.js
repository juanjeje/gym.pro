// ==================== DATOS DEL USUARIO ====================
let userProfile = {
    name: '',
    weight: 0,
    height: 0,
    goal: '',
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

// ==================== RUTINAS EDITABLES ====================
let weeklyRoutines = {
    lunes: { name: 'Lunes', exercises: [] },
    martes: { name: 'Martes', exercises: [] },
    miércoles: { name: 'Miércoles', exercises: [] },
    jueves: { name: 'Jueves', exercises: [] },
    viernes: { name: 'Viernes', exercises: [] },
    sábado: { name: 'Sábado', exercises: [] }
};

let exerciseProgress = {};
let attendedDays = {};
let currentWorkout = null;
let currentExerciseIndex = 0;
let currentSeriesStatus = {};
let currentTab = 'home';
let editingDay = '';

const weekDays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const weekDaysSpanish = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ==================== RUTINAS POR DEFECTO ====================
const defaultRoutines = {
    lunes: {
        name: 'PUSH',
        exercises: [
            { id: 'press_inclinado', name: 'Press inclinado', sets: 3, targetReps: '8-10' },
            { id: 'press_plano', name: 'Press plano', sets: 3, targetReps: '6-8' },
            { id: 'press_militar', name: 'Press militar', sets: 3, targetReps: '8-10' },
            { id: 'elevaciones', name: 'Elevaciones laterales', sets: 3, targetReps: '12' },
            { id: 'fondos', name: 'Fondos', sets: 3, targetReps: '8-10' },
            { id: 'extension_triceps', name: 'Extensión tríceps', sets: 3, targetReps: '10-12' }
        ]
    },
    martes: {
        name: 'PULL',
        exercises: [
            { id: 'remo_t', name: 'Remo T', sets: 3, targetReps: '8-10' },
            { id: 'jalon_polea', name: 'Jalón en polea', sets: 3, targetReps: '10' },
            { id: 'remo_polea', name: 'Remo en polea', sets: 3, targetReps: '10' },
            { id: 'curl_biceps', name: 'Curl bíceps', sets: 3, targetReps: '8-10' },
            { id: 'curl_martillo', name: 'Curl martillo', sets: 3, targetReps: '10-12' }
        ]
    },
    miércoles: {
        name: 'LEGS',
        exercises: [
            { id: 'prensa', name: 'Prensa o sentadilla', sets: 3, targetReps: '8-10' },
            { id: 'peso_muerto', name: 'Peso muerto', sets: 3, targetReps: '6-8' },
            { id: 'femoral', name: 'Femoral', sets: 3, targetReps: '10' },
            { id: 'extension_cuadriceps', name: 'Extensión cuádriceps', sets: 3, targetReps: '12' },
            { id: 'gemelos', name: 'Gemelos', sets: 4, targetReps: '15' }
        ]
    },
    jueves: {
        name: 'CARDIO',
        exercises: [
            { id: 'bicicleta', name: 'Bicicleta', sets: 1, targetReps: '60-120 min' }
        ]
    },
    viernes: {
        name: 'UPPER',
        exercises: [
            { id: 'press_inclinado_v2', name: 'Press inclinado', sets: 3, targetReps: '8-10' },
            { id: 'remo_t_v2', name: 'Remo T', sets: 3, targetReps: '8-10' },
            { id: 'jalon_v2', name: 'Jalón', sets: 3, targetReps: '10' },
            { id: 'elevaciones_v2', name: 'Elevaciones laterales', sets: 3, targetReps: '12' },
            { id: 'fondos_v2', name: 'Fondos', sets: 3, targetReps: '8-10' },
            { id: 'curl_biceps_v2', name: 'Curl bíceps', sets: 3, targetReps: '10' }
        ]
    },
    sábado: {
        name: 'LOWER',
        exercises: [
            { id: 'hack_squat', name: 'Hack squat', sets: 3, targetReps: '10' },
            { id: 'zancadas', name: 'Zancadas', sets: 3, targetReps: '10' },
            { id: 'femoral_v2', name: 'Femoral', sets: 3, targetReps: '10' },
            { id: 'extension_v2', name: 'Extensión', sets: 3, targetReps: '12' },
            { id: 'gemelos_v2', name: 'Gemelos', sets: 4, targetReps: '15' }
        ]
    }
};

// ==================== IA GEMINI ====================
const GEMINI_API_KEY = 'AIzaSyDvQGEoNv35-C5n-agaKC4we7deggdmHYg';

async function askGemini(question, userName, userHistory, userProfile) {
    try {
        const systemPrompt = `Eres un entrenador personal experto en fitness, nutrición y gym.
        Estás ayudando a ${userName}, un atleta con las siguientes características:
        - Peso: ${userProfile.weight || '?'} kg
        - Altura: ${userProfile.height || '?'} cm
        - Objetivo: ${userProfile.goal || 'mejorar condición física'}
        
        Responde de forma amigable, motivadora y práctica. Usa un tono profesional pero cercano.
        Sé conciso pero completo. Si preguntan sobre técnica, da consejos claros.
        Si preguntan sobre nutrición, recomienda alimentos específicos según su objetivo.
        Si preguntan sobre lesiones, recomienda precaución y consultar profesional.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nHistorial de conversación (últimos mensajes):\n${userHistory}\n\nUsuario: ${question}\n\nCoach:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('Error Gemini:', data.error);
            return "Lo siento, hubo un error. Por favor intenta de nuevo.";
        }
        
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('Error llamando a Gemini:', error);
        return "No pude conectarme. Verifica tu conexión a internet e intenta de nuevo.";
    }
}

function isOnline() {
    return navigator.onLine;
}

// ==================== CARGA Y GUARDADO ====================
function loadAllData() {
    const savedProfile = localStorage.getItem('gympro_profile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    } else {
        document.getElementById('registerModal').classList.add('active');
    }
    
    const savedRoutines = localStorage.getItem('gympro_routines');
    if (savedRoutines) {
        weeklyRoutines = JSON.parse(savedRoutines);
    } else {
        for (let day of weekDays) {
            if (defaultRoutines[day]) {
                weeklyRoutines[day].name = defaultRoutines[day].name;
                weeklyRoutines[day].exercises = defaultRoutines[day].exercises;
            }
        }
        saveRoutines();
    }
    
    const savedProgress = localStorage.getItem('gympro_progress');
    if (savedProgress) {
        exerciseProgress = JSON.parse(savedProgress);
    }
    
    const savedAttended = localStorage.getItem('gympro_attended');
    if (savedAttended) {
        attendedDays = JSON.parse(savedAttended);
    }
    
    updateUserDisplay();
}

function saveProfile() {
    localStorage.setItem('gympro_profile', JSON.stringify(userProfile));
}

function saveRoutines() {
    localStorage.setItem('gympro_routines', JSON.stringify(weeklyRoutines));
}

function saveProgress() {
    localStorage.setItem('gympro_progress', JSON.stringify(exerciseProgress));
    localStorage.setItem('gympro_attended', JSON.stringify(attendedDays));
}

function saveUserProfile() {
    const name = document.getElementById('regName').value.trim();
    const weight = parseFloat(document.getElementById('regWeight').value);
    const height = parseFloat(document.getElementById('regHeight').value);
    const goal = document.getElementById('regGoal').value;
    
    if (!name) {
        showToast('Por favor ingresa tu nombre', 1500);
        return;
    }
    
    userProfile.name = name;
    userProfile.weight = weight || 0;
    userProfile.height = height || 0;
    userProfile.goal = goal;
    
    saveProfile();
    updateUserDisplay();
    document.getElementById('registerModal').classList.remove('active');
    renderCurrentView();
    showToast(`Bienvenido ${userProfile.name}`, 2000);
}

function updateUserDisplay() {
    document.getElementById('userNameDisplay').innerHTML = userProfile.name || 'Atleta';
    document.getElementById('levelBadge').innerHTML = `Nv ${userProfile.level}`;
}

function addXP(amount) {
    userProfile.xp += amount;
    while (userProfile.xp >= userProfile.xpToNextLevel) {
        userProfile.xp -= userProfile.xpToNextLevel;
        userProfile.level++;
        userProfile.xpToNextLevel = Math.floor(userProfile.xpToNextLevel * 1.2);
        showToast(`Subiste al nivel ${userProfile.level}`, 2500);
    }
    updateUserDisplay();
    saveProfile();
}

function showToast(message, duration = 2000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ==================== RENDER DE VISTAS ====================
function renderCurrentView() {
    if (currentTab === 'home') renderHome();
    else if (currentTab === 'routines') renderRoutines();
    else if (currentTab === 'progress') renderProgress();
    else if (currentTab === 'coach') renderCoach();
    else if (currentTab === 'settings') renderSettings();
}

function renderHome() {
    const container = document.getElementById('app');
    const today = new Date();
    const dayIndex = today.getDay();
    const dayKey = weekDays[dayIndex === 0 ? 5 : dayIndex - 1];
    const routine = weeklyRoutines[dayKey];
    
    let imc = '';
    if (userProfile.weight > 0 && userProfile.height > 0) {
        const heightM = userProfile.height / 100;
        const imcValue = (userProfile.weight / (heightM * heightM)).toFixed(1);
        let category = '';
        if (imcValue < 18.5) category = 'Bajo peso';
        else if (imcValue < 25) category = 'Normal';
        else if (imcValue < 30) category = 'Sobrepeso';
        else category = 'Obesidad';
        imc = `<div class="hero-subtitle">IMC: ${imcValue} (${category})</div>`;
    }
    
    container.innerHTML = `
        <div class="hero-card">
            <div class="hero-day">${weekDaysSpanish[dayIndex === 0 ? 5 : dayIndex - 1].toUpperCase()}</div>
            <div class="hero-routine">${routine ? routine.name : 'DESCANSO'}</div>
            <div class="hero-subtitle">${routine ? routine.exercises.length + ' ejercicios' : 'Tómate un descanso activo'}</div>
            ${imc}
            <button class="btn-primary" style="margin-top:1rem;" onclick="startWorkout()">INICIAR ENTRENAMIENTO</button>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">Progreso semanal</span></div>
            <div class="card-content">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <span>Racha: ${userProfile.streak} días</span>
                    <span>Récord: ${userProfile.longestStreak}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(userProfile.xp / userProfile.xpToNextLevel * 100)}%"></div>
                </div>
                <div style="font-size:0.75rem; margin-top:0.5rem;">Nivel ${userProfile.level} • ${userProfile.xp}/${userProfile.xpToNextLevel} XP</div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="card"><div class="card-content"><div class="stat-value">${userProfile.totalWorkouts}</div><div style="font-size:0.75rem;">Entrenos</div></div></div>
            <div class="card"><div class="card-content"><div class="stat-value">${userProfile.totalSets}</div><div style="font-size:0.75rem;">Series</div></div></div>
            <div class="card"><div class="card-content"><div class="stat-value">${Math.round(userProfile.totalWeight)}</div><div style="font-size:0.75rem;">Kg totales</div></div></div>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">Tus datos</span></div>
            <div class="card-content">
                <div>Peso: ${userProfile.weight || '?'} kg</div>
                <div>Altura: ${userProfile.height || '?'} cm</div>
                <div>Objetivo: ${userProfile.goal || 'No definido'}</div>
            </div>
        </div>
    `;
}

function renderRoutines() {
    const container = document.getElementById('app');
    let html = '<div class="card"><div class="card-header"><span class="card-title">Mis rutinas</span></div><div class="card-content"><p style="margin-bottom:1rem;">Edita tus rutinas para cada día de la semana</p></div></div>';
    
    for (let i = 0; i < weekDays.length; i++) {
        const day = weekDays[i];
        const routine = weeklyRoutines[day];
        html += `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">${weekDaysSpanish[i]}</span>
                    <button class="edit-btn" onclick="openEditRoutine('${day}')">Editar</button>
                </div>
                <div class="card-content">
                    <div style="font-weight:600; margin-bottom:0.5rem;">${routine.name}</div>
                    ${routine.exercises.slice(0, 3).map(ex => `
                        <div class="exercise-item">
                            <span class="exercise-name">${ex.name}</span>
                            <span class="exercise-sets">${ex.sets} × ${ex.targetReps}</span>
                        </div>
                    `).join('')}
                    ${routine.exercises.length > 3 ? `<div style="font-size:0.75rem; opacity:0.6; margin-top:0.5rem;">+ ${routine.exercises.length - 3} ejercicios más</div>` : ''}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function renderProgress() {
    const container = document.getElementById('app');
    let html = '<div class="card"><div class="card-header"><span class="card-title">Progreso por ejercicio</span></div><div class="card-content">';
    
    let hasProgress = false;
    for (let day in weeklyRoutines) {
        weeklyRoutines[day].exercises.forEach(ex => {
            const prog = exerciseProgress[ex.id];
            if (prog?.history?.length) {
                hasProgress = true;
                const last = prog.history[prog.history.length - 1];
                html += `
                    <div style="margin:1rem 0; padding:1rem; background:var(--gray-700); border-radius:20px;">
                        <div style="font-weight:600;">${ex.name}</div>
                        <div>Último: ${last.weight}kg x ${last.reps} reps</div>
                        <div style="font-size:0.75rem;">Mejor: ${prog.bestWeight || 0}kg</div>
                    </div>
                `;
            }
        });
    }
    
    html += '</div></div>';
    container.innerHTML = hasProgress ? html : '<div class="card"><div class="card-content"><p>Completa entrenamientos para ver tu progreso</p></div></div>';
}

function renderCoach() {
    const container = document.getElementById('app');
    const chatHistory = localStorage.getItem('gympro_chat') || '[]';
    const messages = JSON.parse(chatHistory);
    
    let messagesHtml = '';
    messages.forEach(msg => {
        messagesHtml += `
            <div class="message ${msg.type}">
                ${msg.text}
            </div>
        `;
    });
    
    if (messages.length === 0) {
        messagesHtml = `<div class="message ai">Hola ${userProfile.name}! Soy tu entrenador. Pregúntame cualquier cosa sobre técnica, nutrición, motivación o planes de entrenamiento.</div>`;
    }
    
    container.innerHTML = `
        <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
                <span class="card-title">Coach IA</span>
                <span style="font-size: 0.7rem; opacity: 0.6;">${isOnline() ? 'Conectado' : 'Sin conexión'}</span>
            </div>
            <div class="chat-container" id="chatContainer">
                ${messagesHtml}
            </div>
            <div class="quick-questions">
                <button class="btn-secondary" onclick="askQuestion('¿Cómo mejorar técnica en press banca?')">Press banca</button>
                <button class="btn-secondary" onclick="askQuestion('Dame consejos para mi objetivo')">Mi objetivo</button>
                <button class="btn-secondary" onclick="askQuestion('Qué comer después de entrenar')">Post-entreno</button>
                <button class="btn-secondary" onclick="askQuestion('Motívame para entrenar')">Motivación</button>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput" placeholder="Pregúntame cualquier cosa...">
                <button class="send-btn" onclick="sendQuestion()">➤</button>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

async function sendQuestion() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question) return;
    
    input.value = '';
    
    const messages = JSON.parse(localStorage.getItem('gympro_chat') || '[]');
    messages.push({ type: 'user', text: question });
    localStorage.setItem('gympro_chat', JSON.stringify(messages));
    renderCoach();
    
    if (!isOnline()) {
        const offlineMsg = "Sin conexión a internet. Conéctate para recibir respuestas del entrenador.";
        messages.push({ type: 'ai', text: offlineMsg });
        localStorage.setItem('gympro_chat', JSON.stringify(messages));
        renderCoach();
        return;
    }
    
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai';
        typingIndicator.id = 'typingIndicator';
        typingIndicator.innerHTML = 'Escribiendo...';
        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    const recentHistory = messages.slice(-10).map(m => `${m.type === 'user' ? 'Usuario' : 'Coach'}: ${m.text}`).join('\n');
    const respuesta = await askGemini(question, userProfile.name, recentHistory, userProfile);
    
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
    
    messages.push({ type: 'ai', text: respuesta });
    localStorage.setItem('gympro_chat', JSON.stringify(messages));
    renderCoach();
}

function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendQuestion();
}

function renderSettings() {
    const container = document.getElementById('app');
    container.innerHTML = `
        <div class="card">
            <div class="card-header"><span class="card-title">Configuración</span></div>
            <div class="card-content">
                <div style="margin-bottom:1rem;">
                    <label style="font-size:0.875rem;">Nombre</label>
                    <input type="text" id="settingsName" value="${userProfile.name}" style="width:100%; padding:0.75rem; margin-top:0.25rem; border-radius:12px; border:none; background:var(--gray-700); color:var(--white);">
                </div>
                <div style="margin-bottom:1rem;">
                    <label style="font-size:0.875rem;">Peso (kg)</label>
                    <input type="number" id="settingsWeight" value="${userProfile.weight}" step="0.1" style="width:100%; padding:0.75rem; margin-top:0.25rem; border-radius:12px; border:none; background:var(--gray-700); color:var(--white);">
                </div>
                <div style="margin-bottom:1rem;">
                    <label style="font-size:0.875rem;">Altura (cm)</label>
                    <input type="number" id="settingsHeight" value="${userProfile.height}" style="width:100%; padding:0.75rem; margin-top:0.25rem; border-radius:12px; border:none; background:var(--gray-700); color:var(--white);">
                </div>
                <div style="margin-bottom:1rem;">
                    <label style="font-size:0.875rem;">Objetivo</label>
                    <select id="settingsGoal" style="width:100%; padding:0.75rem; margin-top:0.25rem; border-radius:12px; border:none; background:var(--gray-700); color:var(--white);">
                        <option value="Ganar masa muscular" ${userProfile.goal === 'Ganar masa muscular' ? 'selected' : ''}>Ganar masa muscular</option>
                        <option value="Perder grasa" ${userProfile.goal === 'Perder grasa' ? 'selected' : ''}>Perder grasa</option>
                        <option value="Mantener forma" ${userProfile.goal === 'Mantener forma' ? 'selected' : ''}>Mantener forma</option>
                        <option value="Aumentar fuerza" ${userProfile.goal === 'Aumentar fuerza' ? 'selected' : ''}>Aumentar fuerza</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="updateSettings()">Guardar cambios</button>
                <div style="margin-top:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.875rem;">Tema</span>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn-secondary" onclick="setTheme('dark')">Oscuro</button>
                            <button class="btn-secondary" onclick="setTheme('light')">Claro</button>
                        </div>
                    </div>
                </div>
                <button class="btn-secondary" style="margin-top:1rem; background:#ef4444; color:white;" onclick="resetAllData()">Reiniciar todos los datos</button>
            </div>
        </div>
    `;
}

function updateSettings() {
    userProfile.name = document.getElementById('settingsName').value.trim();
    userProfile.weight = parseFloat(document.getElementById('settingsWeight').value) || 0;
    userProfile.height = parseFloat(document.getElementById('settingsHeight').value) || 0;
    userProfile.goal = document.getElementById('settingsGoal').value;
    saveProfile();
    updateUserDisplay();
    showToast('Datos actualizados', 1500);
    renderCurrentView();
}

function setTheme(theme) {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('gympro_theme', theme);
}

function resetAllData() {
    if (confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.clear();
        location.reload();
    }
}

// ==================== EDITAR RUTINAS ====================
function openEditRoutine(day) {
    editingDay = day;
    const routine = weeklyRoutines[day];
    document.getElementById('editRoutineTitle').innerHTML = `Editar ${weekDaysSpanish[weekDays.indexOf(day)]}`;
    
    let exercisesHtml = '';
    routine.exercises.forEach((ex, idx) => {
        exercisesHtml += `
            <div style="margin-bottom:1rem; padding:0.5rem; background:var(--gray-700); border-radius:12px;">
                <input type="text" id="edit_ex_name_${idx}" value="${ex.name}" placeholder="Nombre del ejercicio" style="width:100%; margin-bottom:0.5rem;">
                <div style="display:flex; gap:0.5rem;">
                    <input type="number" id="edit_ex_sets_${idx}" value="${ex.sets}" placeholder="Series" style="flex:1;">
                    <input type="text" id="edit_ex_reps_${idx}" value="${ex.targetReps}" placeholder="Reps" style="flex:2;">
                    <button class="edit-btn" onclick="removeExerciseFromEdit(${idx})" style="background:#ef4444;">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('editExercisesList').innerHTML = exercisesHtml;
    document.getElementById('editRoutineModal').classList.add('active');
}

function addExerciseToEdit() {
    const container = document.getElementById('editExercisesList');
    const idx = weeklyRoutines[editingDay].exercises.length;
    const newExercise = `
        <div style="margin-bottom:1rem; padding:0.5rem; background:var(--gray-700); border-radius:12px;">
            <input type="text" id="edit_ex_name_${idx}" value="Nuevo ejercicio" placeholder="Nombre del ejercicio" style="width:100%; margin-bottom:0.5rem;">
            <div style="display:flex; gap:0.5rem;">
                <input type="number" id="edit_ex_sets_${idx}" value="3" placeholder="Series" style="flex:1;">
                <input type="text" id="edit_ex_reps_${idx}" value="10" placeholder="Reps" style="flex:2;">
                <button class="edit-btn" onclick="removeExerciseFromEdit(${idx})" style="background:#ef4444;">Eliminar</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', newExercise);
}

function removeExerciseFromEdit(idx) {
    const element = document.querySelector(`#edit_ex_name_${idx}`)?.closest('div');
    if (element) element.remove();
}

function saveEditedRoutine() {
    const newExercises = [];
    const container = document.getElementById('editExercisesList');
    const exerciseDivs = container.children;
    
    for (let i = 0; i < exerciseDivs.length; i++) {
        const nameInput = document.getElementById(`edit_ex_name_${i}`);
        const setsInput = document.getElementById(`edit_ex_sets_${i}`);
        const repsInput = document.getElementById(`edit_ex_reps_${i}`);
        
        if (nameInput && nameInput.value.trim()) {
            newExercises.push({
                id: `custom_${Date.now()}_${i}`,
                name: nameInput.value.trim(),
                sets: parseInt(setsInput?.value) || 3,
                targetReps: repsInput?.value || '10'
            });
        }
    }
    
    if (newExercises.length === 0) {
        showToast('Agrega al menos un ejercicio', 1500);
        return;
    }
    
    weeklyRoutines[editingDay].exercises = newExercises;
    saveRoutines();
    closeEditRoutineModal();
    renderCurrentView();
    showToast('Rutina guardada', 1500);
}

function closeEditRoutineModal() {
    document.getElementById('editRoutineModal').classList.remove('active');
}

// ==================== ENTRENAMIENTO ====================
function startWorkout() {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayKey = weekDays[dayIndex === 0 ? 5 : dayIndex - 1];
    const routine = weeklyRoutines[dayKey];
    
    if (!routine || routine.exercises.length === 0) {
        showToast('No hay rutina para hoy. Edita tus rutinas en la pestaña "Rutinas"', 2500);
        return;
    }
    
    const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    if (!attendedDays[dateStr]) {
        attendedDays[dateStr] = true;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
        userProfile.streak = attendedDays[yesterdayStr] ? userProfile.streak + 1 : 1;
        if (userProfile.streak > userProfile.longestStreak) userProfile.longestStreak = userProfile.streak;
        userProfile.totalWorkouts++;
        addXP(50);
        saveProfile();
        saveProgress();
    }
    
    currentWorkout = JSON.parse(JSON.stringify(routine));
    currentExerciseIndex = 0;
    currentSeriesStatus = {};
    currentWorkout.exercises.forEach((ex, idx) => {
        const progress = exerciseProgress[ex.id];
        currentSeriesStatus[idx] = { 
            completedSets: [], 
            currentSet: 1, 
            weight: progress?.lastWeight || 0, 
            reps: 0 
        };
    });
    
    document.getElementById('workoutTitle').innerHTML = currentWorkout.name;
    document.getElementById('workoutScreen').classList.add('active');
    renderCurrentExercise();
}

function renderCurrentExercise() {
    const ex = currentWorkout.exercises[currentExerciseIndex];
    const status = currentSeriesStatus[currentExerciseIndex];
    const totalSets = ex.sets;
    const completedCount = status.completedSets.length;
    
    let seriesHtml = '';
    for (let i = 1; i <= totalSets; i++) {
        let style = 'background:var(--gray-700);';
        if (status.completedSets.includes(i)) {
            style = 'background:#34c759;';
        } else if (status.currentSet === i) {
            style = 'background:var(--yellow-primary); color:#000; font-weight:bold;';
        }
        seriesHtml += `<button class="series-btn" style="${style} margin:0.25rem; padding:0.75rem 1.25rem; border-radius:40px; border:none; color:${status.currentSet === i ? '#000' : 'var(--white)'};" onclick="selectSeries(${i})">Serie ${i}</button>`;
    }
    
    const html = `
        <div style="background:var(--gray-800); border-radius:32px; padding:2rem; text-align:center;">
            <div style="font-size:2rem; font-weight:800; background:linear-gradient(135deg, var(--purple-primary), var(--yellow-primary)); -webkit-background-clip:text; background-clip:text; color:transparent;">${ex.name}</div>
            <div style="margin:1rem 0;">Objetivo: ${totalSets} × ${ex.targetReps}</div>
            <div style="display:flex; gap:1rem; justify-content:center; margin:1.5rem 0;">
                <input type="number" id="currentWeight" placeholder="Peso (kg)" value="${status.weight || ''}" step="2.5" class="weight-input">
                <input type="number" id="currentReps" placeholder="Reps" value="${status.reps || ''}" class="reps-input">
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; margin:1.5rem 0;">
                ${seriesHtml}
            </div>
            <button class="btn-primary" onclick="completeCurrentSet()">${status.currentSet <= totalSets && !status.completedSets.includes(status.currentSet) ? 'COMPLETAR SERIE' : 'SIGUIENTE EJERCICIO'}</button>
            <button class="btn-secondary" style="margin-top:1rem;" onclick="showToast('Respira bien, controla la técnica, no sacrifiques forma por peso')">Consejo rápido</button>
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
            if (!exerciseProgress[ex.id]) exerciseProgress[ex.id] = { history: [], lastWeight: 0, bestWeight: 0 };
            const progress = exerciseProgress[ex.id];
            const isPR = weight > (progress.bestWeight || 0);
            progress.history.push({ date: new Date().toISOString(), weight, reps });
            progress.lastWeight = weight;
            if (isPR) progress.bestWeight = weight;
            userProfile.totalSets++;
            userProfile.totalWeight += weight;
            addXP(isPR ? 25 : 10);
            if (isPR) showToast(`Récord! ${weight} kg`, 1500);
            saveProfile();
            saveProgress();
        }
        
        status.completedSets.push(status.currentSet);
        status.completedSets.sort();
        showToast(`Serie ${status.currentSet} completada`, 800);
        
        let nextSet = status.currentSet + 1;
        while (nextSet <= totalSets && status.completedSets.includes(nextSet)) nextSet++;
        if (nextSet <= totalSets) status.currentSet = nextSet;
        else status.currentSet = totalSets + 1;
        
        renderCurrentExercise();
    } 
    else if (status.completedSets.length === totalSets) {
        if (currentExerciseIndex + 1 < currentWorkout.exercises.length) {
            showToast(`Siguiente: ${currentWorkout.exercises[currentExerciseIndex + 1].name}`, 1200);
            currentExerciseIndex++;
            renderCurrentExercise();
        } else {
            closeWorkout();
            showToast(`Felicidades ${userProfile.name}! Día completado`, 3000);
            addXP(100);
        }
    }
}

function closeWorkout() {
    currentWorkout = null;
    document.getElementById('workoutScreen').classList.remove('active');
    renderCurrentView();
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
}

init();