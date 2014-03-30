'use strict'


//Global variables

var suits = ['♥','♣','♠','♦'];; //array to store card suits
var deck = []; //array to store the deck of cards
var turns = 0; // number of turns a player has
var audio_sound //audio played when two cards are matched
var audio_source // location of audio


window.onload = function()
{
  window.applicationCache.onnoupdateready = function(evt)
                        {
                          console.log('Swapping files ' + evt);
                          window.applicationCache.update();
                          window.applicationCache.swapCache();
                        };
    startGame();
    drawRandom(); 
    for(var i=0;i<=document.getElementsByClassName('card').length-1;i++)
    {
      document.getElementsByClassName('card')[i].onclick = flipCard;                              
    }

};


function playsTimer()//Keeps track of the number of plays a user makes
{
  if ($$('.flipped').length==2)
  {
    turns+=1;
    if(turns==24)
    {
      var blocker = new Element('blocker',{'class': 'blocker'});
      $$('body')[0].insert({bottom:blocker});
    }
    $('turns').innerHTML = turns;
    console.log('Turns',turns,'completed');
    if(gameLogic()!=-1)
    {
      flipCard($$('.flipped'));
    }
  }
}
      
function drawRandom()//Choose 10 random cards and duplicate them
{

  var random10 = [];
  var splitdeck = []; // Holding array values during shuffling.
  for(var i=0;i<=9;i++)
  {
    random10[i] = deck[Math.floor(Math.random()*(deck.length-1))];
  }
  random10 =random10.concat(random10);//Duplicating the array on itself
  console.log('Unshuffled\n',random10);// Debug purposes
  for(var j=0;i<=19;i++)
  {
    var random = Math.floor(Math.random()*(random10.length-1));
    var random2 = Math.floor(Math.random()*(random10.length-1));
    splitdeck.push(random10.splice(random,1)[0]);                           //Removes random member from random10 and places in splitdeck
    random10.push(splitdeck[0]);                                            //Pushes the random member to the back of random10
    splitdeck.splice(0,1);                                                  //Empties the splitdeck folder
  }
  console.log('Shuffled\n',random10);
  for(var i=0;i<=19;i++)//Deploying random10's constituents into the document.
  {
    document.getElementsByClassName('cardface')[i].insertAdjacentText('afterBegin',random10[i]);
  }
  
}


function matchCards()//Function to test compare the cards that have been flipped for identicality
{
  var card_choice = document.getElementsByClassName('card flipped');         //Array with the cards to be checked for indenticality
  if(card_choice[0].children[1].innerHTML == card_choice[1].children[1].innerHTML)
  {
    if(card_choice[1].className.indexOf('matched') == -1)
    {
      card_choice[1].className += ' matched';
      //trigger the Match sound here 
      audio_sound.load();
      audio_sound.play();
      card_choice[1].className = card_choice[1].className.replace(' flipped', ' flipped2');
    }
    if(card_choice[0].className.indexOf('matched') == -1)
    {
      card_choice[0].className += ' matched';
      card_choice[0].className = card_choice[0].className.replace(' flipped', ' flipped2');
    }
    return 1;
  }
  return 0;
}

function flipCard(cards) //This function triggers the flipped class 
                         //which in turn triggers the necessary 'flipped' 
                         //class to activate initiating a flip of the selected card
{
  
   if(cards!=null && cards.length != undefined)
  {
    window.setTimeout(function(){cards[1].className = cards[1].className.replace(' flipped','');
                                 cards[0].className = cards[0].className.replace(' flipped','');},500); //Triggers both card flips after an interval of 500 milliseconds 
    return;
  }
   if(this!=undefined && this.className.indexOf('flipped')>-1)
      {
        if(this.className.indexOf('flipped2')>-1)
          {
            alert('Already Matched');
          }
        else
          {
            this.className = this.className.replace(' flipped','');
          }
      }
  else
  {
    this.className += ' flipped';
    $('flipAudio').load();
    $('flipAudio').play();
  }
  playsTimer();
}



function createDeck() // Creates the deck of cards 
{
  var ranks = ['A', 'K', 'Q', 'J', '10', '9', '8',
                    '7', '6', '5', '4', '3', '2'];
  
  var cardnum = 0;

  for(var i=0;i<=suits.length-1;i++)
    {
     
      for(var j=0;j<=ranks.length-1;j++)
        {

          deck[cardnum] = ranks[j] + suits[i];
          cardnum++;
        }
    }
  console.log(deck);
}

function matchSound()
{
  audio_sound = document.createElement('audio');
  audio_sound.id = 'matchAudio';
  audio_sound.preload = 'auto';
  audio_source = document.createElement('source');
  audio_source.src = "/static/solemn.mp3";
    //"{{url_for('static', filename='solemn.mp3')}}";
  audio_source.type = "audio/mpeg";
  audio_sound.insertAdjacentElement('afterBegin', audio_source);
  document.getElementsByTagName('body')[0].insertAdjacentElement('beforeEnd',audio_sound);
}

function startGame()//Creates the physical cards within the Game Area.
{
  var gameArea = $('gameboard');
  for(var i=0;i<=19;i++)
  {
    var flipArea = new Element('div',{'class':'flipArea'});
    var card = new Element('div',{'class':'card'});
    var cardBack = new Element('div', {'class':'back'});
    var cardFront = new Element('div', {'class':'front'});
    var cardface = new Element('div', {'class':'cardface'});


    cardface.textContent  = deck;

    gameArea.insert({top:flipArea});
    flipArea.insert({top:card});
    card.insert({top:cardBack});
    cardBack.insert({top:cardface});
    card.insert({top:cardFront});

    

  }
  createDeck();
  matchSound();

  var flip_audio = new Element('audio',{'id':'flipAudio', 'preload':'auto'});
  var audio_source2 = new Element('source',{'src':'/static/page-flip-02.mp3', 'type':'audio/mpeg'});
  var body = $$('body')[0];
  var gameDetails  = new Element('div', {'class':'gameDetails'});







  body.insert({bottom:flip_audio});
  flip_audio.insert({top:audio_source2});
  gameDetails.innerHTML = "Turns:<br/><span id='turns'>0</span>/24";
  gameDetails.insert({bottom:savebtn});
  body.insert({bottom:gameDetails});

    // var turnCounter = document.createElement('div');
    // turnCounter.className = 'turnCounter';
    // turnCounter.innerHTML = "<b>Turns:<br/><span id='turns'>0</span>/24";
  
}
