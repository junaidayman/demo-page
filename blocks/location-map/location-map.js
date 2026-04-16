export default function decorate(block) {
  const rows = [...block.children];

  // --- Extract values ---
  const mapUrl = rows[0]?.textContent.trim();
  const height = rows[1]?.textContent.trim() || '450px';

  if (!mapUrl) return;

  block.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src = mapUrl;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;

  const wrapper = document.createElement('div');
  wrapper.className = 'location-map-wrapper-inner';
  wrapper.style.height = height;
  wrapper.appendChild(iframe);

  block.appendChild(wrapper);
}