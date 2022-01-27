let button = document.getElementsByTagName('button')
console.log(button.length)
button[0].addEventListener("click", function(){
   if(!kontrol()) {
        let mesai = document.querySelector(".mesai").value
        let maas = document.querySelector(".maas").value
        var saatUcreti = maas / mesai
        if(mesai < 50)
            alert("cok az calisiyorsun")
        else {
            

            console.log(saatUcreti)
            
        }

        if(saatUcreti < 100){
            alert("fakir")
            console.log(parseInt(maas)+1000)
        }else if (saatUcreti > 500)
            alert("eskort bile bu kadar kazanmiyor")
        else
            alert("normal kazaniyorsun")
            
   }else {
       
   }
   
})

function kontrol() {
    
    let kutular = document.querySelectorAll(".kutucuk");
    let sayac = 0
    kutular.forEach(kutu => {
        if(kutu.value.length < 1) {
            kutu.classList.add("error")
            sayac = 1
            
        }else{
            kutu.classList.remove("error")
        }
    })

    return sayac
}

// *mesai saati 50 den dusukse bir uyari verdir ya da bir yere birsey yazdir degilse 
// saatlik ucretini consola yazdir (tip donusumlerine dikkat)

// *mesai saat ucreti 100 liradan dusukse fakir diye alert verdir
// 500 den yuksekse alert eskort bile bu kadar bile kazanmiyor yazsin

// *getElementById gibi ulasma yontemlerine bak

// ("form div .")




