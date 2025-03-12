import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameBoardComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'minesweeper';
}
