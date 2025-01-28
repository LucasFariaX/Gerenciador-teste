// Referências dos links e seções
const links = {
    dashboard: document.getElementById('dashboard-link'),
    timeManagement: document.getElementById('time-management-link'),
    routine: document.getElementById('routine-link'),
    financial: document.getElementById('financial-link'), // Vírgula aqui
    calendar: document.getElementById('calendar-link') // Nova aba do calendário
};

const sections = {
    dashboard: document.getElementById('dashboard'),
    timeManagement: document.getElementById('time-management'),
    routine: document.getElementById('routine'),
    financial: document.getElementById('financial'), // Vírgula aqui
    calendar: document.getElementById('calendar') // Nova seção do calendário
};


// Variáveis do calendário
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Referências específicas do calendário
const calendarGrid = document.getElementById('calendar-grid');
const calendarHeader = document.getElementById('current-month');
const miniCalendar = document.getElementById('mini-calendar');

function renderCalendar(month, year) {
    calendarGrid.innerHTML = ''; // Limpa o calendário
    const firstDay = new Date(year, month, 1).getDay(); // Primeiro dia do mês
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total de dias no mês

    // Preenchendo os dias do mês
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayCell.classList.add('calendar-day');

        // Adiciona evento para mostrar detalhes do dia
        dayCell.addEventListener('click', () => showDayDetails(dayCell.dataset.date));
        calendarGrid.appendChild(dayCell);
    }

    // Atualiza o cabeçalho do calendário
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    calendarHeader.textContent = `${monthNames[month]} ${year}`;
}


document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
    renderMiniCalendar(); // Atualiza o mini calendário
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
    renderMiniCalendar(); // Atualiza o mini calendário
});


function showDayDetails(date) {
    const calendarDetails = document.getElementById('calendar-details');
    const routineDetails = document.getElementById('routine-details');
    const taskDetails = document.getElementById('task-details');

    calendarDetails.classList.remove('hidden');

    // Filtra rotinas e tarefas pelo dia selecionado
    const routinesForDay = routines.filter(routine => routine.date === date);
    const tasksForDay = tasks.filter(task => task.due_date === date);

    // Atualiza rotinas
    routineDetails.innerHTML = routinesForDay.length
        ? routinesForDay.map(routine => `<li>${routine.name} (${routine.type})</li>`).join('')
        : '<li>Sem rotinas cadastradas.</li>';

    // Atualiza tarefas
    taskDetails.innerHTML = tasksForDay.length
        ? tasksForDay.map(task => `<li>${task.title} - ${formatTime(task.timer)}</li>`).join('')
        : '<li>Sem tarefas cadastradas.</li>';
}


function renderMiniCalendar() {
    miniCalendar.innerHTML = ''; // Limpa o mini calendário existente
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.textContent = day;
        dayDiv.classList.add('mini-calendar-day');

        // Adiciona destaque para dias com dados
        const hasData = tasks.some(task => task.due_date === date) || routines.some(routine => routine.date === date);
        if (hasData) {
            dayDiv.classList.add('has-data'); // Classe para destacar os dias com dados
        }

        miniCalendar.appendChild(dayDiv);
    }
}



function updateCalendars() {
    renderCalendar(currentMonth, currentYear);
    updateMiniCalendar();
}



// Função para alternar entre seções
function showSection(sectionToShow) {
    Object.values(sections).forEach(section => section.classList.add('hidden')); // Esconde todas as seções
    sections[sectionToShow].classList.remove('hidden'); // Exibe a seção desejada
}


// Adicionando eventos de clique para navegação
links.dashboard.addEventListener('click', () => showSection('dashboard'));
links.timeManagement.addEventListener('click', () => showSection('timeManagement'));
links.routine.addEventListener('click', () => showSection('routine'));
links.financial.addEventListener('click', () => showSection('financial'));
links.calendar.addEventListener('click', () => showSection('calendar'));



// Função para carregar os cards no Dashboard dinamicamente
function loadDashboardCards() {
    const dashboardSection = sections.dashboard;

    // Define os dados dos cards principais
    const cardsData = [
        { id: 'time-management', title: 'Gerenciamento de Tempo', description: 'Resumo das tarefas e atividades programadas.' },
        { id: 'routine', title: 'Rotina', description: 'Resumo das metas e hábitos diários.' },
        { id: 'financial', title: 'Financeiro', description: 'Resumo das finanças e despesas atuais.' }
    ];

    // Limpa o conteúdo do Dashboard
    dashboardSection.innerHTML = '<h1>Dashboard</h1>';

    // Adiciona os cards principais
    cardsData.forEach(card => {
        const cardElement = createCard(card.title, card.description, `summary-${card.id}`);
        dashboardSection.appendChild(cardElement);
    });

    // Adiciona o mini calendário como um card no Dashboard
    const calendarCard = createCard('Calendário', '', 'mini-calendar');
    dashboardSection.appendChild(calendarCard);

    // Renderiza os resumos e o mini calendário
    updateDashboardTasks(); // Atualiza o resumo de tarefas
    updateDashboardFinanceSummary(); // Atualiza o resumo financeiro
    updateDashboardRoutineSummary(); // Atualiza o resumo de rotinas
    renderMiniCalendar(); // Renderiza o mini calendário
}


// Função para criar um card dinâmico
function createCard(title, description, contentId) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
        <h2>${title}</h2>
        ${description ? `<p>${description}</p>` : ''}
        <div class="card-content" id="${contentId}"></div>
    `;
    return cardElement;
}

// Função para renderizar o mini calendário
function renderMiniCalendar() {
    const miniCalendar = document.getElementById('mini-calendar');
    if (!miniCalendar) return;

    miniCalendar.innerHTML = ''; // Limpa o conteúdo do mini calendário
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day');

        // Adiciona destaque para dias com tarefas ou rotinas
        const hasData = tasks.some(task => task.due_date === date) || routines.some(routine => routine.date === date);
        if (hasData) {
            dayDiv.classList.add('has-data');
        }

        // Adiciona evento de clique para mostrar o resumo do dia
        dayDiv.addEventListener('click', () => showDaySummary(date));
        miniCalendar.appendChild(dayDiv);
    }
}

// Função para exibir o resumo de tarefas e rotinas de um dia
function showDaySummary(date) {
    const summaryContainer = document.getElementById('calendar-details');
    const routineDetails = document.getElementById('routine-details');
    const taskDetails = document.getElementById('task-details');

    if (!summaryContainer || !routineDetails || !taskDetails) return;

    summaryContainer.classList.remove('hidden');

    // Filtra as rotinas e tarefas pelo dia selecionado
    const routinesForDay = routines.filter(routine => routine.date === date);
    const tasksForDay = tasks.filter(task => task.due_date === date);

    // Atualiza os detalhes das rotinas
    routineDetails.innerHTML = routinesForDay.length
        ? routinesForDay.map(routine => `<li>${routine.name} (${routine.type})</li>`).join('')
        : '<li>Sem rotinas cadastradas.</li>';

    // Atualiza os detalhes das tarefas
    taskDetails.innerHTML = tasksForDay.length
        ? tasksForDay.map(task => `<li>${task.title} - Progresso: ${calculateProgress(task).toFixed(2)}%</li>`).join('')
        : '<li>Sem tarefas cadastradas.</li>';
}

function showDaySummary(date) {
    const calendarDetails = document.getElementById('calendar-details');
    const routineDetails = document.getElementById('routine-details');
    const taskDetails = document.getElementById('task-details');

    if (!calendarDetails || !routineDetails || !taskDetails) return;

    // Mostra o contêiner de detalhes
    calendarDetails.classList.remove('hidden');

    // Filtra rotinas e tarefas pelo dia selecionado
    const routinesForDay = routines.filter(routine => routine.date === date);
    const tasksForDay = tasks.filter(task => task.due_date === date);

    // Atualiza os detalhes das rotinas
    routineDetails.innerHTML = routinesForDay.length
        ? routinesForDay.map(routine => `<li>${routine.name} (${routine.type})</li>`).join('')
        : '<li>Sem rotinas cadastradas.</li>';

    // Atualiza os detalhes das tarefas
    taskDetails.innerHTML = tasksForDay.length
        ? tasksForDay.map(task => `<li>${task.title} - Progresso: ${calculateProgress(task).toFixed(2)}%</li>`).join('')
        : '<li>Sem tarefas cadastradas.</li>';
}



// Função para atualizar o resumo financeiro no Dashboard
function updateDashboardFinanceSummary() {
    const financialSummaryDiv = document.getElementById('summary-financial');
    if (!financialSummaryDiv) return;

    const totalGains = financialData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = financialData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
    const balance = totalGains - totalExpenses;

    financialSummaryDiv.innerHTML = `
        <p><strong>Total de Ganhos:</strong> R$ ${totalGains.toFixed(2)}</p>
        <p><strong>Total de Gastos:</strong> R$ ${totalExpenses.toFixed(2)}</p>
        <p><strong>Saldo:</strong> R$ ${balance.toFixed(2)}</p>
    `;
}

// Atualiza o Dashboard sempre que houver mudanças nos dados financeiros
document.addEventListener('DOMContentLoaded', () => {
    renderMiniCalendar(); // Renderiza o mini calendário ao carregar a página
    renderCalendar(currentMonth, currentYear); // Renderiza o calendário principal
    updateMiniCalendar(); // Atualiza o mini calendário no Dashboard
    renderTasks(); // Atualiza a lista de tarefas
    renderRecords(); // Atualiza os registros financeiros
    renderRoutines(); // Atualiza a lista de rotinas
    updateDashboardTasks(); // Resumo de tarefas no Dashboard
    loadDashboardCards(); // Carrega os cards do Dashboard
});


// Função para atualizar o resumo de rotinas no Dashboard
function updateDashboardRoutineSummary() {
    const routineSummaryDiv = document.getElementById('summary-routine');
    if (!routineSummaryDiv) return;

    if (routines.length === 0) {
        routineSummaryDiv.innerHTML = '<p>Sem rotinas cadastradas.</p>';
        return;
    }

    // Conta rotinas por tipo
    const routineCounts = routines.reduce((summary, routine) => {
        summary[routine.type] = (summary[routine.type] || 0) + 1;
        return summary;
    }, {});

    // Exibe o resumo no card
    routineSummaryDiv.innerHTML = '<p><strong>Resumo:</strong></p>';
    for (const [type, count] of Object.entries(routineCounts)) {
        routineSummaryDiv.innerHTML += `<p>${type}: ${count} ${count > 1 ? 'rotinas' : 'rotina'}</p>`;
    }
}

// Inicializa a página e o Dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderTasks(); // Atualiza tarefas
    renderRecords(); // Atualiza registros financeiros
    renderRoutines(); // Atualiza rotinas
    loadDashboardCards(); // Atualiza o Dashboard
});

// Função para adicionar o resumo das tarefas no card do Dashboard
function updateDashboardTasks() {
    const taskSummaryDiv = document.getElementById('summary-time-management');
    if (!taskSummaryDiv) return;

    taskSummaryDiv.innerHTML = ''; // Limpa o conteúdo anterior

    if (tasks.length === 0) {
        taskSummaryDiv.innerHTML = '<p>Sem tarefas cadastradas.</p>';
        return;
    }

    tasks.slice(0, 3).forEach(task => {
        const taskSummary = document.createElement('div');
        taskSummary.classList.add('task-summary');
        taskSummary.innerHTML = `
            <p><strong>${task.title}</strong>: ${task.description.substring(0, 50)}...</p>
            <p>Progresso: ${calculateProgress(task).toFixed(2)}%</p>
        `;
        taskSummaryDiv.appendChild(taskSummary);
    });

    if (tasks.length > 3) {
        taskSummaryDiv.innerHTML += `<p>...e mais ${tasks.length - 3} tarefas.</p>`;
    }
}

// Atualiza o Dashboard sempre que uma tarefa for alterada
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    loadDashboardCards();
});


// Chama a função para carregar os cards ao clicar no Dashboard
links.dashboard.addEventListener('click', loadDashboardCards);

// Carregar o Dashboard automaticamente ao iniciar
window.onload = () => {
    showSection('dashboard');
    loadDashboardCards();
};

// Array de tarefas (carregado do localStorage ou inicializado vazio)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Salva as tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderiza todas as tarefas na interface
function renderTasks() {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = ''; // Limpa o conteúdo existente
    let totalTimeSpent = 0; // Tempo total gasto

    tasks.forEach((task, index) => {
        totalTimeSpent += task.timer;

        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-card';
        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Data Limite: ${task.due_date}</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill-${index}" style="width: ${calculateProgress(task)}%;"></div>
            </div>
            <p class="progress-text" id="progress-text-${index}">${calculateProgress(task).toFixed(2)}% concluído</p>
            <div class="task-buttons">
                <button onclick="startTaskTimer(${index})">Iniciar</button>
                <button onclick="pauseTaskTimer(${index})">Pausar</button>
                <button onclick="resetTaskTimer(${index})">Redefinir</button>
                <button onclick="deleteTask(${index})">Excluir</button>
                <button onclick="editTask(${index})">Editar</button>
            </div>
        `;
        tasksDiv.appendChild(taskDiv);
    });

    // Atualiza o tempo total gasto
    document.getElementById('total-time').textContent = `Tempo Total Gasto: ${formatTime(totalTimeSpent)}`;
}

// Calcula o progresso de uma tarefa
function calculateProgress(task) {
    return task.goal > 0 ? (task.timer / (task.goal * 3600)) * 100 : 0;
}

// Adiciona uma nova tarefa
function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('due_date').value;
    const goal = parseFloat(document.getElementById('goal').value) || 0;

    const dueDateObj = new Date(due_date);
    const now = new Date();
    if (dueDateObj < now) {
        alert('A data limite não pode ser no passado!');
        return;
    }

    tasks.push({ title, description, due_date, timer: 0, interval: null, goal });
    saveTasks();
    document.getElementById('task-form').reset();
    showFeedback('Tarefa adicionada com sucesso!');
    renderTasks();
}

// Inicia o cronômetro de uma tarefa
function startTaskTimer(index) {
    if (!tasks[index].interval) {
        tasks[index].interval = setInterval(() => {
            tasks[index].timer++;
            document.getElementById(`progress-fill-${index}`).style.width = `${calculateProgress(tasks[index])}%`;
            document.getElementById(`progress-text-${index}`).innerText = `${calculateProgress(tasks[index]).toFixed(2)}% concluído`;
            saveTasks();
        }, 1000);
    }
}

// Pausa o cronômetro de uma tarefa
function pauseTaskTimer(index) {
    clearInterval(tasks[index].interval);
    tasks[index].interval = null;
    saveTasks();
}

// Redefine o cronômetro de uma tarefa
function resetTaskTimer(index) {
    pauseTaskTimer(index);
    tasks[index].timer = 0;
    document.getElementById(`progress-fill-${index}`).style.width = '0%';
    document.getElementById(`progress-text-${index}`).innerText = '0% concluído';
    saveTasks();
}

// Exclui uma tarefa
function deleteTask(index) {
    clearInterval(tasks[index].interval);
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Edita uma tarefa
function editTask(index) {
    const task = tasks[index];
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due_date').value = task.due_date;
    document.getElementById('goal').value = task.goal;
    pauseTaskTimer(index);
    deleteTask(index);
}

// Formata o tempo em horas:minutos:segundos
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Exibe uma mensagem de feedback ao usuário
function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.padding = '10px 20px';
    feedback.style.backgroundColor = '#76c7c0';
    feedback.style.color = '#1c1c1c';
    feedback.style.borderRadius = '5px';
    feedback.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Inicializa o sistema ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('task-form')?.addEventListener('submit', addTask);
    renderTasks();
});




// Referência ao botão e à sidebar
const toggleSidebarButton = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

// Evento de clique para alternar a classe 'collapsed'
toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});



// Dados financeiros iniciais
let financialData = JSON.parse(localStorage.getItem('financialData')) || [
    { description: 'Salário', category: 'Renda', amount: 5000, date: '2025-01-10' },
    { description: 'Mercado', category: 'Alimentação', amount: -3000, date: '2025-01-12' },
    { description: 'Transporte', category: 'Transporte', amount: -500, date: '2025-01-15' },
];

// Limite inicial de gastos
let spendingLimit = JSON.parse(localStorage.getItem('spendingLimit')) || 5000;

// Atualiza o resumo financeiro
function updateSummary() {
    const totalGains = financialData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = financialData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);
    const balance = totalGains - totalExpenses;

    document.getElementById('total-gains').textContent = `R$ ${totalGains.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `R$ ${totalExpenses.toFixed(2)}`;
    document.getElementById('balance').textContent = `R$ ${balance.toFixed(2)}`;
    showFeedback('Resumo financeiro atualizado com sucesso!');
}

// Renderiza os registros financeiros
function renderRecords() {
    const recordsTable = document.getElementById('records');
    recordsTable.innerHTML = '';
    financialData.forEach((record, index) => {
        const formattedDate = new Date(record.date).toLocaleDateString('pt-BR');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.description}</td>
            <td>${record.category}</td>
            <td>${record.amount > 0 ? `R$ ${record.amount.toFixed(2)}` : `-R$ ${Math.abs(record.amount).toFixed(2)}`}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="edit-btn" onclick="editRecord(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteRecord(${index})">Excluir</button>
            </td>
        `;
        recordsTable.appendChild(row);
    });
}

function editRecord(index) {
    const record = financialData[index];
    document.getElementById('description').value = record.description;
    document.getElementById('category').value = record.category;
    document.getElementById('amount').value = record.amount;
    document.getElementById('date').value = record.date;

    // Remove o registro atual após clicar em "Editar"
    financialData.splice(index, 1);
    localStorage.setItem('financialData', JSON.stringify(financialData));
    updateSummary();
    renderRecords();
    updateChart();
    updateSpendingProgressBar();
    showFeedback('Edite o registro e clique em "Adicionar Registro" para salvar as alterações.');
}


function deleteRecord(index) {
    financialData.splice(index, 1); // Remove o registro pelo índice
    localStorage.setItem('financialData', JSON.stringify(financialData)); // Atualiza o armazenamento local
    updateSummary(); // Atualiza o resumo financeiro
    renderRecords(); // Re-renderiza a tabela
    updateChart(); // Atualiza o gráfico
    updateSpendingProgressBar(); // Atualiza a barra de progresso
    showFeedback('Registro excluído com sucesso!');
}



// Atualiza o gráfico financeiro
function updateChart() {
    const ctx = document.getElementById('financial-chart').getContext('2d');
    const totalGains = financialData.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = financialData.filter(d => d.amount < 0).reduce((sum, d) => sum + Math.abs(d.amount), 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ganhos', 'Gastos'],
            datasets: [
                {
                    label: 'Totais Mensais',
                    data: [totalGains, totalExpenses],
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
    showFeedback('Gráfico de ganhos e gastos atualizado com sucesso!');
}

// Atualiza a barra de progresso de gastos
function updateSpendingProgressBar() {
    const totalExpenses = financialData
        .filter(d => d.amount < 0)
        .reduce((sum, d) => sum + Math.abs(d.amount), 0);

    // Calcula a porcentagem de gastos em relação ao limite
    const percentage = (totalExpenses / spendingLimit) * 100;
    const normalizedPercentage = Math.min(Math.max(percentage, 0), 100); // Limita entre 0 e 100

    // Atualiza a barra de progresso
    const progressBar = document.getElementById('spending-progress');
    const progressPercentage = document.getElementById('progress-percentage');
    progressBar.style.width = `${normalizedPercentage}%`;

    // Define a cor da barra
    if (normalizedPercentage <= 50) {
        progressBar.style.backgroundColor = '#76c7c0'; // Verde
    } else if (normalizedPercentage <= 80) {
        progressBar.style.backgroundColor = '#f39c12'; // Amarelo
    } else {
        progressBar.style.backgroundColor = '#e74c3c'; // Vermelho
    }

    // Atualiza o texto de porcentagem
    progressPercentage.textContent = `${Math.round(normalizedPercentage)}%`;
    showFeedback('Barra de progresso de gastos atualizada com sucesso!');
}


// Adiciona um novo registro financeiro
document.getElementById('financial-form').addEventListener('submit', e => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    financialData.push({ description, category, amount, date });
    localStorage.setItem('financialData', JSON.stringify(financialData));

    document.getElementById('financial-form').reset();
    updateSummary();
    renderRecords();
    updateChart();
    updateSpendingProgressBar();
});

// Atualiza o limite de gastos
function updateSpendingLimit() {
    const limitInput = document.getElementById('spending-limit').value;

    if (!limitInput || limitInput <= 0) {
        showFeedback('Por favor, insira um limite válido.');
        return;
    }

    spendingLimit = parseFloat(limitInput);
    localStorage.setItem('spendingLimit', JSON.stringify(spendingLimit));
    showFeedback(`Limite de gastos atualizado para R$ ${spendingLimit.toFixed(2)}.`);
    updateSpendingProgressBar();
}

// Redefine o limite de gastos para o padrão
function resetSpendingLimit() {
    spendingLimit = 5000; // Valor padrão
    localStorage.setItem('spendingLimit', JSON.stringify(spendingLimit));
    showFeedback('Limite de gastos redefinido para R$ 5000,00.');
    updateSpendingProgressBar();
}

// Listener para o botão de atualizar limite
document.getElementById('update-limit').addEventListener('click', updateSpendingLimit);

// Listener para o botão de redefinir limite
document.getElementById('reset-limit').addEventListener('click', resetSpendingLimit);

// Exibe mensagens de feedback
function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.padding = '10px 20px';
    feedback.style.backgroundColor = '#76c7c0';
    feedback.style.color = '#1c1c1c';
    feedback.style.borderRadius = '5px';
    feedback.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
    renderRecords();
    updateChart();
    updateSpendingProgressBar();
});




// Dados das rotinas
let routines = JSON.parse(localStorage.getItem('routines')) || [];

// Atualiza a exibição das rotinas
function renderRoutines() {
    const routineItems = document.getElementById('routine-items');
    routineItems.innerHTML = '';

    if (routines.length === 0) {
        routineItems.innerHTML = '<li>Nenhuma rotina cadastrada.</li>';
        return;
    }

    routines.forEach((routine, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p><strong>${routine.name}</strong> (${routine.type})</p>
            <span>${routine.frequency} às ${routine.time}</span>
            <button onclick="deleteRoutine(${index})">Excluir</button>
        `;
        routineItems.appendChild(listItem);
    });
}

// Adiciona uma nova rotina
document.getElementById('routine-form').addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('routine-name').value;
    const type = document.getElementById('routine-type').value;
    const frequency = document.getElementById('routine-frequency').value;
    const time = document.getElementById('routine-time').value;

    routines.push({ name, type, frequency, time });
    localStorage.setItem('routines', JSON.stringify(routines));

    document.getElementById('routine-form').reset();
    renderRoutines();
    updateRoutineChart();
});

// Exclui uma rotina
function deleteRoutine(index) {
    routines.splice(index, 1);
    localStorage.setItem('routines', JSON.stringify(routines));
    renderRoutines();
    updateRoutineChart();
}

// Atualiza o gráfico de rotinas
function updateRoutineChart() {
    const ctx = document.getElementById('routine-chart').getContext('2d');

    const typeCounts = routines.reduce((counts, routine) => {
        counts[routine.type] = (counts[routine.type] || 0) + 1;
        return counts;
    }, {});

    const chartData = {
        labels: Object.keys(typeCounts),
        datasets: [
            {
                label: 'Rotinas por Tipo',
                data: Object.values(typeCounts),
                backgroundColor: ['#76c7c0', '#f39c12', '#e74c3c', '#8e44ad'],
            },
        ],
    };

    new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    renderRoutines();
    updateRoutineChart();
});







// Carrega o cliente da API ao carregar a página
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Atualiza o status de login do usuário
function updateSigninStatus(isSignedIn) {
    const eventsContainer = document.getElementById('google-events');
    if (isSignedIn) {
        eventsContainer.textContent = 'Carregando eventos...';
        listUpcomingEvents(); // Lista eventos se estiver autenticado
    } else {
        eventsContainer.textContent = 'Faça login para ver seus eventos do Google Calendar.';
    }
}

// Realiza login no Google
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Realiza logout do Google
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

// Lista os próximos eventos do Google Calendar
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
    }).then(response => {
        const events = response.result.items;
        const eventsContainer = document.getElementById('google-events');
        eventsContainer.innerHTML = ''; // Limpa o conteúdo anterior

        if (events.length > 0) {
            events.forEach(event => {
                const eventElement = document.createElement('div');
                const eventTime = event.start.dateTime || event.start.date;
                eventElement.textContent = `${event.summary} - ${eventTime}`;
                eventElement.className = 'event-item';
                eventsContainer.appendChild(eventElement);
            });
        } else {
            eventsContainer.textContent = 'Nenhum evento encontrado.';
        }
    }, error => {
        console.error('Erro ao listar eventos:', error);
        document.getElementById('google-events').textContent = 'Erro ao carregar eventos.';
    });
}

// Adiciona um evento ao Google Calendar
function addEventToCalendar(event) {
    gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
    }).then(response => {
        console.log('Evento adicionado com sucesso:', response);
        alert('Evento adicionado com sucesso!');
        listUpcomingEvents(); // Atualiza a lista de eventos
    }, error => {
        console.error('Erro ao adicionar evento:', error);
        alert('Erro ao adicionar evento.');
    });
}

// Exemplo de uso: adicionando um evento manualmente
document.getElementById('calendar-link').addEventListener('click', () => {
    const newEvent = {
        summary: 'Exemplo de Evento',
        location: 'Online',
        description: 'Evento criado para teste de integração.',
        start: {
            dateTime: '2025-02-01T10:00:00-03:00',
            timeZone: 'America/Sao_Paulo'
        },
        end: {
            dateTime: '2025-02-01T11:00:00-03:00',
            timeZone: 'America/Sao_Paulo'
        }
    };
    addEventToCalendar(newEvent);
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("google-login-button");
    const loginCard = document.getElementById("google-login-card");

    // Cria o overlay para fechar o card ao clicar fora
    const overlay = document.createElement("div");
    overlay.id = "google-overlay";
    document.body.appendChild(overlay);

    // Função para exibir o card de login e overlay
    loginButton.addEventListener("click", () => {
        loginCard.style.display = "block";
        overlay.style.display = "block";
    });

    // Função para fechar o card de login ao clicar fora
    overlay.addEventListener("click", () => {
        loginCard.style.display = "none";
        overlay.style.display = "none";
    });

    // Função para o botão "Logar com Google"
    const googleLoginButton = document.getElementById("google-login");
    googleLoginButton.addEventListener("click", () => {
        window.open(
            "https://accounts.google.com/o/oauth2/auth",
            "Login com Google",
            "width=500,height=600,left=200,top=100"
        );
    });
});

// Configurações da API do Google Calendar
const CLIENT_ID = '1021694586430-jhd2ans80cnmqdinf9gqv36i3t5bhbvq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC7j8JGpLqmewY4SSd9rVYAZCbdVBuv3WQ';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

// Manipulação do Card Flutuante
function toggleGoogleLoginCard(show) {
    const loginCard = document.getElementById('google-login-card');
    const overlay = document.getElementById('google-overlay');
    if (loginCard && overlay) {
        loginCard.style.display = show ? 'block' : 'none';
        overlay.style.display = show ? 'block' : 'none';
    } else {
        console.error('Elementos "google-login-card" ou "google-overlay" não encontrados.');
    }
}

// Atualiza o status de login
function updateSigninStatus(isSignedIn) {
    const loginButton = document.getElementById('google-login');
    const logoutButton = document.getElementById('google-logout');
    const eventsContainer = document.getElementById('google-events');

    if (!loginButton || !logoutButton || !eventsContainer) {
        console.error('Um ou mais elementos necessários não foram encontrados.');
        return;
    }

    if (isSignedIn) {
        toggleGoogleLoginCard(false);
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        eventsContainer.textContent = 'Carregando eventos...';
        listUpcomingEvents();
    } else {
        toggleGoogleLoginCard(true);
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        eventsContainer.textContent = 'Faça login para ver seus eventos do Google Calendar.';
    }
}

// Inicializa o cliente da API do Google
function initGoogleCalendar() {
    gapi.load('client:auth2', () => {
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                const isSignedIn = authInstance.isSignedIn.get();

                updateSigninStatus(isSignedIn);

                document.getElementById('google-login').addEventListener('click', () => {
                    authInstance.signIn();
                });

                document.getElementById('google-logout').addEventListener('click', () => {
                    authInstance.signOut();
                });

                authInstance.isSignedIn.listen(updateSigninStatus);
            })
            .catch((error) => {
                console.error('Erro ao inicializar o cliente da API do Google:', error);
            });
    });
}

// Lista os próximos eventos do Google Calendar
function listUpcomingEvents() {
    gapi.client.calendar.events
        .list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime',
        })
        .then((response) => {
            const events = response.result.items;
            const eventsContainer = document.getElementById('google-events');

            eventsContainer.innerHTML = '';

            if (events.length > 0) {
                events.forEach((event) => {
                    const eventElement = document.createElement('div');
                    eventElement.textContent = `${event.summary} - ${
                        event.start.dateTime || event.start.date
                    }`;
                    eventElement.className = 'event-item';
                    eventsContainer.appendChild(eventElement);
                });
            } else {
                eventsContainer.textContent = 'Nenhum evento encontrado.';
            }
        })
        .catch((error) => {
            console.error('Erro ao listar eventos:', error);
            const eventsContainer = document.getElementById('google-events');
            if (eventsContainer) {
                eventsContainer.textContent = 'Erro ao carregar eventos.';
            }
        });
}

// Adiciona um evento ao Google Calendar
function addEventToCalendar(event) {
    gapi.client.calendar.events
        .insert({
            calendarId: 'primary',
            resource: event,
        })
        .then(() => {
            alert('Evento adicionado com sucesso!');
            listUpcomingEvents();
        })
        .catch((error) => {
            console.error('Erro ao adicionar evento:', error);
            alert('Erro ao adicionar evento.');
        });
}

// Exemplo de uso: adicionando um evento manualmente
document.getElementById('calendar-link').addEventListener('click', () => {
    const newEvent = {
        summary: 'Exemplo de Evento',
        location: 'Online',
        description: 'Evento criado para teste de integração.',
        start: {
            dateTime: '2025-02-01T10:00:00-03:00',
            timeZone: 'America/Sao_Paulo',
        },
        end: {
            dateTime: '2025-02-01T11:00:00-03:00',
            timeZone: 'America/Sao_Paulo',
        },
    };
    addEventToCalendar(newEvent);
});

// Carrega o cliente da API ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initGoogleCalendar;
    document.body.appendChild(script);

    // Adiciona o overlay para fechar o card de login
    const overlay = document.createElement('div');
    overlay.id = 'google-overlay';
    document.body.appendChild(overlay);

    const loginButton = document.getElementById('google-login-button');
    const loginCard = document.getElementById('google-login-card');

    if (loginButton && loginCard) {
        loginButton.addEventListener('click', () => {
            toggleGoogleLoginCard(true);
        });

        overlay.addEventListener('click', () => {
            toggleGoogleLoginCard(false);
        });
    }
});
