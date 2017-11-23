const express = require("express");
const helmet = require("helmet");
const expressEnforcesSSL = require("express-enforces-ssl");
const PORT = process.env.PORT || 3001;

const app = express();

// Initialize an express app with some security defaults
app.use(https).use(helmet());

// Application-specific routes
// Add your own routes here!
app.get("/get-word", async (req, res, next) => {
  res.json({ word: "hola", definition: "hello" });
});

app.get("/get-another", async (req, res, next) => {
  const words = [
    { word: "de", definition: "of" },
    { word: "que", definition: "what" },
    { word: "en", definition: "in" },
    { word: "y", definition: "and" },
    { word: "los", definition: "the (male gender)" },
    { word: "las", definition: "the (female gender)" },
    { word: "por", definition: "for" },
    { word: "con", definition: "with" },
    { word: "como", definition: "like" },
    { word: "más", definition: "more" },
    { word: "sobre", definition: "about" },
    { word: "ya", definition: "already" },
    { word: "entre", definition: "between" },
    { word: "cuando", definition: "when" },
    { word: "todo", definition: "everything" },
    { word: "también", definition: "also" },
    { word: "muy", definition: "very" },
    { word: "años", definition: "years" },
    { word: "hasta", definition: "until" },
    { word: "desde", definition: "from" },
    { word: "porque", definition: "because" },
    { word: "yo", definition: "i" },
    { word: "todos", definition: "all" },
    { word: "tiene", definition: "has" },
    { word: "donde", definition: "where" },
    { word: "tiempo", definition: "time" },
    { word: "mismo", definition: "same" },
    { word: "ahora", definition: "now" },
    { word: "cada", definition: "every" },
    { word: "otros", definition: "others" },
    { word: "gobierno", definition: "government" },
    { word: "durante", definition: "during" },
    { word: "tan", definition: "so" },
    { word: "siempre", definition: "forever" },
    { word: "día", definition: "day" },
    { word: "ella", definition: "she/her" },
    { word: "el", definition: "he/him" },
    { word: "tres", definition: "three" },
    { word: "país", definition: "country" },
    { word: "mundo", definition: "world" },
    { word: "estado", definition: "state" },
    { word: "año", definition: "year" },
    { word: "forma", definition: "form" },
    { word: "caso", definition: "case" },
    { word: "hacer", definition: "do" },
    { word: "ayer", definition: "yesterday" },
    { word: "momento", definition: "momment" },
    { word: "hombre", definition: "man/men" },
    { word: "hoy", definition: "today" },
    { word: "lugar", definition: "place" },
    { word: "trabajo", definition: "job" },
    { word: "política", definition: "politics" },
    { word: "pasado", definition: "past" },
    { word: "nunca", definition: "never" },
    { word: "grupo", definition: "group" },
    { word: "cosas", definition: "things" },
    { word: "historia", definition: "history" },
    { word: "noche", definition: "night" },
    { word: "ejemplo", definition: "example" },
    { word: "tarde", definition: "afternoon" },
    { word: "proceso", definition: "process" },
    { word: "número", definition: "number" },
    { word: "gente", definition: "people" },
    { word: "body", definition: "cuerpo" }
  ];

  const randomWord = words[Math.floor(Math.random() * words.length)];

  const newWord = randomWord.word;
  const newDefinition = randomWord.definition;

  res.json({ word: newWord, definition: newDefinition });
});

// Serve static assets built by create-react-app
app.use(express.static("build"));

// If no explicit matches were found, serve index.html
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/build/index.html");
});

app.use(notfound).use(errors);

function https(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers["x-forwarded-proto"];
    if (proto === "https" || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get("Host")}${req.originalUrl}`);
  } else {
    return next();
  }
}

function notfound(req, res, next) {
  res.status(404).send("Not Found");
}

function errors(err, req, res, next) {
  console.log(err);
  res.status(500).send("something went wrong");
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
