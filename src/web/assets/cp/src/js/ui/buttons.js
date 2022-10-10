/** global: Craft */
/** global: Garnish */

/**
 * Configuration for creating buttons
 * @typedef {Object} CreateButtonConfig
 * @property {string} [type] Button type.
 * @property {string} [id] ID Attribute of the button.
 * @property {string} [class]
 * @property {string} [ariaLabel]
 * @property {string} [role]
 * @property {string} [label]
 * @property {string} [html]
 */

// #region createButton
/**
 *
 * @param {CreateButtonConfig} config Button config object
 * @returns {*|jQuery|HTMLElement|JQuery<HTMLElement>}
 */
export function createButton(config) {
  const $btn = $('<button/>', {
    type: config.type || 'button',
    class: 'btn',
  });
  if (config.id) {
    $btn.attr('id', config.id);
  }
  if (config.class) {
    $btn.addClass(config.class);
  }
  if (config.ariaLabel) {
    $btn.attr('aria-label', config.ariaLabel);
  }
  if (config.role) {
    $btn.attr('role', config.role);
  }
  if (config.html) {
    $btn.html(config.html);
  } else if (config.label) {
    $btn.append($('<div class="label"/>').text(config.label));
  } else {
    $btn.addClass('btn-empty');
  }
  if (config.toggle) {
    $btn.attr('aria-expanded', 'false');
  }
  if (config.controls) {
    $btn.attr('aria-controls', config.controls);
  }
  if (config.spinner) {
    $btn.append($('<div class="spinner spinner-absolute"/>'));
  }
  return $btn;
}
// #endregion createButton

/**
 *
 * @param {CreateButtonConfig} config
 * @returns {*|jQuery|HTMLElement|JQuery<HTMLElement>}
 */
export function createSubmitButton(config) {
  const $btn = createButton(
    Object.assign({}, config, {
      type: 'submit',
      label: config.label || Craft.t('app', 'Submit'),
    })
  );
  $btn.addClass('submit');
  return $btn;
}
