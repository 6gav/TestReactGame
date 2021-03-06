import React, { Component } from 'react';
import './game.css';

var App;
var ball;
var player1;
var player2;

var dict = {

}

class Game extends Component{

  constructor(props){
    super(props);
    this.keyDownFunction = this.keyDownFunction.bind(this);
    this.keyUpFunction = this.keyUpFunction.bind(this);

  }

  keyDownFunction(event){
    console.log('Key pressed ' + event.keyCode);
    switch(event.keyCode){
      case 87:
        dict.w = true;
        break;
      case 83:
      dict.s = true;
        break;
      case 38:
      dict.up = true;
        break;
      case 40:
      dict.down = true;
        break;

    }
  }

  keyUpFunction(event){
    console.log('Key released ' + event.keyCode);
    switch(event.keyCode){
      case 87:
        dict.w = false;
        break;
      case 83:
      dict.s = false;
        break;
      case 38:
      dict.up = false;
        break;
      case 40:
      dict.down = false;
        break;

    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyDownFunction, false);
    document.addEventListener("keyup", this.keyUpFunction, false);
    ball = document.getElementById('ball');
    player1 = document.getElementById('paddle1');
    player2 = document.getElementById('paddle2');
    this.testServer();
    this.sendInput();
  }

  async testServer(){
    while(true){
      await sleep(10);
      const response = await fetch('/api/getCount', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await response.json();
      if(body){

        this.setPosition(body);

      }
    }
  }

  async sendInput(){
    while(true){
      await sleep(50);

      const response = await fetch('/api/SetStates', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dict),
      });
      const body = await response.json()
      if(body){
        console.log(body);
      }
    }
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyDownFunction, false);
    document.removeEventListener("keyup", this.keyUpFunction, false);
  }

  setPosition(body){
    var x = body.ball.xpos * (window.innerWidth * 0.98) + "px";
    var y = body.ball.ypos * (window.innerHeight * 0.965)+ "px";
    ball.style.left = x;
    ball.style.top = y;
    console.log(body)

    y = body.player1.ypos * (window.innerHeight* 0.87) + "px";
    player1.style.top = y
    y = body.player2.ypos * (window.innerHeight* 0.87) + "px";
    player2.style.top = y
  }

  render(){
    return(
      <div className = 'App'>
        <header className = 'App-header' onKeyPress={this.handleKey}>
          <a id='ball'/>
          <a id='paddle1' className = 'paddle'/>
          <a id='paddle2' className = 'paddle'/>
        </header>
      </div>
    );
  }
}

async function sleep(millis){
  return new Promise(resolve => setTimeout(resolve, millis));
}

export default Game;
