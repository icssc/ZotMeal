// get menu data from firebase

import { Menu, MenuParams } from './models';
import { db } from '../firebase';
import { DataSnapshot } from 'firebase-admin/database';
import { FirebaseError } from '@firebase/util';

// function getMenu(params: MenuParams): Menu | null {
//   const menus = db.ref();
//   return null;
// }

async function getMenuDB({ location, date, meal }: MenuParams): Promise<Menu | null> {
  // const dateKey = `${date.getMonth()}|${date.getDay()}|${date.getFullYear()}`;

  const menuPath = `menus/${location}/${date}/${meal}`;

  const ref = db.ref(menuPath);
  const data = await ref.once('value', (snapshot: DataSnapshot) => snapshot.val());

  if (!data.exists()) {
    return null;
  }

  const menu = data.toJSON() as Menu;
  return menu;
}

async function saveMenuDB(menu: Menu) {
  console.log('saving menu');

  const menuPath = `menus/${menu.location}/${menu.date}/${menu.location}`;

  try {
    await db.ref(menuPath).push(menu);
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e);
      throw e;
    }
  }
}

export { getMenuDB, saveMenuDB };
