let store = {
  photos: [],
  name: "",
  launchDate: "",
  landingDate: "",
  status: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"]
};

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
          <section style="${checkAvailable(photos)}" class="rover">
              <p>Name: ${name}</p>
              <p>Launch date: ${launchDate}</p>
              <p>Landing date: ${landingDate}</p>
              <p>Status: ${status}</p>
              <div class="rover__gallery">
              
              ${formattPhotos(photos)}
              </div>
          </section>
      </div>
  `;
};
// Create photo markup for gallery
const formattPhotos = arr => {
  return arr
    .map(item => `<img src ="${item}" class="rover__gallery__img">`)
    .join(" ");
};
// check if any data
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
        `<div class="rover-btn" id="${item.toLowerCase()}" onClick="clickRoverButton(this)">${item}</div>`
    )
    .join(" ");
};
// search via name, store all photos in arr
const findRoverData = (arr, searchName) => {
  return arr.map(item => item[searchName]);
};
// pass in rover name on click
const getRoverInfo = async roverName => {
  // make api call
  try {
    await fetch(`http://localhost:3000/roverInfo/${roverName}`)
      .then(res => res.json())
      .then(roverInfo => {
        // store data
        const photos = findRoverData(roverInfo.roverData.photos, "img_src");
        const name = roverInfo.roverData.photos[0].rover.name;
        const launchDate = roverInfo.roverData.photos[0].rover.launch_date;
        const landingDate = roverInfo.roverData.photos[0].rover.landing_date;
        const status = roverInfo.roverData.photos[0].rover.status;
        // place into store object
        const newState = {
          photos,
          name,
          launchDate,
          landingDate,
          status
        };
        // use found data to update store
        updateStore(store, newState);
      });
  } catch (error) {
    console.log("error:", error);
  }
};
// click on rover button
const clickRoverButton = async e => {
  // send id to api call
  await getRoverInfo(e.id);
};
// render to begin for buttons
render(root, store);
