import React, { Component } from "react";
import "./app.css";

class App extends Component {
  state = { state: "waiting" };
  listening = false;
  dialect = "es-US";

  // Load some data from the server to demonstrate communication between
  // the client and Node
  async componentDidMount() {
    if (!("webkitSpeechRecognition" in window)) {
      this.setState({
        upgrade: true
      });
    }

    try {
      const data = await fetch("/get-word");
      const json = await data.json();
      this.setState(json);

      const intervalId = setInterval(this.timer, 300);
      this.setState({ intervalId: intervalId });
    } catch (e) {
      console.log("Failed to fetch message", e);
    }
  }

  timer = () => {
    if (this.state.messagesStyleClass) {
      this.setState({
        messagesStyleClass: ""
      });
    } else {
      this.setState({
        messagesStyleClass: " messages-bold"
      });
    }
  };

  continue = () => {
    this.setState({
      state: "playing"
    });

    var recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      this.recognizing = true;
    };

    recognition.onresult = event => {
      let said = event.results[event.results.length - 1][0].transcript;
      said = said.split(" ").slice(-1)[0];

      this.setState({
        said
      });

      const normalizedSaid = said
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const normalizedWord = this.state.word
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (
        normalizedSaid.toLowerCase().trim() ===
        normalizedWord.toLowerCase().trim()
      ) {
        this.setState({
          state: "finished"
        });
      }
    };

    recognition.lang = this.dialect;
    recognition.start();
  };

  another = () => {
    try {
      fetch("/get-another")
        .then(response => response.json())
        .then(json => {
          const randomIndex = Math.floor(Math.random() * 6);
          const bgColorClass = `color${randomIndex}`;

          for (let i = 0; i < 6; i++) {
            document.body.classList.remove(`color${i+1}`);
          }

          document.body.classList.add(bgColorClass);

          this.setState(json);

          this.setState({
            state: "waiting"
          });
        });
    } catch (e) {
      console.log("Failed to fetch message", e);
    }
  };

  appView = () => {
    const inputClasses =
      this.state.state === "waiting" ? "input" : "input input-visible";

    let wordClasses = "word-container word-container-appear";

    if (this.state.state === "playing") {
      wordClasses += " word-hint";
    } else if (this.state.state === "finished") {
      wordClasses += " word-finished";
    }

    const messagesClasses = `${"messages"}${this.state.messagesStyleClass}`;

    let message;

    if (this.state.state === "playing") {
      message = <div className={messagesClasses}>Say the word!</div>;
    } else if (this.state.state === "waiting") {
      message = (
        <div className={messagesClasses}>
          How good is your Spanish pronunciation?
        </div>
      );
    } else if (this.state.state === "finished") {
      message = <div className={messagesClasses}>You did it!</div>;
    }

    const instructions =
      this.state.state === "waiting" ? (
        <div className="instructions">
          <button onClick={this.continue}>Click to Play</button>
        </div>
      ) : null;

    const another =
      this.state.state === "finished" ? (
        <div className="instructions">
          <button onClick={this.another}>Get another Word</button>
        </div>
      ) : null;

    return (
      <div className="app">
        <div className={inputClasses}>{this.state.said}</div>

        <div className={wordClasses}>
          <div className="word">{this.state.word}</div>

          <div className="definition">
            <span className="definition-line" />

            <span className="definition-text">{this.state.definition}</span>
          </div>
        </div>

        {instructions}

        {another}

        {message}
      </div>
    );
  };

  render() {
    const upgrade = this.state.upgrade ? (
      <p className="upgrade">
        Web Speech API is not supported by this browser. Upgrade to{" "}
        <a href="//www.google.com/chrome">Chrome</a> to play the game.
      </p>
    ) : null;

    const appView = upgrade || this.appView();

    return appView;
  }
}

export default App;
