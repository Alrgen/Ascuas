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
                Golem: 'Golem',
                Orco: 'Orco'
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
                    if (User.deck.length + 1 > player.deckSize){
                        Swal.fire({
                            title:'Mazo lleno!',
                            text:`No tienes mas espacio en el mazo.`,
                            icon:'error'
                        })
                    } else {
                        player.AddCardToDeck([this.cardToBuy]);
                        console.log(this.cardToBuy.ID);
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
                    }
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