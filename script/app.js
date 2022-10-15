//Clase padre del jugador
class Player{
    constructor(maxHealth, maxMana, name){
        //Estadisticas del jugador
        this.maxHealth = maxHealth; 
        this.health = this.maxHealth; 
        this.maxMana = maxMana;
        this.mana = this.maxMana;
        this.name = name
        this.points = 0;
        this.damage = 0;

        //Propiedades del mazo del jugador
        this.deck = document.getElementById("deck");
        this.deckCards = [];
        this.deckSize = 10;

        //Propiedades de la mano del jugador
        this.hand = document.getElementById("hand");
        this.handCards = [null, null, null, null, null];
        this.handSize = 5;

        //Propiedades del tablero del jugador
        this.board = document.getElementById("board-bottom");
        this.boardCards = [null, null, null, null, null];
        this.boardSize = 5;

        this.selectedCard = null;
    }

    //Funciones del mazo-----------------------
    AddCardToDeck(cards){

        cards.forEach(card => {
            if (this.deckCards.length < this.deckSize){
                card.master = this;
                this.deckCards.push(card);
            } else {
                Swal.fire({
                    title: 'Mazo lleno!',
                    text: 'Tienes el máximo de cartas posible en el mazo.',
                    icon: 'error',
                    confirmButtonText: 'Continuar'
                });
            }
        })
    }
    RemoveCardFromDeck(card){
        const index = this.deckCards.indexOf(card);
            if (index > -1){
                this.deckCards.splice(index, 1);
            }
    }
    TakeCardFromDeck(){

        if (GameManager.turnOfPlayer == true){
            if(this.deckCards.length > 0) {

                let card = this.deckCards[0];
    
                this.AddCardToHand(card);
                this.deckCards.shift();
            } else {
                Swal.fire({
                    title: 'Mazo vacio!',
                    text: 'No te quedan mas cartas en el mazo',
                    icon: 'error',
                    confirmButtonText: 'Continuar'
                });
            }
        }
    }

    //Funciones de la mano---------------------------
    AddCardToHand(card){

        let slot = this.EmptySlotInHand();

        if (slot >= 0){
            this.handCards.splice(slot, 1, card);
            card.MoveToHand(slot)
        } else {
            this.deckCards.unshift(card);
            Swal.fire({
                title: 'Mano llena!',
                text: 'Tienes el máximo de cartas posible en la mano.',
                icon: 'error',
                confirmButtonText: 'Continuar'
            });
        }
    }
    EmptySlotInHand(){
        for (let i = 0; i <= this.handSize; i++) {
            if (this.handCards[i] === null){
                return i;
            }
        }

        return -1;
    }
    RemoveCardFromHand(card){
        const index = this.handCards.indexOf(card);
        if (index > -1){
            this.handCards.splice(index, 1, null);
        }
    }

    //Funciones del tablero----------------------------------
    AddCardToBoard(card){
        
        let slot = this.EmptySlotInBoard();

        if (slot >= 0){
            this.boardCards.splice(slot, 1, card);
            this.RemoveCardFromHand(card);
        } else{
            Swal.fire({
                title: 'Tablero lleno!',
                text: 'Tienes el máximo de cartas posible en el tablero.',
                icon: 'error',
                confirmButtonText: 'Continuar'
            });
        }
    }
    EmptySlotInBoard(){
        for (let i = 0; i < this.boardSize; i++) {
            if (this.boardCards[i] === null){
                return i;
            }
        }

        return -1;
    }
    RemoveCardFromBoard(card){
        const index = this.boardCards.indexOf(card);
        index > -1 && this.boardCards.splice(index, 1, null);
    }

    HasCardsInBoard(){
        for (let i = 0; i < this.boardCards.length; i++){
            if (this.boardCards[i] != null) return true;
        }
        return false;
    }


    //Funciones de intereaccion ------------------------------------------
    TakeDamage(damage){

        const playerDisplay = document.getElementById("master");
        playerDisplay.classList.add('takeDamage');
        setTimeout(() => {
            playerDisplay.classList.remove('takeDamage');
        }, 500);

        (this.health - damage <= 0) ? (this.health = 0) : (this.health -= damage);
        (this.health <= 0) && this.Death();
        this.UpdateHealth();
    }
    Death(){
        Swal.fire({
            title: 'Te han derrotado!',
            text: 'Ha llegado el final de tu camino...',
            icon: 'error',
            confirmButtonText: 'Continuar'
        });
    }

    UpdateHealth(){
        const healthDisplay = document.getElementById("player-health");
        healthDisplay.innerHTML = this.health;
    }
    UpdateMana(mana){

        this.mana += mana;

        (this.mana > this.maxMana) && (this.mana = this.maxMana);
        (this.mana < 0) && (this.mana = 0);

        const playerManaDisplay = document.getElementById("player-mana");
        playerManaDisplay.innerHTML = player.mana;
    }
}



class Enemy{
    constructor(name) {
        this.name = name;

        this.board = document.getElementById("board-top");
        this.boardCards = [];
        this.boardSize = 5;

        this.selectedCard = null;
    }

    AddCardToBoard(card){

        card.master = this;
        this.boardCards.push(card);

        const index = this.boardCards.indexOf(card);
        const slot = this.board.children[index];

        card.slot = slot;
        card.CreateCard();
        slot.appendChild(card.cardHTML);

    }
    RemoveCardFromBoard(card){
        const index = this.boardCards.indexOf(card);

        index > -1 && this.boardCards.splice(index, 1);
    }

    SelectCard(){
        this.selectedCard = this.boardCards[Math.floor(Math.random()*this.boardCards.length)];

        if (this.selectedCard != null)
            this.selectedCard.cardHTML.classList.add("selected");

        setTimeout(()=>{
            this.AttackPlayer();
        },1000);
    }

    SelectPlayerCard(){

        let card;
        let playerHasCards = player.HasCardsInBoard();

        if (!playerHasCards){
            return player;
        }

        while (card == null && playerHasCards){
            card = player.boardCards[Math.floor(Math.random()*player.boardCards.length)]
        }

        return card;
    }

    AttackPlayer(){
        let playerCardSelected = this.SelectPlayerCard();

        if (playerCardSelected == null) {
            this.selectedCard.cardHTML.classList.remove("selected");
            this.selectedCard = null;
            return GameManager.NextTurn();
        }

        if (this.selectedCard != null){
            playerCardSelected.TakeDamage(this.selectedCard.damage);
            this.selectedCard.TakeDamage(playerCardSelected.damage);
        }

        this.selectedCard != null && this.selectedCard.cardHTML.classList.remove("selected");

        setTimeout(()=>{
            GameManager.NextTurn()
        },1000);
    }
}

let User = { //Usuario utilizado para guardar y cargar datos del jugador
    name:"",
    points:0,
    deck:[]
}

let GameManager = { //Objeto controlador de los niveles del juego
    level:0,
    levelDisplay:document.getElementById("level-display"),
    cards:[], //Cartas que pueden aparecer en el nivel
    cardsInBoard:0, //Cantidad de cartas enemigas en el tablero por nivel
    turnOfPlayer: true,
    levelEnd: true,
    StartNextLevel(){
        if (this.levelEnd){
            this.LevelCards();
            this.levelDisplay.innerHTML = this.level.toString();
            this.level++;
            this.turnOfPlayer = true;
            this.levelEnd = false

            for (let i=0; i < this.cardsInBoard; i++){
                let card = this.cards[Math.floor(Math.random() * this.cards.length)]

                enemy.AddCardToBoard(new card)
            }

        } else {
            Swal.fire({
                title: 'Elimina al anemigo!',
                text: `Al enemigo todavia le quedan ${this.CardsInGame()} cartas.`,
                icon: 'warning',
                confirmButtonText: 'Continuar'
            });
        }
    },
    EndLevel(){
        if (this.CardsInGame() === 0){
            let pointsReward = 1 * this.level;
            User.points += pointsReward;
            pointsDisplay.innerHTML = User.points;

            SaveProgress();

            setTimeout(()=>{
                this.levelEnd = true;
                Swal.fire({
                    title: 'Nivel Superado!',
                    text: `Has obtenido ${pointsReward} ascuas de recompensa!`,
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                });
            },1000);
            
        }
    },
    LevelCards(){
        switch (this.level){
            case 0:
                this.cards.push(Card001);
                this.cardsInBoard = 1;
                break;
            case 3:
                this.cards.push(Card002);
                this.cardsInBoard = 2;
                break;
            case 6:
                this.cards.push(Card003);
                break;
            case 9:
                this.cardsInBoard = 3;
                break;
            case 12:
                this.cards.push(Card004);
                break;
            case 15:
                this.cardsInBoard = 4;
                break;
            case 20:
                this.cards.push(Card005);
                break;
            default:
                break;
        }
    },
    CardsInGame(){  //Comprueba si quedan cartas enemigas en el tablero
        let cards = 0;
        for (let i = 0; i < enemy.boardCards.length; i++){
            if (enemy.boardCards[i] != null) cards++;
        }
        return cards;
    },
    NextTurn(){
        this.turnOfPlayer = !this.turnOfPlayer;

        if (!this.turnOfPlayer) {
            setTimeout(()=>{
                enemy.SelectCard();
            }, 500);
        } else {
            player.UpdateMana(2);
        }
    }
}

const boardTop = document.getElementById("board-top"); //Parte superior del tablero
const boardBottom = document.getElementById("board-bottom"); //Parte inferior del tablero

let playerName = "";


//Alerta de inicio de usuario
Swal.fire({
    title: 'Ingrese su nombre de usuario',
    html: `<input type="text" id="user" class="swal2-input" placeholder="Nombre de Usuario">`,
    confirmButtonText: 'Aceptar',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
        const user = Swal.getPopup().querySelector('#user').value;

        if (!user){
            Swal.showValidationMessage("Ingrese un nombre de usuario");
        }
        return {user: user}
    }
}).then((result) => {
    playerName = result.value.user;
    SaveUser();
    StartGame();
})

const player = new Player(20, 10, playerName);
const userDisplay = document.getElementById("user-display");
const pointsDisplay = document.getElementById("user-points");
const masterNameDisplay = document.getElementById("player-name");

let enemy;

//Funcion que da inicio al juego luego de que un usuario fue cargado
function StartGame(){
    userDisplay.innerHTML = User.name;
    pointsDisplay.innerHTML = User.points;

    masterNameDisplay.innerHTML = playerName;
    player.name = playerName;

    enemy = new Enemy("Enemigo");
    
    pointsDisplay.innerHTML = User.points;
    
    player.deck.addEventListener('click', () => {
        player.TakeCardFromDeck();
    })
}

