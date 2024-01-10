import { PlusOutlined } from '@ant-design/icons'
import {  Upload, message } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { useEffect, useState } from 'react'

interface HeadPicUploadProps {
  value?: string
  onChange?: (value: string) => void
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    callback(reader.result as string)
  })
  reader.readAsDataURL(img)
}

function HeadPicUpload(props: HeadPicUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    setImageUrl(`http://localhost:3000/${props.value}`)
  }, [props.value])

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    const { status , response} = info.file
    if (status === 'done') {
      message.success(` 文件上传成功`)
     
      props.onChange?.(response.data)
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageUrl(url)
      })
    }
    if (status === 'error') {
      message.error(` 文件上传失败`)
    }
  }
  return (
    <Upload
      maxCount={1}
      name={'file'}
      showUploadList={false}
      onChange={handleChange}
      action="http://localhost:3000/user/upload"
      listType="picture-circle"
    >
      {imageUrl ? (
        <img src={imageUrl} alt="头像" style={{ width: '100px', height: '100px' }} />
      ) : (
        <button style={{ border: 0, background: 'none' }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </button>
      )}
    </Upload>
  )
}

export default HeadPicUpload
