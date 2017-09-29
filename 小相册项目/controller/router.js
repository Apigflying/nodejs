exports.showIndex = (req, res) => {
  res.send('这个是首页')
}
exports.showAlbum = (req, res) => {
  res.send('相册' + req.params.albumName)
}