function addItem(event){  // fonksiyon olusturuldu
    event.preventDefault(); //event.preventDefault ile input ettigin bilgiyi enterladiginda sayfanin baska yere gitmesini engelledin. Enter yaptigin anda bilgiyi aldi entere gordu ve gonderimi ya da islevi durdurup basa dondu. yani girdigin texti hafizaya aldi ve bir yere gonderimi islevi durdurdu ve inputu bosaltti//
    let text = document.getElementById("todo-input") //inputu temsil eden "text" isminde degisken olusturuldu //
    db.collection("todo-items").add({ //burda inputa girdigin bilgi firebase veri tabaninda "todo-items" basligina gonderilip ekleniyor //
        text: text.value, //text degiskeni esittir inputa girilen text//
        status: "active"//listeye eklendiginde secili olmadigi surece yani o itemi tiklamadigin surece  aktif oluyor 
    })

    text.value = ""; // burda inputa girdigin texti enterladiktan sonra input yeniden sifirlansin bos kalsin diye//
}

function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => { //veri tabaninda degisiklik oldugunda 
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
        })

        

        generateItems(items, atype);
        
    })

}

function generateItems(items, atype="all"){
    console.log(atype);
    let itemsHTML = "";
    items.forEach((item)=>{
        if(atype=="all"){
            
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
        } else if(atype=="active"){
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
        } else if(atype=="completed") {
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
    // spansin icerdigi her bir elemana forEach ile sana tiklanirsa kendine active classini ekle//  
    console.log("=>"+spans.length)
    spans.forEach(span => {
        span.addEventListener("click", function(){

            //Secilen tum elemanlardaki active classini sildiriyoruz 
            
            spans.forEach(span => {
                span.classList.remove("active")
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
    
    let todoCheckMarked = document.querySelectorAll(".todo-item .check-mark.checked");
    todoCheckMarked.forEach((checkedMark)=>{
        checkedMark.addEventListener("click", function(){
            //alert("selam")
            markUnCompleted(checkedMark.dataset.id);
        });
    });


    function deleteOne(id) {
        let item = db.collection("todo-items").doc(id);
        // item.addEventListener("transitionend", function() {
        //     item.delete();
        // })
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


 