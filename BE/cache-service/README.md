# Cache HTTP Status Module

## Mô tả

Module `cache-http-status` có nhiệm vụ tự động load tất cả các mã lỗi HTTP và message tương ứng vào Redis khi server khởi động. Module này giúp các service khác có thể truy cập nhanh chóng thông tin về HTTP status codes thông qua Redis cache.

## Tính năng

### Tự động load khi khởi động
- Khi server khởi động, module sẽ tự động load tất cả HTTP status codes vào Redis
- Dữ liệu được cache với TTL 24 giờ
- Log chi tiết quá trình load

### Cấu trúc dữ liệu
Mỗi HTTP status code bao gồm:
```typescript
interface HttpStatusInfo {
  code: number;        // Mã số HTTP (200, 404, 500...)
  message: string;     // Tên status ('OK', 'Not Found'...)
  description: string; // Mô tả chi tiết
}
```

### Redis Keys
- `http_status:all` - Tất cả status codes
- `http_status:code:{code}` - Status theo mã số (vd: `http_status:code:200`)
- `http_status:name:{name}` - Status theo tên (vd: `http_status:name:OK`)

## API Endpoints

### GET `/cache/http-status/all`
Lấy tất cả HTTP status codes từ cache

**Response:**
```json
{
  "success": true,
  "data": {
    "OK": {
      "code": 200,
      "message": "OK",
      "description": "The request has succeeded"
    },
    // ... other status codes
  }
}
```

### GET `/cache/http-status/code/{code}`
Lấy HTTP status theo mã số

**Example:** `GET /cache/http-status/code/404`

**Response:**
```json
{
  "success": true,
  "data": {
    "code": 404,
    "message": "Not Found",
    "description": "The server cannot find the requested resource"
  }
}
```

### GET `/cache/http-status/name/{name}`
Lấy HTTP status theo tên

**Example:** `GET /cache/http-status/name/UNAUTHORIZED`

**Response:**
```json
{
  "success": true,
  "data": {
    "code": 401,
    "message": "Unauthorized",
    "description": "Authentication is required and has failed or not been provided"
  }
}
```

### POST `/cache/http-status/refresh`
Refresh lại cache (reload tất cả data)

**Response:**
```json
{
  "success": true,
  "message": "HTTP status codes cache refreshed successfully"
}
```

### DELETE `/cache/http-status/clear`
Xóa toàn bộ cache HTTP status

**Response:**
```json
{
  "success": true,
  "message": "HTTP status codes cache cleared successfully"
}
```

## Cách sử dụng trong code

### Import service
```typescript
import { CacheHttpStatusService } from './module/cache-http-status';

// Trong constructor
constructor(
  private readonly cacheHttpStatusService: CacheHttpStatusService
) {}
```

### Sử dụng service methods
```typescript
// Lấy tất cả status codes
const allCodes = await this.cacheHttpStatusService.getAllHttpStatusCodes();

// Lấy theo mã số
const status200 = await this.cacheHttpStatusService.getHttpStatusByCode(200);

// Lấy theo tên
const statusOK = await this.cacheHttpStatusService.getHttpStatusByName('OK');

// Refresh cache
await this.cacheHttpStatusService.refreshHttpStatusCache();

// Clear cache
await this.cacheHttpStatusService.clearHttpStatusCache();
```

## Cấu hình Redis

Đảm bảo file `.env` có các cấu hình Redis:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_KEY_PREFIX=cache_service:
REDIS_DB=0
REDIS_TLS=false
REDIS_MAX_RETRIES_PER_REQ=3
REDIS_ENABLE_OFFLINE_QUEUE=false
REDIS_CONNECT_TIMEOUT_MS=10000
REDIS_RETRY_DELAY_MS=50
```

## Chạy server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Sau khi server khởi động, check log sẽ thấy:
```
[CacheHttpStatusService] Starting to load HTTP status codes to Redis...
[CacheHttpStatusService] Successfully loaded 46 HTTP status codes to Redis
```

## Testing

Chạy test cho module:
```bash
npm test cache-http-status
```

## HTTP Status Codes được hỗ trợ

Module hỗ trợ tất cả HTTP status codes chuẩn:

### 1xx Informational
- 100 Continue
- 101 Switching Protocols  
- 102 Processing

### 2xx Success
- 200 OK
- 201 Created
- 202 Accepted
- 204 No Content
- và các mã khác...

### 3xx Redirection
- 301 Moved Permanently
- 302 Found
- 304 Not Modified
- và các mã khác...

### 4xx Client Error
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
- và các mã khác...

### 5xx Server Error
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout
- và các mã khác...

## Lưu ý

- Cache có TTL 24 giờ, sau đó tự động expired
- Module tự động load lại cache khi server restart
- Nếu Redis không khả dụng, service sẽ log error nhưng không crash server
- Sử dụng Redis key prefix để tránh conflict với các service khác