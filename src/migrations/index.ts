import * as migration_20260902_091958 from './20260902_091958';
import * as migration_20260902_113728 from './20260902_113728';

export const migrations = [
  {
    up: migration_20260902_091958.up,
    down: migration_20260902_091958.down,
    name: '20260902_091958',
  },
  {
    up: migration_20260902_113728.up,
    down: migration_20260902_113728.down,
    name: '20260902_113728'
  },
];
