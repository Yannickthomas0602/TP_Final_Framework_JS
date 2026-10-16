import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  // Le rendu des routes est laissé au navigateur car certaines pages sont dynamiques.
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
