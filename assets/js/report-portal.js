/* Patient report portal entry (same origin; this page makes no API calls and stores nothing in the browser).
   Two entry methods lead to the same secure LIS flow, which always asks for the Bill Number and the 4-digit Access PIN:
   - the receipt QR code (opens /verify/access#c=<code> directly), or
   - the printed Access Code typed here (or a report verification link/code).
   Codes travel in the URL fragment, which browsers do not send to servers or logs. */
(function () {
  'use strict';
  var form = document.getElementById('reportPortalForm');
  var input = document.getElementById('verifyCode');
  var err = document.getElementById('reportPortalError');
  if (!form || !input) return;

  // Printed Access Code: 26 characters of 0-9A-Z without I, L, O, U (130 bits). Dashes/spaces/case are ignored; O->0 and I/L->1.
  function accessCode(raw) {
    var v = String(raw || '').toUpperCase().replace(/[\s-]+/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(v) ? v : null;
  }
  // Report verification token (from the QR on an issued report): only the token is used, so the destination is always this site.
  function verifyToken(raw) {
    var v = String(raw || '').trim();
    var m = v.match(/\/verify\/([A-Za-z0-9_-]{32,128})(?:[/?#]|$)/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{32,128}$/.test(v) ? v : null;
  }
  function go(raw) {
    var frag = String(raw || '').match(/[#&]c=([A-Za-z0-9-]{20,40})/);
    var code = accessCode(frag ? frag[1] : raw);
    if (code) return '/verify/access#c=' + code;
    var t = verifyToken(raw);
    return t ? '/verify/' + t : null;
  }

  var fromHash = go(window.location.hash);
  if (fromHash && /^#c=/.test(window.location.hash)) window.location.replace(fromHash);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var dest = go(input.value);
    if (!dest) {
      err.textContent = 'Please enter the Access Code printed on your receipt (letters and numbers, e.g. 7K3M-9QWX-...).';
      err.hidden = false;
      input.focus();
      return;
    }
    err.hidden = true;
    window.location.assign(dest);
  });
})();
