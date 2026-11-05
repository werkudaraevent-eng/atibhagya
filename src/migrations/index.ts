import * as migration_20260902_091958 from './20260902_091958';
import * as migration_20260902_113728 from './20260902_113728';
import * as migration_20260902_141956 from './20260902_141956';
import * as migration_20260902_162036 from './20260902_162036';
import * as migration_20260903_040716_privacy_note from './20260903_040716_privacy_note';
import * as migration_20260903_042749_updated_by from './20260903_042749_updated_by';
import * as migration_20260904_122027_nav_labels from './20260904_122027_nav_labels';
import * as migration_20260907_100513_events from './20260907_100513_events';
import * as migration_20260908_005848_event_downloads from './20260908_005848_event_downloads';
import * as migration_20260908_013334_event_hero_darken from './20260908_013334_event_hero_darken';
import * as migration_20260908_045128_home_hero_eyebrow_hidden from './20260908_045128_home_hero_eyebrow_hidden';
import * as migration_20260916_111150_journeys_hero_image from './20260916_111150_journeys_hero_image';
import * as migration_20261104_081805_payload_3_92_upgrade from './20261104_081805_payload_3_92_upgrade';
import * as migration_20261104_082917_privacy_retention_sales_role from './20261104_082917_privacy_retention_sales_role';
import * as migration_20261105_141228_jcwf_event_products from './20261105_141228_jcwf_event_products';
import * as migration_20261105_142734_storage_object_key from './20261105_142734_storage_object_key';

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
    name: '20260907_100513_events',
  },
  {
    up: migration_20260908_005848_event_downloads.up,
    down: migration_20260908_005848_event_downloads.down,
    name: '20260908_005848_event_downloads',
  },
  {
    up: migration_20260908_013334_event_hero_darken.up,
    down: migration_20260908_013334_event_hero_darken.down,
    name: '20260908_013334_event_hero_darken',
  },
  {
    up: migration_20260908_045128_home_hero_eyebrow_hidden.up,
    down: migration_20260908_045128_home_hero_eyebrow_hidden.down,
    name: '20260908_045128_home_hero_eyebrow_hidden',
  },
  {
    up: migration_20260916_111150_journeys_hero_image.up,
    down: migration_20260916_111150_journeys_hero_image.down,
    name: '20260916_111150_journeys_hero_image',
  },
  {
    up: migration_20261104_081805_payload_3_92_upgrade.up,
    down: migration_20261104_081805_payload_3_92_upgrade.down,
    name: '20261104_081805_payload_3_92_upgrade',
  },
  {
    up: migration_20261104_082917_privacy_retention_sales_role.up,
    down: migration_20261104_082917_privacy_retention_sales_role.down,
    name: '20261104_082917_privacy_retention_sales_role',
  },
  {
    up: migration_20261105_141228_jcwf_event_products.up,
    down: migration_20261105_141228_jcwf_event_products.down,
    name: '20261105_141228_jcwf_event_products',
  },
  {
    up: migration_20261105_142734_storage_object_key.up,
    down: migration_20261105_142734_storage_object_key.down,
    name: '20261105_142734_storage_object_key',
  },
];
