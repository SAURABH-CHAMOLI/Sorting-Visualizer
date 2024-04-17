let arr=[30,10,50,60,70,20,40,90,80]
let container=document.querySelector(".container")
let parentDiv=document.querySelector(".content")
let btn=document.querySelector(".btn")

let i=0;
arr.forEach(height=>{
    let innerDiv=document.createElement('div')
    innerDiv.style.height=( height*3 + "px" )
    innerDiv.style.backgroundColor=rgb();
    innerDiv.innerHTML=height;
    innerDiv.setAttribute('id','height'+i)
    i++;
    innerDiv.classList.add('height')
    parentDiv.appendChild(innerDiv)
})

function rgb() {
    const red=Math.floor(Math.random()*256);
    const green=Math.floor(Math.random()*256);
    const blue=Math.floor(Math.random()*256);

    const color=`rgb(${red},${green},${blue})`;

    return color;
}

btn.addEventListener("click",()=>{
    sort(arr);
})

function sleep(time) {
    return new Promise((resolve)=>{
            
        setTimeout(()=>{
            resolve()
        },time)
    })
}


async function sort(arr) {
    for(let i = 0; i < arr.length-1; i++) {

        for(let j = 0; j < (arr.length - i - 1); j++) {

            await sleep(1000) 

            if(arr[j] > arr[j+1]) {
                
                swapNumber(arr,j)

                swapInnerDiv(j)
            }
        }
    }
}

function swapNumber(arr,j) {
    let temp = arr[j];
    arr[j] = arr[j+1];
    arr[j+1] = temp;
}

function swapInnerDiv(j) {
    let a = 'height'+j;
    let b = 'height'+(j+1);
    let height1 = document.getElementById(a);
    let height2 = document.getElementById(b);
    let h1 = height1.style.height;
    let h2 = height2.style.height;
    let c1 = height1.style.backgroundColor;
    let c2 = height2.style.backgroundColor;
    let v1=height1.innerText;
    let v2=height2.innerText;

    height1.style.backgroundColor = c2;
    height2.style.backgroundColor = c1;
    height1.style.height = h2;
    height2.style.height = h1;
    height1.innerText = v2;
    height2.innerText= v1;

}