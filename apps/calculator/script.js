let display=document.querySelector('.display')
function appendValue(text){
    if(display.innerText==='0' || display.innerText==='ERROR' || display.innerText==='Infinity'){
        display.innerText=text;
        return;
    }
    display.innerText=`${display.innerText}${text}`
}
function clearDisplay(){
    display.innerText='0';
}
function calculate(){
    try{
        display.innerText=eval(display.innerText);
    }
    catch(error){
        display.innerText='ERROR'
    }
    
}