// get menu data from firebase

import { SourceTextModule } from 'vm';
import { Menu } from './types';

function getMenu(): Menu | null {
  return null;
}

function saveMenu(db: firebasemenu: Menu): void {
  console.log('saving menu');
}

export { getMenu, saveMenu };
