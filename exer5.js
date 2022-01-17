function addItem(event){
    event.preventDefault();
    let text = document.getElementById("todo-input")
    db.collection("todo-items").add({
        text: text.value,
        status: "active"
    })
    text.value = "";
}

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

        let spans = document.querySelectorAll('.items-statuses span.active')
        spans.forEach(typ => {
            switch(typ.dataset.id){
                case 1:
                    atype = "all";
                    break;
                case 2: 
                    atype = "active"
                    break;
                case 3:
                    atype = "completed"
                default:
                    atype = "all"  

            }
        })

        
    

        generateItems(items, atype);
        
    })

}

function generateItems(items, type="all"){

    let itemsHTML = "";
    items.forEach((item)=>{
        if(type=="all"){
            
            itemsHTML += `<div class="todo-item">
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
        } else if(type=="active"){
            if(item.status=="active"){
                  
            itemsHTML += `<div class="todo-item">
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
        } else {
            if(item.status=="completed"){
                  
                itemsHTML += `<div class="todo-item">
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
        }

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
    }
    
    let todoCheckMarked = document.querySelectorAll(".todo-item .check-mark.checked");
    todoCheckMarked.forEach((checkedMark)=>{
        checkedMark.addEventListener("click", function(){
            alert("selam")
            markUnCompleted(checkedMark.dataset.id);
        });
    });



    function deleteOne(id) {
        let item = db.collection("todo-items").doc(id);
        item.delete();
        // alert('deleted'+ JSON.stringify(db.collection("todo-items").doc(id)))
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

function markUnCompleted(id){
    
    let item = db.collection("todo-items").doc(id)
    item.get().then(function(doc){
        if(doc.exists){
            let status = doc.data().status;
            if(status == "completed"){
                item.update({
                    status: "active"
                })
            } else if(status == "active"){
                item.update({
                    status: "completed"
                })
            }
        }
    })

}



getItems();
 