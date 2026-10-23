import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AuthstateService } from '../../core/services/auth-state.service';
@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly _authStateService =inject(AuthstateService);
  constructor(){
console.log(this._authStateService.permissions());

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  
 
}
