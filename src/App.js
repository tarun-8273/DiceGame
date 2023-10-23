import React, { Component } from "react";
import "./App.css";

class DiceGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      currentPlayerIndex: 0,
      round: 1,
      totalRounds: 3,
      scores: {},
      currentRoll: null,
      roundOver: false,
      gameStarted: false,
      timer: 0,
      isTimerRunning: false,
    };
  }

  initializeGame = () => {
    const numPlayers = parseInt(prompt("Enter the number of players:"));
    if (isNaN(numPlayers) || numPlayers < 1) {
      alert("Please enter a valid number of players.");
      return;
    }

    const players = [];
    for (let i = 1; i <= numPlayers; i++) {
      const playerName = prompt(`Enter name for Player ${i}:`);
      if (playerName) {
        players.push(playerName);
      } else {
        alert("Please enter a name for each player.");
        return;
      }
    }

    const totalRounds = parseInt(prompt("Enter the total number of rounds:"));
    if (isNaN(totalRounds) || totalRounds < 1) {
      alert("Please enter a valid number of rounds.");
      return;
    }

    this.setState({ players, totalRounds, gameStarted: true }, () => {
      this.startTimer(); // Start the timer when the game starts
    });
  };

  startTimer = () => {
    this.setState({ isTimerRunning: true });
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer + 1 }));
    }, 1000);
  };

  stopTimer = () => {
    clearInterval(this.timerInterval);
    this.setState({ isTimerRunning: false });
  };

  rollDice = () => {
    const newRoll = Math.floor(Math.random() * 6) + 1;
    this.setState({ currentRoll: newRoll });
  };

  endRound = () => {
    const {
      players,
      currentPlayerIndex,
      scores,
      round,
      currentRoll,
      totalRounds,
    } = this.state;

    const currentPlayer = players[currentPlayerIndex];
    const newScore = (scores[currentPlayer] || 0) + currentRoll;
    scores[currentPlayer] = newScore;

    if (currentPlayerIndex === players.length - 1) {
      if (round === totalRounds) {
        this.determineWinner();
      } else {
        this.setState({ roundOver: true, scores });
      }
    } else {
      this.setState({ currentPlayerIndex: currentPlayerIndex + 1 });
    }
  };

  determineWinner = () => {
    this.stopTimer(); // Stop the timer when the game is over

    const scores = this.state.scores;
    let maxScore = 0;
    let winners = [];

    for (const player of this.state.players) {
      if (scores[player] > maxScore) {
        maxScore = scores[player];
        winners = [player];
      } else if (scores[player] === maxScore) {
        winners.push(player);
      }
    }

    if (winners.length === 1) {
      alert(
        `Game Over! The winner is ${winners[0]} with a score of ${maxScore}.`
      );
    } else {
      alert(
        `Game Over! It's a tie between ${winners.join(
          " and "
        )} with a score of ${maxScore}.`
      );
    }
  };

  startNextRound = () => {
    const { round, totalRounds } = this.state;
    if (round === totalRounds) {
      this.determineWinner();
    } else {
      this.setState({
        round: round + 1,
        currentPlayerIndex: 0,
        currentRoll: null,
        roundOver: false,
      });
    }
  };

  render() {
    const {
      players,
      round,
      currentPlayerIndex,
      scores,
      currentRoll,
      roundOver,
      gameStarted,
      timer,
      isTimerRunning,
    } = this.state;

    if (!gameStarted) {
      return (
        <div>
          <button className="start-button" onClick={this.initializeGame}>
            Start Game
          </button>
        </div>
      );
    }

    const currentPlayer = players[currentPlayerIndex];

    return (
      <div className="dice-game-container">
        <h1>DiceRoll Challenge - Round {round}</h1>
        <div>
          <h2 className="player-heading">Current Player: {currentPlayer}</h2>
          {roundOver ? (
            <button className="next-round-button" onClick={this.startNextRound}>
              Start Next Round
            </button>
          ) : (
            <div>
              <p className="current-roll">
                Current Roll: {currentRoll || "Not rolled yet"}
              </p>
              <button className="roll-button" onClick={this.rollDice}>
                Roll the Dice
              </button>
              <button className="end-turn-button" onClick={this.endRound}>
                End Turn
              </button>
              <p className="timer">Timer: {timer} seconds</p>
              {isTimerRunning ? (
                <button className="stop-timer-button" onClick={this.stopTimer}>
                  Stop Timer
                </button>
              ) : null} {/* Removed "Start Timer" button */}
            </div>
          )}
        </div>
        <div>
          <h2>Leaderboard</h2>
          {players.map((player) => (
            <div key={player}>
              <p>
                {player}:{" "}
                <span className="score">{scores[player] || 0} points</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <DiceGame />
    </div>
  );
}

export default App;
