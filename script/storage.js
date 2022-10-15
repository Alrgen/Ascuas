let users = localStorage.getItem('users');

let cardsData = [];

fetch('script/data.json')
    .then((resp) => resp.json())
    .then((data) => {
        cardsData = data[0];
    })



function SaveUser(){

    let usersParce = [];

    if (users != null) usersParce = users.split(",");


    if (!IsUserRegistered(usersParce)) {
        usersParce.push(playerName);
        localStorage.setItem('users', usersParce);

        User.name = playerName;
        User.points = 0;
        User.deck = [1, 1, 1, 2, 2]; //Utilizo la ID de cada carta para guardarlas en el local storage y luego lo utilizo para encontrar la carta correspondiente al cargar el mazo

        SaveDeck();
        LoadDeck();

        Swal.fire({
            title: 'Usuario Guardado!',
            text: `El usuario ${playerName} ha sido registrado`,
            icon: 'success',
            confirmButtonText: 'Continuar'
        });
    }
}

function IsUserRegistered(usersParce){
    for (let i = 0; i < usersParce.length; i++){
        if (usersParce[i] === playerName){
            LoadProgress(usersParce[i]);
            return true;
        }
    }
    return false;
}

function SaveProgress(){

    localStorage.setItem(`${playerName}Points`, JSON.stringify(User.points));

}

function LoadProgress(user){

    User.name = playerName; //playerName es el valor que ingreso el usuario al inicio de la aplicacion
    User.points = JSON.parse(localStorage.getItem(`${user}Points`));

    LoadDeck();

    Swal.fire({
        title: 'Usuario Cargado',
        text: `El usuario ${playerName} tiene un total de ${User.points} ascuas.`,
        icon: 'success',
        confirmButtonText: 'Continuar'
    });
}

function SaveDeck(){
    localStorage.setItem(`${User.name}Deck`, JSON.stringify(User.deck));
}

function LoadDeck(){

    let deck = JSON.parse(localStorage.getItem(`${User.name}Deck`));
    let deckCards = []

    for (let card of deck){
        for (let i = 0; i < CardsArray.length; i++){
            let newCard = new CardsArray[i];
            newCard.ID == card && deckCards.push(new CardsArray[i]);
        }
    }

    User.deck = deck;
    player.AddCardToDeck(deckCards);
}

