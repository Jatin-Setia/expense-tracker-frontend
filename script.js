// ---------- auth guard ----------
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
});

const userName = localStorage.getItem('userName') || 'there';
document.getElementById('navGreeting').textContent = `Hi, ${userName}`;
document.getElementById('navAvatar').textContent = userName.charAt(0).toUpperCase();

// ---------- global error banner ----------
const globalError = document.getElementById('globalError');

function showGlobalError(message){
    globalError.textContent = message;
    globalError.classList.add('visible');
    setTimeout(() => {
        globalError.classList.remove('visible');
    }, 5000);
}

// ---------- starfield ----------
const starsContainer = document.getElementById('stars');
const STAR_COUNT = 150;

for (let i = 0; i < STAR_COUNT; i++){
  const star = document.createElement('div');
  star.classList.add('star');

  const size = Math.random() * 2 + 1;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const baseOpacity = Math.random() * 0.6 + 0.3;
  const duration = Math.random() * 3 + 2;
  const delay = Math.random() * 5;

  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${top}%`;
  star.style.left = `${left}%`;
  star.style.setProperty('--base-opacity', baseOpacity);
  star.style.animationDuration = `${duration}s`;
  star.style.animationDelay = `${delay}s`;
  star.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,${baseOpacity})`;

  starsContainer.appendChild(star);
}

// ---------- clock ----------
function updateClock(){
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('floatingClock').textContent = `${hours}:${minutes}`;
}

updateClock();
setInterval(updateClock, 1000 * 30);

// ---------- expense tracker ----------
const API_URL = 'https://expense-tracker-ejph.onrender.com/api/expenses';
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const formError = document.getElementById('formError');

let allExpenses = [];

function renderExpenseList(list){
    expenseList.innerHTML = '';

    if (list.length === 0){
        expenseList.innerHTML = '<li class="empty_state">No expenses in this range yet.</li>';
        return;
    }

    list.forEach(exp => {
        const li = document.createElement('li');
        li.classList.add('expense_item');
        const sign = exp.type === 'income' ? '+' : '-';
        const color = exp.type === 'income' ? '#22D3EE' : '#EC4899';

        const dateObj = new Date(exp.date);
        const shortDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const fullDateTime = dateObj.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        li.innerHTML = `
          <div class="expense_row">
            <div class="expense_info">
              ${exp.title} — <span style="color:${color}">${sign}₹${exp.amount}</span> (${exp.category})
              <span class="expense_date">${shortDate}</span>
            </div>
            <div class="expense_actions">
              <button class="details_btn" data-id="${exp._id}">👁</button>
              <button class="edit_btn" data-id="${exp._id}">✎</button>
              <button class="delete_btn" data-id="${exp._id}">✕</button>
            </div>
          </div>
          <div class="expense_details" id="details-${exp._id}">
            Added on ${fullDateTime}
          </div>
        `;
        expenseList.appendChild(li);
    });

    document.querySelectorAll('.details_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const detailsDiv = document.getElementById(`details-${id}`);
            detailsDiv.classList.toggle('open');
        });
    });

    document.querySelectorAll('.delete_btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                await loadExpenses();
                await loadSummary();
            } catch (err) {
                showGlobalError('Could not delete this expense. Check your connection.');
            }
        });
    });

    document.querySelectorAll('.edit_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const expense = allExpenses.find(exp => exp._id === id);
            openEditForm(expense);
        });
    });
}

function openEditForm(expense){
    const li = document.querySelector(`.edit_btn[data-id="${expense._id}"]`).closest('li');

    li.innerHTML = `
      <div class="edit_form">
        <select class="edit_type">
          <option value="expense" ${expense.type === 'expense' ? 'selected' : ''}>Expense</option>
          <option value="income" ${expense.type === 'income' ? 'selected' : ''}>Income</option>
        </select>
        <input type="text" class="edit_title" value="${expense.title}">
        <input type="number" class="edit_amount" value="${expense.amount}">
        <input type="text" class="edit_category" value="${expense.category}">
        <button type="button" class="save_btn">Save</button>
        <button type="button" class="cancel_btn">Cancel</button>
      </div>
    `;

    li.querySelector('.cancel_btn').addEventListener('click', () => {
        renderExpenseList(getFilteredExpenses());
    });

    li.querySelector('.save_btn').addEventListener('click', async () => {
        const updatedType = li.querySelector('.edit_type').value;
        const updatedTitle = li.querySelector('.edit_title').value.trim();
        const updatedAmount = Number(li.querySelector('.edit_amount').value);
        const updatedCategory = li.querySelector('.edit_category').value.trim();

        if (!updatedTitle || !updatedCategory || isNaN(updatedAmount) || updatedAmount <= 0){
            showGlobalError('Please fill all fields with a valid amount before saving.');
            return;
        }

        try {
            await fetch(`${API_URL}/${expense._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    amount: updatedAmount,
                    category: updatedCategory,
                    type: updatedType
                })
            });
            await loadExpenses();
            await loadSummary();
        } catch (err) {
            showGlobalError('Could not save changes. Check your connection.');
        }
    });
}

function getFilteredExpenses(){
    const from = document.getElementById('filterFrom').value;
    const to = document.getElementById('filterTo').value;

    if (!from && !to) return allExpenses;

    return allExpenses.filter(exp => {
        const expDate = new Date(exp.date).toISOString().split('T')[0];
        if (from && expDate < from) return false;
        if (to && expDate > to) return false;
        return true;
    });
}

document.getElementById('filterBtn').addEventListener('click', () => {
    renderExpenseList(getFilteredExpenses());
});

document.getElementById('filterClearBtn').addEventListener('click', () => {
    document.getElementById('filterFrom').value = '';
    document.getElementById('filterTo').value = '';
    renderExpenseList(allExpenses);
});

async function loadExpenses(){
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok){
            throw new Error('Failed to fetch expenses');
        }

        allExpenses = await res.json();
        renderExpenseList(getFilteredExpenses());
    } catch (err) {
        showGlobalError('Could not load your expenses. Check your connection and try again.');
    }
}

async function loadSummary(){
    try {
        const res = await fetch(`${API_URL}/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok){
            throw new Error('Failed to fetch summary');
        }

        const data = await res.json();

        document.getElementById('totalIncome').textContent = `₹${data.income}`;
        document.getElementById('totalSpent').textContent = `₹${data.spent}`;
        document.getElementById('netBalance').textContent = `₹${data.balance}`;
        document.getElementById('heroBalance').textContent = `₹${data.balance}`;
        document.getElementById('highestSpent').textContent = data.highest
            ? `${data.highest.title} — ₹${data.highest.amount}`
            : '—';

        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = '';

        if (Object.keys(data.byCategory).length === 0){
            categoryList.innerHTML = '<li class="empty_state">No categories yet.</li>';
        } else {
            Object.entries(data.byCategory).forEach(([category, amount]) => {
                const li = document.createElement('li');
                li.classList.add('category_row');
                li.innerHTML = `<div>${category}</div><span>₹${amount}</span>`;
                categoryList.appendChild(li);
            });
        }
    } catch (err) {
        showGlobalError('Could not load your summary. Check your connection and try again.');
    }
}

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';

    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value.trim();
    const amount = Number(document.getElementById('amount').value);
    const category = document.getElementById('category').value.trim();

    if (!title){
        formError.textContent = 'Please enter a title.';
        return;
    }
    if (!category){
        formError.textContent = 'Please enter a category.';
        return;
    }
    if (isNaN(amount) || amount <= 0){
        formError.textContent = 'Amount must be a positive number.';
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, amount, category, type })
        });

        if (!res.ok){
            throw new Error('Failed to add expense');
        }

        localStorage.setItem('lastType', type);
        localStorage.setItem('lastCategory', category);

        document.getElementById('title').value = '';
        document.getElementById('amount').value = '';

        await loadExpenses();
        await loadSummary();
    } catch (err) {
        formError.textContent = 'Could not add this entry. Check your connection and try again.';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedType = localStorage.getItem('lastType');
    const savedCategory = localStorage.getItem('lastCategory');

    if (savedType) document.getElementById('type').value = savedType;
    if (savedCategory) document.getElementById('category').value = savedCategory;
});

loadExpenses();
loadSummary();