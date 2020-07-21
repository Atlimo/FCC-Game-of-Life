class Square extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      squareStatus: props.squareStatus,
      row: props.row,
      col: props.col
    };
    this.toggleSquare = this.toggleSquare.bind(this);
  }

  //If the game is not running then turn square on/off
  toggleSquare(){
    if(!this.props.gameStarted){
      if(this.state.squareStatus === "off"){
        this.setState({squareStatus: "on"});
      }
      else{
        this.setState({squareStatus: "off"});
      }
      this.props.toggleSquare(this.state.row, this.state.col);
    }
  }

  render(){
    if(this.state.squareStatus === "newOn"){
      return(
        <button className="newSquareOn square" onClick={this.toggleSquare}/>
      );
    }
    else if(this.state.squareStatus === "on"){
      return(
        <button className="squareOn square" onClick={this.toggleSquare}/>
      );
    }
    else{
      return(
        <button className="squareOff square" onClick={this.toggleSquare}/>
      );
    }
  }
};

var mainWin;
var checkInterval;
class MainWindow extends React.Component{
  constructor(){
    super();

    mainWin = this;

    var squareStatus = [];
    for(var y = 0; y < 50; y++){
      squareStatus.push([]);
      for(var x = 0; x < 50; x++){
        if( Math.floor( (Math.random()*10)+1 ) < 2){
          squareStatus[y].push("on");
        }
        else{
          squareStatus[y].push("off");
        }
      }
    }

    this.state={
      cols: 50,
      rows: 50,
      squareStatus: squareStatus,
      gameStarted: true,
      gameStatus: "Paused",
      displaySpeed: 100,
      generation: 0
    };

    this.totalNeighbors = this.totalNeighbors.bind(this);
    this.toggleSquare = this.toggleSquare.bind(this);
    this.checkGrid = this.checkGrid.bind(this);
    this.runGame = this.runGame.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.generate = this.generate.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);

    this.runGame();
  }

  toggleSquare(row, col){
    var squareStatus = this.state.squareStatus;
    if(squareStatus[row][col] !== "off"){
      squareStatus[row][col] = "off";
    }
    else{
      squareStatus[row][col] = "on";
    }
    this.setState({squareStatus: squareStatus});
  }

  checkGrid(){
    var squareStatus = this.state.squareStatus;
    var squareUpdate = [];

    for(var row = 0; row < this.state.rows; row++){
      for(var col = 0; col < this.state.cols; col++){

        switch(this.totalNeighbors(row, col))
            {
          case 3:
            if(squareStatus[row][col] === "newOn"){
              squareUpdate.push([row, col, "on"]);
            }
            else if(squareStatus[row][col] === "off"){
              squareUpdate.push([row, col, "newOn"]);
            }
            break;
          case 2:
            if(squareStatus[row][col] === "newOn"){
              squareUpdate.push([row, col, "on"]);
            }
            break;
          default:
            squareUpdate.push([row, col, "off"]);
        }
      }
    }

    for(var x = 0; x < squareUpdate.length; x++){
      squareStatus[squareUpdate[x][0]][squareUpdate[x][1]] = squareUpdate[x][2];
    }

    this.setState({squareStatus: squareStatus, generation: this.state.generation+1});
  }

  //determine if the square is enabled or disabled
  totalNeighbors(row, col){
    var totalNeighbors = 0;//Total active squares adjacent to current square
    var squareStatus = this.state.squareStatus;
    var newRow = 0;
    var newCol = 0;

    //Increment totalNeighbors for each active and adjacent square
    for(var rowMod = -1; rowMod < 2; rowMod++){
      for(var colMod = -1; colMod < 2; colMod++){
        newRow = row+rowMod;
        newCol = col+colMod;

        if(rowMod !== 0 || colMod !== 0){
          if(newRow >= this.state.rows)
            newRow = 0;
          else if(newRow <= -1)
            newRow = this.state.rows-1;

          if(newCol >= this.state.cols)
            newCol = 0;
          else if(newCol <= -1)
            newCol = this.state.cols-1;

          
          if(squareStatus[newRow][newCol] !== "off"){
            totalNeighbors++;
          }
        }
      }
    }
    return totalNeighbors;
  }

  runGame(){
    this.setState({gameStarted: true, gameStatus: "On"});
    checkInterval = setInterval(this.checkGrid, this.state.displaySpeed);
    console.log("Running Game");
  }

  pauseGame(){
    clearInterval(checkInterval);
    document.getElementById("gameStatus").html = "Game Status: Off";
    this.setState({gameStarted: false, gameStatus: "Paused"});
  }

  clearGrid(){
    clearInterval(checkInterval);
    document.getElementById("gameStatus").html = "Game Status: Off";
    var squareStatus = this.state.squareStatus;
    for(var y = 0; y < this.state.rows; y++){
      for(var x = 0; x < this.state.cols; x++){
        squareStatus[y][x] = "off";
      }
    }
    this.setState({squareStatus: squareStatus, gameStarted: false, gameStatus: "Paused", generation: 0});
  }

  generate(){
    clearInterval(checkInterval);
    this.setState({gameStarted: false});

    var squareStatus = this.state.squareStatus;
    for(var y = 0; y < this.state.rows; y++){
      for(var x = 0; x < this.state.cols; x++){
        if(Math.floor( (Math.random()*10)+1 ) < 2){
          squareStatus[y][x] = "on";
        }
        else{
          squareStatus[y][x] = "off";
        }
      }
    }
    this.setState({squareStatus: squareStatus, gameStatus: "Paused", generation: 0});
  }

  changeSpeed(){
    clearInterval(checkInterval);
    this.setState({displaySpeed: document.getElementById("myRange").value});
    if(this.state.gameStarted){
      checkInterval = setInterval(this.checkGrid, document.getElementById("myRange").value);
    }
  }

  //Re-rendering the button requires a key value
  render(){

    var squares = [];

    for(var row = 0; row < this.state.rows; row++){
      squares.push([]);
      for(var col = 0; col < this.state.cols; col++){
        squares[row].push(<Square key={Math.random().toString(36).substr(2, 9)} toggleSquare={this.toggleSquare} squareStatus={this.state.squareStatus[row][col]} row={row} col={col} gameStarted={this.state.gameStarted}/>);
      }
    }

    return(
      <div id="mainWin">
        <div id="gameStatusDiv" className=""><h1 id="gameStatus">Game Status: {this.state.gameStatus}</h1></div>
        <div id="btnContainer" className="row"><br/><br/>
          <span className="col-xs-3 col-xs-push-0"><button className="menuBtn" onClick={this.runGame}>Run</button></span>
          <span className="col-xs-3 col-xs-push-0"><button className="menuBtn" onClick={this.generate}>Generate</button></span>
          <span className="col-xs-3 col-xs-push-0"><button className="menuBtn" onClick={this.pauseGame}>Pause</button></span>
          <span className="col-xs-3 col-xs-push-0"><button className="menuBtn" onClick={this.clearGrid}>Clear</button></span>
        </div>
        <h1 className="centerText">Generation: {this.state.generation}</h1>
        <br/>
        <h1 className="centerText">Generation Speed</h1>
        <div id="slidecontainer">
          <input id="myRange" className="slider" type="range" step="10" min="0" max="800" defaultValue="100" onChange={this.changeSpeed}/>
        </div>
        <br/><br/>
        <span id="squareGrid">{squares}</span>
      </div>
    );
  }
};

ReactDOM.render(<MainWindow/>,document.getElementById("mainDiv"));