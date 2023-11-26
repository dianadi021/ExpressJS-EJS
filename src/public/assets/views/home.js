/** @format */

const FetchData = async (url, mapkey) => {
  const dataString = await fetch(url);
  const toJSON = await dataString.text();
  const dataJSON = JSON.parse(toJSON);
  const dataMap = new Map();
  dataMap.set(mapkey, dataJSON[mapkey]);
  return dataMap.get(mapkey);
};

//COMMUNITY WITH JSON
async function CommunityDisplay(serverURL) {
  const objectData = await FetchData(url, 'Community');
  const first = `
    <div class="container-content">
        <div id="title-article">
            <h2 class="brd-bt-3">community</h2>
        </div>
        <div class="container-content container">
    `;
  let community = ``;
  for (const list of objectData) {
    community += `
    <div class="items-list-card card p-1">
        <img src="${list.img}" class="card-img-top" alt="${list.altIMG}" />
        <div class="card-body">
            <p class="card-text m-0">${list.description}</p>
            <div class="btn btn-primary btn-projects">
                <a class="text-white" href="${list.link}" target="_blank" rel="noopener noreferrer">${list.name}</a>
            </div>
        </div>
    </div>
    `;
  }
  const end = `
        </div>
    </div>
  `;
  //console.log(objectData[0].link);
  $('#community').html(first + community + end);
}

//PROJECT WITH JSON
async function ProjectsDisplay(serverURL) {
  const objectData = await FetchData(url, 'Projects');
  const first = `
    <div class="container-content">
        <div id="title-article">
            <h2 class="brd-bt-3">projects</h2>
        </div>
        <div class="container-content container">
    `;
  let projects = ``;
  for (const list of objectData) {
    projects += `
    <div class="items-list-card card p-1">
        <img src="${list.img}" class="card-img-top" alt="${list.altIMG}" />
        <div class="card-body">
            <p class="card-text m-0">${list.description}</p>
            <div class="btn btn-primary">
                <a class="text-white" href="${list.link}" target="_blank" rel="noopener noreferrer">${list.name}</a>
            </div>
        </div>
    </div>
    `;
  }
  const end = `
        </div>
    </div>
  `;
  //console.log(objectData[0].link);
  $('#projects').html(first + projects + end);
}
