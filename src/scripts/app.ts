/**
 * Comportamiento compartido del cliente. Se mantiene deliberadamente pequeño y
 * sin framework: formularios, filas dinámicas, filtros y acciones de impresión.
 */

const ERROR_CLASS = 'border-rose-400 ring-2 ring-rose-100';

function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll('[data-form-error]').forEach((el) => {
    el.textContent = '';
    el.classList.add('hidden');
  });
  form.querySelectorAll(`.${ERROR_CLASS.split(' ')[0]}`).forEach((el) => {
    el.classList.remove(...ERROR_CLASS.split(' '));
  });
}

function showError(form: HTMLFormElement, message: string, errors: Array<{ path: string; message: string }> = []): void {
  let box = form.querySelector<HTMLElement>('[data-form-error]');
  if (!box) {
    box = document.createElement('div');
    box.setAttribute('data-form-error', '');
    box.className = 'rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700';
    form.prepend(box);
  }
  box.innerHTML = '';
  const title = document.createElement('p');
  title.className = 'font-semibold';
  title.textContent = message;
  box.appendChild(title);
  if (errors.length) {
    const list = document.createElement('ul');
    list.className = 'mt-1.5 list-disc space-y-0.5 pl-5 text-xs';
    for (const error of errors.slice(0, 8)) {
      const item = document.createElement('li');
      item.textContent = error.path ? `${error.path}: ${error.message}` : error.message;
      list.appendChild(item);
    }
    box.appendChild(list);
  }
  box.classList.remove('hidden');
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });

  for (const error of errors) {
    if (!error.path) continue;
    const field = form.querySelector<HTMLElement>(`[name="${CSS.escape(error.path)}"]`);
    if (field) field.classList.add(...ERROR_CLASS.split(' '));
  }
}

function setBusy(form: HTMLFormElement, busy: boolean): void {
  const buttons = form.querySelectorAll<HTMLButtonElement>('button[type="submit"], button:not([type])');
  buttons.forEach((button) => {
    button.disabled = busy;
    if (busy) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = '<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> Procesando…';
    } else if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  });
}

document.addEventListener('submit', async (event) => {
  const form = (event.target as HTMLElement).closest<HTMLFormElement>('form[data-api]');
  if (!form) return;
  event.preventDefault();
  clearErrors(form);
  setBusy(form, true);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      errors?: Array<{ path: string; message: string }>;
      redirect?: string;
      reload?: boolean;
    };

    if (!response.ok || data.ok === false) {
      showError(form, data.message ?? 'No fue posible guardar los datos.', data.errors ?? []);
      return;
    }
    if (data.redirect) {
      window.location.href = data.redirect;
      return;
    }
    if (data.reload) {
      window.location.reload();
      return;
    }
    window.location.reload();
  } catch (error) {
    showError(form, `Error de conexión: ${(error as Error).message}`);
  } finally {
    setBusy(form, false);
  }
});

/* ------------------------------ Filas dinámicas ----------------------------- */

function reindexRows(container: HTMLElement, key: string): void {
  container.querySelectorAll<HTMLElement>('[data-row]').forEach((row, index) => {
    row.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea',
    ).forEach((field) => {
      if (!field.name) return;
      field.name = field.name.replace(
        new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.\\d+\\.`),
        `${key}.${index}.`,
      );
    });
  });
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const addButton = target.closest<HTMLElement>('[data-add-row]');
  if (addButton) {
    event.preventDefault();
    const key = addButton.dataset.addRow;
    if (!key) return;
    const template = document.querySelector<HTMLTemplateElement>(`template[data-row-template="${key}"]`);
    const container = document.querySelector<HTMLElement>(`[data-rows="${key}"]`);
    if (!template || !container) return;
    const index = container.querySelectorAll('[data-row]').length;
    const html = template.innerHTML.replaceAll('__INDEX__', String(index));
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const row = wrapper.firstElementChild;
    if (row) {
      container.appendChild(row);
      row.querySelector<HTMLElement>('input, select, textarea')?.focus();
    }
    return;
  }

  const removeButton = target.closest<HTMLElement>('[data-remove-row]');
  if (removeButton) {
    event.preventDefault();
    const row = removeButton.closest<HTMLElement>('[data-row]');
    const container = row?.parentElement;
    row?.remove();
    if (container) {
      const key = container.dataset.rows;
      if (key) reindexRows(container, key);
    }
  }
});

/* -------------------------- Hallazgos y recomendaciones ------------------------- */

function updateCounts(): void {
  const hallazgos = document.querySelectorAll<HTMLInputElement>('input[name="hallazgos[]"]:checked').length;
  const recomendaciones = document.querySelectorAll<HTMLInputElement>('input[name="recomendaciones[]"]:checked').length;
  document.querySelectorAll('[data-count-hallazgos]').forEach((el) => (el.textContent = String(hallazgos)));
  document.querySelectorAll('[data-count-recomendaciones]').forEach((el) => (el.textContent = String(recomendaciones)));
}

document.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.matches('input[name="hallazgos[]"], input[name="recomendaciones[]"]')) {
    updateCounts();
  }
  if (target.matches('input[name="hallazgos[]"]') && target.checked) {
    const recoId = target.dataset.recomendacion;
    if (recoId) {
      const reco = document.querySelector<HTMLInputElement>(`input[name="recomendaciones[]"][value="${CSS.escape(recoId)}"]`);
      if (reco && !reco.checked) {
        reco.checked = true;
        updateCounts();
      }
    }
  }
  if (target.matches('[data-filter-target]')) {
    const selector = target.dataset.filterTarget;
    if (!selector) return;
    const query = target.value.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>(`${selector} [data-filter-item]`).forEach((item) => {
      const matches = item.textContent?.toLowerCase().includes(query) ?? false;
      item.classList.toggle('hidden', !matches);
    });
    document.querySelectorAll<HTMLElement>(`${selector} [data-filter-group]`).forEach((group) => {
      const visible = group.querySelectorAll('[data-filter-item]:not(.hidden)').length;
      group.classList.toggle('hidden', visible === 0);
    });
  }
});

/* ------------------------------- Puntajes ---------------------------------- */

function updateScoreOutputs(): void {
  document.querySelectorAll<HTMLSelectElement>('select[data-score]').forEach((select) => {
    const output = document.querySelector<HTMLElement>(`[data-score-output="${select.dataset.score}"]`);
    if (!output) return;
    const option = select.selectedOptions[0];
    output.textContent = select.value === '0' ? 'No aplica' : (option?.textContent ?? '');
  });
}

document.addEventListener('change', (event) => {
  if ((event.target as HTMLElement).matches('select[data-score]')) updateScoreOutputs();
});

/* --------------------------------- Varios ---------------------------------- */

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[data-print]')) {
    event.preventDefault();
    window.print();
  }
  const confirmAction = target.closest<HTMLElement>('[data-confirm]');
  if (confirmAction && !window.confirm(confirmAction.dataset.confirm ?? '¿Confirmar acción?')) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

function init(): void {
  updateCounts();
  updateScoreOutputs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
