import { renderApp } from './render.js';
import { subscribe, setState } from './state.js';

subscribe(() => {
  renderApp();
});

setState({ status: 'loading', statusType: 'load' });
setTimeout(() => {
  setState({ status: 'success', statusType: null });
}, 800);
