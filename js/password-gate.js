(function () {
  var STORAGE_KEY = 'portfolio_access_granted_v1';
  var PASSWORD = '5555';

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      return;
    }
  } catch (e) {
    // fall through and show gate
  }

  function lockPage() {
    document.body.classList.add('password-locked');
  }

  function unlockPage() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // ignore storage failures and still unlock for current page
    }

    document.body.classList.remove('password-locked');
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
  }

  function buildGate() {
    var wrapper = document.createElement('div');
    wrapper.className = 'password-gate';

    var card = document.createElement('div');
    card.className = 'password-gate-card';

    var kicker = document.createElement('p');
    kicker.className = 'password-gate-kicker';
    kicker.textContent = 'Private Portfolio';

    var title = document.createElement('h1');
    title.className = 'password-gate-title';
    title.textContent = 'Enter password to view the portfolio';

    var copy = document.createElement('p');
    copy.className = 'password-gate-copy';
    copy.textContent = 'This portfolio is password protected. Enter the access code to continue.';

    var form = document.createElement('form');
    form.className = 'password-gate-form';

    var input = document.createElement('input');
    input.className = 'password-gate-input';
    input.type = 'password';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.placeholder = 'Password';
    input.setAttribute('aria-label', 'Portfolio password');

    var button = document.createElement('button');
    button.className = 'password-gate-button';
    button.type = 'submit';
    button.textContent = 'Enter';

    var error = document.createElement('p');
    error.className = 'password-gate-error';
    error.setAttribute('aria-live', 'polite');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (input.value === PASSWORD) {
        unlockPage();
        return;
      }

      error.textContent = 'Incorrect password. Please try again.';
      input.value = '';
      input.focus();
    });

    form.appendChild(input);
    form.appendChild(button);
    form.appendChild(error);
    card.appendChild(kicker);
    card.appendChild(title);
    card.appendChild(copy);
    card.appendChild(form);
    wrapper.appendChild(card);

    return { wrapper: wrapper, input: input };
  }

  var gateData = buildGate();
  var gate = gateData.wrapper;

  function mountGate() {
    lockPage();
    document.body.appendChild(gate);
    gateData.input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountGate, { once: true });
  } else {
    mountGate();
  }
})();
