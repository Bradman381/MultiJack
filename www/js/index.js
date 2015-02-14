var myFire = new Firebase("https://multijack.firebaseio.com/");
var lobbyId = "";
var hand;
var flipped = false;
var playerNum;
var playerId;
var gameStarted = false;
(function($){ 
	if ($('body').hasClass('player')) {
		myFire.on('child_added', function(snapshot) {
			var commandData = snapshot.val();
			if (commandData.command == 'start') {
				playerStart();
			}
		});
	}
})(jQuery);

function revealAll() {
    if (flipped === false){
		$('.front img').attr('src', 'cards/2h.svg');
		flipped = true;
	} else {
		$('.front img').attr('src','cards/back.svg');
		flipped = false;
	}
}
//deaker function
function startLobby() { 
	if ($('body').hasClass('dealer')) {
		var response = $('#password').val();
		if (response !== '') {
			myFire.set({
				lobby: response,
				numPlayers: 0
			});
		} else {
			alert("Enter a lobby name.");
		}
	}
}

function gameStart() {
	gameStarted = true;
	myFire.push({
		command: 'start'
	});
	slideLobby();
}

//player functions
function joinLobby() {
	if ($('body').hasClass('player')) {
		var response = $('#password').val();
		if (response !== '') {
			var lobbyName;
			myFire.once("value", function(snapshot) {
				var lobbyData = snapshot.val();
				lobbyName = lobbyData.lobby;
				playerNum = lobbyData.numPlayers + 1;
				playerId = "player" + playerNum;
				if (response === lobbyName) {
					myFire.update({
						numPlayers: playerNum
					});
				} else {
					alert("Not a valid lobby name.");
				}
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
		} else {
			alert("Enter a lobby name.");
		}
	}
}

function playerStart() {
	slideLobby();
	gameStarted = true;
}

function slideLobby() {
	$('.game-container').fadeOut();
	$('.gameScreen').fadeIn();
}

function sendCard() {
	$('.card').addClass('move-card');
}