import shouldInterceptClick from 'click-should-be-intercepted-for-navigation';

function attachClickListener(cb) {
  const anchors = document.querySelectorAll('a');
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    if (anchor.host === window.location.host) {
      anchor.addEventListener('click', (e) => {
        const shouldIntercept = shouldInterceptClick(e);

        if (shouldIntercept && document.getElementById('slot')) {
          cb(e);
        }

        return e;
      });
    }
  }
}

const resolve = (p) => Promise.resolve(p).then(
  (v) => [null, v],
  (e) => [e, null],
);

function router(opt = {}) {
  /**
   * @type {Map<string, []function>}
   */
  const subscribers = new Map();

  /**
   * Call all callbacks subscribed to an event
   * @param event string
   * @param args ...any
   */
  function call(event, ...args) {
    if (subscribers.has(event)) {
      subscribers.get(event).forEach((cb) => cb(...args));
    }
  }

  /**
   * The click listener assigned to each anchor tag on the document
   * @param e HTMLClickEvent<*>
   * @returns {Promise<void>}
   */
  async function clickListener(e) {
    e.preventDefault();

    if (e.target.href !== window.location.href) {
      call('routeChangeStart', e.target.href);
      history.pushState({}, null, e.target.href);

      // The location has been changed, so its safe to use window.location
      const [err, data] = await resolve(fetch(window.location.href).then((d) => d.text()));

      if (err) {
        call('routeChangeError', err, window.location.href);
      }

      const bodyRegexpr = /<body>(.*)<\/body>/gs;
      const [, contents] = bodyRegexpr.exec(data) || [];

      const fragment = document.createElement('div');
      fragment.id = 'fragment-parent-container';
      fragment.innerHTML = contents;

      const slot = fragment.querySelector('#slot');

      if (!slot) {
        call('routeMountError', new Error('No Node with id of `slot` found in the Document.'));
        window.location.href = e.target.href;
        return;
      }

      // TODO: fade between routes
      document.getElementById('slot').replaceWith(slot);
      attachClickListener(clickListener);
      call('routeChangeEnd');
    }
  }

  function on(event, cb) {
    const callbacks = subscribers.has(event) ? [...subscribers.get(event), cb] : [cb];
    subscribers.set(event, callbacks);
  }

  attachClickListener(clickListener);

  return {
    on,
    has: subscribers.has,
    keys: subscribers.keys,
  };
}

export default router;
