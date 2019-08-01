export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'ExpertPlus';

// So, there's probably a proper way to type Redux actions, but boy is it a lot
// of potential work. Instead I'm only going to validate that it has the
// mandatory `type` field.
export type Action = {
  type: string;
  [x: string]: any;
};

export type Obstacle = {
  id: string;
  // Lane: which of the 4 columns does this box START on?
  lane: 0 | 1 | 2 | 3;
  // Type: Whether this is a vertical wall or a horizontal overhead ceiling
  type: 'wall' | 'ceiling';
  // beatStart: the number of beats that the song starts at
  beatStart: number;
  // beatDuration: the number of beats it should exist for
  beatDuration: number;
  // colspan: the number of columns this lane occupies
  // NOTE: Users can only create 1- or 2-column widths, but technically the
  // program supports reading 3 and 4, for imported song files.
  colspan: 1 | 2 | 3 | 4;
  // When initially placing an obstacle, it will exist in a limbo state, only
  // becoming real once the user releases the mouse
  tentative?: boolean;
  selected?: boolean;
};
