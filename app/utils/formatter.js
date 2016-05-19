const pad = (val) => { return ("0" + val).slice(-2); };

const mmss = (sec) => {
  sec = Math.floor(sec)
  let ss = sec % 60 || 0;
  let mm = (sec - ss) / 60 || 0;
  return (pad(mm) + ":" + pad(ss))
}

export default { mmss }
