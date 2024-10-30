import { Mod } from '../App';

export default function Modpack({ mods }: { mods: Mod[] }): JSX.Element {
  const BASE_URL = 'https://thunderstore.io';
  return (
    <section className="modpacks">
      {
        mods.map(({ title, url }) => {
          return (
            <article className='modpack' key={url}>
              <p>{title}</p>
              <a className='downloadSingleMod' target='_blank' href={`${BASE_URL}${url ?? ''}` }>
                <img src="./src/assets/downloadButton.svg" alt="Download button" width={20} />
              </a>
            </article>
          );
        })
      }
    </section>
  );
}