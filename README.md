# 简介

从指定网易云歌单中下载音乐，分析音乐的BPM挑选出适合跑步的音乐

##　环境要求

- python 3.*
- nodejs  v8.*
- npm

### python 依赖包

- base64
- pycryptodome
- Selector

## nodejs依赖包

web-audio-api

从reference/music-tempo/目录中安装music-tempo

`npm i --save music-tempo`

##　用法

从网易云中找到需要分析的歌单的id

修改GetMusicFromNetNease.py中main方法的playlistID为需要分析的歌单id

运行GetMusicFromNetNease.py

`python GetMusicFromNetNease.py`

运行后会在目录中生成Musics目录，该目录下为歌单可以下载的所有歌曲

运行AnalyseBPM.js

`node AnalyseBPM.js`

执行完毕后会讲Musics目录下的所有歌曲按照BPM归类到不同子文件夹中

## 备注

在windows环境下，需要将AnalyseBPM.js中第６行的

``var MusicPath="Musics/";``

改为

`var MusicPath="Musics\\";`