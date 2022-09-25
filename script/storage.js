let users = localStorage.getItem('users');

function SaveUser(){

    let usersParce = [];

    if (users != null) usersParce = users.split(",");

    console.log(usersParce);

    if (!IsUserRegistered(usersParce)) {
        usersParce.push(playerName);
        localStorage.setItem('users', usersParce);
        localStorage.setItem(`${playerName}`, 0);
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
}

function SaveProgress(){    
    let lastPoints = parseInt(localStorage.getItem(`${playerName}`));

    if (lastPoints < player.points){
        localStorage.setItem(`${playerName}`, player.points)
    }
}

function LoadProgress(user){
    let points = parseInt(localStorage.getItem(user));

    player.points = points;

    Swal.fire({
        title: 'Usuario Cargado',
        text: `El usuario ${playerName} tiene un total de ${player.points} puntos.`,
        icon: 'success',
        confirmButtonText: 'Continuar'
    });
}