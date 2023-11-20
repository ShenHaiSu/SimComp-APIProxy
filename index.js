const fs = require("fs");
const { default: axios } = require("axios");


const mainFunc = async () => {
  let getCategory = (await axios.get("https://simcotools.app/api/v2/buildings/?category=sales&realm=0")).data;
  console.log(getCategory);

  for (let i = 0; i < getCategory.length; i++) {
    let cata = getCategory[i];
    console.log(`开始请求 ${cata} R1 建筑`);
    let realm_0_data = (await axios.get(`https://simcotools.app/api/v1/retail/?realm=0&building=${cata}`)).data;
    console.log(`开始请求 ${cata} R2 建筑`);
    let realm_1_data = (await axios.get(`https://simcotools.app/api/v1/retail/?realm=1&building=${cata}`)).data;

    fs.writeFileSync(`./toolsData/least/${cata}-R1.json`, JSON.stringify(realm_0_data), "utf-8");
    fs.writeFileSync(`./toolsData/least/${cata}-R2.json`, JSON.stringify(realm_1_data), "utf-8");
  }
}


let timeStamp = new Date().getTime().toString();
let isExixt = fs.existsSync("./toolsData/least");
try {
  if (isExixt) fs.renameSync("./toolsData/least", `./toolsData/${timeStamp}`);
  fs.mkdirSync("./toolsData/least");
  mainFunc();
} catch (error) {
  fs.rmSync("./toolsData/least");
  console.log("删除文件夹");
  fs.renameSync(`./toolsData/${timeStamp}`, "./toolsData/least");
  console.log("还原旧数据");
  console.error(error);
}