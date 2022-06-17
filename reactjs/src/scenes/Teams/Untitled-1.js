let a = ["A","B","C"];
let key = a => a === "A";

if(a.some(key)){
    console.log("Swim");
}


var sound = "grunt";
var bear = {sound: "roar"};


function roar(){
    console.log(this.sound);
}

roar();

