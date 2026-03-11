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
const cancelTransferBtn = document.getElementById('cancelTransferBtn');
const submitTransferBtn = document.getElementById('submitTransferBtn');
const amount = document.getElementById('amount');
const instantTransfer = document.getElementById('instantTransfer');


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
users.forEach(u => {
    let opt = document.createElement('option');
    opt.setAttribute('value', u.id);
    opt.textContent = u.name;
    bselect.appendChild(opt);

});

// affichage source cards
user.wallet.cards.forEach((card) => {
    let opt = document.createElement('option');
    opt.setAttribute('value', card.numcards);
    opt.textContent = card.numcards;
    sourceCardSelect.appendChild(opt);
})

//annuler transfer
cancelTransferBtn.addEventListener('click', () => transfersection.setAttribute('class', 'hidden'));

//effectuer le transfert

const valider = () => {
    alert('transaction valide!!!');
    localStorage.setItem('currentUser', JSON.stringify(user));
    const index = db.allUsers.findIndex(u => u.id === user.id);
    if(index !== -1){
        db.allUsers[index] = user;
        localStorage.setItem('allUsers', JSON.stringify(db.allUsers));
    }


}
const debiter = (ben, mont, carte, callback) => {
    ben.wallet.balance -= mont;
    let cd = ben.wallet.cards.find((card) => card.numcards === carte);
    cd.balance -= mont;
    callback();
}
const credit = (benId, mont, callback) => {
    let benef = db.getUserById(benId);
    benef.wallet.balance += mont;
    callback();
}
//transaction credit
const creerTC = (ben, mont, card, callback) => {
    let benef = db.getUserById(ben);
    const transaction = {
        id: Math.random(),
        type: 'credit',
        amount: mont,
        date: new Date().toISOString().slice(0, 10),
        from: card,
        to: benef.name
    }
    benef.wallet.transactions.push(transaction);
    callback();
}
//transaction debit
const creerTD = (ben, mont, carte, callback) => {
    let benef = db.getUserById(ben);
    const transaction = {
        id: Math.random(),
        type: 'debit',
        amount: mont,
        date: new Date().toISOString().slice(0, 10),
        from: carte,
        to: benef.name
    }
    user.wallet.transactions.push(transaction);
    callback();
}

const verifyBen = (id, callback) => {
    if (db.getUserById(id)) {
        callback();
    }
}

const checkSolde = (mont, carte, callback) => {
    let cd = user.wallet.cards.find((card) => card.numcards === carte)
    if (cd.balance >= mont) callback();
}

submitTransferBtn.addEventListener('click', () => handleTransfert(checkSolde));

function handleTransfert(callback) {
    let benId = bselect.value;
    let carte = sourceCardSelect.value;
    let mont = parseFloat(amount.value);
    let amt = mont;
    if (instantTransfer.checked) {
        amt += 13.4;
    }
    callback(amt, carte, () =>
        verifyBen(benId, () =>
            creerTC(benId, mont, carte, () =>
                creerTD(benId, amt, carte, () =>
                    debiter(user, amt, carte, () =>
                        credit(benId, mont, valider)
                    )
                )
            )
        )
    );
}