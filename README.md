# AI Blueprint - 蓝图编辑器

> **写给编程小白的完整指南**：本文档将带你从零开始理解这个项目，即使你从未接触过 React 也能看懂。
>
> **阅读方式**：文档分为三个层次——速读（5分钟了解项目）、粗读（30分钟理解架构）、精读（深入每行代码）。
>
> **学习建议**：先完整看一遍速读部分，对项目有整体印象后，再根据需要深入阅读后面的内容。

---

# 第一部分：速读（5分钟了解项目）

## 1.1 这是什么项目？

这是一个**蓝图编辑器**（Blueprint Editor）。

**什么是蓝图编辑器？**

蓝图编辑器是一种可视化编程工具。在传统编程中，你需要写代码来实现功能。而在蓝图编辑器中，你通过以下方式来构建程序：

1. **拖拽节点**：每个节点代表一个功能或操作
2. **连接节点**：用线条连接节点，表示数据的流向
3. **配置参数**：设置每个节点的参数

**这个项目的具体功能**：

- 左侧有一个节点面板，显示所有可用的节点类型
- 右侧是画布区域，你可以在这里放置和连接节点
- 每个节点有输入端口（左侧）和输出端口（右侧）
- 节点之间可以用连线连接，表示数据从一个节点流向另一个节点

---

## 1.2 项目能做什么？

**界面布局**：

打开这个应用后，你会看到：
- **左边**：节点面板，显示所有可用的节点，按分类组织
- **右边**：画布区域，用于放置和连接节点

**基本操作**：

| 操作 | 方法 | 说明 |
|------|------|------|
| 添加节点 | 从左侧面板拖拽到画布 | 节点会出现在鼠标释放的位置 |
| 移动节点 | 鼠标左键拖拽节点 | 节点会跟随鼠标移动 |
| 连接节点 | 从输出端口拖拽到输入端口 | 会创建一条连线 |
| 删除节点 | 选中后按 Delete 键 | 节点和相关连线都会被删除 |
| 框选多个节点 | 鼠标左键拖拽空白区域 | 框内的节点都会被选中 |
| 平移画布 | 鼠标中键或右键拖拽 | 画布会跟随移动 |
| 缩放画布 | 鼠标滚轮 | 画布会放大或缩小 |

**右键菜单功能**：

右键点击节点会弹出菜单，包含三个选项：
1. **复制粘贴**：在原位置偏移一点创建节点副本
2. **删除节点**：删除选中的节点
3. **重命名**：修改节点的显示名称

**键盘快捷键**：

| 快捷键 | 功能 |
|--------|------|
| Ctrl+Z | 撤销上一步操作 |
| Ctrl+Y | 重做被撤销的操作 |
| Ctrl+Shift+Z | 重做（另一种方式） |
| Ctrl+C | 复制选中的节点 |
| Ctrl+V | 在鼠标位置粘贴节点 |
| Delete | 删除选中的节点 |

**双击节点**：

双击节点可以打开重命名弹窗，修改节点的显示名称。

---

## 1.3 用了哪些技术？

| 技术 | 版本 | 作用 |
|------|------|------|
| **React** | 19.2.0 | JavaScript 库，用于构建用户界面。React 让你可以把界面拆分成独立的组件，每个组件负责一部分功能。 |
| **Vite** | 7.2.4 | 前端构建工具。它负责把你写的代码打包成浏览器能运行的文件，并且在开发时提供热更新功能（修改代码后自动刷新页面）。 |
| **React Flow** | 12.10.0 | React 库，专门用于构建节点式编辑器。它提供了画布、节点、连线、缩放、拖拽等功能。 |
| **HeroUI** | 3.0.0-beta.3 | UI 组件库，提供了按钮、输入框、开关等预制组件，让界面开发更快。 |
| **Tailwind CSS** | 4.0.0 | CSS 框架，提供了大量预定义的 CSS 类，可以快速设置样式。 |

**这些技术的关系**：

```
Vite（构建工具）
  └── 打包和运行以下代码：
      ├── React（界面框架）
      │     └── 使用以下库：
      │           ├── React Flow（画布和节点功能）
      │           ├── HeroUI（UI 组件）
      │           └── Tailwind CSS（样式）
      └── 你写的业务代码
```

---

## 1.4 如何运行项目？

**前提条件**：

在运行项目之前，你需要确保电脑上已经安装了以下软件：

| 软件 | 说明 | 安装方法 |
|------|------|----------|
| Node.js | JavaScript 运行环境 | 从 https://nodejs.org 下载安装 |
| Yarn | 包管理工具 | 安装 Node.js 后，运行 `npm install -g yarn` |

**运行步骤**：

```bash
# 第1步：打开终端（命令行）
# Windows: 按 Win+R，输入 cmd，回车
# Mac: 按 Cmd+空格，输入 Terminal，回车

# 第2步：进入项目目录
cd d:/kernyr/react/ai-blueprint

# 第3步：安装依赖（只需要运行一次）
# 这个命令会读取 package.json 文件，下载所有需要的库
yarn install

# 第4步：启动开发服务器
yarn dev

# 第5步：打开浏览器
# 在浏览器地址栏输入 http://localhost:5173 并回车
```

**什么是"安装依赖"？**

项目使用了很多第三方库（React、React Flow 等），这些库的代码不在项目文件夹里。`yarn install` 命令会根据 `package.json` 文件中列出的依赖，从网上下载这些库到 `node_modules` 文件夹中。

**什么是"开发服务器"？**

开发服务器是一个在你电脑上运行的程序，它做以下事情：
1. 把你写的代码打包成浏览器能运行的格式
2. 启动一个本地网站（localhost:5173）
3. 监听文件变化，当你修改代码时自动刷新页面（这个功能叫"热更新"）

---

## 1.5 项目文件结构

```
ai-blueprint/                    ← 项目根目录
├── package.json                 ← 项目配置文件，列出所有依赖
├── vite.config.js              ← Vite 构建工具的配置
├── index.html                  ← HTML 入口文件
├── public/                     ← 静态资源目录
│   └── vite.svg               ← 网站图标
└── src/                        ← 源代码目录（你主要修改这里的文件）
    ├── main.jsx               ← 应用入口文件
    ├── App.jsx                ← 主组件
    ├── App.css                ← 主组件样式
    ├── index.css              ← 全局样式
    ├── assets/                ← 图片、图标等资源
    │   ├── logo.svg
    │   ├── category/          ← 分类图标
    │   ├── ContextMenu/       ← 右键菜单图标
    │   └── ToolBar/           ← 工具栏图标
    ├── components/            ← UI 组件
    │   ├── BaseNode.jsx       ← 节点组件
    │   ├── BaseNode.css
    │   ├── NodeBox.jsx        ← 左侧节点面板
    │   ├── NodeBox.css
    │   ├── NodeContextMenu.jsx ← 右键菜单
    │   ├── NodeContextMenu.css
    │   ├── PropertyPanel.jsx  ← 属性面板
    │   ├── PropertyPanel.css
    │   ├── RenameModal.jsx    ← 重命名弹窗
    │   └── RenameModal.css
    ├── hooks/                 ← 自定义钩子（功能逻辑）
    │   ├── useHistory.js      ← 撤销/重做功能
    │   ├── useClipboard.js    ← 复制/粘贴功能
    │   ├── useKeyboardShortcuts.js ← 键盘快捷键
    │   ├── useContextMenu.js  ← 右键菜单控制
    │   ├── usePropertyPanel.js ← 属性面板控制
    │   ├── useRename.js       ← 重命名功能
    │   ├── useNodeActions.js  ← 节点操作
    │   └── useFlowEvents.js   ← 画布事件处理
    ├── config/                ← 配置文件
    │   ├── flowConfig.js      ← 画布配置
    │   └── initialData.js     ← 初始数据
    ├── constants/             ← 常量定义
    │   └── nodeRegistry.js    ← 节点注册表
    └── utils/                 ← 工具函数
        ├── createNode.js      ← 创建节点
        └── positionUtils.js   ← 位置计算
```

**文件夹说明**：

| 文件夹 | 作用 | 什么时候修改 |
|--------|------|-------------|
| `components/` | 存放 UI 组件，每个组件是一个 .jsx 文件和对应的 .css 文件 | 需要修改界面外观时 |
| `hooks/` | 存放自定义钩子，每个钩子封装一个功能 | 需要修改功能逻辑时 |
| `config/` | 存放配置信息 | 需要修改画布设置或初始数据时 |
| `constants/` | 存放常量定义 | 需要添加新节点类型时 |
| `utils/` | 存放工具函数 | 需要添加通用功能时 |
| `assets/` | 存放图片、图标等资源 | 需要添加或修改图标时 |

---

## 1.6 速读总结

完成速读部分后，你应该了解：

| 知识点 | 内容 |
|--------|------|
| 项目类型 | 蓝图编辑器，用于可视化编程 |
| 核心功能 | 拖拽节点、连接节点、配置参数 |
| 技术栈 | React + Vite + React Flow + HeroUI + Tailwind CSS |
| 代码组织 | 组件（components）、钩子（hooks）、配置（config）、常量（constants）、工具（utils） |
| 启动命令 | `yarn install` 安装依赖，`yarn dev` 启动开发服务器 |

**下一步阅读建议**：

- 如果你想**快速修改代码**：直接跳到第三部分（精读），查看具体文件的代码解释
- 如果你想**系统学习 React**：继续阅读第二部分（粗读），学习 React 核心概念

---

# 第二部分：粗读（30分钟理解架构）

> 这部分会教你 React 的核心概念，并解释项目的整体设计思路。
> 读完这部分，你就能理解代码是如何组织的，为什么要这样设计。

---

## 2.0 JavaScript 基础知识（必读前置）

> **重要提示**：如果你对 JavaScript 不熟悉，请务必先阅读这一节。
> React 是基于 JavaScript 的，不理解 JS 基础就无法理解 React 代码。

### 2.0.1 变量声明：const、let、var

JavaScript 有三种声明变量的方式：

```javascript
// const：声明常量，值不能被重新赋值
const name = "小明";
name = "小红";  // ❌ 错误！const 声明的变量不能重新赋值

// let：声明变量，值可以被重新赋值
let age = 18;
age = 19;  // ✅ 正确

// var：旧的声明方式，不推荐使用
var oldWay = "不推荐";
```

**在 React 中的使用**：
- `const` 用于声明组件、函数、不会重新赋值的变量
- `let` 用于需要重新赋值的变量（但在 React 中很少用，因为状态用 useState）
- `var` 基本不用

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "const 声明的对象不能修改" | **错误**！const 只是不能重新赋值，但对象的属性可以修改。`const obj = {}; obj.name = "test";` 是合法的。 |
| "let 和 var 一样" | **错误**！let 有块级作用域，var 没有。在 for 循环中用 var 会有问题。 |

---

### 2.0.2 箭头函数

箭头函数是 ES6 引入的简洁函数写法：

```javascript
// 传统函数写法
function add(a, b) {
  return a + b;
}

// 箭头函数写法
const add = (a, b) => {
  return a + b;
};

// 如果函数体只有一行 return，可以省略大括号和 return
const add = (a, b) => a + b;

// 如果只有一个参数，可以省略括号
const double = x => x * 2;

// 没有参数时，括号不能省略
const sayHello = () => console.log("Hello");
```

**在 React 中的使用**：

```jsx
// 事件处理函数
<button onClick={() => setCount(count + 1)}>点击</button>

// 数组方法的回调
const doubled = numbers.map(n => n * 2);

// 组件定义
const MyComponent = () => {
  return <div>Hello</div>;
};
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "箭头函数和普通函数完全一样" | **错误**！箭头函数没有自己的 `this`，它会继承外层的 `this`。在 React 中这通常是好事。 |
| "箭头函数必须有 return" | **错误**！单行箭头函数可以省略 return，如 `x => x * 2`。 |

---

### 2.0.3 解构赋值

解构赋值是从数组或对象中提取值的简洁语法：

**数组解构**：

```javascript
// 传统写法
const arr = [1, 2, 3];
const first = arr[0];
const second = arr[1];

// 解构写法
const [first, second, third] = [1, 2, 3];
// first = 1, second = 2, third = 3

// 在 React 中最常见的用法：useState
const [count, setCount] = useState(0);
// useState 返回一个数组 [当前值, 设置函数]
// 解构后 count = 当前值, setCount = 设置函数
```

**对象解构**：

```javascript
// 传统写法
const person = { name: "小明", age: 18 };
const name = person.name;
const age = person.age;

// 解构写法
const { name, age } = { name: "小明", age: 18 };
// name = "小明", age = 18

// 在 React 中最常见的用法：props 解构
function Greeting({ name, age }) {  // 直接在参数中解构
  return <div>你好，{name}，你 {age} 岁了</div>;
}

// 等同于
function Greeting(props) {
  const { name, age } = props;
  return <div>你好，{name}，你 {age} 岁了</div>;
}
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "解构时变量名可以随便取" | 对象解构时变量名必须和属性名一致（除非用重命名语法 `{ name: myName }`）。数组解构可以随便取名。 |
| "解构会修改原对象/数组" | **错误**！解构只是提取值，不会修改原数据。 |

---

### 2.0.4 展开运算符（...）

展开运算符 `...` 可以展开数组或对象：

**数组展开**：

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// 复制数组
const copy = [...arr1];  // [1, 2, 3]

// 添加元素
const withNew = [...arr1, 4];  // [1, 2, 3, 4]
```

**对象展开**：

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// 合并对象
const combined = { ...obj1, ...obj2 };  // { a: 1, b: 2, c: 3, d: 4 }

// 复制对象
const copy = { ...obj1 };  // { a: 1, b: 2 }

// 修改部分属性（创建新对象）
const updated = { ...obj1, b: 100 };  // { a: 1, b: 100 }
```

**在 React 中的使用**：

```jsx
// 更新状态时创建新对象
setUser({ ...user, name: "新名字" });

// 传递所有 props
<ChildComponent {...props} />

// 添加新节点到数组
setNodes([...nodes, newNode]);
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "展开运算符会深拷贝" | **错误**！展开运算符只做浅拷贝。嵌套对象仍然是引用。 |
| "展开顺序不重要" | **错误**！后面的属性会覆盖前面的。`{ ...obj, a: 1 }` 和 `{ a: 1, ...obj }` 结果可能不同。 |

---

### 2.0.5 数组方法：map、filter、find、some

这些方法在 React 中非常常用：

**map：转换数组中的每个元素**

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6]

// 在 React 中：渲染列表
const items = ['苹果', '香蕉', '橙子'];
return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

**filter：筛选数组**

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// 在 React 中：删除节点
setNodes(nodes.filter(node => node.id !== deleteId));
```

**find：查找第一个符合条件的元素**

```javascript
const users = [
  { id: 1, name: '小明' },
  { id: 2, name: '小红' },
];
const user = users.find(u => u.id === 2);  // { id: 2, name: '小红' }

// 在 React 中：根据 ID 查找节点
const node = nodes.find(n => n.id === nodeId);
```

**some：检查是否有元素符合条件**

```javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(n => n % 2 === 0);  // true

// 在 React 中：检查节点是否被选中
const hasSelected = nodes.some(n => n.selected);
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "map 会修改原数组" | **错误**！map 返回新数组，原数组不变。filter、find 也一样。 |
| "find 返回所有符合条件的元素" | **错误**！find 只返回第一个。要返回所有，用 filter。 |
| "map 的回调必须 return" | 是的！如果忘记 return，结果数组会是 `[undefined, undefined, ...]`。 |

---

### 2.0.6 模板字符串

模板字符串使用反引号 `` ` ``，可以嵌入变量：

```javascript
const name = "小明";
const age = 18;

// 传统写法
const message = "你好，" + name + "，你 " + age + " 岁了";

// 模板字符串写法
const message = `你好，${name}，你 ${age} 岁了`;

// 可以嵌入任何表达式
const message = `1 + 1 = ${1 + 1}`;  // "1 + 1 = 2"

// 在 React 中：动态生成 ID
const newId = `node-${nodeIdCounter.current++}`;
```

---

### 2.0.7 可选链（?.）和空值合并（??）

**可选链 `?.`**：安全地访问可能不存在的属性

```javascript
const user = { name: "小明", address: { city: "北京" } };

// 传统写法（需要多次判断）
const city = user && user.address && user.address.city;

// 可选链写法
const city = user?.address?.city;  // "北京"

// 如果中间任何一个是 null/undefined，返回 undefined 而不是报错
const user2 = null;
const city2 = user2?.address?.city;  // undefined（不会报错）

// 在 React 中：安全访问可能不存在的数据
const height = nodeData.measured?.height || 100;
```

**空值合并 `??`**：提供默认值

```javascript
// ?? 只在值为 null 或 undefined 时使用默认值
const value1 = null ?? "默认值";     // "默认值"
const value2 = undefined ?? "默认值"; // "默认值"
const value3 = 0 ?? "默认值";         // 0（0 不是 null/undefined）
const value4 = "" ?? "默认值";        // ""（空字符串不是 null/undefined）

// 对比 ||：|| 在值为"假值"时使用默认值
const value5 = 0 || "默认值";         // "默认值"（0 是假值）
const value6 = "" || "默认值";        // "默认值"（空字符串是假值）

// 在 React 中：提供默认值
const label = data.label ?? "未命名节点";
const currentValue = paramValues[paramKey] ?? paramConfig.default;
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "`??` 和 `那个两个竖杠` 一样" | **错误**！`??` 只对 null/undefined 生效，`那个两个竖杠` 对所有假值（0, "", false, null, undefined）生效。 |
| "`?.` 可以用于赋值" | **错误**！`?.` 只能用于读取，不能用于赋值。`obj?.prop = 1` 是错误的。 |

---

### 2.0.8 import 和 export

JavaScript 模块系统用于在文件之间共享代码：

**导出（export）**：

```javascript
// 命名导出（一个文件可以有多个）
export const PI = 3.14;
export function add(a, b) { return a + b; }
export const MyComponent = () => <div>Hello</div>;

// 默认导出（一个文件只能有一个）
export default function App() {
  return <div>App</div>;
}
```

**导入（import）**：

```javascript
// 导入命名导出（必须用大括号，名字必须一致）
import { PI, add, MyComponent } from './utils';

// 导入默认导出（不用大括号，名字可以随便取）
import App from './App';
import MyApp from './App';  // 名字可以不同

// 同时导入默认和命名导出
import App, { PI, add } from './module';

// 导入所有命名导出
import * as utils from './utils';
// 使用：utils.PI, utils.add()
```

**在本项目中的使用**：

```javascript
// 导入 React 的命名导出
import { useState, useEffect, useRef } from 'react';

// 导入默认导出的组件
import App from './App';
import BaseNode from './components/BaseNode';

// 导入配置
import { FLOW_CONFIG, CONTAINER_STYLE } from './config/flowConfig';
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "导入时名字可以随便取" | 只有默认导出可以。命名导出必须用原名（除非用 `as` 重命名）。 |
| "import 可以放在任何地方" | **错误**！import 必须放在文件顶部，不能放在 if 或函数里。 |

---

## 2.1 React 基础概念

### 2.1.1 什么是 React？

React 是一个 JavaScript 库，由 Facebook（现 Meta）开发，用于构建用户界面。

**React 的核心思想是"组件化"**：

传统的网页开发方式是把 HTML、CSS、JavaScript 分开写，然后通过 ID 或类名关联起来。这种方式在项目变大后会变得难以维护，因为相关的代码分散在不同的文件里。

React 的做法是把界面拆分成一个个独立的"组件"（Component），每个组件包含自己的 HTML 结构、样式和逻辑。这样做的好处是：

1. **代码组织清晰**：相关的代码放在一起，容易找到和修改
2. **可复用**：一个组件可以在多个地方使用
3. **独立开发**：不同的人可以同时开发不同的组件，互不影响
4. **易于测试**：每个组件可以单独测试

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "React 是一个框架" | React 是一个**库**（Library），不是框架（Framework）。库是你调用它，框架是它调用你。React 只负责 UI 渲染，路由、状态管理等需要额外的库。 |
| "React 会自动优化性能" | React 只是让 DOM 更新更高效，但你仍然需要注意避免不必要的重新渲染。 |
| "学 React 必须先学 JavaScript" | 是的，这是正确的！React 是 JavaScript 库，你需要先掌握 JS 基础（变量、函数、数组、对象）。 |

### 2.1.2 什么是组件（Component）？

在 React 中，组件是一个 JavaScript 函数，这个函数返回一段描述界面的代码（叫做 JSX）。

**JSX 是什么？**

JSX 是 JavaScript XML 的缩写，它是一种语法扩展，让你可以在 JavaScript 代码中写类似 HTML 的结构。

```jsx
// 这是 JSX 代码
const element = <div className="box">Hello</div>;

// 它会被编译成这样的 JavaScript 代码
const element = React.createElement('div', { className: 'box' }, 'Hello');
```

**最简单的组件**：

```jsx
// 这是一个最简单的组件
// 组件名必须以大写字母开头
function HelloWorld() {
  // return 后面的内容就是 JSX，描述这个组件长什么样
  return <div>Hello, World!</div>;
}
```

**组件可以接收参数（叫做 props）**：

```jsx
// { name } 是从 props 中解构出 name 属性
// 这种写法叫做"解构赋值"，等同于 function Greeting(props) { const name = props.name; ... }
function Greeting({ name }) {
  // 在 JSX 中，用 {} 包裹的内容会被当作 JavaScript 表达式执行
  return <div>你好，{name}！</div>;
}

// 使用组件时，通过属性传递数据
// 这里 name="小明" 就是传递给 Greeting 组件的 props
<Greeting name="小明" />  // 页面上会显示：你好，小明！
```

**组件可以嵌套使用**：

```jsx
// 一个组件可以包含其他组件
function App() {
  return (
    <div>
      <Greeting name="小明" />
      <Greeting name="小红" />
      <Greeting name="小刚" />
    </div>
  );
}
// 页面上会显示：
// 你好，小明！
// 你好，小红！
// 你好，小刚！
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "组件名可以小写" | 组件名**必须**以大写字母开头。小写开头会被当作 HTML 标签处理，导致错误。 |
| "JSX 就是 HTML" | JSX 不是 HTML，它是 JavaScript 的语法扩展。有些属性名不同，如 `class` 要写成 `className`，`for` 要写成 `htmlFor`。 |
| "props 可以在组件内修改" | props 是**只读**的，不能在组件内修改。如果需要可变数据，应该使用 state。 |
| "组件每次调用都是独立的" | 是的，这是正确的！每次渲染组件都会创建新的函数作用域，变量不会共享。 |

**JSX 与 HTML 的区别**：

| HTML | JSX | 说明 |
|------|-----|------|
| `class="box"` | `className="box"` | class 是 JS 保留字 |
| `for="input"` | `htmlFor="input"` | for 是 JS 保留字 |
| `onclick="fn()"` | `onClick={fn}` | 事件名用驼峰命名 |
| `<input>` | `<input />` | 必须闭合标签 |
| `style="color: red"` | `style={{ color: 'red' }}` | style 接收对象 |

### 2.1.3 什么是状态（State）？

**状态的定义**：

状态（State）是组件用来存储数据的地方。这些数据可能会随着用户操作而改变。

**为什么需要状态？**

在普通的 JavaScript 中，如果你想让页面上的数字变化，你需要：
1. 找到显示数字的 DOM 元素
2. 修改它的内容

```javascript
// 普通 JavaScript 的做法
let count = 0;
document.getElementById('counter').innerText = count;

function increment() {
  count++;
  document.getElementById('counter').innerText = count;  // 每次都要手动更新 DOM
}
```

在 React 中，你只需要修改状态，React 会自动更新页面：

```jsx
// React 的做法
import { useState } from 'react';

function Counter() {
  // useState 是一个函数，它接收一个参数（初始值），返回一个数组
  // 数组的第一个元素是当前值，第二个元素是修改值的函数
  // 这里使用了"数组解构"语法，把数组的两个元素分别赋值给 count 和 setCount
  const [count, setCount] = useState(0);
  
  // 当 count 变化时，React 会自动重新执行这个函数，更新页面
  return (
    <div>
      <p>你点击了 {count} 次</p>
      {/* onClick 是点击事件，当按钮被点击时执行 */}
      {/* () => setCount(count + 1) 是一个箭头函数，调用 setCount 把 count 加 1 */}
      <button onClick={() => setCount(count + 1)}>
        点我 +1
      </button>
    </div>
  );
}
```

**useState 的工作原理**：

```
第一次渲染：
useState(0) → 返回 [0, setCount]
页面显示：你点击了 0 次

用户点击按钮：
setCount(0 + 1) 被调用
React 检测到状态变化

第二次渲染：
useState(0) → 返回 [1, setCount]  （注意：初始值 0 被忽略，返回新值 1）
页面显示：你点击了 1 次
```

**重要规则**：

1. **不要直接修改状态**：
```jsx
// 错误做法
count = count + 1;  // 这样不会触发重新渲染

// 正确做法
setCount(count + 1);  // 必须通过 setCount 函数修改
```

2. **状态更新是异步的**：
```jsx
setCount(count + 1);
console.log(count);  // 这里打印的还是旧值，因为状态更新是异步的
```

3. **每次渲染都有自己的状态**：
```jsx
// 每次组件函数执行时，count 都是那一次渲染时的值
// 不会因为后续的状态更新而改变
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "直接修改状态变量就能更新界面" | **错误**！必须使用 `setState` 函数。直接修改变量（如 `count = 5`）不会触发重新渲染。 |
| "setState 后立即能拿到新值" | **错误**！状态更新是异步的。`setState` 后立即读取状态，拿到的还是旧值。 |
| "可以在循环或条件语句中使用 useState" | **错误**！钩子必须在组件顶层调用，不能在 if/for 中使用。 |
| "状态变化后组件会立即重新渲染" | 不完全正确。React 会批量处理状态更新，可能合并多次 setState。 |

**状态更新的正确方式**：

```jsx
// ❌ 错误：直接修改状态
count = count + 1;

// ✅ 正确：使用 setState 函数
setCount(count + 1);

// ❌ 错误：连续调用 setState 期望累加
setCount(count + 1);
setCount(count + 1);  // 结果只加1，因为两次 count 都是旧值

// ✅ 正确：使用函数式更新
setCount(prev => prev + 1);
setCount(prev => prev + 1);  // 结果加2，因为 prev 是最新值
```

---

### 2.1.4 什么是钩子（Hook）？

**钩子的定义**：

钩子（Hook）是 React 提供的特殊函数，让你能在函数组件中使用各种功能。

**为什么叫"钩子"？**

因为这些函数可以让你"钩入"（hook into）React 的内部机制。比如 `useState` 让你钩入状态管理，`useEffect` 让你钩入组件的生命周期。

**钩子的命名规则**：

所有钩子都以 `use` 开头，这是 React 的命名约定。当你看到一个以 `use` 开头的函数，就知道它是一个钩子。

**常用的内置钩子**：

| 钩子 | 作用 | 什么时候用 |
|------|------|-----------|
| `useState` | 管理状态 | 需要存储会变化的数据时 |
| `useEffect` | 处理副作用 | 需要在组件渲染后执行操作时（如获取数据、添加事件监听） |
| `useRef` | 保存不触发渲染的值 | 需要保存数据但不想触发重新渲染时 |
| `useCallback` | 缓存函数 | 需要把函数传给子组件，避免子组件不必要的重新渲染时 |
| `useMemo` | 缓存计算结果 | 有复杂计算，不想每次渲染都重新计算时 |

**自定义钩子**：

你可以把相关的逻辑封装成自定义钩子，方便复用。自定义钩子就是一个以 `use` 开头的函数，内部可以使用其他钩子。

```jsx
// 自定义钩子示例：管理计数器
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// 使用自定义钩子
function MyComponent() {
  const { count, increment, decrement, reset } = useCounter(10);
  // ...
}
```

本项目的 `hooks/` 目录下有 8 个自定义钩子，每个负责一个功能模块：

| 钩子文件 | 功能 |
|----------|------|
| `useHistory.js` | 撤销/重做功能 |
| `useClipboard.js` | 复制/粘贴功能 |
| `useKeyboardShortcuts.js` | 键盘快捷键 |
| `useContextMenu.js` | 右键菜单控制 |
| `usePropertyPanel.js` | 属性面板控制 |
| `useRename.js` | 重命名功能 |
| `useNodeActions.js` | 节点操作（复制、删除） |
| `useFlowEvents.js` | 画布事件处理 |

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "钩子可以在任何地方调用" | **错误**！钩子只能在函数组件的顶层调用，不能在 if/for/嵌套函数中调用。 |
| "钩子的调用顺序可以变化" | **错误**！React 依赖钩子的调用顺序来正确关联状态。每次渲染必须以相同顺序调用相同数量的钩子。 |
| "自定义钩子必须返回数组" | **错误**！自定义钩子可以返回任何值：对象、数组、单个值，甚至不返回。 |
| "use 开头的函数都是钩子" | 不完全正确。只有内部使用了其他钩子的 `use` 开头函数才是钩子。普通函数以 `use` 开头只是命名习惯。 |

**钩子规则详解**：

```jsx
// ❌ 错误：在条件语句中使用钩子
function BadComponent({ showCount }) {
  if (showCount) {
    const [count, setCount] = useState(0);  // 错误！
  }
  // ...
}

// ✅ 正确：钩子在顶层，条件在钩子内部
function GoodComponent({ showCount }) {
  const [count, setCount] = useState(0);  // 正确！
  
  if (showCount) {
    return <div>{count}</div>;
  }
  return null;
}

// ❌ 错误：在循环中使用钩子
function BadList({ items }) {
  items.forEach(item => {
    const [value, setValue] = useState(item);  // 错误！
  });
}

// ✅ 正确：把循环内的逻辑提取成子组件
function GoodList({ items }) {
  return items.map(item => <ListItem key={item.id} item={item} />);
}

function ListItem({ item }) {
  const [value, setValue] = useState(item);  // 正确！每个组件有自己的状态
  return <div>{value}</div>;
}
```

**为什么有这些规则？**

React 内部使用数组来存储每个组件的钩子状态。每次渲染时，React 按顺序遍历这个数组：

```
第一次渲染：
useState(0)  → 数组[0] = 0
useState('')  → 数组[1] = ''
useEffect(...) → 数组[2] = effect

第二次渲染：
useState(0)  → 读取数组[0]
useState('')  → 读取数组[1]
useEffect(...) → 读取数组[2]
```

如果钩子调用顺序变化，数组索引就会错乱，导致状态混乱。

---

### 2.1.5 useEffect 详解

**什么是副作用？**

在 React 中，组件的主要职责是根据数据渲染界面。除此之外的操作都叫"副作用"（Side Effect），比如：

- 获取数据（调用 API）
- 添加/移除事件监听
- 手动修改 DOM
- 设置定时器
- 写入本地存储

**为什么需要 useEffect？**

React 组件函数在每次渲染时都会执行。如果你直接在组件函数中写副作用代码，会导致：

1. 每次渲染都执行，可能造成性能问题
2. 无法控制执行时机
3. 无法在组件卸载时清理

`useEffect` 让你可以控制副作用的执行时机。

**useEffect 的基本语法**：

```jsx
useEffect(
  () => {
    // 副作用代码
    return () => {
      // 清理代码（可选）
    };
  },
  [依赖数组]  // 可选
);
```

**三种使用方式**：

**方式1：每次渲染后都执行**

```jsx
useEffect(() => {
  console.log('组件渲染了');
  // 不传第二个参数，每次渲染后都会执行
});
```

**方式2：只在组件首次加载时执行**

```jsx
useEffect(() => {
  console.log('组件加载了');
  // 这里适合做初始化操作，比如获取数据
}, []);  // 空数组表示没有依赖，只在首次渲染后执行一次
```

**方式3：当某个值变化时执行**

```jsx
useEffect(() => {
  console.log('count 变了，新值是：', count);
  // 当 count 变化时执行
}, [count]);  // 依赖数组中列出要监听的值
```

**清理函数**：

有些副作用需要在组件卸载时清理，比如移除事件监听、取消定时器等。

```jsx
useEffect(() => {
  // 添加事件监听
  const handleResize = () => {
    console.log('窗口大小变了');
  };
  window.addEventListener('resize', handleResize);
  
  // 返回一个清理函数
  // 这个函数会在组件卸载时执行，或者在下次 effect 执行前执行
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);  // 空数组表示只在加载和卸载时执行
```

**执行时机图解**：

```
组件首次渲染
    ↓
页面显示
    ↓
useEffect 执行（首次）
    ↓
用户操作导致状态变化
    ↓
组件重新渲染
    ↓
页面更新
    ↓
清理函数执行（如果有）
    ↓
useEffect 执行（如果依赖变化了）
    ↓
...
    ↓
组件卸载
    ↓
清理函数执行
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "useEffect 在渲染前执行" | **错误**！useEffect 在渲染**后**执行。如果需要在渲染前执行，使用 `useLayoutEffect`。 |
| "空依赖数组 [] 表示没有依赖" | 技术上正确，但容易误解。空数组意味着 effect 只在组件挂载时执行一次，卸载时清理。 |
| "不写依赖数组和写空数组一样" | **错误**！不写依赖数组 = 每次渲染都执行；空数组 = 只执行一次。 |
| "依赖数组里要放所有用到的变量" | 基本正确，但要注意：只放会变化的值。常量、setState 函数不需要放。 |
| "清理函数只在组件卸载时执行" | **错误**！清理函数在每次 effect 重新执行前也会执行。 |

**依赖数组详解**：

```jsx
// ❌ 错误：缺少依赖
useEffect(() => {
  console.log(count);  // 使用了 count，但没有放入依赖
}, []);  // 这个 effect 永远打印初始值

// ✅ 正确：包含所有依赖
useEffect(() => {
  console.log(count);
}, [count]);  // count 变化时重新执行

// ❌ 错误：不写依赖数组
useEffect(() => {
  console.log('每次渲染都执行');  // 可能导致性能问题
});

// ✅ 正确：明确依赖
useEffect(() => {
  console.log('只在 count 变化时执行');
}, [count]);
```

**清理函数执行时机**：

```jsx
useEffect(() => {
  console.log('effect 执行，count =', count);
  
  return () => {
    console.log('清理函数执行，count =', count);
  };
}, [count]);

// 假设 count 从 0 变到 1：
// 1. 首次渲染后：打印 "effect 执行，count = 0"
// 2. count 变为 1，重新渲染后：
//    - 先打印 "清理函数执行，count = 0"（清理上一次的 effect）
//    - 再打印 "effect 执行，count = 1"（执行新的 effect）
// 3. 组件卸载时：打印 "清理函数执行，count = 1"
```

**常见的 useEffect 使用场景**：

| 场景 | 依赖数组 | 清理函数 |
|------|----------|----------|
| 组件挂载时获取数据 | `[]` | 可选（取消请求） |
| 监听某个值变化 | `[value]` | 通常不需要 |
| 添加事件监听 | `[]` | **必须**（移除监听） |
| 设置定时器 | `[]` | **必须**（清除定时器） |
| 订阅外部数据源 | `[]` | **必须**（取消订阅） |

---

### 2.1.6 useCallback 和 useMemo 详解

**为什么需要这两个钩子？**

在 React 中，每次组件重新渲染时，组件函数都会重新执行。这意味着：

1. 函数内定义的变量会重新创建
2. 函数内定义的函数会重新创建
3. 函数内的计算会重新执行

大多数情况下这不是问题，但在以下场景可能造成性能问题：

- 复杂的计算每次渲染都重新执行
- 函数作为 props 传给子组件，导致子组件不必要的重新渲染

**useMemo：缓存计算结果**

```jsx
import { useMemo } from 'react';

function ShoppingCart({ items }) {
  // 不使用 useMemo：每次渲染都会重新计算总价
  // const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // 使用 useMemo：只有当 items 变化时才重新计算
  const total = useMemo(() => {
    console.log('计算总价...');  // 只有 items 变化时才会打印
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);  // 依赖数组：当 items 变化时重新计算
  
  return <div>总价：{total}</div>;
}
```

**useMemo 的语法**：

```jsx
const 缓存的值 = useMemo(
  () => {
    // 计算逻辑
    return 计算结果;
  },
  [依赖1, 依赖2, ...]  // 当这些值变化时，重新计算
);
```

**useCallback：缓存函数**

```jsx
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // 不使用 useCallback：每次渲染都创建新函数
  // const handleClick = () => { console.log('点击了'); };
  
  // 使用 useCallback：函数被缓存，不会每次都创建新的
  const handleClick = useCallback(() => {
    console.log('点击了');
  }, []);  // 空依赖数组：函数永远不变
  
  // 如果函数内部使用了状态，需要把状态加入依赖
  const handleClickWithCount = useCallback(() => {
    console.log('当前 count:', count);
  }, [count]);  // count 变化时，创建新函数
  
  return <ChildComponent onClick={handleClick} />;
}
```

**useCallback 的语法**：

```jsx
const 缓存的函数 = useCallback(
  () => {
    // 函数逻辑
  },
  [依赖1, 依赖2, ...]  // 当这些值变化时，创建新函数
);
```

**useMemo 和 useCallback 的关系**：

```jsx
// useCallback(fn, deps) 等价于 useMemo(() => fn, deps)

// 这两个写法效果相同：
const handleClick = useCallback(() => { console.log('click'); }, []);
const handleClick = useMemo(() => () => { console.log('click'); }, []);
```

**什么时候使用？**

| 场景 | 使用 |
|------|------|
| 复杂计算（如数组过滤、排序、统计） | useMemo |
| 函数作为 props 传给子组件 | useCallback |
| 函数作为 useEffect 的依赖 | useCallback |
| 简单计算或不传给子组件的函数 | 不需要使用 |

**注意**：不要过度使用这两个钩子。只有在确实有性能问题时才使用，否则反而会增加代码复杂度。

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "所有函数都应该用 useCallback 包裹" | **错误**！过度使用反而会降低性能。只有传给子组件或作为依赖时才需要。 |
| "所有计算都应该用 useMemo 包裹" | **错误**！简单计算不需要缓存。useMemo 本身也有开销。 |
| "useCallback 会让函数执行更快" | **错误**！useCallback 不会优化函数执行速度，只是避免重复创建函数。 |
| "依赖数组为空就永远不会重新创建" | 正确，但要注意：如果函数内部使用了状态，空依赖会导致使用过期的值。 |
| "useMemo 和 useCallback 可以互换" | 不完全正确。useMemo 缓存值，useCallback 缓存函数。`useCallback(fn, deps)` 等于 `useMemo(() => fn, deps)`。 |

**什么时候不需要使用？**

```jsx
// ❌ 不需要：简单计算
const double = useMemo(() => count * 2, [count]);  // 乘法很快，不需要缓存

// ✅ 需要：复杂计算
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);  // 排序可能很慢，值得缓存

// ❌ 不需要：不传给子组件的函数
const handleClick = () => { setCount(count + 1); };  // 只在当前组件使用

// ✅ 需要：传给子组件的函数
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);  // 传给 React.memo 包裹的子组件
```

**性能优化的正确思路**：

1. **先写正确的代码**，不要过早优化
2. **发现性能问题后**，使用 React DevTools 分析
3. **找到瓶颈后**，针对性地使用 useMemo/useCallback
4. **验证优化效果**，确保真的有改善

---

### 2.1.7 useRef 详解

**useRef 的定义**：

`useRef` 是一个钩子，它创建一个可以存储任何值的"容器"。这个容器有一个特点：**修改它的值不会触发组件重新渲染**。

**useRef 返回什么？**

`useRef` 返回一个对象，这个对象只有一个属性 `current`：

```jsx
const myRef = useRef(初始值);
// myRef 的结构是：{ current: 初始值 }
```

**用法1：保存 DOM 元素引用**

在 React 中，通常不直接操作 DOM。但有时候你需要直接访问 DOM 元素（比如让输入框获得焦点），这时可以用 `useRef`：

```jsx
import { useRef } from 'react';

function TextInput() {
  // 创建一个 ref，初始值是 null
  const inputRef = useRef(null);
  
  // 点击按钮时，让输入框获得焦点
  const handleClick = () => {
    // inputRef.current 就是 input 元素
    inputRef.current.focus();
  };
  
  return (
    <div>
      {/* 把 ref 传给 input，React 会把 DOM 元素赋值给 inputRef.current */}
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>聚焦输入框</button>
    </div>
  );
}
```

**用法2：保存不需要触发渲染的值**

有些数据需要在渲染之间保持，但修改它不需要更新界面。这时用 `useRef` 比 `useState` 更合适：

```jsx
function Timer() {
  // 用 useRef 保存定时器 ID
  // 因为定时器 ID 不需要显示在界面上，修改它也不需要重新渲染
  const timerIdRef = useRef(null);
  
  const startTimer = () => {
    timerIdRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(timerIdRef.current);
  };
  
  return (
    <div>
      <button onClick={startTimer}>开始</button>
      <button onClick={stopTimer}>停止</button>
    </div>
  );
}
```

**用法3：保存上一次的值**

```jsx
function MyComponent({ value }) {
  // 保存上一次的 value
  const prevValueRef = useRef();
  
  useEffect(() => {
    // 每次渲染后，把当前值保存到 ref
    prevValueRef.current = value;
  });
  
  // prevValueRef.current 是上一次渲染时的 value
  return (
    <div>
      <p>当前值：{value}</p>
      <p>上一次的值：{prevValueRef.current}</p>
    </div>
  );
}
```

**useRef vs useState 对比**：

| 特性 | useState | useRef |
|------|----------|--------|
| 修改值后 | 触发重新渲染 | 不触发重新渲染 |
| 适用场景 | 需要显示在界面上的数据 | 不需要显示的数据、DOM 引用 |
| 获取值 | 直接使用变量名 | 通过 `.current` 属性 |
| 修改值 | 调用 set 函数 | 直接赋值给 `.current` |

**在本项目中的使用**：

```jsx
// useHistory.js 中使用 useRef 保存历史栈
const pastRef = useRef([]);       // 历史栈
const futureRef = useRef([]);     // 未来栈
const isUndoingRef = useRef(false);  // 是否正在撤销

// 为什么用 useRef 而不是 useState？
// 因为历史栈的变化不需要触发界面更新
// 只有当用户执行撤销/重做时，才需要更新界面（通过 setNodes/setEdges）
```

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "useRef 和 useState 可以互换" | **错误**！它们用途不同。useState 用于需要触发渲染的数据，useRef 用于不需要触发渲染的数据。 |
| "修改 ref.current 会触发重新渲染" | **错误**！修改 ref.current 不会触发任何渲染。如果需要界面更新，必须用 useState。 |
| "useRef 只能用来保存 DOM 引用" | **错误**！useRef 可以保存任何值：数字、对象、函数、定时器ID等。 |
| "每次渲染 useRef 都返回新对象" | **错误**！useRef 在组件整个生命周期内返回同一个对象，只是 `.current` 属性可以改变。 |
| "ref.current 的值在渲染期间是稳定的" | 需要注意：ref.current 可以在任何时候被修改，包括渲染期间。读取时要小心。 |

**useRef vs useState 选择指南**：

```jsx
// 问自己：这个数据变化时，界面需要更新吗？

// 需要更新界面 → 用 useState
const [count, setCount] = useState(0);  // count 显示在页面上

// 不需要更新界面 → 用 useRef
const timerIdRef = useRef(null);  // 定时器ID不需要显示
const prevValueRef = useRef(null);  // 上一次的值，用于比较
const isFirstRenderRef = useRef(true);  // 是否首次渲染的标记
```

**常见使用场景**：

| 场景 | 用 useState | 用 useRef |
|------|-------------|-----------|
| 表单输入值（需要显示） | ✅ | ❌ |
| 计数器（需要显示） | ✅ | ❌ |
| 定时器 ID | ❌ | ✅ |
| 上一次的 props/state | ❌ | ✅ |
| DOM 元素引用 | ❌ | ✅ |
| 是否已挂载的标记 | ❌ | ✅ |
| 防抖/节流的标记 | ❌ | ✅ |

**注意事项**：

```jsx
// ❌ 错误：在渲染期间读取可能被修改的 ref
function BadComponent() {
  const countRef = useRef(0);
  
  // 这里读取 ref.current 是危险的，因为它可能在渲染过程中被修改
  return <div>{countRef.current}</div>;
}

// ✅ 正确：如果需要显示，应该用 useState
function GoodComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// ✅ 正确：ref 用于不需要显示的数据
function GoodComponent2() {
  const renderCountRef = useRef(0);
  renderCountRef.current++;  // 记录渲染次数，但不显示
  
  console.log('渲染次数:', renderCountRef.current);
  return <div>...</div>;
}
```

---

## 2.2 React Flow 基础概念

### 什么是 React Flow？

React Flow 是一个用于构建节点式编辑器的 React 库。
它提供了画布、节点、连线、缩放、拖拽等功能，我们只需要专注于业务逻辑。
本项目的核心功能都是基于 React Flow 实现的。

### 核心概念

| 概念 | 说明 | 在本项目中 |
|------|------|-----------|
| **Node（节点）** | 画布上的方块 | 蓝图中的每个功能块 |
| **Edge（连线）** | 连接节点的线 | 数据流向的表示 |
| **Handle（端口）** | 节点上的连接点 | 输入端口和输出端口 |
| **Viewport（视口）** | 画布的可视区域 | 可以缩放和平移 |

---

### React Flow 基本用法

```jsx
import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';  // 必须引入样式

function MyFlow() {
  // 节点数据：数组，每个元素是一个节点
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 0, y: 0 }, data: { label: '节点1' } },
    { id: '2', position: { x: 100, y: 100 }, data: { label: '节点2' } },
  ]);
  
  // 连线数据：数组，每个元素是一条连线
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2' },  // 从节点1连到节点2
  ]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}  // 节点变化时的回调
      onEdgesChange={onEdgesChange}  // 连线变化时的回调
    />
  );
}
```

**关键点**：
- `useNodesState` 和 `useEdgesState` 是 React Flow 提供的状态管理钩子
- 它们返回 `[数据, 设置函数, 变化处理函数]`
- 必须把 `onNodesChange` 和 `onEdgesChange` 传给 ReactFlow，否则节点无法拖动

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "不传 onNodesChange 也能拖动节点" | **错误**！必须传入 `onNodesChange`，否则节点位置不会更新，看起来就是拖不动。 |
| "节点 id 可以是数字" | 技术上可以，但**强烈建议用字符串**。React Flow 内部用字符串比较，数字可能导致问题。 |
| "节点数据可以直接修改" | **错误**！必须通过 `setNodes` 更新。直接修改 `nodes[0].position = ...` 不会触发渲染。 |
| "连线会自动创建" | **错误**！必须传入 `onConnect` 回调并调用 `setEdges` 才能创建连线。 |
| "React Flow 样式会自动加载" | **错误**！必须手动导入 `@xyflow/react/dist/style.css`，否则节点和连线不显示。 |

**节点数据结构详解**：

```jsx
// 一个完整的节点对象
const node = {
  id: 'node-1',           // 必须：唯一标识，建议用字符串
  type: 'default',        // 可选：节点类型，默认是 'default'
  position: { x: 0, y: 0 }, // 必须：节点位置
  data: { label: '节点' },  // 必须：传给节点组件的数据
  
  // 以下是可选属性
  selected: false,        // 是否选中
  draggable: true,        // 是否可拖动
  selectable: true,       // 是否可选中
  connectable: true,      // 是否可连接
  deletable: true,        // 是否可删除
  hidden: false,          // 是否隐藏
  style: {},              // 自定义样式
  className: '',          // 自定义类名
};
```

**连线数据结构详解**：

```jsx
// 一个完整的连线对象
const edge = {
  id: 'edge-1',           // 必须：唯一标识
  source: 'node-1',       // 必须：起点节点 ID
  target: 'node-2',       // 必须：终点节点 ID
  
  // 以下是可选属性
  sourceHandle: 'out',    // 起点端口 ID（有多个端口时需要）
  targetHandle: 'in',     // 终点端口 ID（有多个端口时需要）
  type: 'default',        // 连线类型：default, straight, step, smoothstep
  animated: false,        // 是否显示动画
  style: {},              // 自定义样式
  label: '',              // 连线上的文字
};
```

---

### 自定义节点

React Flow 默认的节点很简单，我们可以创建自定义节点来实现复杂的 UI。

```jsx
// 1. 定义自定义节点组件
function MyCustomNode({ data }) {
  return (
    <div style={{ background: 'lightblue', padding: 10 }}>
      <Handle type="target" position="left" />  {/* 输入端口 */}
      <div>{data.label}</div>                   {/* 节点内容 */}
      <Handle type="source" position="right" /> {/* 输出端口 */}
    </div>
  );
}

// 2. 注册节点类型
const nodeTypes = { myCustomNode: MyCustomNode };

// 3. 使用自定义节点
<ReactFlow nodeTypes={nodeTypes} ... />

// 4. 在节点数据中指定类型
const nodes = [
  { id: '1', type: 'myCustomNode', position: { x: 0, y: 0 }, data: { label: '自定义节点' } }
];
```

本项目的 `BaseNode.jsx` 就是一个自定义节点，包含输入端口、标题、输出端口。

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "自定义节点组件可以随便写" | **错误**！必须包含 Handle 组件才能连线。没有 Handle 的节点无法被连接。 |
| "nodeTypes 可以在组件内定义" | **错误**！nodeTypes 必须在组件外定义或用 useMemo 包裹，否则每次渲染都会重新创建，导致性能问题。 |
| "Handle 的 id 可以省略" | 只有一个端口时可以省略，但有多个端口时**必须**指定 id，否则连线无法区分端口。 |
| "自定义节点会自动接收所有 props" | **错误**！自定义节点只接收 `{ id, data, selected, ... }` 等特定 props，不是所有节点属性。 |

**Handle 组件详解**：

```jsx
import { Handle, Position } from '@xyflow/react';

// Handle 的属性
<Handle
  type="target"           // 必须：'target'（输入）或 'source'（输出）
  position={Position.Left} // 必须：端口位置（Left, Right, Top, Bottom）
  id="input-1"            // 可选：端口 ID，多个端口时必须指定
  isConnectable={true}    // 可选：是否可连接
  style={{ ... }}         // 可选：自定义样式
  onConnect={(params) => {}} // 可选：连接时的回调
/>
```

**自定义节点接收的 props**：

```jsx
function MyCustomNode(props) {
  // props 包含以下属性：
  const {
    id,           // 节点 ID
    data,         // 节点数据（你在 nodes 数组中定义的 data）
    selected,     // 是否被选中
    isConnectable, // 是否可连接
    xPos,         // X 坐标
    yPos,         // Y 坐标
    dragging,     // 是否正在拖动
    zIndex,       // 层级
    type,         // 节点类型
    sourcePosition, // 默认输出端口位置
    targetPosition, // 默认输入端口位置
  } = props;
  
  return <div>...</div>;
}
```

**nodeTypes 的正确定义方式**：

```jsx
// ❌ 错误：在组件内定义（每次渲染都创建新对象）
function App() {
  const nodeTypes = { custom: CustomNode };  // 错误！
  return <ReactFlow nodeTypes={nodeTypes} />;
}

// ✅ 正确：在组件外定义
const nodeTypes = { custom: CustomNode };
function App() {
  return <ReactFlow nodeTypes={nodeTypes} />;
}

// ✅ 正确：用 useMemo 包裹
function App() {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  return <ReactFlow nodeTypes={nodeTypes} />;
}
```

---

### React Flow 常用钩子

React Flow 提供了一些钩子，让我们能获取画布信息和执行操作。

```jsx
import { useReactFlow, useViewport, useNodes, useEdges } from '@xyflow/react';

function MyComponent() {
  // useReactFlow：获取 React Flow 实例，可以执行各种操作
  const {
    getNode,              // 根据ID获取节点
    setNodes,             // 设置节点
    setEdges,             // 设置连线
    screenToFlowPosition, // 屏幕坐标转画布坐标
    flowToScreenPosition, // 画布坐标转屏幕坐标
  } = useReactFlow();
  
  // useViewport：获取视口信息
  const { x, y, zoom } = useViewport();  // 视口位置和缩放比例
  
  // useNodes / useEdges：获取当前节点/连线数据
  const nodes = useNodes();
  const edges = useEdges();
}
```

**注意**：这些钩子必须在 `<ReactFlowProvider>` 内部使用。

**⚠️ 常见误区**：

| 误区 | 正确理解 |
|------|----------|
| "React Flow 钩子可以在任何组件中使用" | **错误**！必须在 `<ReactFlowProvider>` 内部使用，否则会报错。 |
| "useReactFlow 返回的 setNodes 和 useNodesState 的 setNodes 一样" | 基本相同，但 useReactFlow 的版本可以在 Provider 内的任何组件中使用。 |
| "screenToFlowPosition 和 flowToScreenPosition 可以互换" | **错误**！它们是相反的操作。screen→flow 用于拖拽创建，flow→screen 用于显示浮动面板。 |
| "useViewport 返回的值是实时的" | 是的，viewport 会随着画布缩放/平移实时更新，可以用于响应式布局。 |

**坐标转换详解**：

```jsx
// 场景1：从外部拖入节点（需要 screen → flow）
const handleDrop = (event) => {
  // 鼠标位置是屏幕坐标
  const screenPosition = { x: event.clientX, y: event.clientY };
  // 转换为画布坐标，用于设置节点位置
  const flowPosition = screenToFlowPosition(screenPosition);
  // 创建节点时使用画布坐标
  const newNode = { id: '1', position: flowPosition, ... };
};

// 场景2：显示浮动面板（需要 flow → screen）
const showPanel = (node) => {
  // 节点位置是画布坐标
  const flowPosition = node.position;
  // 转换为屏幕坐标，用于定位 DOM 元素
  const screenPosition = flowToScreenPosition(flowPosition);
  // 设置面板的 CSS 位置
  panel.style.left = screenPosition.x + 'px';
  panel.style.top = screenPosition.y + 'px';
};
```

**ReactFlowProvider 的正确使用**：

```jsx
// ❌ 错误：在 Provider 外部使用钩子
function App() {
  const { setNodes } = useReactFlow();  // 错误！会报错
  return <ReactFlowProvider>...</ReactFlowProvider>;
}

// ✅ 正确：在 Provider 内部使用钩子
function FlowCanvas() {
  const { setNodes } = useReactFlow();  // 正确！
  return <ReactFlow ... />;
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />  {/* 钩子在这个组件内使用 */}
    </ReactFlowProvider>
  );
}
```

---

### 数据流向

```
用户操作 → 事件处理函数 → 更新状态 → React 重新渲染 → 页面更新
```

**举例：用户拖拽节点**
1. 用户拖动节点
2. React Flow 触发 `onNodesChange` 回调
3. 回调函数调用 `setNodes` 更新节点位置
4. React 检测到状态变化，重新渲染
5. 节点显示在新位置

**举例：用户从面板拖拽新节点到画布**
1. 用户从 NodeBox 拖拽节点
2. 触发 `onDrop` 事件
3. `handleDrop` 函数创建新节点
4. 调用 `setNodes` 添加新节点
5. 画布上出现新节点

---

### 功能模块划分

项目把功能拆分成多个自定义钩子，每个钩子负责一个独立的功能：

| 钩子 | 功能 | 依赖 |
|------|------|------|
| `useHistory` | 撤销/重做 | nodes, edges |
| `useClipboard` | 复制/粘贴 | nodes, useHistory |
| `useKeyboardShortcuts` | 键盘快捷键 | useHistory, useClipboard |
| `useContextMenu` | 右键菜单控制 | nodes |
| `usePropertyPanel` | 属性面板控制 | nodes, useHistory |
| `useRename` | 重命名功能 | nodes, useHistory |
| `useNodeActions` | 节点操作 | nodes, useHistory |
| `useFlowEvents` | 画布事件处理 | setNodes, setEdges, useHistory |

**设计思想**：
- **单一职责**：每个钩子只做一件事
- **高内聚低耦合**：相关逻辑放在一起，模块之间依赖清晰
- **可复用**：钩子可以在其他项目中复用

---

## 2.3 项目架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                               │
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │  NodeBox    │  │           FlowCanvas                 │   │
│  │  (节点面板)  │  │  ┌─────────────────────────────┐    │   │
│  │             │  │  │        ReactFlow             │    │   │
│  │  - 分类栏   │  │  │  (画布 + 节点 + 连线)        │    │   │
│  │  - 节点列表  │  │  └─────────────────────────────┘    │   │
│  │             │  │  ┌──────────┐ ┌──────────────────┐   │   │
│  │             │  │  │ContextMenu│ │ PropertyPanel   │   │   │
│  │             │  │  │ (右键菜单) │ │ (属性面板)      │   │   │
│  │             │  │  └──────────┘ └──────────────────┘   │   │
│  │             │  │  ┌──────────────────────────────┐    │   │
│  │             │  │  │      RenameModal             │    │   │
│  │             │  │  │      (重命名弹窗)             │    │   │
│  │             │  │  └──────────────────────────────┘    │   │
│  └─────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 节点注册表设计

节点的配置信息集中存储在 `nodeRegistry.js` 中，这是一种**数据驱动**的设计。

```javascript
// 节点注册表结构
const NODE_REGISTRY = {
  categories: {           // 分类信息
    node_group1: {
      label: "节点组1",
      color: "rgb(137, 146, 235)",
      nodes: ["node1", "node2"],
    },
  },
  nodes: {                // 节点配置
    node1: {
      label: "节点1",
      inputs: [{ id: "in", label: "" }],
      outputs: [{ id: "out", label: "" }],
      params: {
        param1: { label: "参数1", type: "number", default: 1 },
      },
    },
  },
};
```

**好处**：
- 添加新节点只需要在注册表中添加配置，不需要修改代码
- 配置可以从后端 API 获取，实现动态加载
- 统一管理，便于维护

---

## 2.4 粗读总结

🎉 恭喜你完成了粗读部分！现在你应该理解：

**React 核心概念**：
- 组件是返回 JSX 的函数
- useState 管理状态，状态变化触发重新渲染
- useEffect 处理副作用
- useCallback/useMemo 用于性能优化
- useRef 保存不触发渲染的值

**React Flow 核心概念**：
- 节点（Node）、连线（Edge）、端口（Handle）
- useNodesState/useEdgesState 管理画布数据
- 自定义节点可以实现复杂 UI

**项目架构**：
- 组件负责 UI，钩子负责逻辑
- 功能模块化，每个钩子一个功能
- 数据驱动的节点注册表设计

接下来的精读部分会逐行解释每个文件的代码。

---

# 第三部分：精读（深入每行代码）

> 这部分会详细解释每个文件的代码，包括每个函数、每个变量的作用。
> 建议配合源代码一起阅读，边看文档边看代码。

---

## 3.1 入口文件

### main.jsx - 应用挂载点

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**逐行解释**：

| 行号 | 代码 | 解释 |
|------|------|------|
| 1 | `import { StrictMode }` | 导入严格模式组件，帮助发现潜在问题 |
| 2 | `import { createRoot }` | 导入 React 18 的新渲染 API |
| 3 | `import './index.css'` | 导入全局样式 |
| 4 | `import App` | 导入主组件 |
| 6 | `createRoot(...)` | 创建 React 根节点 |
| 6 | `document.getElementById('root')` | 获取 HTML 中的挂载点 |
| 7-9 | `<StrictMode><App /></StrictMode>` | 在严格模式下渲染 App |

**StrictMode 的作用**：
- 检测不安全的生命周期方法
- 检测过时的 API 使用
- 检测意外的副作用
- 开发模式下会渲染两次来帮助发现问题

---

### App.jsx - 主组件（第一部分：导入）

```jsx
// ========== 第一部分：导入依赖 ==========

import { useMemo, useRef } from "react";                                         // React 基础 hooks
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";  // React Flow 核心
import "@xyflow/react/dist/style.css";                                           // React Flow 样式

import BaseNode from "./components/BaseNode";                                    // 自定义节点组件
import NodeBox from "./components/NodeBox";                                      // 左侧节点面板
import NodeContextMenu from "./components/NodeContextMenu";                      // 右键菜单
import PropertyPanel from "./components/PropertyPanel";                          // 属性面板
import RenameModal from "./components/RenameModal";                              // 重命名弹窗

import useHistory from "./hooks/useHistory";                                     // 撤销/重做功能
import useClipboard from "./hooks/useClipboard";                                 // 复制/粘贴功能
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";                 // 键盘快捷键
import useContextMenu from "./hooks/useContextMenu";                             // 右键菜单控制
import usePropertyPanel from "./hooks/usePropertyPanel";                         // 属性面板控制
import useRename from "./hooks/useRename";                                       // 重命名功能
import useNodeActions from "./hooks/useNodeActions";                             // 节点操作（复制、删除）
import useFlowEvents from "./hooks/useFlowEvents";                               // 画布事件处理

import { createNode } from "./utils/createNode";                                 // 创建节点的工具函数
import { initialNodes, initialEdges, INITIAL_NODE_ID } from "./config/initialData";  // 初始数据
import { FLOW_CONFIG, CONTAINER_STYLE } from "./config/flowConfig";              // 画布配置
```

**导入分类**：
1. **React 核心**：`useMemo`, `useRef` - React 内置钩子
2. **React Flow**：画布库的核心组件和钩子
3. **UI 组件**：5 个自定义组件
4. **功能钩子**：8 个自定义钩子
5. **工具和配置**：工具函数和配置文件

---

### App.jsx - 主组件（第二部分：FlowCanvas 组件）

```jsx
function FlowCanvas() {
  
  // ---------- 步骤1：注册节点类型 ----------
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);

  // ---------- 步骤2：初始化画布数据 ----------
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeIdCounter = useRef(INITIAL_NODE_ID);

  // ---------- 步骤3：初始化功能模块 ----------
  const history = useHistory(nodes, edges, setNodes, setEdges);
  const clipboard = useClipboard(nodes, setNodes, createNode, nodeIdCounter, history.saveToHistory);
  const contextMenu = useContextMenu(nodes);
  const propertyPanel = usePropertyPanel(nodes, setNodes, history.saveToHistory);
  const rename = useRename(nodes, setNodes, history.saveToHistory);
  const nodeActions = useNodeActions(nodes, setNodes, setEdges, nodeIdCounter, history.saveToHistory);
  const flowEvents = useFlowEvents(setNodes, setEdges, onNodesChange, onEdgesChange, history.saveToHistory, history.isUndoingRef, nodeIdCounter);

  // ---------- 步骤4：绑定键盘快捷键 ----------
  useKeyboardShortcuts({
    undo: history.undo,
    redo: history.redo,
    copy: clipboard.copy,
    paste: clipboard.paste,
  });
  // ... 后续代码
}
```

**逐步解释**：

| 步骤 | 代码 | 作用 |
|------|------|------|
| 1 | `nodeTypes = useMemo(...)` | 注册自定义节点类型，用 useMemo 缓存避免重复创建 |
| 2 | `useNodesState/useEdgesState` | 初始化节点和连线数据，返回状态和更新函数 |
| 2 | `nodeIdCounter = useRef(5)` | 节点 ID 计数器，从 5 开始（因为初始有 4 个节点） |
| 3 | 各种 `use*` 钩子 | 初始化各个功能模块，传入需要的依赖 |
| 4 | `useKeyboardShortcuts` | 绑定快捷键到对应的功能函数 |

**为什么用 useMemo 包裹 nodeTypes？**
- React Flow 会检查 nodeTypes 是否变化
- 如果每次渲染都创建新对象，会导致不必要的重新渲染
- useMemo 确保只有依赖变化时才创建新对象

---

### App.jsx - 主组件（第三部分：事件处理）

```jsx
// ---------- 步骤5：处理节点右键点击 ----------
const handleNodeContextMenu = (event, node) => {
  contextMenu.openContextMenu(event, node);                                    // 打开右键菜单
  const isSingleSelect = checkIsSingleSelect(nodes, node);                     // 检查是否单选
  if (isSingleSelect) propertyPanel.openPropertyPanel(node.id);                // 单选时打开属性面板
  else propertyPanel.closePropertyPanel();                                     // 多选时关闭属性面板
};

// ---------- 步骤6：处理右键菜单的三个按钮 ----------
const handleMenuCopyPaste = () => {
  if (!contextMenu.contextMenu) return;                                        // 菜单没打开就不执行
  nodeActions.duplicateNodes(contextMenu.contextMenu.nodeIds);                 // 复制选中的节点
  contextMenu.closeContextMenu();                                              // 关闭菜单
  propertyPanel.closePropertyPanel();                                          // 关闭属性面板
};

const handleMenuDelete = () => {
  if (!contextMenu.contextMenu) return;
  nodeActions.deleteNodes(contextMenu.contextMenu.nodeIds);
  contextMenu.closeContextMenu();
  propertyPanel.closePropertyPanel();
};

const handleMenuRename = () => {
  if (!contextMenu.contextMenu) return;
  rename.openRenameModal(contextMenu.contextMenu.nodeIds);
  contextMenu.closeContextMenu();
  propertyPanel.closePropertyPanel();
};
```

**事件处理流程**：

```
用户右键点击节点
    ↓
handleNodeContextMenu 被调用
    ↓
打开右键菜单 + 判断是否单选
    ↓
单选 → 打开属性面板
多选 → 关闭属性面板
    ↓
用户点击菜单按钮
    ↓
执行对应操作 + 关闭菜单 + 关闭属性面板
```

---

### App.jsx - 主组件（第四部分：渲染）

```jsx
// ---------- 步骤7：给节点注入双击回调 ----------
const nodesWithCallbacks = useMemo(() => {
  return nodes.map((node) => ({
    ...node,
    data: { ...node.data, onDoubleClick: rename.openRenameModal },
  }));
}, [nodes, rename.openRenameModal]);

// ---------- 步骤8：渲染画布 ----------
return (
  <>
    <ReactFlow
      nodes={nodesWithCallbacks}                                               // 节点数据
      edges={edges}                                                            // 连线数据
      nodeTypes={nodeTypes}                                                    // 自定义节点类型
      onNodesChange={flowEvents.handleNodesChange}                             // 节点变化回调
      onEdgesChange={flowEvents.handleEdgesChange}                             // 连线变化回调
      onConnect={flowEvents.handleConnect}                                     // 新建连线回调
      onDrop={flowEvents.handleDrop}                                           // 拖拽放置回调
      onDragOver={flowEvents.handleDragOver}                                   // 拖拽经过回调
      onMouseMove={clipboard.trackMousePosition}                               // 鼠标移动回调
      onNodeContextMenu={handleNodeContextMenu}                                // 节点右键回调
      onPaneContextMenu={contextMenu.handlePaneContextMenu}                    // 画布右键回调
      onPaneClick={contextMenu.handlePaneClick}                                // 画布点击回调
      onNodeClick={contextMenu.handleNodeClick}                                // 节点点击回调
      {...FLOW_CONFIG}                                                         // 展开所有配置项
    />

    {renderContextMenu(contextMenu, handleMenuCopyPaste, handleMenuDelete, handleMenuRename)}
    {renderPropertyPanel(propertyPanel)}
    {renderRenameModal(rename)}
  </>
);
```

**ReactFlow 组件的 props 分类**：

| 类别 | Props | 作用 |
|------|-------|------|
| 数据 | nodes, edges | 画布上的节点和连线 |
| 类型 | nodeTypes | 自定义节点组件映射 |
| 变化回调 | onNodesChange, onEdgesChange | 处理拖拽、删除等变化 |
| 连线回调 | onConnect | 新建连线时触发 |
| 拖拽回调 | onDrop, onDragOver | 从外部拖入节点时触发 |
| 交互回调 | onMouseMove, onClick, onContextMenu | 各种用户交互 |
| 配置 | ...FLOW_CONFIG | 画布的各种配置选项 |

---

### App.jsx - 主组件（第五部分：辅助函数和入口）

```jsx
// ========== 第三部分：辅助函数（纯逻辑，无副作用） ==========

/** 检查是否为单选模式 */
function checkIsSingleSelect(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);                         // 获取所有选中的节点
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);  // 点击的节点是否在选中列表里
  const isSingleNode = !isClickedNodeSelected || selectedNodes.length <= 1;      // 判断是否单选
  return isSingleNode;
}

// ========== 第四部分：渲染函数（纯UI，无逻辑） ==========

/** 渲染右键菜单 */
function renderContextMenu(contextMenu, onCopyPaste, onDelete, onRename) {
  const shouldShow = contextMenu.contextMenu && contextMenu.menuPosition;
  if (!shouldShow) return null;
  
  return (
    <NodeContextMenu
      x={contextMenu.menuPosition.x}
      y={contextMenu.menuPosition.y}
      position={contextMenu.menuPosition.position}
      scale={contextMenu.menuPosition.scale}
      onCopyPaste={onCopyPaste}
      onDelete={onDelete}
      onRename={onRename}
      onClose={contextMenu.closeContextMenu}
    />
  );
}

// ========== 第五部分：应用入口 ==========

function App() {
  return (
    <div style={CONTAINER_STYLE}>                                                {/* 整体容器 */}
      <NodeBox />                                                                {/* 左侧节点面板 */}
      <div style={{ flex: 1, height: "100%" }}>                                  {/* 右侧画布容器 */}
        <ReactFlowProvider>                                                      {/* ReactFlow上下文 */}
          <FlowCanvas />                                                         {/* 画布组件 */}
        </ReactFlowProvider>
      </div>
    </div>
  );
}
```

**代码组织原则**：
- **辅助函数**：纯函数，只做计算，不修改状态
- **渲染函数**：只负责 UI 渲染，逻辑判断简单
- **入口组件**：只负责布局和组装

**为什么需要 ReactFlowProvider？**
- React Flow 的钩子（如 useReactFlow）需要在 Provider 内部使用
- Provider 提供了画布的上下文信息
- FlowCanvas 组件内部使用了这些钩子

---

## 3.2 配置文件

### flowConfig.js - 画布配置

```javascript
// ========== 画布配置（传给 ReactFlow 组件的 props） ==========

export const FLOW_CONFIG = {
  
  // ----- 拖拽配置 -----
  panOnDrag: [1, 2],                    // 中键(1)和右键(2)拖拽画布，左键(0)留给框选
  
  // ----- 框选配置 -----
  selectionOnDrag: true,                // 启用拖拽框选
  selectionMode: "partial",             // 碰到就选中（"full" 是完全框住才选中）
  
  // ----- 删除配置 -----
  deleteKeyCode: "Delete",              // 按 Delete 键删除选中的节点
  
  // ----- 节点原点配置 -----
  nodeOrigin: [0.5, 0.5],               // 节点原点在中心（拖拽创建时鼠标在节点中心）
  
  // ----- 外观配置 -----
  colorMode: "light",                   // 浅色模式
  fitView: true,                        // 自动适应视图
  
  // ----- 连线样式 -----
  defaultEdgeOptions: {                 // 连线的默认样式
    style: { strokeWidth: 3, stroke: "#fff" },
  },
  connectionLineStyle: {                // 拖拽连线时的样式
    strokeWidth: 3, stroke: "#fff",
  },
};

// ========== 容器样式 ==========

export const CONTAINER_STYLE = {
  display: "flex",                      // flex 布局
  flexDirection: "row",                 // 水平排列
  width: "100vw",                       // 宽度占满屏幕
  height: "100vh",                      // 高度占满屏幕
  background: "#e2e9faff",              // 背景色
};
```

**配置项详解**：

| 配置 | 值 | 说明 |
|------|-----|------|
| `panOnDrag` | `[1, 2]` | 鼠标按键：0=左键，1=中键，2=右键 |
| `selectionMode` | `"partial"` | 框选模式：partial=碰到就选，full=完全框住 |
| `nodeOrigin` | `[0.5, 0.5]` | 节点原点：[0,0]=左上角，[0.5,0.5]=中心 |
| `fitView` | `true` | 初始化时自动缩放以显示所有节点 |

---

### initialData.js - 初始数据

```javascript
import { createNode } from "../utils/createNode";

// ========== 初始节点 ==========

/** 画布上默认显示的节点（演示用，横向排列4个节点） */
export const initialNodes = [
  createNode("node-1", "node1", { x: 100, y: 100 }),   // 第1个节点
  createNode("node-2", "node2", { x: 350, y: 100 }),   // 第2个节点
  createNode("node-3", "node3", { x: 600, y: 100 }),   // 第3个节点
  createNode("node-4", "node4", { x: 850, y: 100 }),   // 第4个节点
];

// ========== 初始连线 ==========

/** 把上面4个节点串联起来：node1 -> node2 -> node3 -> node4 */
export const initialEdges = [
  { id: "e1-2", source: "node-1", sourceHandle: "out", target: "node-2", targetHandle: "in" },
  { id: "e2-3", source: "node-2", sourceHandle: "out", target: "node-3", targetHandle: "in" },
  { id: "e3-4", source: "node-3", sourceHandle: "out", target: "node-4", targetHandle: "in" },
];

// ========== 节点ID计数器初始值 ==========

/** 因为初始节点用了 node-1 到 node-4，所以新节点从 node-5 开始编号 */
export const INITIAL_NODE_ID = 5;
```

**连线数据结构**：

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 连线的唯一标识 | `"e1-2"` |
| `source` | 起点节点ID | `"node-1"` |
| `sourceHandle` | 起点端口ID | `"out"` |
| `target` | 终点节点ID | `"node-2"` |
| `targetHandle` | 终点端口ID | `"in"` |

---

### nodeRegistry.js - 节点注册表

```javascript
// ========== 节点注册表数据 ==========

export const NODE_REGISTRY = {
  
  /** 节点分类 */
  categories: {
    node_group1: {
      label: "节点组1",                    // 分类名称
      color: "rgb(137, 146, 235)",         // 主题色
      nodes: ["node1", "node2"],           // 包含的节点
    },
    node_group2: {
      label: "节点组2",
      color: "rgb(242, 177, 144)",
      nodes: ["node3", "node4"],
    },
  },

  /** 节点配置 */
  nodes: {
    node1: {
      label: "节点1",                      // 节点名称
      inputs: [{ id: "in", label: "" }],   // 输入端口
      outputs: [{ id: "out", label: "" }], // 输出端口
      params: {                            // 参数配置
        param1: { label: "参数1", type: "number", default: 1 },
        param2: { label: "参数2", type: "boolean", default: false },
        param3: { label: "参数3", type: "string", default: "3" },
        // ... 更多参数
      },
    },
    // ... 更多节点
  },
};

// ========== 辅助函数 ==========

/** 根据节点ID获取节点配置 */
export const getNodeConfig = (nodeKey) => {
  return NODE_REGISTRY.nodes[nodeKey] || {};
};

/** 根据节点ID找到它属于哪个分类 */
export const findCategoryByNode = (nodeKey) => {
  const categories = NODE_REGISTRY.categories;
  for (const catKey of Object.keys(categories)) {
    if (categories[catKey].nodes.includes(nodeKey)) return catKey;
  }
  return null;
};

/** 根据节点ID获取它的主题色 */
export const getNodeColor = (nodeKey) => {
  const catKey = findCategoryByNode(nodeKey);
  if (!catKey) return undefined;
  return NODE_REGISTRY.categories[catKey].color;
};

/** 获取所有分类（用于渲染节点面板） */
export const getAllCategories = () => {
  return Object.entries(NODE_REGISTRY.categories);
};
```

**参数类型支持**：

| 类型 | 说明 | 对应组件 |
|------|------|----------|
| `number` | 数字 | 数字输入框 |
| `string` | 字符串 | 文本输入框 |
| `boolean` | 布尔值 | 开关 |

**如何添加新节点**：
1. 在 `categories` 中添加分类（或使用现有分类）
2. 在 `nodes` 中添加节点配置
3. 完成！节点会自动出现在面板中

---

### 组件职责划分

| 组件 | 职责 | 特点 |
|------|------|------|
| `App.jsx` | 应用入口，整合所有模块 | 只负责组装，不包含业务逻辑 |
| `BaseNode.jsx` | 节点的 UI 渲染 | 自定义节点，包含端口 |
| `NodeBox.jsx` | 左侧节点面板 | 独立组件，不依赖画布状态 |
| `NodeContextMenu.jsx` | 右键菜单 UI | 纯展示组件，逻辑在钩子里 |
| `PropertyPanel.jsx` | 属性面板 UI | 纯展示组件，逻辑在钩子里 |
| `RenameModal.jsx` | 重命名弹窗 UI | 纯展示组件，逻辑在钩子里 |

**设计思想**：
- **展示与逻辑分离**：组件只负责 UI，逻辑放在钩子里
- **受控组件**：组件的状态由父组件控制
- **Props 驱动**：组件通过 props 接收数据和回调

---

## 3.3 工具函数

### createNode.js - 创建节点

```javascript
import { getNodeConfig, getNodeColor } from "../constants/nodeRegistry";

/**
 * 创建一个节点对象
 *
 * @param {string} id - 节点的唯一标识（如 "node-1"）
 * @param {string} nodeKey - 节点在注册表中的类型（如 "node1"）
 * @param {Object} position - 节点位置 { x, y }
 * @returns {Object} React Flow 节点对象
 */
export const createNode = (id, nodeKey, position) => {
  const config = getNodeConfig(nodeKey);    // 第1步：从注册表获取节点配置
  const color = getNodeColor(nodeKey);      // 第2步：从注册表获取节点颜色

  return {                                  // 第3步：返回 React Flow 节点格式
    id,                                     // 节点ID
    type: config.type || "baseNode",        // 节点类型（默认 baseNode）
    position,                               // 节点位置
    data: {                                 // 节点数据
      ...config,                            // 展开配置（label、inputs、outputs 等）
      nodeKey,                              // 保存节点类型（用于复制粘贴）
      color,                                // 节点主题色
    },
  };
};
```

**React Flow 节点数据结构**：

```javascript
{
  id: "node-1",           // 唯一标识
  type: "baseNode",       // 节点类型，对应 nodeTypes 中的键
  position: { x: 100, y: 100 },  // 位置
  data: {                 // 传给节点组件的数据
    label: "节点1",
    inputs: [...],
    outputs: [...],
    params: {...},
    nodeKey: "node1",
    color: "rgb(137, 146, 235)",
  },
}
```
---

### positionUtils.js - 位置计算工具

```javascript
/**
 * 计算浮动面板的位置（显示在节点上方）
 *
 * @param {Object} nodeData - 节点数据（包含 position 和 measured）
 * @param {Function} flowToScreenPosition - 画布坐标转屏幕坐标的函数
 * @param {number} zoom - 当前画布缩放比例
 * @returns {Object} 位置信息 { x, y, position, scale }
 */
export function calcPositionAboveNode(nodeData, flowToScreenPosition, zoom) {
  const nodeHeight = nodeData.measured?.height || 100;   // 获取节点高度（默认100）
  
  const nodeTopScreen = flowToScreenPosition({           // 计算节点顶部的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y - nodeHeight / 2,             // nodeOrigin是[0.5,0.5]，所以要减去一半高度
  });
  
  const nodeCenterScreen = flowToScreenPosition({        // 计算节点中心的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y,
  });
  
  const gap = 10 * zoom;                                 // 面板与节点的间距（随缩放变化）
  
  return {
    x: nodeCenterScreen.x,                               // X坐标：节点中心
    y: nodeTopScreen.y - gap,                            // Y坐标：节点顶部上方
    position: 'above',                                   // 位置标记
    scale: zoom,                                         // 缩放比例
  };
}

// calcPositionBelowNode 类似，只是 y 坐标计算不同
```

**坐标系统说明**：

```
画布坐标（Flow Position）          屏幕坐标（Screen Position）
┌─────────────────────┐           ┌─────────────────────┐
│  (0,0)              │           │  (0,0)              │
│    ┌───┐            │           │                     │
│    │节点│ (100,100)  │  ──转换→  │      ┌───┐          │
│    └───┘            │           │      │节点│ (450,300) │
│                     │           │      └───┘          │
└─────────────────────┘           └─────────────────────┘
```

- **画布坐标**：节点在画布上的逻辑位置，不受缩放和平移影响
- **屏幕坐标**：节点在浏览器窗口中的实际像素位置
- `flowToScreenPosition`：将画布坐标转换为屏幕坐标
---

## 3.4 自定义钩子（Hooks）

### useHistory.js - 撤销/重做

```javascript
import { useCallback, useRef } from "react";

const MAX_HISTORY = 50;  // 最多保存50步历史

const useHistory = (nodes, edges, setNodes, setEdges) => {
  
  const pastRef = useRef([]);       // 历史栈：存储过去的状态
  const futureRef = useRef([]);     // 未来栈：存储被撤销的状态
  const isUndoingRef = useRef(false);  // 标记：是否正在撤销/重做

  // ========== 保存历史 ==========
  const saveToHistory = useCallback(() => {
    if (isUndoingRef.current) return;                    // 撤销/重做时不记录
    const snapshot = createSnapshot(nodes, edges);       // 创建当前状态的快照
    pastRef.current.push(snapshot);                      // 推入历史栈
    if (pastRef.current.length > MAX_HISTORY) {
      pastRef.current.shift();                           // 超过最大数量就删除最老的
    }
    futureRef.current = [];                              // 清空未来栈
  }, [nodes, edges]);

  // ========== 撤销 ==========
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;            // 没有历史记录
    isUndoingRef.current = true;                         // 标记正在撤销
    const currentSnapshot = createSnapshot(nodes, edges);
    futureRef.current.push(currentSnapshot);             // 当前状态推入未来栈
    const previousSnapshot = pastRef.current.pop();      // 从历史栈弹出
    setNodes(previousSnapshot.nodes);                    // 恢复节点
    setEdges(previousSnapshot.edges);                    // 恢复连线
    setTimeout(() => { isUndoingRef.current = false; }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  // ========== 重做 ==========
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;          // 没有未来记录
    isUndoingRef.current = true;
    const currentSnapshot = createSnapshot(nodes, edges);
    pastRef.current.push(currentSnapshot);               // 当前状态推入历史栈
    const nextSnapshot = futureRef.current.pop();        // 从未来栈弹出
    setNodes(nextSnapshot.nodes);
    setEdges(nextSnapshot.edges);
    setTimeout(() => { isUndoingRef.current = false; }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  return { saveToHistory, undo, redo, isUndoingRef };
};

/** 创建状态快照（深拷贝） */
function createSnapshot(nodes, edges) {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  };
}
```

**撤销/重做原理图**：

```
操作1 → 操作2 → 操作3 → 当前状态
                         ↓ 撤销
操作1 → 操作2 → 当前状态   操作3（进入未来栈）
                         ↓ 重做
操作1 → 操作2 → 操作3 → 当前状态
```

**为什么用 useRef 而不是 useState？**
- 历史栈的变化不需要触发重新渲染
- useRef 的值变化不会导致组件重新渲染
- 性能更好，避免不必要的渲染
---

### useClipboard.js - 复制/粘贴

```javascript
import { useCallback, useState, useRef } from "react";
import { useReactFlow } from "@xyflow/react";

const useClipboard = (nodes, setNodes, createNode, nodeIdCounterRef, saveToHistory) => {
  
  const [clipboard, setClipboard] = useState(null);        // 剪贴板
  const mousePositionRef = useRef({ x: 0, y: 0 });         // 鼠标位置
  const { screenToFlowPosition } = useReactFlow();         // 坐标转换函数

  // ========== 追踪鼠标位置 ==========
  const trackMousePosition = useCallback((event) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  // ========== 复制 ==========
  const copy = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);  // 找出选中的节点
    if (selectedNodes.length === 0) return;
    const center = calcCenter(selectedNodes);                     // 计算中心点
    const nodesWithRelativePos = addRelativePosition(selectedNodes, center);  // 添加相对位置
    setClipboard({ nodes: nodesWithRelativePos });                // 保存到剪贴板
  }, [nodes]);

  // ========== 粘贴 ==========
  const paste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;
    const pasteCenter = screenToFlowPosition(mousePositionRef.current);  // 鼠标位置转画布坐标
    saveToHistory();                                              // 保存历史
    const newNodes = createNodesAtPosition(clipboard.nodes, pasteCenter, createNode, nodeIdCounterRef);
    setNodes((currentNodes) => currentNodes.concat(newNodes));    // 添加新节点
  }, [clipboard, screenToFlowPosition, setNodes, createNode, nodeIdCounterRef, saveToHistory]);

  return { copy, paste, trackMousePosition };
};
```

**复制粘贴流程**：

```
复制时：
选中节点 → 计算中心点 → 记录每个节点相对于中心的偏移 → 保存到剪贴板

粘贴时：
获取鼠标位置 → 转换为画布坐标 → 以此为新中心 → 根据偏移创建新节点
```

**为什么要记录相对位置？**
- 复制多个节点时，需要保持它们之间的相对位置关系
- 粘贴时以鼠标位置为中心，各节点按原来的相对位置排列
---

### useKeyboardShortcuts.js - 键盘快捷键

```javascript
import { useEffect } from "react";

const useKeyboardShortcuts = ({ undo, redo, copy, paste }) => {
  
  useEffect(() => {
    
    const handleKeyDown = (event) => {
      const isCtrl = event.ctrlKey || event.metaKey;  // Ctrl 或 Mac 的 Cmd
      const key = event.key.toLowerCase();
      
      if (isCtrl && key === "z" && !event.shiftKey) {  // Ctrl+Z: 撤销
        event.preventDefault();
        undo();
        return;
      }
      
      if (isCtrl && (key === "y" || (event.shiftKey && key === "z"))) {  // Ctrl+Y 或 Ctrl+Shift+Z: 重做
        event.preventDefault();
        redo();
        return;
      }
      
      if (isCtrl && key === "c") {  // Ctrl+C: 复制
        event.preventDefault();
        copy();
        return;
      }
      
      if (isCtrl && key === "v") {  // Ctrl+V: 粘贴
        event.preventDefault();
        paste();
        return;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);  // 注册监听
    return () => window.removeEventListener("keydown", handleKeyDown);  // 清理
    
  }, [undo, redo, copy, paste]);
};
```

**关键点**：
- `event.preventDefault()` 阻止浏览器默认行为（如 Ctrl+Z 撤销输入框内容）
- `event.metaKey` 是 Mac 上的 Command 键
- useEffect 的清理函数会在组件卸载时移除监听器
---

### useContextMenu.js - 右键菜单控制

```javascript
import { useState, useCallback, useEffect, useMemo } from "react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { calcPositionAboveNode } from "../utils/positionUtils";

const useContextMenu = (nodes) => {
  
  const [contextMenu, setContextMenu] = useState(null);  // 菜单状态
  const { getNode, flowToScreenPosition } = useReactFlow();
  const viewport = useViewport();  // 视口信息（包含缩放比例）

  // ========== 计算菜单位置 ==========
  const menuPosition = useMemo(() => {
    if (!contextMenu) return null;
    const nodeData = getNode(contextMenu.targetNodeId);
    if (!nodeData) return null;
    return calcPositionAboveNode(nodeData, flowToScreenPosition, viewport.zoom);
  }, [contextMenu, getNode, flowToScreenPosition, viewport]);

  // ========== 打开菜单 ==========
  const openContextMenu = useCallback((event, node) => {
    event.preventDefault();  // 阻止浏览器默认右键菜单
    const targetNodeIds = getTargetNodeIds(nodes, node);  // 获取要操作的节点
    setContextMenu({
      targetNodeId: node.id,  // 用于计算位置
      nodeIds: targetNodeIds, // 要操作的节点列表
    });
  }, [nodes]);

  // ========== 关闭菜单 ==========
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // ... 其他事件处理函数

  return { contextMenu, menuPosition, openContextMenu, closeContextMenu, ... };
};

/** 获取要操作的节点ID列表 */
function getTargetNodeIds(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);
  
  if (isClickedNodeSelected && selectedNodes.length > 0) {
    return selectedNodes.map((n) => n.id);  // 返回所有选中的节点
  } else {
    return [clickedNode.id];  // 只返回点击的节点
  }
}
```

**智能选择逻辑**：
- 如果右键点击的节点在选中列表里 → 操作所有选中的节点
- 如果右键点击的节点不在选中列表里 → 只操作这一个节点

**菜单位置跟随**：
- 使用 `useMemo` 计算位置，依赖 `viewport` 变化
- 当画布缩放或平移时，`viewport` 变化，位置自动重新计算
---

### useFlowEvents.js - 画布事件处理

```javascript
import { useCallback, useRef } from "react";
import { addEdge, reconnectEdge, useReactFlow } from "@xyflow/react";
import { createNode } from "../utils/createNode";

const useFlowEvents = (setNodes, setEdges, onNodesChange, onEdgesChange, saveToHistory, isUndoingRef, nodeIdCounterRef) => {
  
  const { screenToFlowPosition } = useReactFlow();
  const reconnectSuccessRef = useRef(true);  // 重连是否成功的标记

  // ========== 新建连线 ==========
  const handleConnect = useCallback((params) => {
    saveToHistory();
    setEdges((currentEdges) => {
      const filteredEdges = removeOldConnection(currentEdges, params);  // 删除旧连接
      return addEdge(params, filteredEdges);  // 添加新连接
    });
  }, [setEdges, saveToHistory]);

  // ========== 拖拽创建节点 ==========
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const nodeKey = event.dataTransfer.getData("application/reactflow");  // 获取节点类型
    if (!nodeKey) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    saveToHistory();
    const newId = `node-${nodeIdCounterRef.current++}`;
    const newNode = createNode(newId, nodeKey, position);
    setNodes((nodes) => nodes.concat(newNode));
  }, [screenToFlowPosition, setNodes, saveToHistory, nodeIdCounterRef]);

  // ========== 节点变化处理 ==========
  const handleNodesChange = useCallback((changes) => {
    const shouldSave = checkShouldSaveHistory(changes, isUndoingRef.current);
    if (shouldSave) saveToHistory();
    onNodesChange(changes);
  }, [onNodesChange, saveToHistory, isUndoingRef]);

  return { handleConnect, handleDrop, handleNodesChange, ... };
};

/** 删除目标端口的旧连接（输入端口只能有一个连接） */
function removeOldConnection(edges, params) {
  return edges.filter((edge) =>
    !(edge.target === params.target && edge.targetHandle === params.targetHandle)
  );
}

/** 判断是否需要保存历史 */
function checkShouldSaveHistory(changes, isUndoing) {
  if (isUndoing) return false;  // 撤销时不保存
  const hasPositionEnd = changes.some((c) => c.type === "position" && c.dragging === false);
  const hasRemove = changes.some((c) => c.type === "remove");
  return hasPositionEnd || hasRemove;  // 拖拽结束或删除时保存
}
```

**连线规则**：
- 输入端口只能有一个连接（新连接会替换旧连接）
- 输出端口可以有多个连接

**历史记录时机**：
- 节点拖拽**结束**时保存（不是拖拽过程中）
- 节点删除时保存
- 撤销/重做过程中不保存
---

## 3.5 UI 组件

### BaseNode.jsx - 节点组件

```jsx
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import { Button } from "@heroui/react";
import "./BaseNode.css";

const DRAG_THRESHOLD = 5;  // 拖拽阈值（像素）

// ========== 输入端口组件 ==========
const InputPort = ({ id, label, nodeId }) => {
  const edges = useEdges();
  const { setEdges } = useReactFlow();

  const handleMouseDown = (event) => {
    const connectedEdge = findConnectedEdge(edges, nodeId, id);  // 查找连接到这个端口的线
    if (!connectedEdge) return;  // 没有连接，让 React Flow 正常处理
    event.stopPropagation();
    startDragDetection(event, connectedEdge, setEdges);  // 开始拖拽检测
  };

  return (
    <div className="port-item">
      <Handle type="target" position={Position.Left} id={id} onMouseDown={handleMouseDown} />
      <span className="input-label">{label}</span>
    </div>
  );
};

// ========== 输出端口组件 ==========
const OutputPort = ({ id, label }) => (
  <div className="port-item">
    <span className="output-label">{label}</span>
    <Handle type="source" position={Position.Right} id={id} />
  </div>
);

// ========== 节点主体 ==========
const BaseNode = ({ data, id }) => {
  const color = data.color || "rgb(137, 146, 235)";
  const label = data.label || "未命名节点";
  const inputs = data.inputs || [];
  const outputs = data.outputs || [];
  const onDoubleClick = data.onDoubleClick;

  return (
    <Button className="container" style={{ background: color }} onDoubleClick={() => onDoubleClick?.(id)}>
      <div className="port-container">
        {inputs.map((port, i) => <InputPort key={`in-${i}`} {...port} nodeId={id} />)}
      </div>
      <div className="title-container">
        <div className="title">{label}</div>
      </div>
      <div className="port-container">
        {outputs.map((port, i) => <OutputPort key={`out-${i}`} {...port} />)}
      </div>
    </Button>
  );
};
```

**"拔出连接线"功能**：
- 当用户拖拽已连接的输入端口时，会断开连接
- 然后从源端口开始创建新连接
- 这是通过模拟 mousedown 事件实现的

**Handle 组件**：
- `type="target"` 表示输入端口（接收连线）
- `type="source"` 表示输出端口（发出连线）
- `position` 指定端口在节点的哪一边
---

### NodeBox.jsx - 节点面板

```jsx
import { useState } from "react";
import { getNodeConfig, getAllCategories } from "../constants/nodeRegistry";
import "./NodeBox.css";

// ========== 节点项组件 ==========
const NodeItem = ({ nodeId, color }) => {
  const config = getNodeConfig(nodeId);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", nodeId);  // 存储节点类型
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="node-item" style={{ background: color }} draggable onDragStart={handleDragStart}>
      {config.label || nodeId}
    </div>
  );
};

// ========== 主组件 ==========
const NodeBox = () => {
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);  // null = 显示全部
  const filteredCategories = filterCategories(categories, selectedCategory);

  return (
    <div className="node-box">
      <CategoryBar categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="node-list">
        {filteredCategories.map(([groupKey, groupData]) => (
          <NodeGroup key={groupKey} groupData={groupData} />
        ))}
      </div>
    </div>
  );
};
```

**拖拽原理**：
1. 设置 `draggable` 属性使元素可拖拽
2. `onDragStart` 时用 `dataTransfer.setData` 存储数据
3. 画布的 `onDrop` 时用 `dataTransfer.getData` 获取数据

**分类筛选**：
- `selectedCategory = null` 时显示所有分类
- 选中某个分类时只显示该分类的节点
---

### PropertyPanel.jsx - 属性面板

```jsx
import { Input, Switch } from "@heroui/react";
import "./PropertyPanel.css";

// ========== 参数编辑器组件 ==========
const NumberInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input type="number" value={String(value)} onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

const StringInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const BooleanSwitch = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Switch isSelected={value} onChange={onChange}>
      <Switch.Control><Switch.Thumb /></Switch.Control>
    </Switch>
  </div>
);

// ========== 主组件 ==========
const PropertyPanel = ({ x, y, position, scale, nodeLabel, params, paramValues, onParamChange }) => {
  if (!params || Object.keys(params).length === 0) return null;

  return (
    <div className="property-panel" style={calcPositionStyle(x, y, position, scale)}>
      <div className="panel-header">
        <span className="panel-title">{nodeLabel} 属性</span>
      </div>
      <div className="panel-content">
        {Object.entries(params).map(([paramKey, paramConfig]) =>
          renderParamEditor(paramKey, paramConfig, paramValues, onParamChange)
        )}
      </div>
    </div>
  );
};

/** 根据参数类型渲染对应的编辑器 */
function renderParamEditor(paramKey, paramConfig, paramValues, onParamChange) {
  const currentValue = paramValues[paramKey] ?? paramConfig.default;
  const editorMap = { number: NumberInput, string: StringInput, boolean: BooleanSwitch };
  const Editor = editorMap[paramConfig.type] || StringInput;
  return <Editor key={paramKey} label={paramConfig.label} value={currentValue} onChange={(v) => onParamChange(paramKey, v)} />;
}
```

**动态渲染**：
- 根据 `params` 配置动态生成编辑器
- 使用 `editorMap` 映射类型到组件
- 支持扩展：添加新类型只需在 `editorMap` 中添加映射
---

### RenameModal.jsx - 重命名弹窗

```jsx
import { useState, useEffect, useRef } from "react";
import { Button, Input, Label, TextField } from "@heroui/react";
import "./RenameModal.css";

const RenameModal = ({ isOpen, onClose, currentName, isMultiple, onConfirm }) => {
  
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const prevIsOpenRef = useRef(false);

  // ========== 弹窗打开时初始化 ==========
  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;  // 判断是否刚打开
    prevIsOpenRef.current = isOpen;
    if (!justOpened) return;
    
    setTimeout(() => {
      setInputValue(isMultiple ? "" : currentName);  // 多选时为空，单选时为当前名称
      inputRef.current?.focus();                     // 聚焦输入框
      if (!isMultiple) inputRef.current?.select();   // 单选时选中文字
    }, 50);
  }, [isOpen, currentName, isMultiple]);

  // ========== 确认重命名 ==========
  const handleConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) { onClose(); return; }
    if (!isMultiple && trimmedValue === currentName) { onClose(); return; }
    onConfirm(trimmedValue);
    onClose();
  };

  // ========== 键盘事件 ==========
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rename-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rename-modal">
        <div className="rename-modal-header">
          <h3>{isMultiple ? "批量节点重命名" : "节点重命名"}</h3>
        </div>
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
          </TextField>
        </div>
        <div className="rename-modal-footer">
          <Button variant="flat" onPress={onClose}>取消</Button>
          <Button color="primary" onPress={handleConfirm}>确认</Button>
        </div>
      </div>
    </div>
  );
};
```

**用户体验优化**：
- 打开时自动聚焦输入框
- 单选时自动选中文字（方便直接输入替换）
- 支持 Enter 确认、Escape 取消
- 点击遮罩层关闭

**prevIsOpenRef 的作用**：
- 用于判断弹窗是"刚打开"还是"已经打开"
- 只有刚打开时才执行初始化逻辑
- 避免每次 isOpen 变化都重新初始化
---

## 3.6 精读总结与开发指南

### 如何添加新功能？

**添加新节点类型**：
1. 在 `nodeRegistry.js` 的 `nodes` 中添加配置
2. 如果需要新分类，在 `categories` 中添加
3. 完成！节点会自动出现在面板中

**添加新参数类型**：
1. 在 `PropertyPanel.jsx` 中创建新的编辑器组件
2. 在 `editorMap` 中添加类型映射
3. 在节点配置的 `params` 中使用新类型

**添加新快捷键**：
1. 在 `useKeyboardShortcuts.js` 中添加按键处理
2. 在 `App.jsx` 中传入对应的回调函数

**添加新的右键菜单项**：
1. 在 `NodeContextMenu.jsx` 中添加 MenuItem
2. 在 `App.jsx` 中添加对应的处理函数

---

### 代码风格约定

本项目遵循以下代码风格：

1. **文件组织**：每个文件开头有注释说明文件作用
2. **代码分区**：使用 `// ========== 分区名 ==========` 分隔代码块
3. **行内注释**：重要代码行末尾有注释说明
4. **函数顺序**：按执行顺序排列，像流程图一样清晰
5. **辅助函数**：放在文件末尾，与主逻辑分开

---

### 常见问题

**Q: 为什么节点拖不动？**
A: 检查是否传入了 `onNodesChange` 回调给 ReactFlow

**Q: 为什么连线不显示？**
A: 检查是否引入了 `@xyflow/react/dist/style.css`

**Q: 为什么撤销不生效？**
A: 检查是否在操作前调用了 `saveToHistory()`

**Q: 如何调试状态？**
A: 在组件中使用 `console.log(nodes)` 或 React DevTools

---

### 推荐学习资源

- [React 官方文档](https://react.dev/)
- [React Flow 官方文档](https://reactflow.dev/)
- [HeroUI 组件库](https://heroui.com/)
- [Vite 官方文档](https://vitejs.dev/)

---

# 结语

恭喜你读完了整个文档！

现在你应该：
- 理解了 React 的核心概念（组件、状态、钩子）
- 理解了 React Flow 的使用方法
- 理解了项目的架构设计和代码组织
- 能够独立修改和扩展这个项目

如果有任何问题，可以：
1. 查看源代码中的注释
2. 参考本文档的相关章节
3. 查阅官方文档

祝你开发顺利！





















