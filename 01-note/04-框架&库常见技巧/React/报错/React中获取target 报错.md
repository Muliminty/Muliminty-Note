# Warning: This synthetic event is reused for performance reasons.

（报错信息Warning: This synthetic event is reused for performance reasons.）

```JSX
//在change事件之前加上  e.persist()
change(e){
e.persist()
}
```
