exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'siratl',
          password:
            '$2a$10$YNk76GrgcFn6YJGQgmr1luICjYOdIz.Y3cErve1fG9YYRn6kCewFa',
          fullName: 'Elisha Atulomah',
          email: 'elisha@gmail.com',
          userImgUrl:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        },
        {
          username: 'test-1',
          password:
            '$2a$10$YNk76GrgcFn6YJGQgmr1luICjYOdIz.Y3cErve1fG9YYRn6kCewFa',
          fullName: 'Rowan Atkinson',
          email: 'mrbean@gmail.com',
          userImgUrl:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        },
        {
          username: 'bond',
          password:
            '$2a$10$YNk76GrgcFn6YJGQgmr1luICjYOdIz.Y3cErve1fG9YYRn6kCewFa',
          fullName: 'James Bond',
          email: '007@gmail.com',
          userImgUrl:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        },
      ]);
    });
};
