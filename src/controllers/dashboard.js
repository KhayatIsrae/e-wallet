import db from "../models/database.js";

let user = localStorage.getItem('currentUser');
if (!user) {
    document.location = '../views/login.html';
}
user = JSON.parse(user);
const users = db.allUsers;
const greetingName = document.getElementById('greetingName');
const availableBalance = document.getElementById('availableBalance');
const monthlyIncome = document.getElementById('monthlyIncome');
const monthlyExpenses = document.getElementById('monthlyExpenses');
const activeCards = document.getElementById('activeCards');
const quickTransferbtn = document.getElementById('quickTransfer');
const transfersection = document.getElementById('transfer-section');
const closeTransferBtn = document.getElementById('closeTransferBtn');
const bselect = document.getElementById('beneficiary');
const sourceCardSelect = document.getElementById('sourceCard');
const cancelTransferBtn=document.getElementById('cancelTransferBtn');



// ajout d'infos
greetingName.textContent = user.name;
availableBalance.textContent = user.wallet.balance;
let Ctransactions = user.wallet.transactions.filter((t) => t.type === 'credit');
monthlyIncome.textContent = Ctransactions.reduce((acc, curr) => acc + curr.amount, 0);
let Dtransactions = user.wallet.transactions.filter((t) => t.type === 'debit');
monthlyExpenses.textContent = Dtransactions.reduce((acc, curr) => acc + curr.amount, 0);
activeCards.textContent = user.wallet.cards.length;

//transfert
quickTransferbtn.addEventListener('click', () => transfersection.setAttribute('class', 'transfer-section'));
closeTransferBtn.addEventListener('click', () => transfersection.setAttribute('class', 'hidden'));

//affichage beneficiares
users.forEach(user => {
    user.wallet.cards.forEach(card => {
        let opt = document.createElement('option');
        opt.setAttribute('value', card.numcards);
        opt.textContent = card.numcards;
        bselect.appendChild(opt);
    })
});

// affichage source cards
user.wallet.cards.forEach((card) => {
    let opt = document.createElement('option');
    opt.setAttribute('value', card.numcards);
    opt.textContent = card.numcards;
    sourceCardSelect.appendChild(opt);
})

//annuler transfer
cancelTransferBtn.addEventListener('click',()=>transfersection.setAttribute('class', 'hidden'));



