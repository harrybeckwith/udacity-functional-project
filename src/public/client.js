let store = {
  photos: [],
  name: "",
  launchDate: "",
  landingDate: "",
  status: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"]
};

// ------------------------------------------------------  API CALLS

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = state => {
  let { rovers, photos, name, launchDate, landingDate, status } = state;

  return `
      <div>
      <section>
        ${displayRoverNames(rovers)}
      </section>
          <section style="${checkAvailable(photos)}">
              <p>Name: ${name}</p>
              <p>Launch date: ${launchDate}</p>
              <p>Landing date: ${landingDate}</p>
              <p>Status: ${status}</p>
          </section>
      </div>
    
  `;
};

const checkAvailable = arr => {
  if (arr.length > 0) {
    return "display:block;";
  } else {
    return "display:none;";
  }
};

// rover names as buttons
const displayRoverNames = arr => {
  return arr
    .map(
      item =>
        `<div class="rover-btn" id="${item.toLowerCase()}" onClick="ClickRoverButton(this)">${item}</div>`
    )
    .join(" ");
};

const findRoverData = (arr, searchName) => {
  return arr.map(item => item[searchName]);
};

const getRoverInfo = async roverName => {
  try {
    await fetch(`http://localhost:3000/roverInfo/${roverName}`)
      .then(res => res.json())
      .then(roverInfo => {
        const photos = findRoverData(roverInfo.roverData.photos, "img_src");
        const name = roverInfo.roverData.photos[0].rover.name;
        const launchDate = roverInfo.roverData.photos[0].rover.launch_date;
        const landingDate = roverInfo.roverData.photos[0].rover.landing_date;
        const status = roverInfo.roverData.photos[0].rover.status;

        const newState = {
          photos,
          name,
          launchDate,
          landingDate,
          status
        };

        updateStore(store, newState);
      });
  } catch (error) {
    console.log("error:", error);
  }
};

const ClickRoverButton = async e => {
  await getRoverInfo(e.id);
};
render(root, store);
