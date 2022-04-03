const Hashids = require('hashids/cjs')
const hashids = new Hashids()

console.log(hashids.encode(1));

var x = "62495137ac6fa3ea8f994b84";
var out = "";
for(var i =0; i <x.length; i++){
    if(x.charCodeAt(i) <58){
        out += x.charAt(i);
    }else{
        out +=x.charCodeAt(i);
    }
}
console.log(out);
var q = BigInt(out);
console.log(q);