
let content = document.getElementsByClassName("app");
console.log(content + "content is loaded correctly ^_^");

const draw = () => {
  setInterval(() => {
    //functions to draw in here...
  }, 10000) //1000 = 1 second 10000 = 10 seconds etc...
}

const initialiseGame = () => {
  let app = document.getElementById("app");
  
  drawCanvas(app);
  const startButton = ('<button onClick="startMovement" className="start-button">START GAME</button>');
  
  //app.innerHTML = content;
}

const drawCanvas = (app) => {
  const myCanvas = ('<canvas className="app-canvas">Browser does not support canvas"</canvas>');
  app.innerHTML = myCanvas;
}

initialiseGame()