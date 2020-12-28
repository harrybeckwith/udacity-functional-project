let store = {
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
  let { rovers, apod } = state;

  return `
      <header></header>
      <main>
          ${Greeting(store.user.name)}
          <section>
              <h3>Put things on the page!</h3>
              <p>Here is an example section.</p>
              <p>
                  One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                  the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                  This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                  applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                  explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                  but generally help with discoverability of relevant imagery.
              </p>
              ${ImageOfTheDay(apod)}
          </section>
      </main>
      <footer></footer>
  `;
};

const formattRoverGallery = arr => {
  return arr.map(item => item.img_src);
};

const getRoverInfo = async roverName => {
  try {
    await fetch(`http://localhost:3000/roverInfo/${roverName}`)
      .then(res => res.json())
      .then(roverInfo => {
        const photos = formattRoverGallery(roverInfo.roverData.photos);
        console.log(photos);
      });
  } catch (error) {
    console.log("error:", error);
  }
};

const ClickRoverButton = async e => {
  await getRoverInfo(e.target.value);
};

const aa = document.querySelector(".aa");
aa.addEventListener("click", e => {
  ClickRoverButton(e);
});
