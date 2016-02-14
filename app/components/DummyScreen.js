import _ from 'lodash';
import React, { Component } from 'react';
import styles from './DummyScreen.module.css';

const style = {
  margin: 0,
  padding: 0,
  backgroundColor: "#282c34",
  backgroundImage: "none",
  fontSize: "15px",
  fontFamily: "Menlo, Consolas, 'DejaVu Sans Mono', monospace",
  lineHeight: 1.2,
  color: "#abb2bf"
}

export default class Home extends Component {
  componentDidMount() {
    let body = document.getElementsByTagName("body")[0]
    this.originalStyle = {};
    _.forEach(style, (val, key) => {
      this.originalStyle[key] = body.style[key];
      body.style[key] = val;
    })
  }
  componentWillUnmount() {
    let body = document.getElementsByTagName("body")[0]
    _.forEach(this.originalStyle, (val, key) => {
      body.style[key] = val;
    })
  }

  command(cmd) {
    return (
      <tr key={this.currentKey++}>
        <td className={styles.command} width="355px">
          [this.is@shokushu:<span className={styles.place}>~/workspace/shokushu</span>]

        </td>
        <td>
          <span className={styles.prompt}>$ </span>{cmd}
        </td>
      </tr>
    )
  }
  feedback(content) {
    return (
      <tr key={this.currentKey++}>
        <td colSpan={2}>
          {content}
        </td>
      </tr>
    )
  }
  render() {
    this.currentKey = 1;
    return (
      <div className={styles.main}>
        <table>
          <tbody>
            {[
              this.command("npm run start-hot"),
              this.feedback("　"),
              this.feedback("> shokushu@0.0.1 start-hot /Users/shokushu/workspace/shokushu"),
              this.feedback("> cross-env HOT=1 NODE_ENV=development electron ./"),
              this.feedback("　"),
              this.feedback("2016-02-14 10:13:58.946 Electron Helper[20761:862116] Couldn't set selectedTextBackgroundColor from default ()"),
              this.command("npm run hot-server"),
              this.feedback("　"),
              this.feedback("> shokushu@0.0.1 hot-server /Users/shokushu/workspace/shokushu"),
              this.feedback("> node server.js"),
              this.feedback("　"),
              this.feedback("　[0] multi main 40 bytes {0} [built]"),
              this.feedback("　[1] (webpack)-hot-middleware/client.js?path=/__webpack_hmr 3.39 kB {0} [built]"),
              this.feedback("　[2] (webpack)/buildin/module.js 251 bytes {0} [built]"),
              this.feedback("　[3] external \"querystring\" 42 bytes {0} [not cacheable]"),
              this.command(<input className={styles.cli} autoFocus/>),
            ]}
          </tbody>
        </table>
      </div>
    );
  }
}
