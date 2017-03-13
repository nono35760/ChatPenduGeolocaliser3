var monTab = new Array(); //contiendra enregistrement des coords maps 

arrayLettersWord = new Array();  //contiendra les lettres du mots à trouver

function findPosition(position) {

	var infopos = "Ma position actuelle avec cette ip :\n";

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	infopos += "Latitude : " + position.coords.latitude + "\n";
	infopos += "Longitude: " + position.coords.longitude + "\n";
	// infopos += "Altitude : " + position.coords.altitude + "\n";
	// infopos += "Vitesse : " + position.coords.speed + "\n";
	document.getElementById("divReplaceCoord").innerHTML = infopos;
	document.getElementById("myLat1").value = position.coords.latitude;
	document.getElementById("myLong1").value = position.coords.longitude;
	initMap(latitude, longitude, 'theMap1');

}

// Fonction de callback en cas d’erreur
function returnError(error) {
	var info = "Erreur lors de la géolocalisation : ";
	switch (error.code) {
	case error.TIMEOUT:
		info += "Timeout !";
		break;
	case error.PERMISSION_DENIED:
		info += "Vous n’avez pas donné la permission";
		break;
	case error.POSITION_UNAVAILABLE:
		info += "La position n’a pu être déterminée";
		break;
	case error.UNKNOWN_ERROR:
		info += "Erreur inconnue";
		break;
	}
	document.getElementById("infoposition").innerHTML = info;
}

function run() {
	if (navigator.geolocation) {
		survId = navigator.geolocation.getCurrentPosition(findPosition,
				returnError);
	} else {
		alert("Ce navigateur ne supporte pas la géolocalisation");
	}
}

function initMap(latitude, longitude, divMap, monTab) {

	alert(latitude + ',' + longitude);
	// Création de la carte et affichage dans le div dédié
	var map = new google.maps.Map(document.getElementById(divMap), {
		center : {
			lat : parseFloat(latitude),
			lng : parseFloat(longitude),
		},
		zoom : 18,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});

	// creation d'une latitude/longitude au format map
	var latAndLong = new google.maps.LatLng(parseFloat(latitude),
			parseFloat(longitude));

	// placement d'un marker sur la carte
	var marker1 = new google.maps.Marker({
		position : latAndLong,
		title : "Coucou, TOCARD !"
	});
	marker1.setMap(map);

	// gérer l'angle de vue
	map.setTilt(90);

	save(latitude, longitude, monTab);

}

function initMap2(latitude, longitude, divMap) {

	alert(latitude + '+' + longitude + '+' + divMap);
	// Création de la carte et affichage dans le div dédié
	var map2 = new google.maps.Map(document.getElementById(divMap), {
		center : {
			lat : parseFloat(latitude),
			lng : parseFloat(longitude),
		},
		zoom : 18,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});

	// creation d'une latitude/longitude au format map
	var latAndLong = new google.maps.LatLng(parseFloat(latitude),
			parseFloat(longitude));

	// placement d'un marker sur la carte
	var marker1 = new google.maps.Marker({
		position : latAndLong,
		title : "Coucou, TOCARD !"
	});
	marker1.setMap(map2);

	// gérer l'angle de vue
	map2.setTilt(90);

}

function findDistance(lat1, long1, lat2, long2) {
	// si lat est une chaine texte, on utilise l''url sans coordonnées gps //a
	// faire aussi pour lat2
	if (parseFloat(lat1)) {
		var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='
				+ parseFloat(lat1)
				+ ','
				+ parseFloat(long1)
				+ '&destinations='
				+ parseFloat(lat2)
				+ ','
				+ parseFloat(long2)
				+ '+&mode=bicycling&language=fr-FR&key=AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo';
	} else {
		var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='
				+ lat1
				+ '&destinations='
				+ parseFloat(lat2)
				+ ','
				+ parseFloat(long2)
				+ '+&mode=bicycling&language=fr-FR&key=AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo';
	}

	// alert('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+parseFloat(lat1)+','+parseFloat(long1)+'&destinations='+parseFloat(lat2)+','+parseFloat(long2)+'+&mode=bicycling&language=fr-FR&key=AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo');
	$
			.ajax(
					{
						// url:'https://maps.googleapis.com/maps/api/distancematrix/json?origins=47.26115180000001,-1.5829457&destinations=47.261151,-1.3829457+&mode=bicycling&language=fr-FR&key=AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo',
						url : url,
						dataType : 'json',
						success : function(data) {

							var monText = "Adresse de depart  "
									+ data.origin_addresses;
							monText += "<br>Adresse de destination  "
									+ data.destination_addresses;
							monText += "<br>Distance  "
									+ data.rows[0].elements[0].distance.text;
							monText += "<br>Durée à vélo  "
									+ data.rows[0].elements[0].duration.text;

							$('#divDisplayJson').html(monText);

						}

					}).fail(function() {
				alert('Error (Go Firefox CorsE ?)')
			});

}
// sauvegarde des latitudes et longitude dans le tableau JSon en local storage
function save(latitude, longitude, monTab) {
	if (typeof localStorage != 'undefined') {

		var enregistrement = {
			latitude : latitude,
			longitude : longitude
		};

		monTab.push(enregistrement);

		var monTabJson = JSON.stringify(monTab);
		localStorage.setItem("enregistrement", monTabJson);

		var monTabJsonRecup = localStorage.getItem("enregistrement");
		console.log(monTabJsonRecup);
		var monTabRecup = JSON.parse(monTabJsonRecup);

		var monHtml = "<table class='table-striped table-bordered'><tr><td>Enregistrement</td><td>Latitude</td><td>Longitude</td></tr>";
		for (var i = 0; i < monTabRecup.length; i++) {
			monHtml += "<tr><td>N° " + i + "</td><td>"
					+ monTabRecup[i].latitude + "</td><td>"
					+ monTabRecup[i].longitude + "</td></tr>";
		}
		monHtml += "</table>";

		document.getElementById("divDisplayJsonSave").innerHTML = monHtml;

	} else {
		alert("Pas de storage tocard !");
	}

}
// sauvegarde du login/password en localStorage
function saveLogin(login, password) {
	if (typeof localStorage != 'undefined') {

		var ident = {
			login : login,
			password : password
		};

		var identJson = JSON.stringify(ident);
		localStorage.setItem("ident", identJson);

	} else {
		alert("Pas de storage tocard !");
	}

	appelLogin(login, password);
}

// appelé par saveLogin
function appelLogin(login, password) {
	alert('tu mas appelé ?' + login + password);
	$
			.ajax(
					{

						url : 'http://localhost:8080/rest1/rest/geoloc/geolocJson.html?login='
								+ login + '&password=' + password,
						dataType : 'text',
						success : function(data) {

							$('#divReplaceWebService').html(data);

							if (data == "YES") {
								$('#central').show();
								// Afficher les coordonnées de la position
								run();
							} else if (data == "NO") {
								$('#central').hide();
							} else {
								alert("WTF on retour appelLogin");
							}

						}

					}).fail(function() {
				alert('Erreur de récup Login')
			});
}

// retourne un mot du tableau
/*
 * function appelWord() {
 * 
 * $.ajax({
 * 
 * url : 'http://localhost:8080/rest1/rest/geoloc/geolocWord.html', dataType :
 * 'text', success : function(data) {
 * 
 * $('#divReplaceWord').html(data);
 *  }
 * 
 * }).fail(function() { alert('Erreur de récup Word') }); }
 */

// retourne un mot du fichier dico
function appelWord2() {

	$.ajax({

		url : 'http://localhost:8080/rest1/rest/geoloc/geolocWord2.html',
		dataType : 'text',
		success : function(data) {

			$('#divReplaceWord').html(data);

			// recup du mot à trouver dans le dico
			wordToFind = data;
			alert("Mot à trouver"+wordToFind);
			

			// affichage des emplacements
			// var textPendu="";
			textPendu = new Array();
			for (i = 0; i < wordToFind.length; i++) {
				textPendu.push("_");
			}
			// ###afficher les cases vides pendu
			$('#divPenduTxt').html(textPendu.length);

			/*
			 * if (typeof localStorage != 'undefined') {
			 * 
			 * localStorage.setItem("textPendu", textPendu); }
			 */

			// décomposition du mot lettre par lettre
			
			arrayLettersWord = wordToFind.split("");
			alert(arrayLettersWord[1]); //test affiche la seconde lettre de du mot
		}

	}).fail(function() {
		alert('Erreur de récup Word')
	});
}

function checkLetter(letter) {
	alert(arrayLettersWord[1] + "(((" + letter + wordToFind.length);

	/*
	 * //décomposition du mot lettre par lettre var arrayLetters=new Array();
	 * arrayLetters=wordToFind.split(""); alert(arrayLetters[1]);
	 */

	var indices = []; // enregistre les emplacements trouvés
	var letter = 'a';
	var idx = arrayLettersWord.indexOf(letter);
	// tant que lettre trouvée, on vérifie que pas d'autres ensuite
	while (idx != -1) {
		indices.push(idx);
		idx = arrayLettersWord.indexOf(letter, idx + 1);
	}
	console.log(indices); //retourne tableau des emplacements trouvés
	
}

// clé matrix api AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo
// https://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR&key=AIzaSyAGNfXrvUDmgYHmKjEaBVzR_IkaHYiiopo
