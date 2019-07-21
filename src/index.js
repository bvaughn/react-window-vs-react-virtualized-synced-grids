import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Define custom <raf-spinner> web component
import './RafSpinner';

let count = 0;
let total = 0;

const samples = document.getElementById('samples');

window.registerScrollTarget = target => {
  const rafSpinner = document.querySelector('raf-spinner')
  const fps = rafSpinner.shadowRoot.querySelector('.fps');

  const onScroll = event => {
    count++;
    total += parseInt(fps.innerText, 10);

    samples.innerHTML = `${Math.round(total/count)}fps average, ${count} samples`;
  };

  target.addEventListener('scroll', onScroll);
};

ReactDOM.render(<App />, document.getElementById('root'));
