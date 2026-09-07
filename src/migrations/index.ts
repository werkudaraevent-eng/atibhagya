import * as migration_20260902_091958 from './20260902_091958';
import * as migration_20260902_113728 from './20260902_113728';
import * as migration_20260902_141956 from './20260902_141956';
import * as migration_20260902_162036 from './20260902_162036';
import * as migration_20260903_040716_privacy_note from './20260903_040716_privacy_note';
import * as migration_20260903_042749_updated_by from './20260903_042749_updated_by';
import * as migration_20260904_122027_nav_labels from './20260904_122027_nav_labels';
import * as migration_20260907_100513_events from './20260907_100513_events';

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
    name: '20260902_162036',
  },
  {
    up: migration_20260903_040716_privacy_note.up,
    down: migration_20260903_040716_privacy_note.down,
    name: '20260903_040716_privacy_note',
  },
  {
    up: migration_20260903_042749_updated_by.up,
    down: migration_20260903_042749_updated_by.down,
    name: '20260903_042749_updated_by',
  },
  {
    up: migration_20260904_122027_nav_labels.up,
    down: migration_20260904_122027_nav_labels.down,
    name: '20260904_122027_nav_labels',
  },
  {
    up: migration_20260907_100513_events.up,
    down: migration_20260907_100513_events.down,
    name: '20260907_100513_events'
  },
];
