import { env } from '@src/env';
import { CacheDriver, GoodDB, JSONDriver, MongoDBDriver } from 'good.db';

const isJSON = env.DATABASE === 'JSON';
if (!isJSON && !env.MONGO) throw 'Mongo DB not provided';

const driver = isJSON
	? new JSONDriver()
	: new MongoDBDriver({
			uri: env.MONGO || '',
		});
		
const db = new GoodDB(driver, {
	table: 'Data',
	nested: ':',
	nestedIsEnabled: true,
});

if (!isJSON) db.connect();

export default db;

const cache = new GoodDB(new CacheDriver(), {
	nested: ':',
	table: 'Cache',
	nestedIsEnabled: true,
});

export { cache };
