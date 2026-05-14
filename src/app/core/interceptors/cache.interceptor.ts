import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, { expiredAt: number; resp: HttpResponse<unknown>}>();
const TTL = 1000 * 60 * 10;

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Clave única basada en la URL, método, headers y body
  const cacheKey = JSON.stringify({
    url: req.url,
    method: req.method,
    headers: req.headers.keys().reduce((acc:any, key:any) => {
      acc[key] = req.headers.get(key);
      return acc
    }, {} as Record<string, string | null>),
    body: req.body
  });
  // Verificamos si existe una respuesta cacheada
  const cachedResponse = cache.get(cacheKey);
  if(cachedResponse) {
    if(cachedResponse.expiredAt > Date.now()) {
      return of(cachedResponse.resp)
    } else {
      cache.delete(cacheKey);
    }
  }
  // Si no está cacheada, hacemos la petición y guardamos la respuesta
  return next(req).pipe(
    tap((event) => {
      if(event instanceof HttpResponse) {
        cache.set(cacheKey, {expiredAt: Date.now() + TTL, resp: event});
      }
    })
  );
};
