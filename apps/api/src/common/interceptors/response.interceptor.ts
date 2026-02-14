import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((value) => {
        if (value && typeof value === 'object' && 'data' in value) return value as ApiResponse<unknown>
        return { data: value }
      }),
    )
  }
}
