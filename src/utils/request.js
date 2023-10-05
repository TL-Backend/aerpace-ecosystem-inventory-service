const rp = require('request-promise');
const { methods } = require('./constant');

const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

exports.sendRequest = async (params) => {
  const { method, headers, uri, body, query, json = true, form } = params;
  const options = {
    method,
    uri,
    headers,
    body,
    qs: query,
    json,
    form,
  };
  return rp(options);
};

exports.requestAsync = async (params) => {
  const { method, expiryTimeInSeconds, prefix = '' } = params;

  if (!ALLOWED_METHODS.includes(method.toUpperCase())) {
    throw new Error({
      message: `Invalid http method, allowed methods are ${ALLOWED_METHODS}`,
    });
  }
  const response = await this.sendRequest(params);
  return response;
};

exports.postAsync = async (params) => {
  return this.requestAsync({ method: methods.POST, ...params });
};

exports.deleteAsync = async ({ uri, headers, body, qs: query, json, form }) => {
  return this.requestAsync({
    method: methods.DELETE,
    uri,
    headers,
    body,
    qs: query,
    json,
    form,
  });
};

exports.patchAsync = async ({ uri, headers, body, qs: query, json, form }) => {
  return this.requestAsync({
    method: methods.PATCH,
    uri,
    headers,
    body,
    qs: query,
    json,
    form,
  });
};
