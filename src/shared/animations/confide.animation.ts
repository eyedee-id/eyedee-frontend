import {animate, style, transition, trigger} from "@angular/animations";

export const confideAnimation = trigger('confideAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-100%)',
    }),
    animate('700ms cubic-bezier(0.23, 1, 0.32, 1)', style({
      opacity: 1,
      transform: 'translateY(0)',
    })),
  ]),
]);
