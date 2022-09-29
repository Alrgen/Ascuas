//CLase padre de todas las cartas
class Card{
    constructor(name, ID,damage,maxHealth, manaCost, image, cost){ //Estadisticas de las cartas
        this.name = name;
        this.ID = ID;
        this.damage = damage;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.manaCost = manaCost;
        this.master;
        this.image = image;
        this.cardHTML;
        this.damageHTML;
        this.healthHTML;
        this.slot = null;
        this.isInBoard = false;
        this.state = "inDeck";
        this.cost = cost;
    }

    MoveToHand(index){

        let slot = this.master.hand.children[index];

        this.slot = slot;
        this.CreateCard();
        this.slot.appendChild(this.cardHTML);
        this.state = "inHand";
    }

    MoveToBoard(){
        let slot = this.master.EmptySlotInBoard();

        if (slot >= 0){
            this.slot.innerHTML = "";
            this.master.RemoveCardFromHand(this);
    
            this.slot = this.master.board.children[slot];
            this.master.AddCardToBoard(this);
            this.slot.appendChild(this.cardHTML);
            this.state = "inBoard"
        } else {
            Swal.fire({
                title: 'Tablero lleno!',
                text: 'Tienes el máximo de cartas posible en el tablero.',
                icon: 'error',
                confirmButtonText: 'Continuar'
            });
        }
    }

    CreateCard(){ //Esta función crea los elementos HTML de la carta
        this.cardHTML = document.createElement('div');
        
        this.cardHTML.classList.add(`card`);
        this.cardHTML.classList.add(`${this.master.name}`)


        this.OnClick();

        //Html de la carta
        this.cardHTML.innerHTML += `
            <h5 class="card-mana"> ${this.manaCost} </h5>
            <img src="${this.image}" alt="">
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h4 class="card-tittle">${this.name}</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3 p-0">
                            <h5 class="card-damage">${this.damage}</h5>
                        </div>
                        <div class="col-lg-6">
                        </div>
                        <div class="col-lg-3 p-0">
                            <h5 class="card-health">${this.health}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.damageHTML = this.cardHTML.getElementsByClassName("card-damage")[0]; //Guarda el elemento que muestra el daño de la carta por pantalla
        this.healthHTML = this.cardHTML.getElementsByClassName("card-health")[0]; //Guarda el elemento que muestra la vida de la carta por pantalla
    }

    OnClick(){
        if (this.master == player){
            this.cardHTML.addEventListener('click', () => {
                if (GameManager.turnOfPlayer == true){
                    if (this.state == "inHand"){
                        this.MoveToBoard();
                        return;
                    }
                    if (this.state == "inBoard"){
    
                        if(this.master.selectedCard != null){
                            this.master.selectedCard.cardHTML.classList.remove("selected");
                            this.master.selectedCard = null;
                        }
    
                        this.master.selectedCard = this;
                        this.cardHTML.classList.toggle("selected");
                        return;
                    }
                }  
            });
        }
        if (this.master == enemy){
            this.cardHTML.addEventListener('click', () => {
                if (GameManager.turnOfPlayer == true) {
                    if (player.selectedCard != null){
                        this.TakeDamage(player.selectedCard.damage);
                        player.selectedCard.TakeDamage(this.damage);
                        player.selectedCard != null && player.selectedCard.cardHTML.classList.toggle("selected");
                        player.selectedCard = null;
                        GameManager.NextTurn();
                    }
                }
            })
        }
    }

    TakeDamage(damage){ //Función llamada cuando la carta recibe daño
        
        this.cardHTML != null && this.cardHTML.classList.add("takeDamage");

        setTimeout(()=>{
            this.cardHTML != null && this.cardHTML.classList.remove("takeDamage");
        },1000);

        (this.health - damage <= 0) ? (this.health = 0) : (this.health -= damage);
        (this.health <= 0) && this.DestroySelf();

        this.healthHTML.textContent = this.health; //Actualizo la vida de la carta en el display
    }

    DestroySelf(){ //Función que cumprueba si la vida de la carta es menor o igual a 0 para establecer el estado de "muerto"
        this.master.selectedCard = null;
        this.master.RemoveCardFromBoard(this);
        this.slot.innerHTML = "";

        if (this.master == enemy){
            GameManager.EndLevel();
        }
    }
}

function Card001(){ //Función constructora de cartas
    return new Card("Goblin", 1, 1, 2, 2, "./media/goblin.jpg", 2);
}
function Card002(){
    return new Card("Soldado", 2, 1, 3, 3, "./media/soldier.jpg", 4);
}
function Card003(){
    return new Card("Brujo", 3, 3, 1, 4,  "./media/brujo.jpg", 10);
}
function Card004(){
    return new Card("Golem", 4, 0, 4, 4,  "./media/golem.jpg", 10);
}

const CardsArray = [Card001, Card002, Card003, Card004];

//Clase padre del jugador
class Player{
    constructor(maxHealth, maxMana, name){
        this.maxHealth = maxHealth; //Vida maxima del jugador
        this.health = this.maxHealth; //Vida actual
        this.maxMana = maxMana; //Mana maximo (sera consumido al invocar cartas)
        this.mana = this.maxMana; //Mana actual
        this.name = name //Nombre del jugador
        this.points = 0;
        this.damage = 0;

        //Propiedades del mazo del jugador
        this.deck = document.getElementById("deck");
        this.deckCards = [];
        this.deckSize = 20;

        //Propiedades de la mano del jugador
        this.hand = document.getElementById("hand");
        this.handCards = [null, null, null, null, null];
        this.handSize = 5;

        //Propiedades del tablero del jugador
        this.board = document.getElementById("board-bottom");
        this.boardCards = [null, null, null, null, null];
        this.boardSize = 5;

        this.selectedCard = null; //Carta que tiene seleccionado el jugador 
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

    TakeDamage(damage){
        (this.health - damage <= 0) ? (this.health = 0) : (this.health -= damage);
        (this.health <= 0) && this.Death();
    }

    Death(){
        Swal.fire({
            title: 'Te han derrotado!',
            text: 'Ha llegado el final de tu camino...',
            icon: 'error',
            confirmButtonText: 'Continuar'
        });
    }
}



class Enemy{
    constructor(name) {
        this.name = name;

        this.board = document.getElementById("board-top");
        this.boardCards = [];
        this.boardSize = 5;

        this.selectedCard = null; //Carta que tiene seleccionado el jugador 
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

        playerCardSelected.TakeDamage(this.selectedCard.damage);
        this.selectedCard.TakeDamage(playerCardSelected.damage);

        this.selectedCard != null && this.selectedCard.cardHTML.classList.remove("selected");

        setTimeout(()=>{
            GameManager.NextTurn()
        },1000);
    }
}

let User = {
    name:"",
    points:0,
    unlockCards:[],
    deck:[]
}

let GameManager = {
    level:0,
    levelDisplay:document.getElementById("level-display"),
    cards:[],
    cardsInBoard:0,
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
                this.cardsInBoard = 3;
                break;
            case 9:
                this.cards.push(Card004);
                this.cardsInBoard = 4;
                break;
            default:
                break;
        }
    },
    CardsInGame(){
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
        }
    }
}

let Shop = {
    cardCost:1,
    cardToBuy:null,
    async ShowShop(){
        const {value: card} = await Swal.fire({
            title: 'Selecciona una carta para forjarla',
            input: 'select',
            inputOptions: {
                Goblin: 'Goblin',
                Soldado: 'Soldado',
                Brujo: 'Brujo',
                Golem: 'Golem'
            },
            inputPlaceholder: 'Cartas',
            showCancelButton: true,
        })

        if (card) {
            this.GetCard(card)
            this.BuyCardConfirm();
        }
    },

    BuyCardConfirm(){
        Swal.fire({
             title: `Forjar ${this.cardToBuy.name}`,
             text: `Coste: ${this.cardToBuy.cost}`,
             icon:'question',
             showCancelButton: true,
             confirmButtonText: 'Forjar'
        }).then((result) => {
            if (result.isConfirmed) {
                if (User.points >= this.cardToBuy.cost){
                    player.AddCardToDeck([this.cardToBuy]);
                    User.deck.push(this.cardToBuy.ID);
                    User.points -= this.cardToBuy.cost;
                    pointsDisplay.innerHTML = User.points;

                    SaveProgress();
                    SaveDeck();
                    
                    Swal.fire({
                        title:'Forja Exitosa!',
                        text:`La carta ${this.cardToBuy.name} se ha añadido al mazo.`,
                        icon:'success'
                    })
                } else {
                    Swal.fire({
                        title: 'Insuficientes ascuas',
                        text: `Insuficientes ascuas para forjar ${this.cardToBuy.name}`,
                        icon:'error'
                    })
                }
            }
        })
    },

    GetCard(name){
        for (let i = 0; i < CardsArray.length; i++){
            let card = new CardsArray[i];
            if (card.name == name) this.cardToBuy = card;
        }
    }
}

const boardTop = document.getElementById("board-top"); //Parte superior del tablero
const boardBottom = document.getElementById("board-bottom"); //Parte inferior del tablero

let playerName = "";

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

//Creo dos master principales
//Primero el jugador:
//---------------------Vida--Mana--Cartas Desbloqueadas -- Nombre
const player = new Player(10, 20, playerName);
const userDisplay = document.getElementById("user-display");
const pointsDisplay = document.getElementById("user-points");

let enemy;

function StartGame(){
    userDisplay.innerHTML = User.name;
    pointsDisplay.innerHTML = User.points;

    player.name = playerName;

    enemy = new Enemy("Enemigo");
    
    pointsDisplay.innerHTML = User.points;
    
    player.deck.addEventListener('click', () => {
        player.TakeCardFromDeck();
    })
}