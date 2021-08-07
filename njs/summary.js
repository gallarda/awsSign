
function parse_args(v) { var args ={}; var list = v.split('&').filter(v=>v.length); for (var i in list) {var kv = list[i].split('=');args[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]) }; return args}

function summary(r) {
    var a, s, h;

    s = "JS summary\n\n";

    s += "Method: " + r.method + "\n";
    s += "HTTP version: " + r.httpVersion + "\n";
    s += "Host: " + r.headersIn.host + "\n";
    s += "Remote Address: " + r.remoteAddress + "\n";
    s += "URI: " + r.uri + "\n";
    s += "Args: " + r.variables.args + "\n";
    s += "Bucket: " + r.variables.bucket + "\n";
    s += "Variables: " + JSON.stringify(njs.dump(r)) + "\n";

    s += "Headers:\n";
    for (h in r.headersIn) {
        s += "  header '" + h + "' is '" + r.headersIn[h] + "'\n";
    }

    var x = 0, q = [];
    s += "Args:\n";
    for (a in r.args) {
        s += "  arg '" + a + "' is '" + r.args[a] + "'\n";
	q[x] = a + "=" + encodeURI(r.args[a]);
	x++;
    }
q.sort();
    s += "Query String: ";
for (var index in q) {
  s += q[index];
  if (index < q.length -1) {
	s += '&';
  }
}
 s += "\n";
r.log(njs.dump(r));
r.log(JSON.stringify(parse_args(r.variables.args)));

r.return(200, s);

}

export default {summary}