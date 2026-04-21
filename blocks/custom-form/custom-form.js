export default async function decorate(block) {
  const outer = block.querySelector(':scope > div');
  if (!outer) return;

  outer.classList.add('custom-form-layout');

  const columns = [...outer.children];
  if (columns.length < 2) return;

  const infoCol = columns[0];
  const formCol = columns[1];

  infoCol.classList.add('custom-form-info');
  formCol.classList.add('custom-form-form');

  /* ===============================
   Left column grouping logic
   =============================== */

infoCol.classList.add('custom-form-info');

// ✅ If author already grouped content, respect it and stop
if (infoCol.querySelector('.custom-form-info-list')) {
  return;
}

// ✅ Otherwise, auto‑group legacy flat authoring
const nodes = [...infoCol.children].filter(
  (el) => el.nodeType === Node.ELEMENT_NODE
);

infoCol.innerHTML = '';

let buffer = [];

nodes.forEach((el) => {
  buffer.push(el);

  // icon + heading + value = 3 items
  if (buffer.length === 3) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-form-info-list';
    buffer.forEach((n) => wrapper.append(n));
    infoCol.append(wrapper);
    buffer = [];
  }
});

// Safely wrap leftovers
if (buffer.length) {
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-form-info-list';
  buffer.forEach((n) => wrapper.append(n));
  infoCol.append(wrapper);
}

  /* ===============================
   Form Right Column Logic
   =============================== */

const link = formCol.querySelector('a[href$=".json"]');
if (!link) return;

const formUrl = link.href;

// Remove only the link's parent paragraph
const linkWrapper = link.closest('p');
if (linkWrapper) linkWrapper.remove();

let response;
try {
  response = await fetch(formUrl);
} catch (e) {
  return;
}

if (!response.ok) return;

const formJson = await response.json();
if (!formJson?.data) return;

const form = document.createElement('form');
form.className = 'eds-form';
form.method = 'post';
form.noValidate = true;

formJson.data.forEach((field) => {
  if (field.Type === 'submit') {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'eds-form-submit';

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = field.Label || 'Send A Message';

    btnWrap.appendChild(button);
    form.appendChild(btnWrap);
    return;
  }

  const fieldWrap = document.createElement('div');
  fieldWrap.className = 'eds-form-field';

  let input;
  if (field.Type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 5;
  } else {
    input = document.createElement('input');
    input.type = field.Type || 'text';
  }

  input.name = field.Name;
  input.placeholder = field.Placeholder || field.Label || '';
  input.setAttribute('aria-label', field.Label || field.Name);

  if (field.Required === 'yes') {
    input.required = true;
  }

  fieldWrap.appendChild(input);
  form.appendChild(fieldWrap);
});

// Append form AFTER authored heading/content
formCol.appendChild(form);
}