import { getbeneficiaries, finduserbyaccount, findbeneficiarieByid } from "../models/database.js";

const user = JSON.parse(sessionStorage.getItem("currentUser"));
if (!user) {
    alert("User not authenticated");
    document.location = '../views/login.html';
}

//const users = db.allUsers;
const greetingName = document.getElementById('greetingName');
const currentDate = document.getElementById("currentDate");
const availableBalance = document.getElementById('availableBalance');
const monthlyIncome = document.getElementById('monthlyIncome');
const monthlyExpenses = document.getElementById('monthlyExpenses');
const transactionsList = document.getElementById("recentTransactionsList");
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
currentDate.innerText = new Date().toLocaleDateString("fr-FR");
// Display transactions
transactionsList.innerHTML = "";
user.wallet.transactions.forEach(transaction => {
    const transactionItem = document.createElement("div");
    transactionItem.className = "transaction-item";
    transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
  `;
    transactionsList.appendChild(transactionItem);
});


//transfert
quickTransferbtn.addEventListener('click', () => transfersection.setAttribute('class', 'transfer-section'));
closeTransferBtn.addEventListener('click', () => transfersection.setAttribute('class', 'hidden'));

//affichage beneficiares
user.wallet.beneficiaries.forEach(u => {
    let opt = document.createElement('option');
    opt.setAttribute('value', u.account);
    opt.textContent = u.name;
    bselect.appendChild(opt);

});

// affichage source cards
user.wallet.cards.forEach((card) => {
    let opt = document.createElement('option');
    opt.setAttribute('value', card.numcards);
    opt.textContent = card.type + "****" + card.numcards;
    sourceCardSelect.appendChild(opt);
})

//annuler transfer
cancelTransferBtn.addEventListener('click', () => transfersection.setAttribute('class', 'hidden'));

//effectuer le transfert
/*
//check if beneficiary is valid
const verifyBen = (numcompte, callback) => {
        console.log("arrive!")
        const beneficiary = finduserbyaccount(numcompte);
        if (beneficiary) {
            callback(beneficiary);
        }
        else {
            alert("beneficiary not found");
        }
    
}

const checkSolde = (mont, carte, callback) => {
    
        if (user.wallet.balance >= mont) {
            callback("Sufficient balance");
        } else {
            alert("Insufficient balance");
        }
    
}

const debiter = (ben, mont, callback) => {
    
        ben.wallet.balance -= mont;
        callback("update balance done");
    

}
const credit = (benacc, mont, callback) => {
    
        let ben = finduserbyaccount(benacc);
        ben.wallet.balance += mont;
        callback();
    
}

//transaction credit
const creerTC = (benacc, mont, card, callback) => {
    let benef = finduserbyaccount(benacc);
    const transaction = {
        id: Math.random(),
        type: 'credit',
        amount: mont,
        date: new Date().toLocaleString(),
        from: card,
        to: benef.name
    }
    benef.wallet.transactions.push(transaction);
    callback("transaction added successfully");
}
//transaction debit
const creerTD = (benacc, mont, carte, callback) => {
    let benef = finduserbyaccount(benacc);
    const transaction = {
        id: Math.random(),
        type: 'debit',
        amount: mont,
        date: new Date().toLocaleString(),
        from: carte,
        to: benef.name
    }
    user.wallet.transactions.push(transaction);
    callback("transaction added successfully");
}

const valider = () => {
    
    alert("transaction reussi!!!");
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    location.reload();

}

submitTransferBtn.addEventListener('click', () => handleTransfert(verifyBen));

function handleTransfert(callback) {
    let benacc = bselect.value;
    let carte = sourceCardSelect.value;
    let mont = parseFloat(amount.value);
    let amt = mont;
    if (instantTransfer.checked) {
        amt += 13.4;
    }
    callback(benacc, (beneficiary) =>
        checkSolde(amt, carte, () =>
            creerTC(benacc, mont, carte, () =>
                creerTD(benacc, amt, carte, () =>
                    debiter(user, amt, () =>
                        credit(benacc, mont, valider)
                    )
                )
            )
        )
    );
}
*/

const valider = () => {
    alert("transaction reussi!!!");
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    location.reload();
}


const verifyBen = (numcompte) => new Promise((resolve, reject) => {
    setTimeout(() => {
        alert("test!")
        const beneficiary = finduserbyaccount(numcompte);
        beneficiary ? resolve() : reject("Bénéficiaire introuvable");
    }, 2000);
});

const checkSolde = (mont) => new Promise((resolve, reject) => {
    setTimeout(() => {
        user.wallet.balance >= mont
            ? resolve()
            : reject("Solde insuffisant");
    }, 3000);
});

const debiter = (mont) => new Promise((resolve) => {
    setTimeout(() => {
        user.wallet.balance -= mont;
        resolve();
    }, 200);
});

const credit = (benacc, mont) => new Promise((resolve) => {
    setTimeout(() => {
        const ben = finduserbyaccount(benacc);
        ben.wallet.balance += mont;
        resolve();
    }, 200);
});

//transaction credit
const creerTC = (benacc, mont, card) => {
    let benef = finduserbyaccount(benacc);
    const transaction = {
        id: Math.random(),
        type: 'credit',
        amount: mont,
        date: new Date().toLocaleString(),
        from: card,
        to: benef.name
    }
    benef.wallet.transactions.push(transaction);
}
//transaction debit
const creerTD = (benacc, mont, carte) => {
    let benef = finduserbyaccount(benacc);
    const transaction = {
        id: Math.random(),
        type: 'debit',
        amount: mont,
        date: new Date().toLocaleString(),
        from: carte,
        to: benef.name
    }
    user.wallet.transactions.push(transaction);
}

function handleTransfert() {
    const benacc = bselect.value;
    const carte = sourceCardSelect.value;
    const mont = parseFloat(amount.value);
    const amt = instantTransfer.checked ? mont + 13.4 : mont;

    verifyBen(benacc)
        .then(() => checkSolde(amt))
        .then(() => {
            creerTC(benacc, mont, carte);
            creerTD(benacc, amt, carte);
            return debiter(amt);
        })
        .then(() => credit(benacc, mont))
        .then(() => valider())
        .catch(erreur => alert(erreur));
}
submitTransferBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert("test1")
    handleTransfert();
});