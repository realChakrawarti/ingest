// Reference: https://github.com/jeremyben/reflet/blob/master/http/src/status.ts

const InformationStatus = {
  /**
   * This interim response indicates that everything so far is OK
   * and that the client should continue with the request or ignore it if it is already finished.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
   */
  Continue: <const>100,

  /**
   * This status code is primarily intended to be used with the `Link` header to allow
   * the user agent to start preloading resources while the server is still preparing a response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)
   */
  EarlyHints: <const>103,

  /**
   * This code indicates that the server has received and is processing the request,
   * but no response is available yet.
   */
  Processing: <const>102,

  /**
   * This code is sent in response to an `Upgrade` request header by the client,
   * and indicates the protocol the server is switching to.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101)
   */
  SwitchingProtocols: <const>101,
};

type InformationStatus =
  (typeof InformationStatus)[keyof typeof InformationStatus];

// ────────────────────────────────────────────────────────────────────────────

const SuccessStatus = {
  /**
   * The request has been received but not yet acted upon. It is non-committal,
   * meaning that there is no way in HTTP to later send an asynchronous response
   * indicating the outcome of processing the request.
   *
   * It is intended for cases where another process or server handles the request, or for batch processing.
   */
  Accepted: <const>202,

  /**
   * Used inside a DAV: propstat response element to avoid enumerating
   * the internal members of multiple bindings to the same collection repeatedly.
   */
  AlreadyReported: <const>208,

  /**
   * The request has succeeded and a new resource has been created as a result of it.
   * This is typically the response sent after a `POST` request, or after some `PUT` requests.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201)
   */
  Created: <const>201,

  /**
   * The server has fulfilled a `GET` request for the resource, and the response is a representation
   * of the result of one or more instance-manipulations applied to the current instance.
   */
  ImUsed: <const>226,

  /**
   * Conveys information about multiple resources in situations
   * where multiple status codes might be appropriate.
   */
  MultiStatus: <const>207,

  /**
   * There is no content to send for this request, but the headers may be useful.
   * The user-agent may update its cached headers for this resource with the new ones.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204)
   */
  NoContent: <const>204,

  /**
   * This response code means returned meta-information set is not exact set as available
   * from the origin server, but collected from a local or a third party copy.
   *
   * Except this condition, `200 OK` response should be preferred instead of this response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203)
   */
  NonAuthoritativeInformation: <const>203,
  /**
   * The request has succeeded.
   * The meaning of a success varies depending on the HTTP method:
   *
   * - `GET`: The resource has been fetched and is transmitted in the message body.
   * - `HEAD`: The entity headers are in the message body.
   * - `PUT` or `POST`: The resource describing the result of the action is transmitted in the message body.
   * - `TRACE`: The message body contains the request message as received by the server
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
   */
  Ok: <const>200,

  /**
   * This response code is used because of range header sent by the client to separate download into multiple streams.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)
   */
  PartialContent: <const>206,

  /**
   * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205)
   */
  ResetContent: <const>205,
};

type SuccessStatus = (typeof SuccessStatus)[keyof typeof SuccessStatus];

// ────────────────────────────────────────────────────────────────────────────

const RedirectionStatus = {
  /**
   * This response code means that the URI of requested resource has been changed _temporarily_.
   * New changes in the URI might be made in the future.
   *
   * Therefore, this same URI should be used by the client in future requests.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302)
   */
  Found: <const>302,

  /**
   * This response code means that the URI of the requested resource has been changed permanently.
   * Probably, the new URI would be given in the response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
   */
  MovedPermanently: <const>301,
  /**
   * The request has more than one possible response. The user-agent or user should choose one of them.
   * There is no standardized way of choosing one of the responses.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300)
   */
  MultipleChoices: <const>300,

  /**
   * This is used for caching purposes. It tells the client that the response has not been modified,
   * so the client can continue to use the same cached version of the response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)
   */
  NotModified: <const>304,

  /**
   * This means that the resource is now permanently located at another URI,
   * specified by the `Location` HTTP Response header.
   *
   * This has the same semantics as the `301 Moved Permanently` HTTP response code,
   * with the exception that the user agent must not change the HTTP method used:
   * If a `POST` was used in the first request, a `POST` must be used in the second request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308)
   */
  PermanentRedirect: <const>308,

  /**
   * The server sent this response to direct the client to get the requested resource at another URI with a `GET` request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303)
   */
  SeeOther: <const>303,

  /**
   * The server sends this response to direct the client to get the requested resource at another URI
   * with same method that was used in the prior request.
   *
   * This has the same semantics as the `302 Found` HTTP response code,
   * with the exception that the user agent must not change the HTTP method used:
   * If a `POST` was used in the first request, a `POST` must be used in the second request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307)
   */
  TemporaryRedirect: <const>307,
};

type RedirectionStatus =
  (typeof RedirectionStatus)[keyof typeof RedirectionStatus];

// ────────────────────────────────────────────────────────────────────────────

const ClientErrorStatus = {
  /**
   * This response means that server could not understand the request due to invalid syntax.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
   */
  BadRequest: <const>400,

  /**
   * This response is sent when a request conflicts with the current state of the server.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409)
   */
  Conflict: <const>409,

  /**
   * This response code means the expectation indicated by the `Expect` request header field can't be met by the server.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417)
   */
  ExpectationFailed: <const>417,

  /**
   * The request failed due to failure of a previous request.
   */
  FailedDependency: <const>424,

  /**
   * The client does not have access rights to the content, i.e. they are _unauthorized_,
   * so server is rejecting to give proper response.
   *
   * Unlike `401`, the client's identity is known to the server.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
   */
  Forbidden: <const>403,

  /**
   * This response would be sent when the requested content has been permanently deleted from server, with no forwarding address.
   * Clients are expected to remove their caches and links to the resource.
   *
   * The HTTP specification intends this status code to be used for "limited-time, promotional services".
   * APIs should not feel compelled to indicate resources that have been deleted with this status code.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410)
   */
  Gone: <const>410,

  /**
   * The server refuses the attempt to brew coffee with a teapot.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418)
   */
  ImATeapot: <const>418,

  /**
   * Server rejected the request because the `Content-Length` header field is not defined and the server requires it.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411)
   */
  LengthRequired: <const>411,

  /**
   * The resource that is being accessed is locked.
   */
  Locked: <const>423,

  /**
   * The request method is known by the server but has been disabled and cannot be used.
   * For example, an API may forbid `DELETE`-ing a resource.
   *
   * The two mandatory methods, `GET` and `HEAD`, must never be disabled and should not return this error code.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)
   */
  MethodNotAllowed: <const>405,

  /**
   * The request was directed at a server that is not able to produce a response.
   * This can be sent by a server that is not configured to produce responses
   * for the combination of scheme and authority that are included in the request URI.
   */
  MisdirectedRequest: <const>421,

  /**
   * This response is sent when the web server, after performing server-driven content negotiation,
   * doesn't find any content following the criteria given by the user agent.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406)
   */
  NotAcceptable: <const>406,

  /**
   * The server can not find requested resource. In the browser, this means the URL is not recognized.
   * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
   *
   * Servers may also send this response instead of `403` to hide the existence of a resource from an unauthorized client.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)
   */
  NotFound: <const>404,

  /**
   * Request entity is larger than limits defined by server.
   * The server might close the connection or return an `Retry-After` header field.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413)
   */
  PayloadTooLarge: <const>413,

  /**
   * This response code is reserved for future use.
   * Initial aim for creating this code was using it for digital payment systems,
   * however this status code is used very rarely and no standard convention exists.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
   */
  PaymentRequired: <const>402,

  /**
   * The client has indicated preconditions in its headers which the server does not meet.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412)
   */
  PreconditionFailed: <const>412,

  /**
   * The origin server requires the request to be conditional.
   * Intended to prevent the 'lost update' problem, where a client GETs a resource's state,
   * modifies it, and PUTs it back to the server, when meanwhile a third party has modified
   * the state on the server, leading to a conflict.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428)
   */
  PreconditionRequired: <const>428,

  /**
   * This is similar to `401` but authentication is needed to be done by a proxy.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407)
   */
  ProxyAuthenticationRequired: <const>407,

  /**
   * The range specified by the `Range` header field in the request can't be fulfilled.
   * It's possible that the range is outside the size of the target URI's data.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416)
   */
  RequestedRangeNotSatisfiable: <const>416,

  /**
   * The server is unwilling to process the request because its header fields are too large.
   * The request MAY be resubmitted after reducing the size of the request header fields.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431)
   */
  RequestHeaderFieldsTooLarge: <const>431,

  /**
   * This response is sent on an idle connection by some servers, even without any previous request by the client.
   * It means that the server would like to shut down this unused connection.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408)
   */
  RequestTimeout: <const>408,

  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425)
   */
  TooEarly: <const>425,

  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
   */
  TooManyRequests: <const>429,

  /**
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
   * That is, the client must authenticate itself to get the requested response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
   */
  Unauthorized: <const>401,

  /**
   * The user requests an illegal resource, such as a web page censored by a government.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451)
   */
  UnavailableForLegalReasons: <const>451,

  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422)
   */
  UnprocessableEntity: <const>422,

  /**
   * The media format of the requested data is not supported by the server, so the server is rejecting the request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)
   */
  UnsupportedMediaType: <const>415,

  /**
   * The server refuses to perform the request using the current protocol
   * but might be willing to do so after the client upgrades to a different protocol.
   * The server sends an `Upgrade` header in a 426 response to indicate the required protocol(s).
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426)
   */
  UpgradeRequired: <const>426,

  /**
   * The URI requested by the client is longer than the server is willing to interpret.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414)
   */
  UriTooLong: <const>414,
};

type ClientErrorStatus =
  (typeof ClientErrorStatus)[keyof typeof ClientErrorStatus];

// ────────────────────────────────────────────────────────────────────────────

const ServerErrorStatus = {
  /**
   * This error response means that the server, while working as a gateway
   * to get a response needed to handle the request, got an invalid response.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502)
   */
  BadGateway: <const>502,

  /**
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504)
   */
  GatewayTimeout: <const>504,

  /**
   * The HTTP version used in the request is not supported by the server.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505)
   */
  HttpVersionNotSupported: <const>505,

  /**
   * The method could not be performed on the resource because the server is unable
   * to store the representation needed to successfully complete the request.
   */
  InsufficientStorage: <const>507,
  /**
   * The server has encountered a situation it doesn't know how to handle.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500)
   */
  InternalServerError: <const>500,

  /**
   * The server detected an infinite loop while processing the request.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508)
   */
  LoopDetected: <const>508,

  /**
   * Indicates that the client needs to authenticate to gain network access.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511)
   */
  NetworkAuthenticationRequired: <const>511,

  /**
   * Further extensions to the request are required for the server to fulfil it.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510)
   */
  NotExtended: <const>510,

  /**
   * The request method is not supported by the server and cannot be handled.
   * The only methods that servers are required to support (and therefore that must not return this code) are `GET` and `HEAD`.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501)
   */
  NotImplemented: <const>501,

  /**
   * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
   *
   * Note that together with this response, a user-friendly page explaining the problem should be sent.
   * This responses should be used for temporary conditions and the `Retry-After` HTTP header should, if possible,
   * contain the estimated time before the recovery of the service.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503)
   */
  ServiceUnavailable: <const>503,

  /**
   * The server has an internal configuration error: the chosen variant resource
   * is configured to engage in transparent content negotiation itself,
   * and is therefore not a proper end point in the negotiation process.
   */
  VariantAlsoNegotiates: <const>506,
};

type ServerErrorStatus =
  (typeof ServerErrorStatus)[keyof typeof ServerErrorStatus];

// ────────────────────────────────────────────────────────────────────────────

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export const Status = {
  ...InformationStatus,
  ...SuccessStatus,
  ...RedirectionStatus,
  ...ClientErrorStatus,
  ...ServerErrorStatus,

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Client_error_responses)
   */
  ClientError: ClientErrorStatus,

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Client_error_responses)
   */
  Error: { ...ClientErrorStatus, ...ServerErrorStatus },

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Information_responses)
   */
  Information: InformationStatus,

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Redirection_messages)
   */
  Redirection: RedirectionStatus,

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Server_error_responses)
   */
  ServerError: ServerErrorStatus,

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Successful_responses)
   */
  Success: SuccessStatus,
};

export type Status =
  | InformationStatus
  | SuccessStatus
  | RedirectionStatus
  | ClientErrorStatus
  | ServerErrorStatus;

export namespace Status {
  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Information_responses)
   */
  export type Information = InformationStatus;

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Successful_responses)
   */
  export type Success = SuccessStatus;

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Redirection_messages)
   */
  export type Redirection = RedirectionStatus;

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Client_error_responses)
   */
  export type ClientError = ClientErrorStatus;

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Server_error_responses)
   */
  export type ServerError = ServerErrorStatus;

  /**
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Client_error_responses)
   */
  export type Error = ClientErrorStatus | ServerErrorStatus;
}
