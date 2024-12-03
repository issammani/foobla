const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" }));

// Directory to save files
const saveDir = path.join(__dirname, "data");

// Ensure the directory exists
if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir);
}

// HTML for the main route
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;

// Routes
app.get("/", (req, res) => res.type("html").send(html));

// POST endpoint to save JSON data to a file
app.post("/save", (req, res) => {
  const fileName = `file_${Date.now()}.json`;
  const filePath = path.join(saveDir, fileName);

  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save file" });
    }
    res.json({ message: "File saved successfully", fileName });
  });
});

// GET endpoint to list all files and their contents
app.get("/files", (req, res) => {
  fs.readdir(saveDir, (err, files) => {
    if (err) {
      console.error("Error reading files:", err);
      return res.status(500).json({ message: "Failed to read files" });
    }

    const fileContents = files.map((file) => {
      const filePath = path.join(saveDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const foo = JSON.parse(content)
      return foo;
    });

    res.json(fileContents);
  });
});

// Start the server
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
