function getDataPOST() {

    var xhttp = new XMLHttpRequest();
        
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            console.log(json)
            if (json["game"]["size"] == null) {
                createField(5);
            } else {
                createField(json["game"]["size"]);
            }
            window.seq = json["steps"];
            window.winner = json["game"]["winner"];
            createHistory();
            document.getElementById("size").innerHTML ="";
            document.getElementById("winner").innerHTML ="Winner "+window.winner;
        }
    };
    xhttp.open("POST", window.location.href, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
    
}

window.onload = function(){

    getDataPOST();

}