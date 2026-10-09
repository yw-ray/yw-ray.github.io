/* Separate channel-count extension; frozen results and their B2 are unchanged. */
let channelStudyPromise;
function channelStudyApplies() {
  return ['designs', 'patterns'].includes(page) &&
    $('chip').value === '16' && $('core').value === '1' &&
    $('design').value === 'single' && $('orientation').value === 'reflection' &&
    ['ALL', 'CNN'].includes(activeGroup) && data.some(p => p.workload === 'darknet19');
}
async function renderChannelStudy() {
  const host = $('channel-count-study');
  host.hidden = !channelStudyApplies();
  if (host.hidden) return;
  if (host.dataset.loaded) return;
  host.textContent = 'Loading Darknet-19 channel-count extension…';
  try {
    channelStudyPromise ||= fetch('channel-count-darknet19-core1/data.json').then(r => {
      if (!r.ok) throw Error('Study data unavailable');
      return r.json();
    });
    const study = await channelStudyPromise;
    const base = 'channel-count-darknet19-core1/';
    host.innerHTML = `<span class="badge">Additional experiment · 2026-10-08 · different channel-count constraint</span>
      <h2>Darknet-19 · 16 chiplets × 1 core · variable channel counts</h2>
      <p>The original results below keep <b>8 channels per port</b>. This extension keeps each installed channel at <b>8 B/cycle</b> and sizes the number of TX/RX channels in each shared tile template. The original 0% result is not replaced.</p>
      <div class="table-scroll"><table><thead><tr><th>Design</th><th>Installed TX + RX capacity (B/cycle)</th><th>Cycles</th></tr></thead><tbody>${study.rows.map(r => `<tr><td>${r.design}</td><td>${r.capacity_Bpc.toLocaleString()}</td><td>${r.cycles.toLocaleString()}</td></tr>`).join('')}</tbody></table></div>
      <p><b>B2 also shrinks:</b> uniform 8 → 7 channels reduces B2 from <b>6,144 to 5,376 B/cycle</b>. Uniform 6 channels takes 349,290 cycles and fails the 349,129-cycle deadline. The variable-channel design is <b>21.43% smaller than the retuned B2</b>; 31.25% is its reduction relative to the old 8-channel baseline.</p>
      <p><b>Where the gain comes from:</b> the old mapping already achieves 4,224 B/cycle. Mapping search keeps the same capacity and lowers cycles from 348,813 to 348,781. The capacity gain comes from channel-count sizing, not a new mapping.</p>
      <p>Same-type tiles share one port configuration before rotation/reflection. The connected ports use 4, 5 or 7 channels; unused installed endpoints are included in capacity. All 48 directed connections remain. Area and energy reductions were not measured.</p>
      <details><summary>Show the three configurations and their shared tile templates</summary><a href="${base}index.html" target="_blank" rel="noopener"><img src="${base}tile-configurations.svg" alt="Original 8-channel, retuned uniform 7-channel, and variable 4/5/7-channel corner, edge and interior tiles" loading="lazy"></a></details>
      <p class="study-links"><a href="${base}index.html" target="_blank" rel="noopener">Open tile viewer</a><a href="${base}tile-configurations.pdf" target="_blank" rel="noopener">Tile PDF</a><a href="${base}summary.csv" download>Result CSV</a><a href="${base}uniform-sweep.csv" download>B2 channel sweep</a><a href="${base}data.json">Study data / validation</a></p>
      <p class="meta">${study.native_validation.checks} full native checks; ${study.native_validation.baseline_profiles_exact.toLocaleString()} original profiles reproduced exactly. Deadline ≤${study.deadline.toLocaleString()} cycles. Existing tile assignment/orientations and routing retained; no global mapping or routing optimum claim.</p>`;
    host.dataset.loaded = 'true';
    host.hidden = !channelStudyApplies();
  } catch (error) {
    channelStudyPromise = undefined;
    host.textContent = `Unable to load the additional study: ${error.message}`;
  }
}
