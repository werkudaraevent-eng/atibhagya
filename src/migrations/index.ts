import * as migration_20260902_091958 from './20260902_091958';
import * as migration_20260902_113728 from './20260902_113728';
import * as migration_20260902_141956 from './20260902_141956';
import * as migration_20260902_162036 from './20260902_162036';

export const migrations = [
  {
    up: migration_20260902_091958.up,
    down: migration_20260902_091958.down,
    name: '20260902_091958',
  },
  {
    up: migration_20260902_113728.up,
    down: migration_20260902_113728.down,
    name: '20260902_113728',
  },
  {
    up: migration_20260902_141956.up,
    down: migration_20260902_141956.down,
    name: '20260902_141956',
  },
  {
    up: migration_20260902_162036.up,
    down: migration_20260902_162036.down,
    name: '20260902_162036'
  },
];
