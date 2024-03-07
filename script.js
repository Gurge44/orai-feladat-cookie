const State = {
    FREE: 1,
    BOOKING_IN_PROGRESS: 2,
    BOOKED: 3,
    BORDER: 4
};

class MatrixButton {
    constructor(state, id) {
        this.state = state;
        this.id = id;
    }

    render() {
        return `<button class="cell cell-${this.state}" onclick="cellClick(${this.state}, ${this.id})"></button>`;
    }

    getPrice() {
        // If the state is not booking in progress, the price is 0
        if (this.state !== State.BOOKING_IN_PROGRESS) {
            return 0;
        }
        // If the id is less than 2450, the price is 12, otherwise it is 9
        return this.id < 2450 ? 12 : 9;
    }
}

matrix = [];
let totalPrice = 0;

function createMatrix() {
    for (let i = 0; i < 49; i++) {
        matrix.push([]);
        for (let j = 0; j < 49; j++) {
            let state = State.FREE;
            if (i % 24 === 0 || j % 24 === 0) {
                state = State.BORDER;
            }
            matrix[i].push(new MatrixButton(state, i * 100 + j));
        }
    }
}

function renderMatrix() {
    let html = matrix.map(row => row.map(button => button.render()).join("")).join("<br>");
    document.getElementById("matrix").innerHTML = html;
    sendMatrixToCookie();
}

function cellClick(state, id) {
    if (state === State.BORDER || state === State.BOOKED) {
        alert("You can't book this seat");
        return;
    }
    const element = matrix[Math.floor(id / 100)][id % 100];
    element.state = state === State.FREE ? State.BOOKING_IN_PROGRESS : State.FREE;
    renderMatrix();
    calculatePrice();
}

function book() {
    matrix.forEach(row => {
        row.forEach(button => {
            if (button.state === State.BOOKING_IN_PROGRESS) {
                button.state = State.BOOKED;
            }
        });
    });
    renderMatrix();
}

function calculatePrice() {
    totalPrice = matrix.flat().reduce((acc, button) => acc + button.getPrice(), 0);
    document.getElementById("price").innerText = totalPrice;
}

function sendMatrixToCookie() {
    let expireDays = 30;
    document.cookie = `matrix=${JSON.stringify(matrix)};expires=${new Date(Date.now() + expireDays * 24 * 3600 * 1000).toUTCString()}`;
}

function getMatrixFromCookie() {
    const cookie = document.cookie.split(";").find(c => c.includes("matrix"));
    if (cookie != undefined) {
        matrix = JSON.parse(cookie.split("=")[1]);
    }
    else {
        createMatrix();
    }
    renderMatrix();
}

getMatrixFromCookie();