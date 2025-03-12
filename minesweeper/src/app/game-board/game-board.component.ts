import { Component, OnInit } from '@angular/core';
import { Cell } from '../cell';
import { Difficulty, DIFFICULTY_CONFIG } from '../difficulty';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  board: Cell[][] = [];
  difficulty: Difficulty = Difficulty.EASY;
  rows: number = DIFFICULTY_CONFIG[Difficulty.EASY].rows;
  cols: number = DIFFICULTY_CONFIG[Difficulty.EASY].cols;
  mines: number = DIFFICULTY_CONFIG[Difficulty.EASY].mines;
  gameOver = false;
  gameWon = false;
  timer = 0;
  timerInterval: any;
  remainingMines: number = 0;
  difficulties = Object.values(Difficulty);

  ngOnInit() {
    // this.initializeBoard();
    this.startNewGame();
  }
  startNewGame() {
    this.gameOver = false;
    this.gameWon = false;
    this.stopTimer();
    this.timer = 0;
    const config = DIFFICULTY_CONFIG[this.difficulty];
    this.rows = config.rows;
    this.cols = config.cols;
    this.mines = config.mines;
    this.remainingMines = this.mines;
    this.initializeBoard();
    this.startTimer();
   }
  initializeBoard() {
    // 创建空板
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          row: i,
          col: j
        };
      }
    }

    // 随机放置地雷
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!this.board[row][col].isMine) {
        this.board[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // 计算每个格子周围的地雷数
    this.calculateNeighborMines();
  }
  changeDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
    this.startNewGame();
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }
  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  calculateNeighborMines() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.board[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols) {
                if (this.board[ni][nj].isMine) count++;
              }
            }
          }
          this.board[i][j].neighborMines = count;
        }
      }
    }
  }

  onCellClick(cell: Cell) {
    if (this.gameOver || cell.isFlagged || this.gameWon) return;
    
    if (cell.isMine) {
      this.gameOver = true;
      this.stopTimer();
      this.revealAll();
      alert('遊戲結束！');
      return;
    }

    this.revealCell(cell);
    this.checkWinCondition();
  }

  onRightClick(event: Event, cell: Cell) {
    event.preventDefault();
    if (this.gameOver || this.gameWon || cell.isRevealed) return;
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      this.remainingMines++;
    } else {
      cell.isFlagged = true;
      this.remainingMines--;
    }
  }
  private checkWinCondition() {
    const allNonMinesRevealed = this.board.every(row =>
      row.every(cell =>
        (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed)
      )
    );

    if (allNonMinesRevealed) {
      this.gameWon = true;
      this.stopTimer();
      alert('恭喜你贏了！');
    }
  }
  revealCell(cell: Cell) {
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    
    if (cell.neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const ni = cell.row + di;
          const nj = cell.col + dj;
          if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols) {
            this.revealCell(this.board[ni][nj]);
          }
        }
      }
    }
  }

  revealAll() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j].isRevealed = true;
      }
    }
  }
}