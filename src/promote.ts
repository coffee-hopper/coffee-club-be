import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { User } from './entities/user.entity';

async function promoteAdmin() {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  const user = await em.findOne(User, { googleEmail: 'bhdrpkcn@gmail.com' });

  if (!user) {
    console.log('❌ No such user found.');
    await orm.close();
    return;
  }

  if (user.role !== 'admin') {
    user.role = 'admin';
    await em.persistAndFlush(user);
    console.log(`🫡 Promoted ${user.username} to admin!`);
  } else {
    console.log(`✅ ${user.username} is already an admin.`);
  }

  await orm.close();
}

promoteAdmin().catch((err) => {
  console.error('🔥 Failed to promote:', err);
});
