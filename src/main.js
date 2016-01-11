'use strict';

// アプリケーションをコントロールするモジュール
import app from 'app';
import polifill from 'babel-polyfill';
// ウィンドウを作成するモジュール
import BrowserWindow from 'browser-window';
import crashReporter from 'crash-reporter';

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;

if (process.env.NODE_ENV === 'develop') {
  crashReporter.start();
}

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', ()=> {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', () => {
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/renderer/index.html');

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
