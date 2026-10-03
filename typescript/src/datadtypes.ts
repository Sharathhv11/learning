let sales: number = 10_00_000
let course: string = "TypeScript"
let published:boolean = true

function printOnScreen(document : any){
    console.log(document)
}

// arrays
// let numbers : number[] = [1,2,'3'] causes the error because the expected is number but got '3'

let numbers: number[] = [1,2]


// code complition - due to the value of variable is know , we will get the methods and function for that objects 

// tuple
let user: [number,string] = [1,"Sharath"]
console.log(user[0].toString())


// enums
const enum size {Small = 1,Medium,Large}
let mySize : size = size.Medium

console.log(mySize)



function calculateTax(income: number): number{
    if( income < 12_00_000 )
        return 0;
    return income * 1.2
}


// objects 
const userObj : {
    readonly id:number,
    name:string,
    retire : (date:Date)=>void 
} = {
    id:1,
    name:"",
    retire :  function(date:Date){
        console.log(date)
    }
}

userObj["name"] ="Sharath"

// type alias
type Employee = {
    readonly id:number,
    name:string,
    retire: (date:Date) => void
}

const emp1: Employee = {
    id:1,
    name:"Sharath",
    retire: function(date:Date){
        console.log(date)
    }
}

// union operator
function kgsToLbs(weight: number|string ){

}
kgsToLbs(10)
kgsToLbs('10kg')

// intersection operator 
type Draggable = {
    drag : () => void
}

type Resizeable = {
    resize : () => void 
}


type UIWidget = Draggable & Resizeable ;

const box:UIWidget = {
    drag : () => {
        
    },
    resize : () => {

    }
}

//limiting the quantity of a variable 
let quantity: 90 | 100 = 100;
type Quantity = 90 | 100 
let q1:Quantity = 90;

//nullable types
function greet(name :string | null ){
    if( name )
        console.log("Hello "+name.toUpperCase())
    else
        console.log("Hello")
}

type Customer = {
    id:number,
    getBirthDay:Date
}

function getCustomer(id: number):null | Customer{
    return ( id == 0 )? null : {
        id:id,
        getBirthDay : new Date()
    };
} 
//optional chaining
getCustomer(0)?.getBirthDay

