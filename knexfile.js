// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/lifeGpa.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './database/seeds' },
  },
};
