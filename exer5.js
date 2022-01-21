//nesne atama. kayit ekleme. inputa girilen degeri ekleme//
function addItem(event){  // fonksiyon olusturuldu
    event.preventDefault(); //event.preventDefault ile input ettigin bilgiyi enterladiginda sayfanin baska yere gitmesini engelledin. Enter yaptigin anda bilgiyi aldi entere gordu ve gonderimi ya da islevi durdurup basa dondu. yani girdigin texti hafizaya aldi ve bir yere gonderimi islevi durdurdu ve inputu bosaltti//
    let text = document.getElementById("todo-input") //inputu temsil eden "text" isminde degisken olusturuldu //
    db.collection("todo-items").add({ //burda inputa girdigin bilgi firebase veri tabaninda "todo-items" basligina gonderilip ekleniyor //
        text: text.value, //text degiskeni esittir inputa girilen text//
        status: "active"//listeye eklendiginde secili olmadigi surece yani o itemi tiklamadigin surece  aktif oluyor 
    })

    text.value = ""; // burda inputa girdigin texti enterladiktan sonra input yeniden sifirlansin bos kalsin diye//
}




//az once getAdd ile input edilen bilgileri firebase yollamistik. simdi getItems ile de FireBase den bir onceki asamada yollanan verileri cekip todo liste yani browserdaki app'a listeliyor ya listeliyor//
function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => { // onSnapshot:"veri tabaninda olan ne varsa onlari veriyor" ,"onSnapshot" ile veriler geliyor ve sonra bunlari (olusturdugu "snapshot" degiskenine atiyor )
        console.log(snapshot);                             //arrow function ile veriler geldikten sonra calisacak blogu tanimliyor. yani arrow function ile ben bunu yapicam diyorsun 
        let items = [];             //items degiskeni olusturdu ve bunu dizi olarak olusturduk
        snapshot.docs.forEach((doc) =>{     //snapshotun icerisinde docs ta dizi mevcut bu dizi icerisindeki her bir veri icin forEach ile donuyor ve donerkenki mevcut her veriyi "doc" un icine atiyor
            items.push({                    //burda arrow function ile sirasiyle sunlar oluyor. itemslari "push" ile doc'un icine atilan her kaydi ya da satiri  items dizisinin icine sokusturuyoruz
                id: doc.id,                 //id, firebasedeki o kaydin benzersiz id'si. yani kimlik numarasi. doc'un yani firebasede todo-items(kaydin temsil edildigi kisim)
                ...doc.data()               //firebasede todo-items---->id----->status ve text e yani veriyi yayiyor ya da isliyor ya da listeliyor
            })                              // doc.data ile status ve texte , doc.id ile de kimlik numarasina yani firebasedeki o uniek numaraya isleniyor
        })

        
        //Gosterecegimiz kayitlarin tipini yani app ta navbarda sectigimiz ALL ya da Active ya da Completed'i sectigimizde bu sectigimizin orda gozukmesini sagliyor 
        let span = document.querySelector('.items-statuses span.active') //burda "active" clasi olan spani aliyor
        
            
            switch(span.dataset.id){    // html'de <span data-id="5">/span> => dataset.is <span data-ad="gokhan"></span> => dataset.ad
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
        
        

        generateItems(items, atype); //yukarida push ile sokusturdugun veriler ve atype ile hangi statusteki kayitlar oldugu
        
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


 