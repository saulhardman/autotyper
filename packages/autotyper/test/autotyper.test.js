import test from 'ava';

import autotyper, { DEFAULTS, EVENTS, NAME } from '../src/autotyper';

import objectToDataAttributes from './helpers/object-to-data-attributes';

const EVENT_NAMES = Object.keys(EVENTS).map(name => EVENTS[name]);
const { DESTROY, LOOP, START, STOP, TYPE } = EVENTS;
const ASYNC_TIMEOUT = 10000;

test.beforeEach(t => {
  const instance = Object.create(autotyper);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  const element = document.getElementById('js-example');

  Object.assign(t.context, {
    instance,
    element,
  });
});

test.afterEach(t => {
  const {
    context: { instance },
  } = t;

  instance.destroy();

  document.body.innerHTML = '';
});

test('it sets default options correctly', t => {
  const {
    context: { instance },
  } = t;

  instance.init();

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets options correctly', t => {
  const {
    context: { instance },
  } = t;

  const options = {
    text: 'Example text.',
    interval: 200,
    autoStart: false,
    loop: true,
    loopInterval: 2000,
    empty: '',
  };

  instance.init(options);

  t.deepEqual(instance.settings, options);
});

test('it works with an element', t => {
  const {
    context: { instance, element },
  } = t;

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets `text` to the HTML content of an element', t => {
  const {
    context: { instance, element },
  } = t;
  const text = 'Example text.';

  element.innerHTML = text;

  instance.init(element);

  t.is(instance.settings.text, text);
});

test('it receives an options object via a single HTML data attribute', t => {
  const {
    context: { instance },
  } = t;

  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" data-${NAME}-options='${JSON.stringify(
    DEFAULTS,
  )}'>${text}</p>
  `;

  const element = document.getElementById('js-example');

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it receives individual options via HTML data attributes', t => {
  const {
    context: { instance },
  } = t;

  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" ${objectToDataAttributes(DEFAULTS, NAME)}>${text}</p>
  `;

  const element = document.getElementById('js-example');

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it removes all event listeners on `destroy()`', t => {
  const {
    context: { instance },
  } = t;

  const callback = () => {};

  t.plan(EVENT_NAMES.length);

  instance.init();

  EVENT_NAMES.forEach(event => instance.on(event, callback));

  instance.destroy();

  EVENT_NAMES.forEach(event => t.false(instance.hasListeners(event)));
});

test('it emits events', t => {
  const {
    context: { instance },
  } = t;

  t.plan(EVENT_NAMES.length);

  instance.init();

  EVENT_NAMES.forEach(event => instance.on(event, () => t.pass()));

  EVENT_NAMES.forEach(event => instance.emit(event));
});

test('it correctly sets the `text` value on `type()`', t => {
  const {
    context: { instance },
  } = t;
  const text = 'Example text.';
  let index = 0;

  t.plan(text.length + 1);

  return new Promise(resolve => {
    instance.on(STOP, resolve);

    instance.on(TYPE, () => {
      if (index === 0) {
        t.is(instance.text, DEFAULTS.empty);
      } else {
        t.is(instance.text, text.substring(0, index));
      }

      index += 1;
    });

    instance.init({ text });
  });
});

test('it correctly sets the `text` value on `type()` when empty is `false`', t => {
  const {
    context: { instance },
  } = t;
  const text = 'Example text.';
  const empty = false;
  let index = 1;

  t.plan(text.length);

  return new Promise(resolve => {
    instance.on(STOP, resolve);

    instance.on(TYPE, () => {
      t.is(instance.text, text.substring(0, index));

      index += 1;
    });

    instance.init({ empty, text });
  });
});

test('it correctly sets the `element.innerHTML` value on `type()`', t => {
  const {
    context: { instance, element },
  } = t;
  const text = 'Example text.';

  t.plan(text.length + 1);

  return new Promise(resolve => {
    instance.on(STOP, resolve);

    instance.on(TYPE, string => t.is(string, element.textContent));

    instance.init(element, { text });
  });
});

test('it passes the correct `text` parameter when emitting the `TYPE` event', t => {
  const {
    context: { instance },
  } = t;
  const text = 'Example text.';

  t.plan(text.length + 1);

  return new Promise(resolve => {
    instance.on(STOP, resolve);

    instance.on(TYPE, string => t.is(instance.text, string));

    instance.init({ text });
  });
});

test('it passes the correct `character` parameter when emitting the `TYPE` event', t => {
  const {
    context: { instance },
  } = t;
  const text = 'Example text.';
  let index = 0;

  t.plan(text.length + 1);

  return new Promise(resolve => {
    instance.on(STOP, resolve);

    instance.on(TYPE, (string, character) => {
      if (index === 0) {
        t.is(character, DEFAULTS.empty);
      } else {
        t.is(character, text.substring(index - 1, index));
      }

      index += 1;
    });

    instance.init({ text });
  });
});

test('it correctly sets the first character when empty is default', t => {
  const {
    context: { instance },
  } = t;

  t.plan(1);

  return new Promise(resolve => {
    instance.on(TYPE, text => {
      t.is(text, DEFAULTS.empty);

      resolve();
    });

    instance.init();
  });
});

test('it correctly sets the first character when empty is not default', t => {
  const {
    context: { instance },
  } = t;
  const empty = '';

  t.plan(1);

  return new Promise(resolve => {
    instance.on(TYPE, text => {
      t.is(text, empty);

      resolve();
    });

    instance.init({ empty });
  });
});

test('it correctly sets the first character when empty is false', t => {
  const {
    context: { instance },
  } = t;

  t.plan(1);

  return new Promise(resolve => {
    instance.on(TYPE, text => {
      t.is(text, DEFAULTS.text.substring(0, 1));

      resolve();
    });

    instance.init({ empty: false });
  });
});

test('it starts if `autoStart` is `true`', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = true;

  return new Promise(resolve => {
    instance.on(START, () => {
      t.pass();

      resolve();
    });

    instance.init({ autoStart });
  });
});

test('it starts if `autoStart` is an integer', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = 1000;

  return new Promise(resolve => {
    instance.on(START, () => {
      t.pass();

      resolve();
    });

    instance.init({ autoStart });
  });
});

test('it starts if `autoStart` can be parsed as an integer', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = '1000';

  return new Promise(resolve => {
    instance.on(START, () => {
      t.pass();

      resolve(true);
    });

    instance.init({ autoStart });
  });
});

test('it does not start when `autoStart` cannot be parsed as an integer', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = 'banana';

  return new Promise(resolve => {
    setTimeout(() => {
      t.pass();

      resolve();
    }, 500);

    instance.on(START, () => t.fail());

    instance.init({ autoStart });
  });
});

test('it stops after 1 cycle when `loop` is `false`', t => {
  const {
    context: { instance },
  } = t;
  const loop = false;

  instance.on(LOOP, () => t.fail());

  instance.on(STOP, () => t.pass());

  instance.init({ loop });

  return new Promise(resolve => instance.on(STOP, () => resolve()));
});

test('it loops or stops at the right time', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = false;
  const loop = false;
  const text = 'Example text.';

  instance.init({ autoStart, loop, text });

  instance.letterCount = text.length + 1;

  instance.type();

  t.false(instance.isRunning);
});

test('it emits events from respective functions', t => {
  const {
    context: { instance },
  } = t;
  const options = { loop: 1, interval: 50 };

  t.plan(EVENT_NAMES.length);

  EVENT_NAMES.forEach(event => {
    instance.on(event, () => {
      instance.off(event);

      t.pass();
    });
  });

  instance.on(STOP, () => instance.destroy());

  instance.init(options);

  return new Promise((resolve, reject) => {
    instance.on(DESTROY, resolve);

    setTimeout(reject, ASYNC_TIMEOUT);
  });
});

test('it sets `settings.text` to default value if undefined and HTML element is empty', t => {
  const {
    context: { instance, element },
  } = t;

  element.innerHTML = '';

  instance.init(element);

  t.is(instance.settings.text, DEFAULTS.text);
});

test('it adds text after start', t => {
  const {
    context: { instance },
  } = t;
  const interval = 50;

  t.plan(1);

  return new Promise(resolve => {
    const text1 = instance.init({ interval }).text;

    t.plan(1);

    setTimeout(() => {
      const text2 = instance.text;

      t.not(text1, text2);

      resolve();
    }, 200);
  });
});

test('it sets `isRunning` on start', t => {
  const {
    context: { instance },
  } = t;

  t.plan(1);

  return new Promise(resolve => {
    instance.on(START, () => {
      t.is(instance.isRunning, true);

      resolve();
    });

    instance.init();
  });
});

test('it does not add text after stop', t => {
  const {
    context: { instance },
  } = t;
  const interval = 50;

  t.plan(1);

  return new Promise(resolve => {
    instance.init({ interval });

    t.plan(1);

    setTimeout(() => {
      const text1 = instance.stop().text;

      setTimeout(() => {
        const text2 = instance.text;

        t.is(text1, text2);

        resolve();
      }, 200);
    }, 200);
  });
});

test('it sets `isRunning` on stop', t => {
  const {
    context: { instance },
  } = t;

  t.plan(1);

  return new Promise(resolve => {
    instance.on(STOP, () => {
      t.is(instance.isRunning, false);

      resolve();
    });

    instance.init().stop();
  });
});

test('it starts, stops and starts again', t => {
  const {
    context: { instance },
  } = t;
  const interval = 50;

  t.plan(4);

  return new Promise(resolve => {
    const startText = instance.init({ interval }).text;

    setTimeout(() => {
      const stopText = instance.stop().text;

      t.not(startText, stopText);

      t.is(instance.isRunning, false);

      instance.start();

      setTimeout(() => {
        const restartText = instance.text;

        t.not(restartText, stopText);

        t.is(instance.isRunning, true);

        resolve();
      }, 200);
    }, 200);
  });
});

// test('it starts, stops, resets, and starts again');

test('it does nothing when `start()` is called multiple times', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = false;

  t.plan(1);

  instance.on(START, () => t.pass());

  instance.init({ autoStart });

  instance.start().start();
});

test('it does nothing when `stop()` is called multiple times', t => {
  const {
    context: { instance },
  } = t;

  t.plan(1);

  instance.on(STOP, () => t.pass());

  instance.init();

  instance.stop().stop();
});

test('it sets `empty`', t => {
  const {
    context: { instance },
  } = t;
  const empty = '';

  t.plan(1);

  instance.on(TYPE, text => t.is(text, empty));

  instance.init({ empty });
});

test('it can empty the text whilst running', t => {
  const {
    context: { instance },
  } = t;

  instance
    .init()
    .empty()
    .stop();

  t.is(instance.text, DEFAULTS.empty);
});

test('it can empty the text whilst not running', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = false;

  instance.init({ autoStart }).empty();

  t.is(instance.text, DEFAULTS.empty);
});

test('it can empty the text when `empty` is set to false', t => {
  const {
    context: { instance },
  } = t;
  const empty = false;

  instance
    .init({ empty })
    .empty()
    .stop();

  t.is(instance.text, DEFAULTS.empty);
});

test('it can fill the text whilst running', t => {
  const {
    context: { instance },
  } = t;

  instance
    .init()
    .fill()
    .stop();

  t.is(instance.text, DEFAULTS.text);
});

test('it can fill the text whilst not running', t => {
  const {
    context: { instance },
  } = t;
  const autoStart = false;

  instance.init({ autoStart }).fill();

  t.is(instance.text, DEFAULTS.text);
});
