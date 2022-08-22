const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const modalContainer = document.querySelector(".modal-container")
const maincont = document.querySelector(".main");
const textarea = document.querySelector(".textarea-container");
const toolbox = document.querySelector(".toolbox-container");
let allPriorityColors = document.querySelectorAll(".priority-color");
const lockElem = document.querySelector(".ticket-lock");
let toolboxcolors = document.querySelectorAll(".color");
// let colors = ["#FC427B","#1B9CFC","#55E6C1","#181d25"];
let colors = ["peach", "blue", "green", "dark"]
let modalPriorityColor = colors[colors.length - 1];
let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-unlock";

let ticketsArr = [];


let allLocaltickets = JSON.parse(localStorage.getItem("all_tickets"))
if(allLocaltickets){
    ticketsArr = allLocaltickets;
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.id);
    })
}

for (let i = 0; i < toolboxcolors.length; i++) {
    toolboxcolors[i].addEventListener("click", (e) => {
        let currentToolboxColor = toolboxcolors[i].classList[0];
        
        let filteredTickets = ticketsArr.filter((ticket,i)=>{
             return currentToolboxColor===ticket.ticketColor
        })

        // remove prev tickets

        let allTicketsContainer = document.querySelectorAll(".ticket-container");

        for(let i=0;i<allTicketsContainer.length;i++){
            allTicketsContainer[i].remove();
        }

        // display filtered tickets

        filteredTickets.forEach((ticket,i)=>{
            createTicket(ticket.ticketColor,ticket.ticketTask,ticket.id)
        });
        toolboxcolors[i].addEventListener("dblclick", (e) => {
            let allTicketsContainer = document.querySelectorAll(".ticket-container");
            for(let i=0;i<allTicketsContainer.length;i++){
                allTicketsContainer[i].remove();
            }
            ticketsArr.forEach((t,i)=>{
                createTicket(t.ticketColor,t.ticketTask,t.id)
            })

        })
    })
}

// event listender modal color

allPriorityColors.forEach((colorElem, i) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColor, idx) => {
            priorityColor.classList.remove("border");
        })
        colorElem.classList.add("border");

        let color = colorElem.classList[0];
        modalPriorityColor = color;
    })
})


addBtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modalContainer.style.display = "flex";
        maincont.style.opacity = "0.4";
        toolbox.style.opacity = "0.4";
    } else {
        modalContainer.style.display = "none";
        maincont.style.opacity = "1";
        toolbox.style.opacity = "1";
    }
})


removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    if(removeFlag) {
        removeBtn.style.backgroundColor = "black";
    }else{
        removeBtn.style.backgroundColor = "rgb(174, 71, 71)";
    }
})

modalContainer.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textarea.value);
        addFlag = false;
        setModalDefault()
        maincont.style.opacity = "1";
        toolbox.style.opacity = "1";
    }

})

document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "Escape") {
        modalContainer.style.display = "none";
        textarea.value = "";
        addFlag = false;
        maincont.style.opacity = "1";
        toolbox.style.opacity = "1";
    }
})

function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class", "ticket-container");
    ticketCont.innerHTML = `
    <div class="ticket-container">
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="task-area">
            ${ticketTask}
           </div>
           <div class="ticket-lock">
           <i class="fa-solid fa-lock"></i>
          </div>
        </div>
    `;
    maincont.appendChild(ticketCont);

//    create object of tickets and add to array
    if(!ticketId){
        ticketsArr.push({ticketColor,ticketTask,id});
        localStorage.setItem("all_tickets",JSON.stringify(ticketsArr));
    }

    handleRemove(ticketCont,id);
    handleLock(ticketCont,id);
    handleColor(ticketCont,id);
}


function handleRemove(ticket,id) {
    ticket.addEventListener("click",(e)=>{
        if(!removeFlag) return;
        const idx = ticketsArr.findIndex(t=>{
            return t.id === id
        });
        if(idx!==-1){
            ticketsArr.splice(idx,1)
        }
        localStorage.setItem("all_tickets",JSON.stringify(ticketsArr));
        ticket.remove();
    })
}

function handleLock(ticket,id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true")
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false")
        }
        // modify data localStorage(ticket)
 
        const val = ticketTaskArea.innerHTML.toString().trim();
        ticketsArr.map(tObj=>{
            if(tObj.id===id){
                tObj.ticketTask = val
            }
        })
        localStorage.setItem("all_tickets",JSON.stringify(ticketsArr))
        console.log(ticketsArr);
    })
}

function handleColor(ticket,id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let currentTicketColor = ticketColor.classList[1];
        let ticketColorIdx = colors.findIndex(color => {
            return currentTicketColor === color;
        })
        ticketColorIdx++;
        let newTicketColorIdx = ticketColorIdx % colors.length;
        let newticketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newticketColor);
        ticketsArr.map(tObj=>{
            if(tObj.id===id){
                tObj.ticketColor = newticketColor
            }
        })
        
        localStorage.setItem("all_tickets",JSON.stringify(ticketsArr))
    })

}


function setModalDefault(){
    modalContainer.style.display = "none";
    textarea.value = "";
    modalPriorityColor = colors[colors.length-1]
    allPriorityColors.forEach((priorityColor, idx) => {
        priorityColor.classList.remove("border");
    });
    allPriorityColors[allPriorityColors.length-1].classList.add("border")
}

