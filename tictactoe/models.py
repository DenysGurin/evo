from tictactoe import db


class Game(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    winner = db.Column(db.String(1), nullable=False)
    size = db.Column(db.Integer)
    
    def __repr__(self):
        return '<Game {} - winner {} size {}>'.format(self.id, self.winner, self.size)


class Step(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    row = db.Column(db.Integer, nullable=False)
    col = db.Column(db.Integer, nullable=False)
    val = db.Column(db.String(1), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship('Game',
        backref=db.backref('steps', lazy=True))

    def __repr__(self):
        return '<Game {} - step {} {} {}>'.format(self.game.id, self.row, self.col, self.val)

