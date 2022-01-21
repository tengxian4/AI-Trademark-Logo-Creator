const express = require("express");
var bodyParser = require('body-parser')
const fontSelector = require('./font-selector');
const fontGenerator = require('./font-generator');

const app = express();

var logo_word='';


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.route("/ajax")
.get(function(req, res){
  res.render('ajax',{quote: "Write your desired words to generate logos"});

})
.post(function(req,res){
  logo_word=req.body.quote;

  res.send({response: req.body.quote});

});
app.listen(process.env.PORT||3000);






app.get('/getRecommendedFont', (req, res) => {

console.log(logo_word);

  const query = req.query;
  const response = {};
  const fonts = fontSelector.getRecommendedFont(JSON.parse(query.payload), query.amountNear);

  for (var i = 0; i < fonts.length; i++) {
    fonts[i].svg = fontGenerator.generateFont(logo_word, fonts[i].name);
  }
  response.fonts = fonts;
  res.status(200).json(response);
}); 

app.use(express.static('frontend'));

app.listen(1234);



