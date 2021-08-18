import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";

export const confideAnimation = [
  trigger('list', [
    transition('* => *', [
      query(':enter',
        stagger(50, animateChild()), {optional: true}
      )
    ]),
  ]),
  trigger('confideAnimation', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateY(-100%)',
      }),
      animate('100ms cubic-bezier(0.23, 1, 0.32, 1)',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
    ]),
  ])
];
