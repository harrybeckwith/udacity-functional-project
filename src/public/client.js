let store = Immutable.Map({
  photos: [],
  name: "",
  launchDate: "",
  landingDate: "",
  status: "",
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  showRoverInfo: false
});
// add our markup to the page
const root = document.getElementById("root");
// update store current and new
const updateStore = (store, newState) => {
  store = store.merge(store, newState);
  render(root, store);
};
// display to html
const render = async (root, state) => {
  root.innerHTML = App(state);
};
// create content
const App = state => {
  return `
  <header>
      <div class="rover-btns">
        ${displayRoverNames(state.get("rovers"))}
      </div>
      <div style="${displayToggle(
        state.get("showRoverInfo")
      )}" class="rover__details">
        <p class="rover__details__item"><span class="rover__details__item--white">Name: </span><span class="rover__details__item--gold">${state.get("name")}</span></p>
        <p class="rover__details__item"><span class="rover__details__item--white">Launch date:</span> <span class="rover__details__item--gold"> ${state.get(
          "launchDate"
        )}</span></p>
        <p class="rover__details__item"><span class="rover__details__item--white">Landing date:</span> <span class="rover__details__item--gold"> ${state.get(
          "landingDate"
        )}</span></p>
        <p class="rover__details__item"><span class="rover__details__item--white">Status:</span><span class="rover__details__item--gold">  ${state.get("status")}</span></p>
      </div>
      </header>
         
              <div class="rover__gallery">
              ${formattPhotos(state.get("photos"))}
              </div>
          
  `;
};
// checks
const displayToggle = boolean => {
  if (boolean) return "display:flex";
  return "display:none";
};
// Create photo markup for gallery
const formattPhotos = arr => {
  return arr
    .map(item => `<img src ="${item}" class="rover__gallery__img">`)
    .join(" ");
};
// rover names as buttons
const displayRoverNames = arr => {
  return arr
    .map(
      item =>
        `<div class="rover-btns__btn" id="${item.toLowerCase()}" onClick="clickRoverButton(this)">${item}</div>`
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
          status,
          showRoverInfo: true
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
  console.log(e.id);
  // send id to api call
  await getRoverInfo(e.id);
};

// render to begin for buttons
render(root, store);
