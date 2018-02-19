const TABLE = {
  "<": "lt",
  ">": "gt",
  '"': "quot",
  "'": "apos",
  "&": "amp",
  "\r": "#10",
  "\n": "#13"
};

const safetext = text => {
  return text.toString().replace(/[<>"'\r\n&]/g, function(chr) {
    return "&" + TABLE[chr] + ";";
  });
};

export default safetext;

