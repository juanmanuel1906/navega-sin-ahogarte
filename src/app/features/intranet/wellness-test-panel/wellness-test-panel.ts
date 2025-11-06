import { Component } from '@angular/core';
import { WellnessTest } from '../../components/wellness-test/wellness-test';

@Component({
  selector: 'app-wellness-test-panel',
  imports: [WellnessTest],
  templateUrl: './wellness-test-panel.html',
  styleUrl: './wellness-test-panel.css'
})
export class WellnessTestPanel {

}
