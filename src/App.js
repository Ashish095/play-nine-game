import React from 'react';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

var possibleCombinationSum = function (arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount; i++) {
    var combinationSum = 0;
    for (var j = 0; j < listSize; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
  let stars = [];
  for (let i = 0; i < props.numberOfStars; i++) {
    stars.push(<i key={i} className="fa fa-star"></i>);
  }

  return (
    <div className="col-5">
      {stars}
    </div>
  );
}

const Button = (props) => {
  let button;
  switch (props.answerIsCorrect) {
    case true:
      button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>;
      break;
    case false:
      button =
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>;
      break;
    default:
      button =
        <button className="btn btn-secondary"
          onClick={props.checkAnswer}
          disabled={props.selectedNumbers.length === 0}>
          =
      </button>;
      break;
  }
  // End Switch
  return (
    <div className="col-2 text-center">
      {button}
      <br />
      <br />
      <button className="btn btn-warning btn-sm"
        disabled={props.redraws === 0} onClick={props.redraw}>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => props.unSelectNumber(number)}>
          {number}
        </span>
      )}
    </div>
  );
}

const Number = (props) => {
  const numberClassName = (number) => {
    if (props.usedNumber.indexOf(number) >= 0) {
      return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  }
  return (
    <div className="card text-center">
      <div>
        {Number.List.map((number, i) =>
          <span key={i} className={numberClassName(number)}
            onClick={() => props.selectNumber(number)}>
            {number}
          </span>
        )}
      </div>
    </div>
  );
}
Number.List = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>
        Play Again
      </button>
    </div>
  );
}

class Game extends React.Component {
  static randomNumber = () => 1 + Math.floor(Math.random() * 9);
  static initialState = () => ({
    selectedNumbers: [],
    randonNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumber: [],
    redraws: 5,
    doneStatus: null,
  });
  
  state = Game.initialState();

  resetGame = () => this.setState(Game.initialState());

  selectNumber = (clickedNumber) => {
    // disabled number those are clicked
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }))
  }

  unSelectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers
        .filter(number => number !== clickedNumber)
    }))
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randonNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumber: prevState.usedNumber.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randonNumberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus)
  };

  redraw = () => {
    if (this.state.redraws === 0) { return; }
    this.setState(prevState => ({
      randonNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws - 1,
    }), this.updateDoneStatus);
  };

  possibleSolutions = ({ randonNumberOfStars, usedNumber }) => {
    const possibleNumbers = Number.List.filter(number =>
      usedNumber.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randonNumberOfStars);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumber.length === 9) {
        return { doneStatus: "Done. Nice!" }
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: "Game Over!" };
      }
    });
  };

  render() {
    const {
      selectedNumbers,
      randonNumberOfStars,
      answerIsCorrect,
      usedNumber,
      redraws,
      doneStatus
    } = this.state;

    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randonNumberOfStars} />
          <Button selectedNumbers={selectedNumbers} checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer} redraws={redraws}
            redraw={this.redraw} answerIsCorrect={answerIsCorrect} />
          <Answer selectedNumbers={selectedNumbers} unSelectNumber={this.unSelectNumber} />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} /> :
          <Number selectedNumbers={selectedNumbers}
            usedNumber={usedNumber}
            selectNumber={this.selectNumber} />}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div style={{ margin: '1em' }}>
        <Game />
      </div>
    );
  }
}

export default App;