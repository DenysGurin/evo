var step;
var max;
var seq = [];
var winner;
var changed = true;

function checkRow() {
    var list = window.seq;
    var len = window.max;
    var count = {
        x:0, 
        o:0
    };

    for (row=0; row<len; row++) {

        for (item=0; item<list.length; item++) {
 
            if (list[item].row == row && list[item].val == "X") {
                count.x += 1;
            }

            if (list[item].row == row && list[item].val == "O") {
                count.o += 1;
            }

            if (count.x == len || count.o == len) {
                return true;
            }
        }

        count = {
            x:0, 
            o:0
        };
    }
}

function checkCol() {

    var list = window.seq;
    var len = window.max;
    var count = {
        x:0, 
        o:0
    };

    for (col=0; col<len; col++) {

        for (item=0; item<list.length; item++) {
 
            if (list[item].col == col && list[item].val == "X") {
                count.x += 1;
            }

            if (list[item].col == col && list[item].val == "O") {
                count.o += 1;
            }

            if (count.x == len || count.o == len) {
                return true;
            }
        }
        count = {
            x:0, 
            o:0
        };
    }
}

function checkDiag() {

    var list = window.seq;
    var len = window.max;
    var count = {
        x:0, 
        o:0
    };

    for (item=0; item<list.length; item++) {

        if (list[item].row == list[item].col && list[item].val == "X") {
            count.x += 1;
        }

        if (list[item].row == list[item].col && list[item].val == "O") {
            count.o += 1;
        }

        if (count.x == len || count.o == len) {
            return true;
        }
    }

    count = {
        x:0, 
        o:0
    };

    for (item=0; item<list.length; item++) {

        console.log(list[item].row);
        console.log(list[item].col);

        if (list[item].row == len - 1 - list[item].col && list[item].val == "X") {
            count.x += 1;
        }

        if (list[item].row == len - 1 - list[item].col && list[item].val == "O") {
            count.o += 1;
        }

        if (count.x == len || count.o == len) {
            return true;
        }

        console.log(count);
    }
}

function checkWinner() {

    if (checkRow()) {
        return true;
    }

    if (checkCol()) {
        return true;
    }

    if (checkDiag()) {
        return true;
    }
}

function createField(max) {
    
    window.max = max; 
    for (var i=0; i<max; i++) {

        var i = i.toString();
        var tr = "<tr id=row_".concat(i,">");
        document.getElementById('game').innerHTML+=tr;

        for (var j=0; j<max; j++) {

            i_j = i.toString()+"_"+j.toString();
            text = '<td><button type="button" class=cell id=cell_'.concat(i_j, ' onclick="setVal(this)"></button></td>');
            document.getElementById('row_'+i).innerHTML+=text;
        }

        document.getElementById('game').innerHTML+='</tr>';
    }

}

function setSize(obj) {

    var x;

    x = document.getElementById("numb").value;

    if (x > 1 && x <= 10) {

        document.getElementById("game").innerHTML="";
        createField(x);
        window.step = 'X';
        window.max = x;
    }
}

function createHistory() {
    for (item=0; item<window.seq.length; item++) {
        console.log(window.seq[item]);
        var i = window.seq[item].row;
        var j = window.seq[item].col;
        var val = window.seq[item].val;
        document.getElementById("cell_"+i+"_"+j).innerHTML = val;
        var step = item + 1;
        var history = '<p><button id="step_'+step+'" onclick=showMoves('+step+')>Step '+step+'</button></p>';
        console.log(history)
        document.getElementById("history").innerHTML += history;
    }
}

function cleanField() {
    var cutted = window.seq.slice();
    cutted.splice(step);
    console.log(window.seq);
    // console.log(cutted.length);
    // document.getElementsByClassName('cell').innerHTML = "";
    for (item=0; item<window.seq.length; item++) {
        console.log(window.seq[item]);
        var i = window.seq[item].row;
        var j = window.seq[item].col;
        document.getElementById("cell_"+i+"_"+j).innerHTML = "";
    }
}

function updateField(step) {
    var cutted = window.seq.slice();
    cutted.splice(step);
    console.log(window.seq);
    
    for (item=0; item<cutted.length; item++) {

        // console.log(cutted[item]);
        var i = cutted[item].row;
        var j = cutted[item].col;
        var val = cutted[item].val;
        // console.log(document.getElementById("cell_"+i+"_"+j));
        // document.getElementById("cell_1_1").innerHTML = "";
        document.getElementById("cell_"+i+"_"+j).innerHTML = val;

    }
}

function showMoves(step) {
    if (step == window.seq.length) {
        window.changed = true;
    } else {
        window.changed = false;
    }
    cleanField();
    updateField(step);
}

function sendPOST(winner) {
    var xhttp = new XMLHttpRequest();
    var json = JSON.stringify({
        winner: window.winner,
        steps: window.seq,
        size: window.max
    });
    console.log(json)
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("games_list").innerHTML =
            this.responseText;
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(json);
}

function setVal(cell) {

    var data = cell.id.split('_').slice(1);
    var val = window.step;
    document.getElementById("size").innerHTML ="";
    if (window.winner == null && window.changed == true) {

        if (cell.innerHTML=="" && cell.value=="") {
            var object = {
                row:data[0],
                col:data[1],
                val:val
            };

            cell.innerHTML = val;
            // cell.value = val;

            window.seq.push(object);

            if (val == 'X') {

                window.step = 'O';
                
            } else {

                window.step = 'X';
            }
            var step = window.seq.length
            var history = '<p><button id="step_'+step+'" onclick=showMoves('+step+')>Step '+step+'</button></p>';
            document.getElementById("history").innerHTML += history;

        } 
        

        if (checkWinner()) {

            window.winner = val;
            document.getElementById("winner").innerHTML += val;
            sendPOST(val);
        }
    }
    
    // console.log(window.seq);
    // console.log(checkWinner());
}


function myFunction() {
    var x, text;

    // Get the value of the input field with id="numb"
    x = document.getElementById("numb").value;

    // If x is Not a Number or less than one or greater than 10
    if (isNaN(x) || x < 1 || x > 10) {
        text = "Input not valid";
    } else {
        text = "Input OK";
    }
    document.getElementById("demo").innerHTML = text;
}


