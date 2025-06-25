# Vite + React + Three.js 项目搭建指南

我将为你创建一个完整的Vite + React + Three.js项目模板，包含基础场景、灯光、模型加载和交互功能。

## 项目搭建流程

### 1. 创建Vite项目
```bash
npm create vite@latest my-threejs-project -- --template react
cd my-threejs-project
npm install
```

### 2. 安装Three.js依赖
```bash
npm install three @react-three/fiber @react-three/drei
```

### 3. 项目结构
```
src/
├── components/
│   ├── Scene.jsx
│   ├── Box.jsx
│   ├── Sphere.jsx
│   └── Controls.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 完整代码实现

### 1. src/index.css
```css
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  color: white;
  overflow: hidden;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
}

.container {
  display: flex;
  flex: 1;
}

.canvas-container {
  flex: 1;
  position: relative;
}

.controls-panel {
  width: 300px;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  overflow-y: auto;
}

.control-group {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.control-group h3 {
  margin-top: 0;
  color: #fdbb2d;
}

button {
  background: #4a5568;
  color: white;
  border: none;
  padding: 8px 15px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #2d3748;
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

.footer {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  font-size: 0.9rem;
}
```

### 2. src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3. src/App.jsx
```jsx
import React, { useState } from 'react'
import Scene from './components/Scene'
import Controls from './components/Controls'

function App() {
  const [sceneState, setSceneState] = useState({
    backgroundColor: '#1a1a2e',
    ambientLight: 0.5,
    directionalLight: 0.8,
    showBox: true,
    showSphere: true,
    boxColor: '#00ff9d',
    sphereColor: '#ff2975',
    rotationSpeed: 0.01,
    wireframe: false
  })

  return (
    <div className="app">
      <header className="header">
        <h1>Vite + React + Three.js Starter</h1>
        <p>Interactive 3D Scene with React Three Fiber</p>
      </header>
      
      <div className="container">
        <div className="canvas-container">
          <Scene sceneState={sceneState} />
        </div>
        
        <div className="controls-panel">
          <Controls sceneState={sceneState} setSceneState={setSceneState} />
        </div>
      </div>
      
      <footer className="footer">
        <p>Built with Vite, React and Three.js | {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
```

### 4. src/components/Scene.jsx
```jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Box from './Box'
import Sphere from './Sphere'

const Scene = ({ sceneState }) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{ background: sceneState.backgroundColor }}
    >
      <ambientLight intensity={sceneState.ambientLight} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={sceneState.directionalLight} 
        castShadow
      />
      
      {sceneState.showBox && (
        <Box 
          position={[-2, 0, 0]} 
          color={sceneState.boxColor} 
          rotationSpeed={sceneState.rotationSpeed}
          wireframe={sceneState.wireframe}
        />
      )}
      
      {sceneState.showSphere && (
        <Sphere 
          position={[2, 0, 0]} 
          color={sceneState.sphereColor} 
          rotationSpeed={sceneState.rotationSpeed}
          wireframe={sceneState.wireframe}
        />
      )}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
      <Environment preset="city" />
    </Canvas>
  )
}

export default Scene
```

### 5. src/components/Box.jsx
```jsx
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Box = ({ position, color, rotationSpeed, wireframe }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed
    }
  })
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

export default Box
```

### 6. src/components/Sphere.jsx
```jsx
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Sphere = ({ position, color, rotationSpeed, wireframe }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
    }
  })
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

export default Sphere
```

### 7. src/components/Controls.jsx
```jsx
import React from 'react'

const Controls = ({ sceneState, setSceneState }) => {
  const handleChange = (key, value) => {
    setSceneState(prev => ({ ...prev, [key]: value }))
  }
  
  const toggleObject = (object) => {
    setSceneState(prev => ({ ...prev, [object]: !prev[object] }))
  }
  
  const resetScene = () => {
    setSceneState({
      backgroundColor: '#1a1a2e',
      ambientLight: 0.5,
      directionalLight: 0.8,
      showBox: true,
      showSphere: true,
      boxColor: '#00ff9d',
      sphereColor: '#ff2975',
      rotationSpeed: 0.01,
      wireframe: false
    })
  }
  
  return (
    <div className="controls">
      <div className="control-group">
        <h3>Scene Controls</h3>
        <button onClick={() => toggleObject('showBox')}>
          {sceneState.showBox ? 'Hide Box' : 'Show Box'}
        </button>
        <button onClick={() => toggleObject('showSphere')}>
          {sceneState.showSphere ? 'Hide Sphere' : 'Show Sphere'}
        </button>
        <button onClick={() => toggleObject('wireframe')}>
          {sceneState.wireframe ? 'Solid Mode' : 'Wireframe Mode'}
        </button>
        <button onClick={resetScene}>Reset Scene</button>
      </div>
      
      <div className="control-group">
        <h3>Lighting</h3>
        <label>
          Ambient Light: {sceneState.ambientLight.toFixed(2)}
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={sceneState.ambientLight}
            onChange={(e) => handleChange('ambientLight', parseFloat(e.target.value))}
          />
        </label>
        
        <label>
          Directional Light: {sceneState.directionalLight.toFixed(2)}
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.01" 
            value={sceneState.directionalLight}
            onChange={(e) => handleChange('directionalLight', parseFloat(e.target.value))}
          />
        </label>
      </div>
      
      <div className="control-group">
        <h3>Colors</h3>
        <label>
          Background:
          <input 
            type="color" 
            value={sceneState.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </label>
        
        <label>
          Box Color:
          <input 
            type="color" 
            value={sceneState.boxColor}
            onChange={(e) => handleChange('boxColor', e.target.value)}
          />
        </label>
        
        <label>
          Sphere Color:
          <input 
            type="color" 
            value={sceneState.sphereColor}
            onChange={(e) => handleChange('sphereColor', e.target.value)}
          />
        </label>
      </div>
      
      <div className="control-group">
        <h3>Animation</h3>
        <label>
          Rotation Speed: {sceneState.rotationSpeed.toFixed(3)}
          <input 
            type="range" 
            min="0" 
            max="0.05" 
            step="0.001" 
            value={sceneState.rotationSpeed}
            onChange={(e) => handleChange('rotationSpeed', parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}

export default Controls
```

## 项目功能说明

这个Vite + React + Three.js项目包含以下功能：

1. **基础场景**：
   - 使用@react-three/fiber创建3D场景
   - 环境光和方向光设置
   - 轨道控制器实现场景旋转

2. **3D对象**：
   - 立方体（Box）和球体（Sphere）
   - 材质和颜色自定义
   - 自动旋转动画

3. **交互控制面板**：
   - 显示/隐藏对象
   - 调整光照强度
   - 修改对象颜色
   - 控制旋转速度
   - 切换线框模式
   - 重置场景功能

4. **响应式设计**：
   - 自适应屏幕尺寸
   - 控制面板可折叠

## 运行项目

```bash
npm run dev
```

项目将在 http://localhost:5173 运行

## 项目特点

1. **现代工具链**：使用Vite作为构建工具，提供极快的开发体验
2. **组件化结构**：将3D对象封装为React组件
3. **状态管理**：使用React状态管理场景参数
4. **交互控制**：提供直观的控制面板调整场景参数
5. **响应式设计**：适应不同屏幕尺寸

这个项目为Three.js初学者提供了一个良好的起点，包含了基本场景设置、对象创建和交互控制功能，你可以在此基础上继续扩展更复杂的功能。