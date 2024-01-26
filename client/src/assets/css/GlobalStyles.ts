import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'SingleDay-Regular';
    font-weight: normal;
    src: url('../fonts/Single_Day/SingleDay-Regular.ttf') format("truetype");
  }
  *{
    box-sizing: border-box;
  }
  #root,body{
    margin: 0;
    height: 100vh;
  }
`;

export default GlobalStyle;
