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
     form left column group
     =============================== */

  const paragraphs = [...infoCol.querySelectorAll('p')];
  infoCol.innerHTML = '';

  for (let i = 0; i < paragraphs.length; i += 2) {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-form-info-list';

    if (paragraphs[i]) wrapper.append(paragraphs[i]);
    if (paragraphs[i + 1]) wrapper.append(paragraphs[i + 1]);

    infoCol.appendChild(wrapper);
  }

  /* ===============================
     form right column group
     =============================== */

  const link = formCol.querySelector('a[href$=".json"]');
  if (!link) return;

  const formUrl = link.href;
  formCol.innerHTML = '';

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
      button.textContent = field.Label || 'Send Message';

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

  formCol.appendChild(form);
}