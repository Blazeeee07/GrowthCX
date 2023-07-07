const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let insights = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


  //Get Insights API
app.post('/api/insights', async (req, res) => {
  const url = req.body.url1;
  let fav=false;
  //console.log(url);
  try {
    // Fetch webpage content
    const response = await axios.get(url);
    const html = response.data;
    
    const $ = cheerio.load(html);

    // Extract text content and calculate word count
    const text = $('body').text();
    const wordCount = text.trim().split(/\s+/).length;

    const newInsight = { url, wordCount, fav };
    insights.push(newInsight);
    //console.log(newInsight);
    //res.sendFile(__dirname+"/response.html");
    //res.status(200).json(newInsight);

    let tableHtml = '<table style="border-collapse: collapse; width: 75%; text-align: center;">';
tableHtml += '<tr><th style="border: 1px solid #ccc; padding: 8px;">Domain Name</th><th style="border: 1px solid #ccc; padding: 8px;">WordCount</th>'
tableHtml += `<tr><td style="border: 1px solid #ccc; padding: 8px;">${newInsight.url}</td><td style="border: 1px solid #ccc; padding: 8px;">${newInsight.wordCount}</td></tr>`;
tableHtml += '</table>';
    //console.log(typeof(newInsight));
    res.send(tableHtml);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch word count' });
  }
   
  //console.log(req.body);
});

app.get('/api/insights',(req,res)=>{
  res.json(insights);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});