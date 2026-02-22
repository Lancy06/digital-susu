let allWallets = []
let allDeposits = []
let countdownIntervals = {} // for each deposit sequence

// Helper: Mask first 4 and last 4
function maskString(str){
  if(!str || str.length<=8) return str
  return `${str.slice(0,4)}...${str.slice(-4)}`
}

// ===================== CREATE WALLET =====================
export async function createWallet() {
  const walletInfo = document.getElementById("walletInfo")
  walletInfo.textContent = "Creating wallet..."

  try {
    const res = await fetch("/create-wallet", { method: "POST" })
    const data = await res.json()

    allWallets.push({
      address: data.address,
      seed: data.seed,
      createdAt: new Date().toLocaleTimeString()
    })

    walletInfo.textContent = `Wallet Created! Address: ${maskString(data.address)}`
    alert(`Wallet Created!\nAddress: ${data.address}\nSeed: ${data.seed}\nSave this seed!`)
    console.log("Wallet:", data)

    updateWalletTable()
  } catch(err){
    console.error(err)
    walletInfo.textContent = "Wallet creation failed"
    alert("Wallet creation failed")
  }
}

// ===================== UPDATE WALLET TABLE =====================
function updateWalletTable(){
  const table = document.getElementById("walletTable")
  const tbody = table.querySelector("tbody")
  tbody.innerHTML = ""
  allWallets.forEach((w,i)=>{
    const tr = document.createElement("tr")
    tr.innerHTML = `<td>${i+1}</td>
                    <td>${maskString(w.address)}</td>
                    <td>${maskString(w.seed)}</td>
                    <td>${w.createdAt}</td>`
    tbody.appendChild(tr)
  })
  table.style.display = allWallets.length ? "table" : "none"
}

// ===================== DEPOSIT =====================
export async function deposit(){
  const seedInput = document.getElementById("depositSeed").value.trim()
  const depositInfo = document.getElementById("depositInfo")
  if(!seedInput) return alert("Enter wallet seed!")

  const wallet = allWallets.find(w=>w.seed===seedInput)
  if(!wallet) return alert("Wallet not found")

  depositInfo.textContent = "Submitting deposit..."

  try{
    const res = await fetch("/deposit", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({seed: wallet.seed, amount: 10})
    })

    const data = await res.json()
    const sequence = data.result.result.tx_json.Sequence
    const finishTime = Date.now() + 60*1000

    const newDeposit = { wallet: wallet.address, seed: wallet.seed, sequence, amount:10, status:"Pending", finishTime }
    allDeposits.push(newDeposit)
    addDepositRow(newDeposit)

    depositInfo.textContent = `Escrow Created! Sequence: ${sequence}`
    alert(`Escrow Created! Sequence: ${sequence}`)
    console.log("Deposit result:", data)

    startDepositCountdown(sequence)

  } catch(err){
    console.error(err)
    depositInfo.textContent = "Deposit failed"
    alert("Deposit failed")
  }
}

// ===================== ADD DEPOSIT ROW =====================
function addDepositRow(deposit){
  const table = document.getElementById("depositTable")
  const tbody = table.querySelector("tbody")
  const tr = document.createElement("tr")

  tr.innerHTML = `<td>#</td>
                  <td>${maskString(deposit.wallet)}</td>
                  <td>${deposit.sequence}</td>
                  <td>${deposit.amount}</td>
                  <td>${deposit.status}</td>
                  <td class="countdown" id="cd-${deposit.sequence}">Waiting...</td>`

  const tdRelease = document.createElement("td")
  const btn = document.createElement("button")
  btn.textContent = "Release"
  btn.disabled = true
  btn.style.background = "#e74c3c"
  btn.onclick = () => releaseDeposit(deposit.sequence)
  tdRelease.appendChild(btn)
  tr.appendChild(tdRelease)

  tbody.appendChild(tr)
  table.style.display = "table"
  updateDepositRowNumbers()
}

// ===================== UPDATE ROW NUMBERS =====================
function updateDepositRowNumbers(){
  const tbody = document.getElementById("depositTable").querySelector("tbody")
  Array.from(tbody.querySelectorAll("tr")).forEach((tr,i)=>tr.children[0].textContent=i+1)
}

// ===================== COUNTDOWN =====================
function startDepositCountdown(sequence){
  const deposit = allDeposits.find(d=>d.sequence===sequence)
  if(!deposit) return

  const cdEl = document.getElementById(`cd-${sequence}`)
  const releaseBtn = cdEl.nextElementSibling.querySelector("button") // FIXED

  countdownIntervals[sequence] && clearInterval(countdownIntervals[sequence])
  countdownIntervals[sequence] = setInterval(()=>{
    const remaining = Math.max(0, Math.floor((deposit.finishTime - Date.now())/1000))
    if(remaining>0){
      cdEl.textContent = `${remaining}s`
      cdEl.style.color = "#e67e22"
      deposit.status="Pending"
    } else {
      cdEl.textContent = "Ready!"
      cdEl.style.color = "#2ecc71"
      deposit.status="Ready"
      releaseBtn.disabled=false
      releaseBtn.style.background="#2ecc71"
      clearInterval(countdownIntervals[sequence])
    }
  }, 500)
}

// ===================== RELEASE =====================
async function releaseDeposit(sequence){
  const deposit = allDeposits.find(d=>d.sequence===sequence)
  if(!deposit || deposit.status!=="Ready") return alert("Escrow not ready")

  const cdEl = document.getElementById(`cd-${sequence}`)
  const releaseBtn = cdEl.nextElementSibling.querySelector("button")
  releaseBtn.disabled = true
  releaseBtn.style.background="#ccc"
  cdEl.textContent="Releasing..."

  try{
    const res = await fetch("/release", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({seed:deposit.seed, owner:deposit.wallet, sequence})
    })
    const data = await res.json()
    deposit.status="Released"
    cdEl.textContent="Released"
    releaseBtn.style.background="#ccc"
    console.log("Released:", data)
    alert("Escrow released! Check console for TX details")
  }catch(err){
    console.error(err)
    deposit.status="Ready"
    releaseBtn.disabled=false
    releaseBtn.style.background="#2ecc71"
    alert("Release failed")
  }
}

// ===================== EXPORT BUTTONS =====================
document.getElementById('createBtn').addEventListener('click',()=>createWallet())
document.getElementById('depositBtn').addEventListener('click',()=>deposit())