const base = require('../backend/base.json');
const phrasal = require('../backend/phrasal.json');

Array.prototype.shuffle = function() {
  let i = this.length;

  let j, temp;

  while ( --i ) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  return this;
}

const host = location.host.split(':')[0];

const [ count_span, left_span, right_span ] = document.getElementsByTagName('span');
const [ input_add, input_translate ] = document.getElementsByTagName('input');
const [ select_order, select_target, select_mode, select_count ] = document.getElementsByTagName('select');
const [ repeat_button, go_button, run_button ] = document.getElementsByTagName('button');

let lang = 'en-ru';
let target = 'base';
let counter = 0;
let incorrect_count = 0;
let incorrect_words = [];
let type = 'regular';
let words = null;
let ru_count = 0;
// let base = null;

// const clearBase = () => new Promise((resolve) => {
//   if (confirm('Are you sure you want to clear base?')) {
//     fetch(`http://${ host }:3000/clear`).then(resolve);
//   } else {
//     resolve();
//   }
// });

// const getBase = (type) => new Promise((resolve) => fetch(`http://${ host }:3000/get_base${ type ? `_${ type }` : '' }`)
//   .then((response) => response.json())
//   .then((json) => {
//     words = json.words;
//     base = json.base;
//     resolve();
//   }));

const getWords = (type) => {
  if (type === 'regular') {
    words = Object.keys(base);
  } else if (type === 'reversed') {
    words = Object.keys(base).reverse();
  } else if (type === 'shuffled') {
    words = Object.keys(base).shuffle();
  } else if (type === 'randomized') {
    words = Object.keys(base).map((elm, index, arr) => arr[Math.floor(Math.random() * arr.length)]);
  } else if (type === 'incorrect') {
    words = incorrect_words.slice();
  }

  incorrect_count = 0;
  incorrect_words = [];

  console.log(words);
};

const getNextWord = () => {
  const en = words[counter];
  const ru = base[en];

  if (lang === 'en-ru') {
    left_span.innerHTML = en;

    if (ru_count === 1) {
      right_span.innerHTML = ru.slice().shuffle().join(', ');
    } else {
      right_span.innerHTML = ru.slice().shuffle()[0];
    }
  } else {
    if (ru_count === 1) {
      left_span.innerHTML = ru.slice().shuffle().join(', ');
    } else {
      left_span.innerHTML = ru.slice().shuffle()[0];
    }

    right_span.innerHTML = en;
  }

  count_span.innerHTML = `${ counter + 1 } / ${ words.length } (${ incorrect_count = incorrect_words.length })`;

  if (counter < (words.length - 1)) {
    counter++;
  } else {
    counter = 0;
  }
};

const addWord = (en, ru) => fetch(`http://${ host }:3000/add?target=${ target }&en=${ en }&ru=${ ru }`);

const run = () => {
  left_span.style.opacity = 1;
  right_span.style.opacity = 0;

  getNextWord();

  setTimeout(() => {
    left_span.style.opacity = 1;
    right_span.style.opacity = 1;

    setTimeout(run, 1000);
  }, 3000);
};

select_order.addEventListener('change', (evt) => (lang = evt.target.value));

select_target.addEventListener('change', (evt) => (target = evt.target.value));

select_mode.addEventListener('change', (evt) => getWords(type = evt.target.value));

getWords('regular');

select_count.addEventListener('change', (evt) => {
  const en = words[counter - 1];
  const ru = base[en];

  ru_count = 1 - ru_count;

  if (lang === 'en-ru') {
    if (ru_count === 1) {
      right_span.innerHTML = ru.slice().shuffle().join(', ');
    } else {
      right_span.innerHTML = ru.slice().shuffle()[0];
    }
  } else {
    if (ru_count === 1) {
      left_span.innerHTML = ru.slice().shuffle().join(', ');
    } else {
      left_span.innerHTML = ru.slice().shuffle()[0];
    }
  }
});

repeat_button.addEventListener('click', () => getWords(type));

go_button.addEventListener('click', () => {
  counter = 0;
  incorrect_count = 0;
  incorrect_words = [];

  left_span.style.opacity = 1;
  right_span.style.opacity = 0;

  getNextWord();
});

run_button.addEventListener('click', () => {
  counter = 0;
  incorrect_count = 0;
  incorrect_words = [];

  left_span.style.opacity = 1;
  right_span.style.opacity = 0;

  run();
});

input_add.addEventListener('keypress', async (evt) => {
  if (evt.keyCode === 13) {
    if (confirm("Are you sure?")) {
      const arr = input_add.value.trim().split('-').map((elm) => elm.trim());

      if (arr.length === 2) {
        input_add.value = '';

        await addWord(...arr);
      }
    }
  }
});

input_translate.addEventListener('keypress', async (evt) => {
  if (evt.keyCode === 13) {
    // console.log((words));
    const word = words[counter - 1] || words[words.length - 1];
    const word_splitted = word.split(' ');

    if ((word_splitted.length === 1 && input_translate.value.toLowerCase() !== word_splitted[0]) || (word_splitted.length > 1 && input_translate.value.toLowerCase() !== word_splitted.slice(1).join(' '))) {
      // const arr = [];

      // words.forEach((word_) => {
      //   base[word.join(' ')].forEach((elm) => {
      //     if (base[word_].indexOf(elm) >= 0 && arr.indexOf(word_) < 0) {
      //       arr.push(word_);
      //     }
      //   });

      //   // if (base[word_].indexOf(elm) >= 0 && arr.indexOf(word_) < 0) {
      //   //   arr.push(word_);
      //   // }
      // });

      // if (arr.indexOf(word.join(' ')) >= 0) {
      //   arr[arr.indexOf(word.join(' '))] = arr[arr.indexOf(word.join(' '))].toUpperCase();
      // }

      // console.log(arr);

      // alert(arr.join(', '));

      alert(word);

      if (incorrect_words.indexOf(word) < 0) {
        incorrect_words.push(word);

        console.log(word);
      }
    } else if (incorrect_words.indexOf(word) >= 0) {
      incorrect_words.splice(incorrect_words.indexOf(word), 1);
    }

    getNextWord();

    input_translate.value = '';
  }
});

// window.__clearBase = верстка ;
window.__addWord = addWord;
