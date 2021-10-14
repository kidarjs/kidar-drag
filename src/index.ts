import { VueConstructor } from 'vue'
import DragContainer from './KiDragContainer.vue'

DragContainer.install = (vue: VueConstructor) => {
  vue.component(DragContainer.name, DragContainer)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  DragContainer.install(window.Vue)
}

export default DragContainer