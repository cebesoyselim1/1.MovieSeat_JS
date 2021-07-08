const seats = document.querySelector(".seats");
const getTicket = document.querySelector(".submit");
const movieSelectBox = document.querySelector(".movie-select-items");
const total = document.querySelector(".total");

function InitiateMoviesToLS(){
    const movies = [
        {name:"Movie 1", price:15},
        {name:"Movie 2", price:12},
        {name:"Movie 3", price:8}
    ];

    if(JSON.parse(localStorage.getItem("Movies")) == null){
        localStorage.setItem("Movies",JSON.stringify(movies));
    }

    movies.forEach((movie) => {
        let option = document.createElement("option");
        option.value = movie.name;
        option.innerHTML = movie.name + " " + movie.price + "$";
        movieSelectBox.appendChild(option);
    })
}


InitiateMoviesToLS();


function GetMoviesFromLS(){
    return JSON.parse(localStorage.getItem("Movies"));
}

function GetOccupiedSeatsFromLS(movieName){
    let seats = JSON.parse(localStorage.getItem("Seats"));
    let returningSeats = null;
    if(seats != null) {
        let seat = seats.forEach((seat) => {if(seat.name == movieName){returningSeats = seat}
        
        })
    }
    return returningSeats;
}

function getMoviePriceByName(movieName){
    let movies = GetMoviesFromLS();
    let price = 0;
    movies.forEach((movie) => {
        if(movie.name == movieName) {price = movie.price;}
    })
    
    return price;
}

function InitiateSeats(){
    let occupiedSeats = GetOccupiedSeatsFromLS("Movie 1");
    let seatNumber = 1;
    let occupiedCounter = 0;
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 8; j++){
            let seat = document.createElement("div");
            seat.className = "seat seat-na";
            if(occupiedSeats != null){
                if(occupiedSeats.occupiedSeats[occupiedCounter] == seatNumber){
                    seat.className = "seat seat-occupied";
                    occupiedCounter++;
                }
            }
            seat.style.margin = "2px";
            if(j == 1 || j == 5) {seat.style.marginRight = "20px"};
            seat.innerHTML = seatNumber;
            seats.appendChild(seat);
            seatNumber++;
        }
    }
}

InitiateSeats();



function GetOccupiedSeats(){
    let seatArr = [];
    for(let i = 0; i < seats.children.length; i++){
        if(seats.children[i].classList.contains("seat-occupied")){
            seatArr.push(i + 1);
        }
    }
    return seatArr;
}

getTicket.addEventListener("click",(e) => {
    for(let i = 0; i < seats.children.length; i++){
        if(seats.children[i].classList.contains("seat-selected")){
            seats.children[i].className = "seat seat-occupied";
        }
    }
    //Save Seats to LS
    saveSeatsToLS();
    total.innerHTML = "";
});

function saveSeatsToLS(){
    let currentMovie = movieSelectBox.value;
    let seats = GetOccupiedSeats();
    let seatsObj = {
        name: currentMovie,
        occupiedSeats: seats
    };

    let seatsLS = JSON.parse(localStorage.getItem("Seats"));
    if(GetOccupiedSeatsFromLS(seatsObj.name) != null){
        for(let i = 0; i < seatsLS.length; i++){
            if(seatsLS[i].name == seatsObj.name){
                seatsLS.splice(i,1,seatsObj);
            }
        }
    }else{
        if(seatsLS == null)seatsLS = [];
        seatsLS.push(seatsObj);
    }
    localStorage.setItem("Seats",JSON.stringify(seatsLS));
}

seats.addEventListener("click",(e) => {
    if(e.target.classList.contains("seat")){
        
        if(e.target.classList.contains("seat-na")){
            e.target.className = "seat seat-selected";
        }else if(e.target.classList.contains("seat-selected")){
            e.target.className = "seat seat-na";
        }
    }
    calculateTotal();
});

movieSelectBox.addEventListener("change",(e) => {
    let occupiedSeats = GetOccupiedSeatsFromLS(e.target.value);
    occupiedCounter = 0;
    for(let i = 0; i < seats.children.length; i++){
        seats.children[i].className = "seat seat-na";
        if(i + 1 == occupiedSeats.occupiedSeats[occupiedCounter]){
            seats.children[i].className = "seat seat-occupied";
            occupiedCounter++;
        }
    }
    total.innerHTML = "";
});

function GetSelectedSeats(){
    let selectedSeats = 0;
    for(let i = 0; i < seats.children.length; i++){
        if(seats.children[i].classList.contains("seat-selected")){
            selectedSeats++;
        }
    }
    return selectedSeats;
}

function calculateTotal(){
    let moviePrice = getMoviePriceByName(movieSelectBox.value);
    let selectedSeats = GetSelectedSeats();
    if(selectedSeats == 0){total.innerHTML = ""; return;} 
    total.innerHTML = `${selectedSeats} seats selected with price ${moviePrice * selectedSeats}$`;
}




