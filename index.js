


const projects = [];
var current_proj = 0;
class Project {
    constructor(name, desc, url, lang) {
      this.name = name;
      this.desc = desc;
      this.github_url = url;

        var count = 0;
        for (const [key, value] of Object.entries(lang)) {
            console.log(`${key}: ${value}`);
            count += value;
        }
     
       
        console.log(count);
        for (const [key, value] of Object.entries(lang)) {
            lang[key] = Math.floor((lang[key]/count) * 100);
        }
     

      this.lang = lang;
    }
}

window.onload = (event) => {
  };

function projectButtonClicked(){
    document.getElementById("content").style.display = "flex";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";
    setupContent();
}

function showContact(){
    console.log("contacts");
    document.getElementById("content").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "flex";

}

function showAbout(){
    document.getElementById("content").style.display = "none";
    document.getElementById("about").style.display = "flex";
    document.getElementById("contact").style.display = "none";
    
}

async function setupContent(){
    if(projects.length == 0){
        var reposJson = await getRepos();
        console.log(reposJson);
        if(reposJson != -1){
            var loader = document.getElementById("load");
            loader.hidden = false;
            for (let index = 0; index < reposJson.length; index++) {
                var readme = await getReadme(reposJson[index].name); 
                var lang = await getLanguages(reposJson[index].languages_url);
                if(readme != -1){
                    projects.push(new Project(reposJson[index].name, readme, reposJson[index].owner.html_url, lang));
    
                }else{
                    projects.push(new Project(reposJson[index].name, "Could not catch README", reposJson[index].owner.html_url, lang));
    
                }
                loader.innerHTML = Math.floor((index / reposJson.length)*100 ) + "%";
                
            }
            loader.hidden = true;
    
            showProject(current_proj);
    
        }
    }else{
        showProject(current_proj);
    }
}

function next_proj(){
    current_proj = (current_proj+1) % projects.length;
    showProject(current_proj)
}

function prev_proj(){
    current_proj = (current_proj-1) % projects.length;
    showProject(current_proj)
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}


async function getRepos(){
    const request = new Request('https://api.github.com/users/wallentinr/repos', {method: 'GET'});
    return await fetch(request)
    .then(async resp =>{
        const json = await resp.json()
        if(resp.status == 200) return json
        return -1;
    })
    .catch(err => {
        return -1;
    })
    
}


async function getLanguages(url){
    const request = new Request(url, {method: 'GET'});
    return await fetch(request)
    .then(async resp =>{
        const json = await resp.json()
        if(resp.status == 200){
            return json;
        }
        return -1;
    })
    .catch(err => {
         return -1;
    })
}

async function getReadme(name){
    const request = new Request('https://api.github.com/repos/wallentinr/' + name + '/readme', {method: 'GET'});
    return await fetch(request)
    .then(async resp =>{
        const json = await resp.json()
        if(resp.status == 200){
            return await getHTML(name, b64_to_utf8(json.content));
        }
        return -1;
    })
    .catch(err => {
         return -1;
    })
}

async function getHTML(name, body){
    var body_text = {"text":body };
    
    const request = new Request('https://api.github.com/markdown', {method: 'POST', body: JSON.stringify(body_text)});
    return await fetch(request)
    .then(async resp =>{
        const json = await resp.text()
        if(resp.status == 200){
            return json
        }
        return -1;
    })
    .catch(err => {
         return -1;
    })
}


function showProject(index){
    var project_h = document.getElementsByClassName("project")[0];
    var title_h = project_h.getElementsByClassName("project-title")[0];
    var desc_h = project_h.getElementsByClassName("project-desc")[0];
    var github_logo = document.getElementById("gh");
    title_h.innerHTML = projects[index].name;
    desc_h.innerHTML = projects[index].desc;
    github_logo.href = projects[index].github_url;
    var languages = document.getElementById("languages");
    languages.innerHTML = "";
    for (const [key, value] of Object.entries(projects[index].lang)) {
        var lab = document.createElement("label");
        lab.innerHTML = key + ":" + value + "%   ";
        languages.appendChild(lab);

    }
}


