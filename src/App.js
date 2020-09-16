import React from 'react';
import images from './cans.js';
import './App.css';

//arrays and functions

//const flavors = ["limoncello", "pasteque", "hibiscus", "keylime", "tangerine", "apricot", "mango", "passionfruit", "coconut", "pamplemousse", "peachpear", "berry", "razzcranberry", "orange", "lemon", "lime"];
let canArray = [...images];
console.log(canArray);


function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

//creates an array of all cans qualifying for the current round
function generateRound(arr, roundNum) {
  const qualified = arr.filter(arr => arr.ascore === roundNum);
  shuffle(qualified);
  return qualified;
}

shuffle(images);

//components

class CanDisplay extends React.Component {
  

  render() {
    const flavor = this.props.selected;
    return(<div style={{display:'inline-block'}}>
      <img src={flavor.src} alt={flavor.description}/>
      <h2>{flavor.description}</h2>
    </div>)
  
  }
}

class Comparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      round: 0,
      cans: canArray,
      currentRound: '',
      firstCan: '',
      firstCanIndex: 0,
      secondCan: '',
      secondCanIndex: 0,
      winner: ''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.generateMatch = this.generateMatch.bind(this);
  }

  componentDidMount() {
    let bracket = generateRound(this.state.cans, this.state.round);
    const firstMatch = this.generateMatch(bracket);
    this.setState({
      currentRound:bracket,
      firstCan: firstMatch[0].can,
      firstCanIndex: firstMatch[0].index,
      secondCan: firstMatch[1].can,
      secondCanIndex: firstMatch[1].index
    })
  }

  generateMatch(arr) {
    if (arr.length === 0) {
      const nextRound = this.state.round + 1;
      let newBracket = generateRound(canArray, nextRound);
      const nextMatch = this.generateMatch(newBracket);
      this.setState({
        round: nextRound,
        currentRound: newBracket
      })
      return nextMatch;
      
    }
    if (arr.length === 1) {
      this.setState({winner:arr});
      return this.state.winner;
    }
    if (arr.length >= 2) {
      const firstCan = arr.pop();
      const firstIndex = canArray.indexOf(firstCan);
      const secondCan = arr.shift();
      const secondIndex = canArray.indexOf(secondCan);
      
      const matchUp = [{can:firstCan, index:firstIndex},{can:secondCan, index:secondIndex}];
  
      return matchUp;
    }
  };

  resolveFirstWin() {
    canArray[this.state.firstCanIndex].ascore = canArray[this.state.firstCanIndex].ascore+1;
    canArray[this.state.secondCanIndex].ascore = -1;
    this.setState({
      cans:canArray
    });

    const nextMatch = this.generateMatch(this.state.currentRound);


    if (nextMatch.length === 2){
    this.setState({
      firstCan: nextMatch[0].can,
      firstCanIndex: nextMatch[0].index,
      secondCan: nextMatch[1].can,
      secondCanIndex: nextMatch[1].index
    });
  }
  }
  

  resolveSecondWin() {
    canArray[this.state.firstCanIndex].ascore = -1;
    canArray[this.state.secondCanIndex].ascore = canArray[this.state.secondCanIndex].ascore +1;
    this.setState({
      cans:canArray
    });
    const nextMatch = this.generateMatch(this.state.currentRound)

    if (nextMatch.length === 2){
    this.setState({
      firstCan: nextMatch[0].can,
      firstCanIndex: nextMatch[0].index,
      secondCan: nextMatch[1].can,
      secondCanIndex: nextMatch[1].index
    });
  }
  }

  reset() {
    canArray.map(item => item.ascore =0);
    let bracket = generateRound(canArray, 0);
    const firstMatch = this.generateMatch(bracket);
    this.setState({
      round:0,
      cans:canArray,
      currentRound:bracket,
      firstCan: firstMatch[0].can,
      firstCanIndex: firstMatch[0].index,
      secondCan: firstMatch[1].can,
      secondCanIndex: firstMatch[1].index,
      winner:''
    })
  }

  render() {

    if (this.state.winner === '') {return(
      <div>
        <h1 className='Title'>pick your favorite</h1>
        <button className = 'Can-button' onClick={this.resolveFirstWin.bind(this)}><CanDisplay selected={this.state.firstCan} index = {this.state.firstCanIndex}/></button>
        <button className = 'Can-button' onClick={this.resolveSecondWin.bind(this)}><CanDisplay selected={this.state.secondCan} index = {this.state.secondCanIndex}/></button>
        <br/>
        <button className='App-button' onClick={this.reset.bind(this)}>reset</button>
      </div>
    )} else {
      return(
        <div>
          <h1 className='Title'>your favorite flavor:</h1>
          <img src={this.state.winner[0].src} alt={this.state.winner[0].description}/>
          <h2>{this.state.winner[0].description}</h2>
          <br/>
          <button className='App-button' onClick={this.reset.bind(this)}>reset</button> 
        </div>
      )
    }
  
  }
}


function App() {
  return (
    <div className="App">

    <Comparison/>    
    </div>
  );
}

export default App;
