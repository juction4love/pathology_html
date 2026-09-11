/**
 * Bimal Pathology & Diagnostic Center — Safe Report Portal Logic
 * Connects securely to laboratory reporting endpoint without fabricated clinical fallbacks.
 */

(function() {
  'use strict';

  const form = document.getElementById('reportForm');
  const resultDiv = document.getElementById('reportResult');
  const contentDiv = document.getElementById('reportContent');
  const labIdInput = document.getElementById('labId');
  const mobileInput = document.getElementById('mobile');
  const dobInput = document.getElementById('dob');
  const submitBtn = document.getElementById('reportBtn');

  if (!form || !resultDiv || !contentDiv || !labIdInput || !mobileInput) return;

  const API_BASE = 'https://api.bimalpathology.com.np';
  const REPORT_ENDPOINT = API_BASE + '/api/report/search';

  function escapeHtml(str) {
    if (!str) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function validateInputs(labId, mobile) {
    if (!labId || labId.trim().length < 3) {
      if (window.showToast) window.showToast('कृपया सही Lab ID वा बारकोड प्रविष्ट गर्नुहोस् ।', 'error');
      labIdInput.focus();
      return false;
    }
    const cleanMobile = mobile.replace(/\s+/g, '');
    if (!cleanMobile || cleanMobile.length < 8) {
      if (window.showToast) window.showToast('कृपया मान्य मोबाइल नम्बर प्रविष्ट गर्नुहोस् ।', 'error');
      mobileInput.focus();
      return false;
    }
    return true;
  }

  function buildReportHTML(data) {
    const p = data.patient || {};
    const tests = data.tests || [];

    let rowsHtml = '';
    tests.forEach(function(t) {
      let statusClass = 'status-normal';
      let statusLabel = t.status || 'Normal';
      const sl = String(statusLabel).toLowerCase();
      if (sl === 'elevated' || sl === 'high') statusClass = 'status-elevated';
      else if (sl === 'low' || sl === 'decreased') statusClass = 'status-low';

      rowsHtml += `
        <tr>
          <td style="font-weight:600;">${escapeHtml(t.name)}</td>
          <td style="text-align:center; font-weight:700;">${escapeHtml(t.value)}</td>
          <td style="text-align:center; color:var(--text-muted);">${escapeHtml(t.unit || '—')}</td>
          <td style="text-align:center; color:var(--text-muted);">${escapeHtml(t.ref || '—')}</td>
          <td style="text-align:center;"><span class="status-badge ${statusClass}">${escapeHtml(statusLabel)}</span></td>
        </tr>
      `;
    });

    const genderMap = { 'M': 'पुरुष (Male)', 'F': 'महिला (Female)', 'O': 'अन्य (Other)' };
    const genderDisplay = genderMap[p.gender] || p.gender || '—';

    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border-light);">
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">
              <i class="fas fa-file-medical text-primary" style="margin-right:0.5rem;"></i>डिजिटल प्रयोगशाला रिपोर्ट (Official Laboratory Report)
            </h3>
            <p style="font-size:0.8125rem; color:var(--text-muted);">Bimal Pathology & Diagnostic Center — Bharatpur, Chitwan</p>
          </div>
          <div class="no-print" style="display:flex; gap:0.5rem;">
            <button onclick="window.print()" class="btn btn-sm btn-primary" style="font-size:0.8125rem;">
              <i class="fas fa-print"></i> प्रिन्ट / PDF Save
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.875rem; background:var(--bg-page); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-light); font-size:0.875rem; margin-bottom:1.25rem;">
          <div><strong style="color:var(--text-muted); font-size:0.75rem; display:block;">PATIENT NAME / नाम:</strong> <span style="font-weight:700;">${escapeHtml(p.name || '—')}</span></div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; display:block;">LAB ID / बारकोड:</strong> <span style="font-weight:700; color:var(--primary);">${escapeHtml(p.labId || '—')}</span></div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; display:block;">AGE & GENDER / उमेर र लिङ्ग:</strong> ${escapeHtml(p.age || '—')} / ${genderDisplay}</div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; display:block;">REPORT DATE / मिति:</strong> ${escapeHtml(p.date || '—')}</div>
        </div>

        <div class="report-table-wrapper">
          <table class="report-table">
            <thead>
              <tr>
                <th>परीक्षण नाम (Test Name)</th>
                <th style="text-align:center;">नतिजा (Result)</th>
                <th style="text-align:center;">एकाइ (Unit)</th>
                <th style="text-align:center;">सामान्य दायरा (Reference Range)</th>
                <th style="text-align:center;">स्थिति (Status)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">कुनै परीक्षण रेकर्ड फेला परेन ।</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:var(--radius-md); padding:0.875rem 1rem; font-size:0.8125rem; color:#92400e; margin-top:1rem;">
          <i class="fas fa-info-circle" style="margin-right:0.35rem;"></i>
          <strong>सूचना:</strong> यो डिजिटल रिपोर्ट आधिकारिक प्रयोगशाला नतिजा हो। कृपया विस्तृत परामर्श तथा औषधोपचारका लागि आफ्नो चिकित्सकसँग सम्पर्क गर्नुहोस्।
        </div>
      </div>
    `;
  }

  async function fetchReport(labId, mobile, dob) {
    const payload = {
      labId: labId.trim(),
      mobile: mobile.trim(),
      dob: dob || undefined
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch(REPORT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errMsg = 'रिपोर्ट फेला परेन । कृपया Lab ID र मोबाइल नम्बर जाँच गर्नुहोस् ।';
        try {
          const errData = await response.json();
          if (errData && errData.message) errMsg = errData.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const labId = labIdInput.value.trim();
    const mobile = mobileInput.value.trim();
    const dob = dobInput ? dobInput.value : '';

    if (!validateInputs(labId, mobile)) return;

    resultDiv.classList.remove('hidden');
    contentDiv.innerHTML = `
      <div style="text-align:center; padding:3rem 1.5rem; color:var(--primary);">
        <i class="fas fa-circle-notch fa-spin" style="font-size:2.5rem; margin-bottom:1rem; display:block;"></i>
        <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main);">रिपोर्ट खोज्दैछ...</h4>
        <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.35rem;">सुरक्षित सर्भरबाट नतिजा प्रमाणीकरण गरिँदैछ ।</p>
      </div>
    `;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> खोजी हुँदैछ...';
    }

    try {
      const response = await fetchReport(labId, mobile, dob);
      if (response && response.success && response.data) {
        contentDiv.innerHTML = buildReportHTML(response.data);
        if (window.showToast) window.showToast('रिपोर्ट सफलतापूर्वक लोड भयो ।', 'success');
      } else {
        const msg = (response && response.message) || 'प्रविष्ट गरिएको Lab ID वा मोबाइल नम्बर अनुसार रिपोर्ट फेला परेन ।';
        showReportNotFound(msg);
      }
    } catch (err) {
      showBackendUnavailable(err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-search"></i> रिपोर्ट खोज्नुहोस् (Search Report)';
      }
    }
  });

  function showReportNotFound(message) {
    contentDiv.innerHTML = `
      <div class="report-alert report-alert-error">
        <i class="fas fa-file-excel" style="font-size:2.5rem; color:var(--danger); margin-bottom:1rem; display:block;"></i>
        <h4 style="font-size:1.15rem; font-weight:800; color:#991b1b; margin-bottom:0.5rem;">रिपोर्ट फेला परेन (Report Not Found)</h4>
        <p style="font-size:0.9375rem; color:#7f1d1d; line-height:1.6; max-width:560px; margin:0 auto 1.25rem auto;">
          ${escapeHtml(message)}
        </p>
        <div style="background:#ffffff; border-radius:var(--radius-md); padding:1rem; max-width:500px; margin:0 auto; text-align:left; font-size:0.8125rem; color:var(--text-secondary);">
          <strong>कृपया जाँच गर्नुहोस्:</strong>
          <ul style="margin-top:0.5rem; padding-left:1.25rem; line-height:1.6;">
            <li>बिल / रसिदमा उल्लेखित सही <strong>Lab ID</strong> वा बारकोड नम्बर प्रविष्ट गर्नुभएको छ ।</li>
            <li>नमूना दिँदा दर्ता गराउनुभएको <strong>मोबाइल नम्बर</strong> सही छ ।</li>
            <li>यदि परीक्षण भर्खरै गराउनुभएको हो भने, नतिजा आउन केही समय लाग्न सक्छ ।</li>
          </ul>
        </div>
        <div style="margin-top:1.5rem;">
          <a href="tel:+97756593288" class="btn btn-sm btn-primary">
            <i class="fas fa-phone-alt"></i> सहयोगका लागि सम्पर्क: ०५६-५९३२८८
          </a>
        </div>
      </div>
    `;
    if (window.showToast) window.showToast('रिपोर्ट फेला परेन ।', 'error');
  }

  function showBackendUnavailable(errorMsg) {
    contentDiv.innerHTML = `
      <div class="report-alert report-alert-error">
        <i class="fas fa-wifi" style="font-size:2.5rem; color:var(--danger); margin-bottom:1rem; display:block;"></i>
        <h4 style="font-size:1.15rem; font-weight:800; color:#991b1b; margin-bottom:0.5rem;">अनलाइन रिपोर्टिङ सर्भर उपलब्ध छैन</h4>
        <p style="font-size:0.9375rem; color:#7f1d1d; line-height:1.6; max-width:580px; margin:0 auto 1.25rem auto;">
          अहिले अनलाइन रिपोर्टिङ सर्भरसँग प्रत्यक्ष सम्पर्क हुन सकेन । प्राविधिक समस्या वा इन्टरनेट अवरोधका कारण यस्तो हुन सक्छ।
        </p>
        <div style="background:#ffffff; border-radius:var(--radius-md); padding:1.25rem; max-width:520px; margin:0 auto; text-align:left; font-size:0.875rem; color:var(--text-secondary); border:1px solid var(--border-light);">
          <strong>रिपोर्ट प्राप्त गर्ने वैकल्पिक उपाय:</strong>
          <ul style="margin-top:0.5rem; padding-left:1.25rem; line-height:1.6;">
            <li>प्रयोगशालाको आधिकारिक नम्बरमा फोन गरी रिपोर्ट स्थिति बुझ्नुहोस्: <strong>०५६-५९३२८८</strong></li>
            <li>वा प्रयोगशालाको रिसेप्शन काउन्टरबाट सिधै आधिकारिक प्रिन्ट रिपोर्ट लिनुहोस् ।</li>
          </ul>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
          <a href="tel:+97756593288" class="btn btn-sm btn-primary">
            <i class="fas fa-phone-alt"></i> फोन गर्नुहोस्: ०५६-५९३२८८
          </a>
          <button onclick="document.getElementById('reportForm').dispatchEvent(new Event('submit'))" class="btn btn-sm btn-secondary">
            <i class="fas fa-redo"></i> पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    `;
    if (window.showToast) window.showToast('अनलाइन सर्भर सम्पर्क त्रुटि ।', 'error');
  }

  // Auto-fill from URL params
  (function() {
    const params = new URLSearchParams(window.location.search);
    const labIdParam = params.get('labId');
    const mobileParam = params.get('mobile');
    if (labIdParam) labIdInput.value = labIdParam;
    if (mobileParam) mobileInput.value = mobileParam;
  })();

})();
