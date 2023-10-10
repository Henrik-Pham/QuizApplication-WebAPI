import express from "express";
import bodyParser from "body-parser";
const app = express();

import {isCorrectAnswer, randomQuestion, Questions} from "./questions.js"

app.use(bodyParser.json()),
    app.use(express.static("../client/dist"));

app.get("/api/questions/random", (req, res) => {
    const {id, question, answers} = randomQuestion();
    res.json({id, question, answers})
})

app.post("/api/questions/answer", (req, res) => {
    const {id, answer} = req.body;
    const question = Questions.find(q => q.id === id);
    const correct = isCorrectAnswer(question, answer);
    res.json({correct})
})

app.get("/api/score", (req, res) => {
    const score = 0;
    res.json({score})
})

app.listen(process.env.PORT || 3001);

