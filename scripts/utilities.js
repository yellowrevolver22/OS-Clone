import { appsDetail } from "../data/app-data.js";

export function findApp(appId){
  let foundApp;
  appsDetail.forEach((app)=>{
    if(Number(appId)===app.id){
      foundApp=app;
    }
  })
  return foundApp;
}