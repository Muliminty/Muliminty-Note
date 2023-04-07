## 解决方案

> 在路由组件上最上层元素上加一个key增加路由的识别度 
> this.props.location.key


```jsx
 // 组件挂载
  componentDidMount() {
    console.log(this.props.location);
  }

```


![image.png](https://cdn.nlark.com/yuque/0/2022/png/12539472/1654680693048-09fa00a7-bb34-402e-9a47-c123de9f63ae.png#clientId=u505c539f-2bbe-4&from=paste&height=284&id=uc4fb43e9&name=image.png&originHeight=284&originWidth=382&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22549&status=done&style=none&taskId=u1f0f75dc-8095-43dc-9c87-214049ce7de&title=&width=382)


```jsx
			

  <div className={style.content} key={this.props.location.key}>
				<CSSTransition
					key={this.props.location.pathname}>
					<Switch location={this.props.location}>
						{routes.map(r => (
							<Route key={r.key} supKey={r.supKey} path={r.path} exact={r.exact} component={r.component} />
						))}
					</Switch>
				</CSSTransition>
			</div>
```
