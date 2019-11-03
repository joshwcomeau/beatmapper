import { createGlobalStyle } from 'styled-components';

import { COLORS } from '../../constants';

const GlobalStyles = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Global custom styles */

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body, input, select, button, textarea {
    font-family: 'Oswald';
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    color: ${COLORS.white};
  }

  body {
    background-color: ${COLORS.blueGray[1000]};
  }

  /* Styles for the Tippy tooltip library */

  .tippy-tooltip {
    line-height: 1 !important;
    padding: 8px 12px !important;
    background: ${COLORS.gray[900]} !important;
  }


  .tippy-popper {
    pointer-events: auto !important;
  }

  /* Allow the "global" font stack (used primarily in docs) */
  @font-face {
    font-family: system;
    font-style: normal;
    font-weight: 300;
    src: local(".SFNSText-Light"), local(".HelveticaNeueDeskInterface-Light"), local(".LucidaGrandeUI"), local("Ubuntu Light"), local("Segoe UI Light"), local("Roboto-Light"), local("DroidSans"), local("Tahoma");
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic
  }

`;

export default GlobalStyles;
