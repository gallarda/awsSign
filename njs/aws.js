// Date Handling
//
function pad(n) {return n<10 ? '0'+n : n}
var d = new Date();
var datestamp = d.getUTCFullYear() + pad(d.getUTCMonth()+1).toString() + pad(d.getUTCDate())
var amzdate = datestamp + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds())+'Z'

// Amazon formatted date/time is created above as a global variable so it is the same for all operations
//
function amzDate(r) {
	return amzdate;
}

var crypto = require("crypto");

// Generate Hash of Request Payload
//
function payHash(r) {
	if (r.requestBody) {
		return crypto.createHash('sha256').update(r.requestBody).digest('hex');
	} else {
		return crypto.createHash('sha256').update('').digest('hex');
	}
}

// Generate Authorization Header
//
function awsSign(r) {

// CHANGE THESE VARIABLES to match your AWS Environment #######
//
var service = r.variables.service
var host = r.variables.apiHost
var region = r.variables.region
var access_key = r.variables.access_key
var key = r.variables.key

var request_parameters = ''
if (r.variables.args) {
	request_parameters = r.variables.args
	if (!request_parameters.includes('=')) {
		request_parameters += '='
	}
}

// Hash Generator
//
function sign(msg, key) {
    return crypto.createHmac('sha256', key).update(msg.toUTF8()).digest();
}

// Derive Private Signing Key
//
function getSignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = sign(dateStamp, "AWS4" + key);
    var kRegion = sign(regionName, kDate);
    var kService = sign(serviceName, kRegion);
    var kSigning = sign("aws4_request", kService);
   return kSigning;
}

var signing_key = getSignatureKey(key, datestamp, region, service);

// Assemble Canonical Request
//
var method = r.method
var canonical_uri = r.uri
var canonical_querystring = request_parameters
var canonical_headers = 'host:' + host + '\n' + 'x-amz-date:' + amzdate + '\n'
var signed_headers = 'host;x-amz-date'
var payload_hash = payHash(r);
var canonical_request = method + '\n' + canonical_uri + '\n' + canonical_querystring + '\n' + canonical_headers + '\n' + signed_headers + '\n' + payload_hash

// Assemble Header String
//
var algorithm = 'AWS4-HMAC-SHA256'
var credential_scope = datestamp + '/' + region + '/' + service + '/' + 'aws4_request'
var string_to_sign = algorithm + '\n' +  amzdate + '\n' +  credential_scope + '\n' + crypto.createHash('sha256').update(canonical_request).digest('hex')

var signature = sign(string_to_sign, signing_key)

var authorization_header = algorithm + ' ' + 'Credential=' + access_key + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature.toBytes().toString('hex')

	return(authorization_header);
}

export default {awsSign, amzDate, payHash}