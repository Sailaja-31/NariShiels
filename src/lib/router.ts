// Lightweight hash-based router. Keeps the app a true SPA with no extra deps.
import { useEffect, useState } from 'react';

export type Route =
  | 'home'
  | 'dashboard'
  | 'scanner'
  | 'guard'
  | 'simulator'
  | 'manipulation'
  | 'job'
  | 'link'
  | 'reply'
  | 'assistant'
  | 'planner'
  | 'journey'
  | 'sos'
  | 'privacy';

const ROUTES: Route[] = [
  'home', 'dashboard', 'scanner', 'guard', 'simulator', 'manipulation',
  'job', 'link', 'reply', 'assistant', 'planner', 'journey', 'sos', 'privacy',
];

export function routeFromHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '') as Route;
  return ROUTES.includes(h) ? h : 'home';
}

export function navigate(route: Route) {
  window.location.hash = `/${route}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(routeFromHash());
  useEffect(() => {
    const onChange = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
