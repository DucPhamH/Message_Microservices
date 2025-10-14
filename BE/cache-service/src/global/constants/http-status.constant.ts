export interface HttpStatusInfo {
  code: number;
  message: string;
  description: string;
}

export const HTTP_STATUS_CODES: Record<string, HttpStatusInfo> = {
  // 1xx Informational
  CONTINUE: {
    code: 100,
    message: 'Continue',
    description: 'The client can continue with the request',
  },
  SWITCHING_PROTOCOLS: {
    code: 101,
    message: 'Switching Protocols',
    description: 'The server is switching to a different protocol',
  },
  PROCESSING: {
    code: 102,
    message: 'Processing',
    description: 'The request is being processed',
  },

  // 2xx Success
  OK: {
    code: 200,
    message: 'OK',
    description: 'The request has succeeded',
  },
  CREATED: {
    code: 201,
    message: 'Created',
    description:
      'The request has been fulfilled and a new resource has been created',
  },
  ACCEPTED: {
    code: 202,
    message: 'Accepted',
    description: 'The request has been accepted for processing',
  },
  NON_AUTHORITATIVE_INFORMATION: {
    code: 203,
    message: 'Non-Authoritative Information',
    description: 'The returned meta information is not the definitive set',
  },
  NO_CONTENT: {
    code: 204,
    message: 'No Content',
    description: 'The request has been processed but no content is returned',
  },
  RESET_CONTENT: {
    code: 205,
    message: 'Reset Content',
    description:
      'The user agent should reset the document which sent this request',
  },
  PARTIAL_CONTENT: {
    code: 206,
    message: 'Partial Content',
    description: 'The server is delivering only part of the resource',
  },

  // 3xx Redirection
  MULTIPLE_CHOICES: {
    code: 300,
    message: 'Multiple Choices',
    description: 'The request has more than one possible response',
  },
  MOVED_PERMANENTLY: {
    code: 301,
    message: 'Moved Permanently',
    description: 'The resource has been permanently moved to a new URL',
  },
  FOUND: {
    code: 302,
    message: 'Found',
    description: 'The resource has been temporarily moved to a different URL',
  },
  SEE_OTHER: {
    code: 303,
    message: 'See Other',
    description: 'The response to the request can be found under another URL',
  },
  NOT_MODIFIED: {
    code: 304,
    message: 'Not Modified',
    description: 'The resource has not been modified since the last request',
  },
  TEMPORARY_REDIRECT: {
    code: 307,
    message: 'Temporary Redirect',
    description: 'The resource has been temporarily moved',
  },
  PERMANENT_REDIRECT: {
    code: 308,
    message: 'Permanent Redirect',
    description: 'The resource has been permanently moved',
  },

  // 4xx Client Errors
  BAD_REQUEST: {
    code: 400,
    message: 'Bad Request',
    description: 'The server cannot process the request due to client error',
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized',
    description:
      'Authentication is required and has failed or not been provided',
  },
  PAYMENT_REQUIRED: {
    code: 402,
    message: 'Payment Required',
    description: 'Payment is required to access the resource',
  },
  FORBIDDEN: {
    code: 403,
    message: 'Forbidden',
    description: 'The client does not have access rights to the content',
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found',
    description: 'The server cannot find the requested resource',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    message: 'Method Not Allowed',
    description:
      'The request method is not supported for the requested resource',
  },
  NOT_ACCEPTABLE: {
    code: 406,
    message: 'Not Acceptable',
    description:
      'The requested resource cannot generate content acceptable to the client',
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    code: 407,
    message: 'Proxy Authentication Required',
    description: 'Authentication with the proxy is required',
  },
  REQUEST_TIMEOUT: {
    code: 408,
    message: 'Request Timeout',
    description: 'The server timed out waiting for the request',
  },
  CONFLICT: {
    code: 409,
    message: 'Conflict',
    description: 'The request conflicts with the current state of the server',
  },
  GONE: {
    code: 410,
    message: 'Gone',
    description: 'The requested resource is no longer available',
  },
  LENGTH_REQUIRED: {
    code: 411,
    message: 'Length Required',
    description: 'The request did not specify the length of its content',
  },
  PRECONDITION_FAILED: {
    code: 412,
    message: 'Precondition Failed',
    description:
      'One or more conditions given in the request header fields evaluated to false',
  },
  PAYLOAD_TOO_LARGE: {
    code: 413,
    message: 'Payload Too Large',
    description: 'The request entity is larger than limits defined by server',
  },
  URI_TOO_LONG: {
    code: 414,
    message: 'URI Too Long',
    description: 'The URI provided was too long for the server to process',
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    message: 'Unsupported Media Type',
    description:
      'The request entity has a media type which the server does not support',
  },
  RANGE_NOT_SATISFIABLE: {
    code: 416,
    message: 'Range Not Satisfiable',
    description:
      'The client has asked for a portion of the file that the server cannot supply',
  },
  EXPECTATION_FAILED: {
    code: 417,
    message: 'Expectation Failed',
    description:
      'The server cannot meet the requirements of the Expect request-header field',
  },
  I_AM_A_TEAPOT: {
    code: 418,
    message: "I'm a teapot",
    description: 'The server refuses the attempt to brew coffee with a teapot',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    message: 'Unprocessable Entity',
    description:
      'The request was well-formed but was unable to be followed due to semantic errors',
  },
  LOCKED: {
    code: 423,
    message: 'Locked',
    description: 'The resource that is being accessed is locked',
  },
  FAILED_DEPENDENCY: {
    code: 424,
    message: 'Failed Dependency',
    description: 'The request failed due to failure of a previous request',
  },
  TOO_EARLY: {
    code: 425,
    message: 'Too Early',
    description:
      'The server is unwilling to risk processing a request that might be replayed',
  },
  UPGRADE_REQUIRED: {
    code: 426,
    message: 'Upgrade Required',
    description: 'The client should switch to a different protocol',
  },
  PRECONDITION_REQUIRED: {
    code: 428,
    message: 'Precondition Required',
    description: 'The origin server requires the request to be conditional',
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    message: 'Too Many Requests',
    description:
      'The user has sent too many requests in a given amount of time',
  },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    code: 431,
    message: 'Request Header Fields Too Large',
    description:
      'The server is unwilling to process the request because its header fields are too large',
  },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    code: 451,
    message: 'Unavailable For Legal Reasons',
    description:
      'The user-agent requested a resource that cannot legally be provided',
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
    description:
      'The server encountered an unexpected condition that prevented it from fulfilling the request',
  },
  NOT_IMPLEMENTED: {
    code: 501,
    message: 'Not Implemented',
    description:
      'The server does not support the functionality required to fulfill the request',
  },
  BAD_GATEWAY: {
    code: 502,
    message: 'Bad Gateway',
    description:
      'The server received an invalid response from the upstream server',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'Service Unavailable',
    description: 'The server is currently unavailable (overloaded or down)',
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    message: 'Gateway Timeout',
    description:
      'The server did not receive a timely response from the upstream server',
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    code: 505,
    message: 'HTTP Version Not Supported',
    description:
      'The server does not support the HTTP protocol version used in the request',
  },
  VARIANT_ALSO_NEGOTIATES: {
    code: 506,
    message: 'Variant Also Negotiates',
    description:
      'Transparent content negotiation for the request results in a circular reference',
  },
  INSUFFICIENT_STORAGE: {
    code: 507,
    message: 'Insufficient Storage',
    description:
      'The server is unable to store the representation needed to complete the request',
  },
  LOOP_DETECTED: {
    code: 508,
    message: 'Loop Detected',
    description:
      'The server detected an infinite loop while processing the request',
  },
  NOT_EXTENDED: {
    code: 510,
    message: 'Not Extended',
    description:
      'Further extensions to the request are required for the server to fulfill it',
  },
  NETWORK_AUTHENTICATION_REQUIRED: {
    code: 511,
    message: 'Network Authentication Required',
    description: 'The client needs to authenticate to gain network access',
  },
};

// Redis keys for caching HTTP status codes
export const HTTP_STATUS_CACHE_KEYS = {
  ALL_STATUS_CODES: 'http_status:all',
  STATUS_CODE_BY_CODE: (code: number) => `http_status:code:${code}`,
  STATUS_CODE_BY_NAME: (name: string) => `http_status:name:${name}`,
} as const;

// TTL for HTTP status cache (24 hours in seconds)
export const HTTP_STATUS_CACHE_TTL = 24 * 60 * 60;
