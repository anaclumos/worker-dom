import { fetchAndInstall } from './install';
import { ExportedWorker } from './exported-worker';

export function upgradeElement(baseElement: Element, domURL: string): Promise<ExportedWorker | null> {
  const authorURL = baseElement.getAttribute('src');
  console.log('Upgrading element...', authorURL);
  if (authorURL) {
    return fetchAndInstall(baseElement as HTMLElement, {
      authorURL,
      domURL,
    });
  }
  return Promise.resolve(null);
}
