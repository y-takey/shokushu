# shokushu

This application is Local video manage and player using electron.

![list](https://github.com/y-takey/shokushu/blob/master/screenshots/list.png)
![edit](https://github.com/y-takey/shokushu/blob/master/screenshots/edit.png)
![view](https://github.com/y-takey/shokushu/blob/master/screenshots/view.png)

The application based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate).

## Features

1. Keyboard friendly
1. Tagging and favorites the video
1. Preview it when mouse hover on the seekbar
1. Bookmarking any playing position, and playing later
1. Mamakita button (means showing emergency evacuation screen)

## Install

Download [here](https://github.com/y-takey/shokushu/tree/master/release/darwin-x64/shokushu-darwin-x64) to your pc

## Upgrade

1. select [JSON export] on application menu, and then save the file to local strage.
1. replace your app with latest the app
1. select [JSON import] on application menu, and then open your local file.

*caution* just replace the app, json data will clear.

--

# Development

## Install

Install dependencies.

```bash
$ npm install
```


## Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

*Note: requires a node version >= 4 and an npm version >= 2.*


## Packaging

```bash
$ npm run package
```

To package apps for all platforms:

```bash
$ npm run package-all
```

#### Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon
- --all: pack for all platforms

Use `electron-packager` to pack your app with `--all` options for darwin (osx), linux and win32 (windows) platform. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

## License

MIT © [y-takey](https://github.com/y-takey)
