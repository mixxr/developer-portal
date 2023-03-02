import { SITECORE_CLIENT_ID, SITECORE_CLIENT_SECRET } from './constants';
import { authenticate } from './lib/auth';
import { getItems } from './lib/items';
import { isPublished, publishItem } from './lib/publishing';

console.log('START');

const client = authenticate(SITECORE_CLIENT_ID, SITECORE_CLIENT_SECRET);

//find all changelog items with prefix that are not published yet

start();

async function start() {
  console.log('Publish - Start');

  const items = await getItems(client, 'changelog');
  console.log('Count: ' + items.totalCount);
  console.log('PageSize: ' + items.pageSize);
  console.log('PageNumber: ' + items.pageNumber);
  //console.log(items);

  items.data.forEach(async (item) => {
    console.log(item.name);
    //console.log(item.system);
    if (item.name?.startsWith('SEBW-TEST-chlog-')) {
      console.log('Detected candidate...');

      const published = isPublished(item);
      if (!published) {
        await publishItem(client, item.id);
      } else {
        console.log('Item is already published');
      }
    } else {
      console.log('Ignore me please, I am not the one you were searching for');
    }

    console.log(item.fields.title);
    console.log('-------');
  });

  console.log('publish - end');
}
