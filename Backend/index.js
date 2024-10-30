const e = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan')

const app = e()
const PORT = process.env.PORT || 3000;

app.use(e.json());
app.use(cors());
app.use(morgan('short'));

app.get("/api/gethtml", async (req, res) => {
  const url = req.query.thunderstore_url;

  if (!url) {
    return res.status(400).json({"error": true, message: "Missing thunderstore_url query", "html": "" }); 
  }

  const fixedUrl = url.replace("https://thunderstore.io", "")

  try {
    const r = await fetch(`https://thunderstore.io${fixedUrl}`)
    
    if (!r.ok) return res.status(res.status).json({error: true, message: "Error on fetching", html: ""})
      
    const html = await r.text()
    res.json({"error": false, "message": "Html fetched succesfully", "html": html})

  } catch(err) {
    res.status(500).json({"error": true, "message": "Bad request", html: ""})
  }
});

app.get("/api/getmod", async (req, res) => {
  const url = req.query.thunderstore_url;

  if (!url) {
    return res.status(400).json({error: true, message: "Missing thunderstore_url query", mod: null}); 
  }

  const fixedUrl = url.replace("https://thunderstore.io", "")

  try {
    const r = await fetch(`https://thunderstore.io${fixedUrl}`, {
      method: "GET",
      redirect: "follow"
    })
    if (!r.ok) throw new Error()

    const blob = await r.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    res.set({
      'Content-Type': "application/zip",
      'Content-Length': blob.size,
      'Content-Disposition': `attachment;`
    })

    res.send(buffer)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Error downloading mod", mod: null });
  }
});

app.use(e.static(path.join(__dirname, "./dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
