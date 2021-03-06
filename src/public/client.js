let store = Immutable.Map({
  photos: [],
  name: "",
  launchDate: "",
  landingDate: "",
  status: "",
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  showRoverInfo: false
});
// Add our markup to the page
const root = document.getElementById("root");
// Update store current and new
const updateStore = (store, newState) => {
  store = store.merge(store, newState);
  render(root, store);
};
// Display to html
const render = async (root, state) => {
  root.innerHTML = App(state);
};

// Create content
const App = state => {
  return `
  <header>
    <div class="rover-btns">
      ${displayRoverNames(state.get("rovers"))}
    </div>
    <div class="rover__details" style="${displayToggle(
      state.get("showRoverInfo")
    )}">
      <p class="rover__details__item">
        <span class="rover__details__item--white">Name: </span>
        <span class="rover__details__item--gold">
          ${state.get("name")}
        </span>
      </p>
      <p class="rover__details__item">
        <span class="rover__details__item--white">Launch date:</span>
        <span class="rover__details__item--gold">
          ${state.get("launchDate")}</span
        >
      </p>
      <p class="rover__details__item">
        <span class="rover__details__item--white">Landing date:</span>
        <span class="rover__details__item--gold">
          ${state.get("landingDate")}</span
        >
      </p>
      <p class="rover__details__item">
        <span class="rover__details__item--white">Status:</span
        ><span class="rover__details__item--gold">
          ${state.get("status")}</span
        >
      </p>
    </div>
</header>
<div class="rover__gallery">
  ${formattPhotos(state.get("photos"))}
</div>`;
};
// Check if first button clicked
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
// Rover names as buttons
const displayRoverNames = arr => {
  return arr
    .map(
      item =>
        `<div class="rover-btns__btn" id="${item.toLowerCase()}" onClick="clickRoverButton(this)">${item}</div>`
    )
    .join(" ");
};
// Search via name, store all photos in arr
const findRoverData = (arr, searchName) => {
  return arr.map(item => item[searchName]);
};
// Pass in rover name on click
const getRoverInfo = async roverName => {
  // Make api call
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
        // Place into store object
        const newState = {
          photos,
          name,
          launchDate,
          landingDate,
          status,
          showRoverInfo: true
        };
        // Use found data to update store
        updateStore(store, newState);
      });
  } catch (error) {
    console.log("error:", error);
  }
};
// Click on rover button
const clickRoverButton = async e => {
  // Send id to api call
  await getRoverInfo(e.id);
};

// Render to begin for buttons
render(root, store);
