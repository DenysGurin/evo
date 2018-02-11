from flask import render_template, request, jsonify

from tictactoe import app
from tictactoe.models import Game, Step
from tictactoe import db

@app.route('/', methods=['GET', 'POST'])
def main():

    if request.method == 'GET':

        return render_template('tictactoe.html', main=True, games=Game.query.all())

    elif request.method == 'POST':

        game = Game(winner = request.get_json()["winner"], 
                    size = request.get_json()["size"])

        for step in request.get_json()["steps"]:

            step = Step(game=game, 
                        row=step["row"], 
                        col=step["col"],
                        val=step["val"])
            game.steps.append(step)
    
        db.session.add(game)
        db.session.commit()

        return render_template('games_list.html', games=Game.query.all())


@app.route('/<int:game_id>', methods=['GET', 'POST'])
def detail(game_id):

    if request.method == 'GET':

        return render_template('tictactoe.html', detail=True, games=Game.query.all())
        
    elif request.method == 'POST':

        game = Game.query.get(game_id)
        steps = Step.query.filter_by(game_id=game_id).all()

        return jsonify({"game":dict(winner=game.winner,
                                    size=game.size),
                        "steps":[dict(row=step.row,
                                      col=step.col,
                                      val=step.val) for step in steps]})