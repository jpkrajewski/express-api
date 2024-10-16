import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://loripsum.net/api";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/loremipsum", async (req, res) => {
    const integer = req.body.integer;
    const short = (req.body.short === "on") ? "short" : undefined;
    const decorate = (req.body.decorate === "on") ? "decorate" : undefined;
    const link = (req.body.link === "on") ? "link" : undefined;
    const ul = (req.body.ul === "on") ? "ul" : undefined;
    const ol = (req.body.ol === "on") ? "ol" : undefined;
    const dl = (req.body.dl === "on") ? "dl" : undefined;
    const bq = (req.body.bq === "on") ? "bq" : undefined;
    const code = (req.body.code === "on") ? "code" : undefined;
    const headers = (req.body.headers === "on") ? "headers" : undefined;
    const allcaps = (req.body.allcaps === "on") ? "allcaps" : undefined;
    const prude = (req.body.prude === "on") ? "prude" : undefined;
    const plaintext = (req.body.plaintext === "on") ? "plaintext" : undefined;

    const params = [
        short,
        decorate,
        link,
        ul,
        ol,
        dl,
        bq,
        code,
        headers,
        allcaps,
        prude,
        plaintext
    ].filter((elem) => {return elem !== undefined});

    try { 
        const result = await axios.get(API_URL + integer + "/" + params.join("/"));
        const content = JSON.stringify(result.data)
            .replace(/\\n\\n/g, "<br>")    // Replace double newlines with double <br> for paragraph breaks
            .replace(/\\n/g, "<br>")           // Replace single newlines with <br>
            .replace(/\\t/g, "")               // Remove tab characters
            .trim().slice(1).slice(0, -1); 

        res.render("index.ejs", { content: content});
    } catch (error) {
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
