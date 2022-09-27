let users = localStorage.getItem('users');

function SaveUser(){

    let usersParce = [];

    if (users != null) usersParce = users.split(",");


    if (!IsUserRegistered(usersParce)) {
        usersParce.push(playerName);
        localStorage.setItem('users', usersParce);

        User.name = playerName;
        User.points = 0;
        User.unlockCards = [];
        User.deck = [1, 1, 1, 2, 2];

        SaveDeck();
        LoadDeck();

        //localStorage.setItem(`${playerName}Deck`, JSON.stringify(player.deckCards));

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

    User.name = playerName;
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

    console.log(User.name);

    let deck = JSON.parse(localStorage.getItem(`${User.name}Deck`));
    let deckCards = []

    for (let card of deck){
        for (let i = 0; i < CardsArray.length; i++){
            let newCard = new CardsArray[i];
            newCard.ID == card && deckCards.push(new CardsArray[i]);
        }
    }

    player.AddCardToDeck(deckCards);
}

