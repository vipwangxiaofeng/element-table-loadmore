> vue指令 v-elTableScrollLoad 用来完善element-ui的table组件滚动加载

```
<!-- 使用table需设置max-height或height -->
<el-table
  v-elTableScrollLoad="{ 
    load: load, 
    loadEnd: tableloadStatus,
    loadingText:'loading...'
    loadendText:'no more'
  }"
  :max-height="scrollHeight"
  :data="tableData"
>
</el-table>
```
> 指令配置说明
```
 v-elTableScrollLoad="{ 
  load: load, // 加载数据回调函数 必填
  loadEnd: tableloadStatus, // 是否加载完成标志 Boolean 必填
  loadingText:'loading...' //  加载中文字  string 非必填
  loadendText:'no more'  //   加载完成文字  string 非必填
}"
```