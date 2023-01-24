


const projects = [];
var current_proj = 0;
class Project {
    constructor(name, desc) {
      this.name = name;
      this.desc = desc;
    }
}

window.onload = (event) => {
    setupContent();
  };

async function setupContent(){
    var reposJson = await getRepos();
    for (let index = 0; index < reposJson.length; index++) {
        var readme = await getReadme(reposJson[index].name); 
        projects.push(new Project(reposJson[index].name, readme));
    }
    showProject(0);
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

async function getReadme(name){
    const request = new Request('https://api.github.com/repos/wallentinr/' + name + '/readme', {method: 'GET'});
    var response = await fetch(request);
    var ret = await getHTML(name, b64_to_utf8(response.json().content));
    return ret;
}

async function getRepos(){
    const request = new Request('https://api.github.com/users/wallentinr/repos', {method: 'GET'});
    var response = await fetch(request);
    console.log(response);
    return response.json();
}


async function getHTML(name, body){
    var body_text = {"text":body };
    
    const request = new Request('https://api.github.com/markdown', {method: 'POST', body: JSON.stringify(body_text)});
    var response = await fetch(request);
    if(response.status === 200){
        return response.text();
    }

    return -1;
}


function showProject(index){
    var project_h = document.getElementsByClassName("project")[0];
    var title_h = project_h.getElementsByClassName("project-title")[0];
    var desc_h = project_h.getElementsByClassName("project-desc")[0];
    title_h.innerHTML = projects[index].name;
    desc_h.innerHTML = projects[index].desc;
}


