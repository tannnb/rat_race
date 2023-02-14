import { useRef } from 'react'

export default function DataUrl () {
  const imgRef = useRef(null)
  
  // 动态构建JS代码方案
  //                                          动态逻辑⬇️
  // <script src="data:application/javascript,alert('hello world')"></script>

  const handleChange = (e) => {
    const files = e.target.files[0]
    // dataUrl:固定图片字符串 -> 固定格式: data:mediaType;base64,data
    // 例子：data:image/jpeg;base64,/sidhsid1232423423
    const render = new FileReader()
    render.onload = (e) => {
      imgRef.current.src = e.target.result
    }
    render.readAsDataURL(files)
  }
  return (
    <>
      <input onChange={handleChange} type="file" />
      <img width='500' ref={imgRef} src="" alt="" />
    </>
  )
}

