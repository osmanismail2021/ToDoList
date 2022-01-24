

function addItem(event){  
    event.preventDefault();
    let text = document.getElementById("todo-input")
    db.collection("todo-items").add({ 
        text: text.value, 
        status: "active"
    })

    text.value = ""; 
}

// let names = [
//     "go to the park",
//     "go to the gym",
//     "go to the markt",
//     "go to the cinema",
//     "go to the theatre",
//     "come to me",
//     "come to us",
//     "enjoy",
//     "try it again",
//     "ambulance",
//     "taxi",
// ];

// let sortedNames = names.sort();


// text = document.getElementById("todo-input");

// text.addEventListener("keyup", (e) => {
//     removeElements();
//     for (let i of sortedNames) {

//         if(
//             i.toLowerCase().startsWith(text.value.toLowerCase()) && text.value != ""
//         )
//         {

//             let listItem = createElement("li");

//             listItem.classList.add("list-items");
//             listItem.style.cursor = "pointer";
//             listItem.setAttribute("onclick", "displayNames('" + i + "')");

//             let word = "<b>" + i.substr(0, text.value.length) + "</b>";
//             word += i.substr(text.value.length);

//             listItem.innerHTML = word;
//             document.querySelector(".list").appendChild(listItem);
//         }
//     }
// });

// function displayNames(value) {
//     text.value = value;
//     removeElements();
// }

// function removeElements() {

//     let artikels = document.querySelectorAll(".list-items");
//     artikels.forEach((artikel) => {
//         artikel.remove();
//     });
// }





function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => { 
        console.log(snapshot);                              
        let items = [];             
        snapshot.docs.forEach((doc) =>{     
            items.push({                    
                id: doc.id,                 
                ...doc.data()               
            })                              
        })

        
         
        let span = document.querySelector('.items-statuses span.active')
        
            
            switch(span.dataset.id){    
                case "1":
                    atype = "all";
                    break;
                case "2": 
                    atype = "active"
                    break;
                case "3":
                    atype = "completed"
                    break;
                default:
                    atype = "all"  

            }
        
        

        generateItems(items, atype); 
        
    })

}

function generateItems(items, atype="all"){
    console.log(atype);
    let itemsHTML = "";
    items.forEach((item)=>{
        
        
            if(item.status==atype || atype=="all"){
                  
                itemsHTML =itemsHTML + `<div class="todo-item"> 
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked": "nothing"}">
                <img src="./assets/icon-check.svg" alt="">
    
                    </div>
                </div>
                <div class="todo-text ${item.status == "completed" ? "checked": "nothing"}">
                    ${item.text}
                </div>
            </div>
    
                <div  class="binmarkcont ${item.status == "completed" ? "checked" : "nothing"}"  data-id="${item.id}">
                <img class="binmark  ${item.status == "completed" ? "checked": "nothing"}" src="./assets/remove.png" width="45" alt="icon-bin.svg"></div>
            </div>
                    `
                }
        

    })

    var item = db.collection("todo-items").where("status", "==", "active" )
    item.get().then(function (querySnapshot) {      
        
        document.getElementById("itemsLeft").innerHTML = querySnapshot.docs.length + " items left" 
        
        //console.log(querySnapshot.docs.length)
    })

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners(){
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
    todoCheckMarks.forEach((checkMark)=>{
        checkMark.addEventListener("click", function(){
            markCompleted(checkMark.dataset.id);
        });
    });

    let bins = document.querySelectorAll(".binmarkcont");
    bins.forEach(bin => {
        bin.addEventListener("click", function () {
          deleteOne(bin.dataset.id);
          
        });
      });

    let spans = document.querySelectorAll ('.items-statuses span')
     
    console.log("=>"+spans.length)
    spans.forEach(span => {
        span.addEventListener("click", function(){

             
            
            spans.forEach(a => {
                a.classList.remove("active")
            })

            span.classList.add("active");
            getItems();
        })
    })

    let clearBtn = document.getElementById("clearCompleted")
    clearBtn.addEventListener("click", function() {
        compDeleter()
    })

    }
    
    function deleteOne(id) {
        let item = db.collection("todo-items").doc(id);
        
        item.delete();
        
        
        alert(item + id);
      }
function markCompleted(id){
    let item = db.collection("todo-items").doc(id)
    item.get().then(function(doc){
        if(doc.exists){
            let status = doc.data().status;
            if(status == "active"){
                item.update({
                    status: "completed"
                })
            } else if(status == "completed"){
                item.update({
                    status: "active"
                })
            }
        }
    })

}


function compDeleter () {
    var item = db.collection("todo-items").where("status", "==", "completed" )
    item.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            
            console.log(doc)
            doc.ref.delete();

        });
        
    });
}



getItems();


 