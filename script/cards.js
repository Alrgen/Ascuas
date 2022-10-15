//CLase padre de todas las cartas
class Card{
    constructor(data){ 
        //Estadisticas de las cartas
        this.name = data.name;
        this.ID = data.ID;
        this.damage = data.damage;
        this.maxHealth = data.health;
        this.health = this.maxHealth;
        this.manaCost = data.manaCost;
        this.master;
        this.image = data.image;
        this.cardHTML;
        this.damageHTML;
        this.healthHTML;
        this.slot = null;
        this.isInBoard = false;
        this.state = "inDeck";
        this.cost = data.cost;
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

        this.damageHTML = this.cardHTML.getElementsByClassName("card-damage")[0];
        this.healthHTML = this.cardHTML.getElementsByClassName("card-health")[0];
    }

    OnClick(){
        if (this.master == player){
            this.cardHTML.addEventListener('click', () => {
                if (GameManager.turnOfPlayer == true){
                    if (this.state == "inHand"){

                        if (player.mana >= this.manaCost){
                            this.MoveToBoard();
                            player.UpdateMana(-this.manaCost);
                        } else {
                            Swal.fire({
                                title: 'Mana insuficiente',
                                text: 'No tienes suficiente mana para invocar esta carta',
                                icon: 'error',
                                confirmButtonText: 'Continuar'
                            });
                        }
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

    TakeDamage(damage){
        //Utilizo la clase html "takeDamage" para añadir el efecto de recibir daño en las cartas
        this.cardHTML != null && this.cardHTML.classList.add("takeDamage"); 

        setTimeout(()=>{
            this.cardHTML != null && this.cardHTML.classList.remove("takeDamage");
        },1000);

        (this.health - damage <= 0) ? (this.health = 0) : (this.health -= damage);
        (this.health <= 0) && this.DestroySelf();

        this.healthHTML.textContent = this.health;
    }

    DestroySelf(){ 
        this.master.selectedCard = null;
        this.master.RemoveCardFromBoard(this);
        this.slot.innerHTML = "";

        if (this.master == enemy){
            GameManager.EndLevel();
        }
    }
}

function Card001(){ //Función constructora de cartas
    return new Card(cardsData[0]);
}
function Card002(){
    return new Card(cardsData[1]);
}
function Card003(){
    return new Card(cardsData[2]);;
}
function Card004(){
    return new Card(cardsData[3]);
}
function Card005(){
    return new Card(cardsData[4]);
}

const CardsArray = [Card001, Card002, Card003, Card004, Card005];