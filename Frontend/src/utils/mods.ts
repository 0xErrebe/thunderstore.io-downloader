import { Mod } from '../App';
const API_URL = 'http://localhost:3000/api/gethtml';

export async function getMods(modpackUrl: string): Promise<[Mod[], { error: boolean, message: string }]> {
  const searchParam = new URLSearchParams({ thunderstore_url: modpackUrl });
  const response = await fetch(`${API_URL}?${searchParam}`);
  const { html, error, message } = await response.json();

  if (error) return [[], { error: true, message }];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const $$ = (selector: string) => doc.querySelectorAll(selector);

  const badges = $$('.badge');

  const isModpack = Array.from(badges).filter(({ textContent }) => textContent === 'Modpacks').length !== 0;
  if (!isModpack) return [[], { error: true, message: 'No modpack found' }];

  const modsDivs = Array.from($$('.list-group-item.flex-column.align-items-start.media'));
  const mods = modsDivs.map(div => {
    const a = div.querySelector('a');
    const title = a?.textContent?.replace(/[ \n]/g, '');
    const url = a?.getAttribute('href');
    return { title, url };
  });

  return [mods, { error: false, message: 'Mods fetched successfully' }];
}

export async function getModDownloadUrl({ title, url }: Mod): Promise<Mod> {
  if (!url) return { title, url: null };

  const searchParam = new URLSearchParams({ thunderstore_url: url });
  const response = await fetch(`${API_URL}?${searchParam}`);
  const { html, error } = await response.json();

  if (error) return { title, url: null };
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const $$ = (selector: string) => doc.querySelectorAll(selector);

  const downloadUrl = $$('.btn.btn-primary.w-100.text-large')[1].getAttribute('href');

  return { title, url: downloadUrl };
}
