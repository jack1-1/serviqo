import { Component,ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
   imports: [RouterOutlet,Header,Sidebar],
  selector: 'app-shell',
  styleUrl: './shell.scss',
  templateUrl: './shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Shell {}
