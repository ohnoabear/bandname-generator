require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;
//const Promise = require('promise');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const dictFile = fileSetup();
bot.login(TOKEN);


bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.startsWith('!bandname')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.channel.send(generateBandnames(dictFile, 1));
    }
  }
});

function fileSetup() {
  var rawDictContents = new Map();
  var rawDictFilepaths = [6];
  rawDictFilepaths[0] = '/words/adjectives.txt';
  rawDictFilepaths[1] = '/words/firstfemalenames.txt';
  rawDictFilepaths[2] = '/words/firstmalenames.txt';
  rawDictFilepaths[3] = '/words/lastnames.txt';
  rawDictFilepaths[4] = '/words/nouns.txt';
  rawDictFilepaths[5] = '/words/verbs.txt';
  rawDictFilepaths[6] = '/words/interjections.txt';

  for(var i=0; i<rawDictFilepaths.length; i++){
      readFile(rawDictFilepaths[i], 'utf8', (err, data) =>{
          var key = 'null';
          if(data.startsWith('**adjectives')){
              key = 'adj';
          } else if(data.startsWith('**firstfemalenames')){
              key = 'fname';
          } else if(data.startsWith('**firstmalenames')){
              key = 'mname';
          } else if(data.startsWith('**lastnames')){
              key = 'sname';
          } else if(data.startsWith('**nouns')){
              key = 'noun';
          } else if(data.startsWith('**verbs')){
              key = 'verb';
          } else if(data.startsWith('**interjections')){
              key = 'intj';
          }
          rawDictContents.set(key,data);
      });
  }
  return rawDictContents;
}

function generateBandnames(rawDictContents,flag){
    var numberOfNames = 0;
    if(flag > 0){
        numberOfNames = flag;
    }

    var arrAdj = rawDictContents.get('adj').split('\n');
    var arrFName = rawDictContents.get('fname').split('\n');
    var arrMName = rawDictContents.get('mname').split('\n');
    var arrSName = rawDictContents.get('sname').split('\n');
    var arrNoun = rawDictContents.get('noun').split('\n');
    var arrVerb = rawDictContents.get('verb').split('\n');
    var arrIntj = rawDictContents.get('intj').split('\n');

    var grammars = [];
    grammars.push('AdjNoun');
    grammars.push('Adj Noun');
    grammars.push('The Adj Nouns');
    grammars.push('Noun Noun');
    grammars.push('First Last & the Adj Nouns');
    grammars.push('Adj Noun and the Adj Nouns');
    grammars.push('Adj Last');
    grammars.push('The Nouns');
    grammars.push('Noun of Nouns');
    grammars.push('Noun');
    grammars.push('Verb the Noun');
    grammars.push('The Noun Boys');
    grammars.push('Interjection! You Adj Noun');
    grammars.push('The Adj, Adj Nouns');

    var output = '';
    for(var i=0; i<numberOfNames; i++){
        output = (i > 0) ? output + '\n' : output;

        var currGrammar = grammars[getRandomInt(grammars.length)];
        var adj1 = arrAdj[getRandomInt(arrAdj.length)].trim();
        var adj2 = arrAdj[getRandomInt(arrAdj.length)].trim();
        var noun1 = arrNoun[getRandomInt(arrNoun.length)].trim();
        var noun2 = arrNoun[getRandomInt(arrNoun.length)].trim();
        var verb = arrVerb[getRandomInt(arrVerb.length)].trim();
        var intj = arrIntj[getRandomInt(arrIntj.length)].trim();
        var fname = arrFName[getRandomInt(arrFName.length)].trim();
        var mname = arrMName[getRandomInt(arrMName.length)].trim();
        var sname = arrSName[getRandomInt(arrSName.length)].trim();

        var bandname = '';
        if(currGrammar === 'AdjNoun' || currGrammar === 'Adj Noun' ){
            bandname += adj1 + ' ' + noun1;
        } else if(currGrammar === 'The Adj Nouns'){
            bandname += 'The ' + adj1 + ' ' + noun1 + 's';
        } else if(currGrammar === 'Noun Noun'){
            bandname += noun1 + ' ' + noun2;
        } else if(currGrammar === 'First Last & the Adj Nouns'){
            bandname += (randBool() ? fname : mname) + '' + (randBool() ? ' ' + sname : '');
            bandname += ' & the ';
            bandname += adj1 + ' ' + noun1 + 's';
        } else if(currGrammar === 'Adj Noun and the Adj Nouns'){
            bandname += adj1 + ' ' + noun1;
            bandname += ' & the ';
            bandname += adj2 + ' ' + noun2 + 's';
        } else if(currGrammar === 'Adj Last'){
            bandname += adj1 + ' ' + sname;
        } else if(currGrammar === 'The Nouns'){
            bandname += 'The ' + noun1 + 's';
        } else if(currGrammar === 'Noun of Nouns'){
            bandname += noun1 + ' of ' + noun2 + 's';
        } else if(currGrammar === 'Noun'){
            bandname += noun1;
        } else if(currGrammar === 'Verb the Noun'){
            bandname += verb + ' the ' + noun1 + (randBool() ? 's' : '');
        } else if(currGrammar === 'The Noun Boys'){
            bandname += 'The ' + noun1 + ' Boys';
        } else if(currGrammar === 'Interjection! You Adj Noun'){
            bandname += intj + '! You ' + adj1 + ' ' + noun1;
        } else if(currGrammar === 'The Adj, Adj Nouns'){
            bandname += 'The ' + adj1 + ', ' + adj1 + ' ' + (randBool() ? noun1 + ' ' : '') + noun2 + 's';
        }
        bandname = bandname.replace(/[\n\r]/g, ' ').trim();
        output = output + bandname;
    }

    return output;
}

function getRandomInt(max) {
    var rand = Math.floor(Math.random() * Math.floor(max));
    if(rand == 0){
        return rand + 1;
    }
    return rand;
}

function randBool(){
    var randInt = Math.floor(Math.random() * Math.floor(2));
    return randInt == 1;
}