var AudioContext = require("web-audio-api").AudioContext;
var MusicTempo = require("music-tempo");
var fs = require("fs");
var join = require('path').join;

var MusicPath="Musics/";
var bpmRange={"超快":[190,280],
              "快跑":[160,190],
              "慢跑":[140,160],
              "快走":[120,140],
              "慢走":[100,120],
              "超慢":[0,100]
              };
var calcTempo = function (buffer) {
  var audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels == 2) {
    var channel1Data = buffer.getChannelData(0);
    var channel2Data = buffer.getChannelData(1);
    var length = channel1Data.length;
    for (var i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }
  try{
    var mt = new MusicTempo(audioData); 
    var bpm=Math.round(mt.tempo)
    console.log(getCurrentMusicName()+" bpm:"+bpm);

    moveMusicFile(bpm);
  }catch(err){
    console.log("读取音频文件"+getCurrentMusicName()+"失败，请检查音频格式");
  } 
  startAnalyse();
  // console.log(mt.tempo);
  //console.log(mt.beats);
}
/**
 * 获取文件夹下的所有mp3文件
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function finder(path) {
    var result=[];
    var files=fs.readdirSync(path);
    files.forEach((val,index) => {
        var fPath=join(path,val);
        var stats=fs.statSync(fPath);
        if(stats.isFile()) {
            var isMusic=val.indexOf(".mp3")>0;//这里只识别MP3，因为网易云的音乐均为mp3
            if(isMusic){
                result.push(fPath);
            }
        }
    });
    return result;
}

function startAnalyse(){  
  musicIndex++;
  if(musicIndex>fileNames.length-1){
    console.log("分析完成");
  }else{
    console.log("分析进度："+(musicIndex+1)+"/"+fileNames.length);
    var data=fs.readFileSync(fileNames[musicIndex]);
    context.decodeAudioData(data, calcTempo);
  }
}
function getCurrentMusicName(){
  return fileNames[musicIndex].replace(MusicPath,"").replace(".mp3","");
}

function moveMusicFile(bpm){
  for (var key in bpmRange) {
            if(bpm>bpmRange[key][0]&&bpm<=bpmRange[key][1]){
            var fPath=join(MusicPath,getBpmRangeFolderName(key));
              moveFileIndexFloder(fileNames[musicIndex],fPath,bpm);
            }
                //move     
    }
}
function getBpmRangeFolderName(key){
  return key+"("+bpmRange[key][0]+"-"+bpmRange[key][1]+")";
}
function moveFileIndexFloder(filePath,folder,bpm){
  if(!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  var fileName=filePath.replace(MusicPath,"");
  if(fileName.indexOf("bpm).mp3")<0){
    fileName=fileName.replace(".mp3"," ("+bpm+"bpm).mp3");
  }
  var newPath=join(folder,fileName)
  console.log(newPath);
  fs.rename(filePath,newPath,()=>{});
}
var fileNames=finder(MusicPath);
console.log("开始分析,音乐数量："+ fileNames.length);
var context = new AudioContext();
var musicIndex=-1;
startAnalyse();
