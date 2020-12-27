// ------------------------------------------------------  API CALLS

const getRoverInfo = async roverName => {
  try {
    await fetch(`http://localhost:3000/roverInfo/${roverName}`)
      .then(res => res.json())
      .then(roverInfo => {
        console.log(roverInfo);
      });
  } catch (error) {
    console.log("error:", err);
  }
};

const ClickRoverButton = async e => {
  await getRoverInfo(e.target.value);
};

const aa = document.querySelector(".aa");
aa.addEventListener("click", e => {
  ClickRoverButton(e);
});
