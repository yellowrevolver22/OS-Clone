const video = document.querySelector('#camera');

async function startCamera(){
  try{

    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    video.srcObject=stream;

  }catch(err){

    document.body.innerHTML=`
    <h2 style="text-align:center;">
    Camera access denied or inaccesible <br>${err.message}</br>
    </h2>
    `
  }
}

startCamera();