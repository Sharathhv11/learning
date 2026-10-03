let sales = 10_00_000;
let course = "TypeScript";
let published = true;
function printOnScreen(document) {
    console.log(document);
}
// arrays
// let numbers : number[] = [1,2,'3'] causes the error because the expected is number but got '3'
let numbers = [1, 2];
// code complition - due to the value of variable is know , we will get the methods and function for that objects 
// tuple
let user = [1, "Sharath"];
console.log(user[0].toString());
// enums
var size;
(function (size) {
    size[size["Small"] = 1] = "Small";
    size[size["Medium"] = 2] = "Medium";
    size[size["Large"] = 3] = "Large";
})(size || (size = {}));
let mySize = size.Medium;
console.log(mySize);
export {};
//# sourceMappingURL=datadtypes.js.map