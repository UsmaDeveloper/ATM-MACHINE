// Simple ATM Logic
const CORRECT_PIN = "1234";
let balance = 5000;
const transactions = [];

const pinScreen = document.getElementById("pinScreen");
const menuScreen = document.getElementById("menuScreen");
const pinInput = document.getElementById("pin");
const pinMsg = document.getElementById("pinMsg");
const balanceDisplay = document.getElementById("balanceDisplay");
const actionArea = document.getElementById("actionArea");
const message = document.getElementById("message");
const txList = document.getElementById("txList");

// Format currency
function formatCurrency(n){ return "Rs " + n.toFixed(0); }
function updateBalance(){ balanceDisplay.textContent = formatCurrency(balance); }
function clearAction(){ actionArea.innerHTML = ""; }

function addTransaction(type, amount){
  transactions.unshift({type, amount, date: new Date().toLocaleString()});
  if(transactions.length>10) transactions.pop();
}

// PIN check
document.getElementById("pinSubmit").addEventListener("click", ()=>{
  const val = pinInput.value.trim();
  if(val.length!==4 || !/^\d+$/.test(val)){ pinMsg.textContent="Enter 4 digits.";return;}
  if(val===CORRECT_PIN){ pinMsg.textContent=""; showMenu(); }
  else{ pinMsg.textContent="Incorrect PIN."; }
});
document.getElementById("pinClear").addEventListener("click", ()=>{pinInput.value="";pinMsg.textContent="";});

function showMenu(){
  pinScreen.style.display="none";
  menuScreen.style.display="block";
  updateBalance();
  clearAction();
  message.textContent="";
  txList.style.display="none";
}
document.getElementById("btnLogout").addEventListener("click", ()=>{
  pinScreen.style.display="block";
  menuScreen.style.display="none";
  pinInput.value="";
});

// Withdraw
document.getElementById("btnWithdraw").addEventListener("click", ()=>{
  clearAction(); txList.style.display="none";
  actionArea.innerHTML = `
    <label>Amount to withdraw</label>
    <input id="withdrawAmt" type="number" min="100" />
    <div class="row">
      <button id="doWithdraw" class="btn btn-primary">Withdraw</button>
      <button id="cancelW" class="btn btn-ghost">Cancel</button>
    </div>`;
  document.getElementById("doWithdraw").onclick = ()=>{
    const v = Number(document.getElementById("withdrawAmt").value);
    if(!v || v<=0) return showMsg("Enter valid amount",true);
    if(v%100!==0) return showMsg("Use multiples of 100",true);
    if(v>balance) return showMsg("Insufficient balance",true);
    balance-=v; updateBalance(); addTransaction("Withdraw",v);
    showMsg("Withdrawn "+formatCurrency(v));
    clearAction();
  };
  document.getElementById("cancelW").onclick = clearAction;
});

// Deposit
document.getElementById("btnDeposit").addEventListener("click", ()=>{
  clearAction(); txList.style.display="none";
  actionArea.innerHTML = `
    <label>Amount to deposit</label>
    <input id="depositAmt" type="number" />
    <div class="row">
      <button id="doDeposit" class="btn btn-primary">Deposit</button>
      <button id="cancelD" class="btn btn-ghost">Cancel</button>
    </div>`;
  document.getElementById("doDeposit").onclick = ()=>{
    const v = Number(document.getElementById("depositAmt").value);
    if(!v || v<=0) return showMsg("Enter valid amount",true);
    balance+=v; updateBalance(); addTransaction("Deposit",v);
    showMsg("Deposited "+formatCurrency(v));
    clearAction();
  };
  document.getElementById("cancelD").onclick = clearAction;
});

// Statement
document.getElementById("btnStatement").addEventListener("click", ()=>{
  clearAction(); message.textContent=""; txList.style.display="block";
  txList.innerHTML="";
  if(transactions.length===0){ txList.innerHTML="<div class='small muted'>No transactions yet.</div>";return;}
  transactions.forEach(tx=>{
    txList.innerHTML += `<div class="tx"><div><strong>${tx.type}</strong><div class="small muted">${tx.date}</div></div><div><strong>${formatCurrency(tx.amount)}</strong></div></div>`;
  });
});

// Show messages
function showMsg(text,isError=false){
  message.innerHTML = `<div class="${isError?'error':'success'}">${text}</div>`;
}
updateBalance();
