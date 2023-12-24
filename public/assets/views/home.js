/** @format */

const FetchData = async (serverURL, mapKey) => {
  const dataString = await fetch(serverURL);
  const toJSON = dataString.text();
  const dataJSON = JSON.parse(toJSON);
  const dataMap = new Map();
  dataMap.set(mapKey, dataJSON[mapKey]);
  return dataMap.get(mapKey);
};

//COMMUNITY WITH JSON
async function CommunityDisplay(serverURL) {
  const objectData = await FetchData(serverURL, 'Community');
  const first = `
    <div class="container-content">
        <div id="title-article">
            <h2 class="brd-bt-3">community</h2>
        </div>
        <div class="container-content container">
    `;
  let community = ``;
  objectData.forEach((list) => {
    const { thumbnailImage, title, description, link } = list;
    community += `
    <div class="items-list-card card p-1">
      <img src="${serverURL}/uploads/images/${thumbnailImage}" class="card-img-top" alt="${title}" />
      <div class="card-body">
        <p class="card-text m-0" style="color: black">${description}</p>
        <div class="btn btn-primary btn-projects">
          <a class="text-white" href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
        </div>
      </div>
    </div>
    `;
  });
  const end = `
        </div>
    </div>
  `;
  //console.log(objectData[0].link);
  $('#community').html(first + community + end);
}

//PROJECT WITH JSON
async function ProjectsDisplay(serverURL) {
  const objectData = await FetchData(serverURL, 'Projects');
  const first = `
    <div class="container-content">
        <div id="title-article">
            <h2 class="brd-bt-3">projects</h2>
        </div>
        <div class="container-content container">
    `;
  let projects = ``;
  objectData.forEach((list) => {
    const { thumbnailImage, title, description, link } = list;
    projects += `
    <div class="items-list-card card p-1">
      <img src="${serverURL}/uploads/images/${thumbnailImage}" class="card-img-top" alt="${title}" />
      <div class="card-body">
        <p class="card-text m-0" style="color: black">${description}</p>
        <div class="btn btn-primary btn-projects">
          <a class="text-white" href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
        </div>
      </div>
    </div>
    `;
  });
  const end = `
        </div>
    </div>
  `;
  //console.log(objectData[0].link);
  $('#projects').html(first + projects + end);
}
