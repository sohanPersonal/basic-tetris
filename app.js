document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector(".grid");
    const miniGrid = document.querySelector(".mini-grid");
    var newDiv;
    for(i = 0; i < 200; i++){
        newDiv=document.createElement("div");
        grid.appendChild(newDiv);
    }
    for(i = 0; i < 10; i++){
        newDiv=document.createElement("div");
        newDiv.classList.add('taken');
        grid.appendChild(newDiv);
    }
    for(i = 0; i < 16; i++){
        newDiv=document.createElement("div");
        miniGrid.appendChild(newDiv);
    }
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const GRID_WIDTH = 10;
    let nextRandom = 0;
    let score = 0;
    const scoreDisplay = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");
    let timerId


    const colors = [
        'red','blue','green','orange','purple'
    ]

    //The Tetrominoes
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4;
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let currentRotation = 0;




  let current = theTetrominoes[random][currentRotation];


  function draw(){
    current.forEach(index=> {
        squares[currentPosition + index].classList.add("tetromino");
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  

  function undraw(){
    current.forEach(index=> {
        squares[currentPosition + index].classList.remove("tetromino");
        squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  //timerId = setInterval(moveDown,1000);


  //assign functions to keycodes
 function control(e){
     if(e.keyCode === 37){
         moveLeft();
     } else if(e.keyCode === 38){
         rotate();
     } else if(e.keyCode === 39){
        moveRight();
     } else if(e.keyCode === 40){
         moveDown();
     }
 } 
 document.addEventListener('keyup', control)



  function moveDown(){
      undraw()
      currentPosition += GRID_WIDTH
      draw()
      freeze()
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))

        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4;
        draw()
        displayShape()
        addScore()
        gameOver()
    }
  }

  function moveLeft(){
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0)

      if(!isAtLeftEdge) currentPosition -= 1


     if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
         currentPosition +=1;
     }

     draw();
  }

  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1)

    if(!isAtRightEdge) currentPosition += 1


   if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
       currentPosition -=1;
   }

   draw();
}

  function rotate(){
      undraw()
      currentRotation++
      if(currentRotation === current.length){
        currentRotation = 0; 
      }

      current = theTetrominoes[random][currentRotation]
      draw()
  }


  //show up next tetromino in the mini grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4;
  const displayIndex =0;
  


  //the tetrominos without rotation
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],

  ]

  function displayShape(){
      displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundColor = ''
      })
      upNextTetrominos[nextRandom].forEach( index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })

  }

  startButton.addEventListener('click', () => {
      if(timerId){
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown,1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
  })


  function addScore(){
      for(let i=0; i< 199; i+=GRID_WIDTH){
        const row = [i, i+1, i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]


        if(row.every(index => squares[index].classList.contains('taken')) ){
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index =>{
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, GRID_WIDTH)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
      }
  }

  function gameOver(){
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
          scoreDisplay.innerHTML = 'end'
          clearInterval(timerId)
      }
  }


});