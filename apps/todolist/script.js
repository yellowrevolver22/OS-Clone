let listContainer=document.querySelector('.listContainer');
let addBtn=document.querySelector('.addBtn');
let addInput=document.querySelector('#addInput');
let list=[
    
]

function renderList(arr){
    listContainer.innerHTML='';
    arr.map(item=>{
    let divelem=document.createElement('div');
    divelem.classList.add('list');
    divelem.innerHTML=`
        <p>${item.text}</p>

    `
    let buttonElem=document.createElement('button');
    buttonElem.innerText='❌';
    divelem.appendChild(buttonElem);
    buttonElem.addEventListener('click',()=>{
        handleRemoveList(item.id);
    })
    listContainer.append(divelem);
} )
}
renderList(list);
function handleAddList(){
    let newTask={
        id:Date.now(),
        text:addInput.value
    }
    list.unshift(newTask);
    renderList(list);
    addInput.value='';
}
function handleRemoveList(id){
    let a=list.filter(obj=>{
        return id!==obj.id
    })
    list=a
    renderList(list);

}
addBtn.addEventListener('click',handleAddList);