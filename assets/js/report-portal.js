/* Patient report portal entry (same origin, no API calls from this page).
   The report itself is shown by the LIS page /verify/<token>, which asks for the Bill number and the 4-digit access PIN,
   applies server-side throttling and renders the issued report. This script only extracts the QR verification code. */
(function () {
  'use strict';
  var form = document.getElementById('reportPortalForm');
  var input = document.getElementById('verifyCode');
  var err = document.getElementById('reportPortalError');
  if (!form || !input) return;

  // Accepts the full link printed under the QR code, a "/verify/<code>" path, or the bare code. Only the code is used,
  // so the destination is always this site's own /verify/ page (no redirect to a supplied host).
  function extractCode(raw) {
    var v = String(raw || '').trim();
    var m = v.match(/\/verify\/([A-Za-z0-9_-]{16,128})(?:[/?#]|$)/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{16,128}$/.test(v) ? v : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = extractCode(input.value);
    if (!code) {
      err.textContent = 'Please enter the verification code or link printed under the QR code on your report.';
      err.hidden = false;
      input.focus();
      return;
    }
    err.hidden = true;
    window.location.assign('/verify/' + code);
  });
})();
