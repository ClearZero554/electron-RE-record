import CryptoJS from 'crypto-js'
function hexToRgb(hex) {
  // 将 #E9EDF7 格式的颜色值转换为十进制  
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // 将每个通道的值转换为字符串  
  return r.toString() + g.toString() + b.toString();
}

// 随机uuid
export function getUuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

// AudioBuffer转WAV
export function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [], i, sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  // "RIFF"
  setUint32(0x46464952);
  // file length - 8   
  setUint32(length - 8);
  // "WAVE"   
  setUint32(0x45564157);
  // "fmt " chunk
  setUint32(0x20746d66);
  // length = 16   
  setUint32(16);
  // PCM (uncompressed)    
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  // avg. bytes/sec
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  // block-align
  setUint16(numOfChan * 2);
  // 16-bit (hardcoded in this demo)
  setUint16(16);
  // "data" - chunk
  setUint32(0x61746164);
  // chunk length   
  setUint32(length - pos - 4);

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    // interleave channels
    for (i = 0; i < numOfChan; i++) {
      // clamp
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      // scale to 16-bit signed int
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      // write 16-bit sample
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    // next source sample
    offset++
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}


// 键盘对应案件处理
export const keyboardProcessing=(e)=>{
  let arr = ['0', '1','2', '3','4','5', '6','7', '8', '9']
  let key=e.key
  // 处理数字键盘
  if (e.code.includes("Numpad")&&arr.includes(e.key)) {
    key = "num" + key;
  }
  // 处理空格
  if (e.code == "Space") {
    key = "Space";
  }
  // 处理数字键盘的其他
  if (e.code=='NumpadAdd') {
    key='numadd'
  } else if (e.code == 'NumpadSubtract') {
    key='numsub'
  }else if (e.code == 'NumpadMultiply') {
    key='nummult'
  }else if (e.code == 'NumpadDivide') {
    key='numdiv'
  }else if (e.code == 'NumpadDecimal') {
    key='numdec'
  }else if (e.code=='ArrowUp') {
    key='Up'
  }else if (e.code=='ArrowDown') {
    key='Down'
  }else if (e.code=='ArrowRight') {
    key='Right'
  }else if (e.code=='ArrowLeft') {
    key='Left'
  }
  return key
}

export function getDay(datetime = Date.now(), pattern = 'yyyy/MM/dd hh:mm:ss', addon = false) {

	let rPattern = pattern
	const vWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	const dt = new Date(datetime)
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1).toString().padStart(2, '0')
	const d = dt.getDate().toString().padStart(2, '0')
	const hh = dt.getHours().toString().padStart(2, '0')
	const mm = dt.getMinutes().toString().padStart(2, '0')
	const ss = dt.getSeconds().toString().padStart(2, '0')
	const vDWeek = dt.getDay() // 星期

	rPattern = rPattern.replace(/y{4}/, `${y}`)
	rPattern = rPattern.replace(/(\W)?M{2}/, `$1${m}`)
	rPattern = rPattern.replace(/(\W)?d{2}/, `$1${d}`)
	rPattern = rPattern.replace(/(\s)?h{2}/, `$1${hh}`)
	rPattern = rPattern.replace(/(\W)?m{2}/, `$1${mm}`)
	rPattern = rPattern.replace(/(\W)?s{2}/, `$1${ss}`)
  rPattern += addon ? ` ${vWeek[vDWeek]}` : ''
	return rPattern
}


