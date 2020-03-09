const debounce = (fn, wait) => {
	var timeout = null
	return () => {
		if (timeout !== null) clearTimeout(timeout)
		timeout = setTimeout(fn, wait)
	}
}
const directive = {
  install = function (Vue, options) {
    // 2. 添加全局资源
    Vue.directive('elTableScrollLoad', {
      inserted(el, binding) {
        let loadEnd = binding.value.loadEnd
        el.timeout = null
        el.timer = null
        // 防止首次加载不够填满容器
        if (!loadEnd) {
          const selectWrap = el.querySelector('.el-table__body-wrapper')
          el.timeout = setTimeout(() => {
            let elTableWrap = parseFloat(el.style.maxHeight || el.style.height)
            if (selectWrap.scrollHeight <= elTableWrap && selectWrap.scrollHeight !== 0 && !loadEnd) {
              el.timer = setInterval(() => {
                binding.value.load()
                if (selectWrap.scrollHeight > elTableWrap) {
                  clearInterval(el.timer)
                  clearTimeout(el.timeout)
                }
              }, 1500)
            }
          }, 500)
        }
      },
      async bind(el, binding) {
        let loadEnd = binding.value.loadEnd
        let loadingText = binding.loadingText || '加载中...'
        let loadendText = binding.loadendText || '没有更多了'
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        let remove = () => {
          let ele = el.querySelector('.el-table__body-wrapper').querySelector('.tableloadmoretext')
          if (ele) {
            selectWrap.removeChild(ele)
          }
        }
        if (!loadEnd) {
          let fun = () => {
            let sign = 0
            const scrollDistance = selectWrap.scrollHeight - Math.ceil(selectWrap.scrollTop) - Math.ceil(selectWrap.clientHeight)
            if (scrollDistance <= sign) {
              binding.value.load()
            }
          }
    
          let vueScrollEvent = debounce(fun, 500)
          el._vueScrollEvent = vueScrollEvent
          selectWrap.addEventListener('scroll', vueScrollEvent)
          remove()
          let h = document.createElement('div')
          h.innerHTML = `<p>${loadingText}</p>`
          h.style = 'text-align:center;'
          h.className = 'tableloadmoretext'
          h.dataname = 'loading'
          selectWrap.appendChild(h)
        }
        if (loadEnd) {
          remove()
          let h = document.createElement('div')
          h.innerHTML = `<p>${loadendText}</p>`
          h.style = 'text-align:center;'
          h.className = 'tableloadmoretext'
          h.dataname = 'loaded'
          selectWrap.appendChild(h)
        }
      },
      update(el, binding) {
        if (binding.value.loadEnd) {
          clearInterval(el.timer)
          clearTimeout(el.timeout)
        }
        // loading loaded none
        let loadingText = binding.loadingText || '加载中...'
        let loadendText = binding.loadendText || '没有更多了'
        if (binding.value.loadEnd !== binding.oldValue.loadEnd) {
          const selectWrap = el.querySelector('.el-table__body-wrapper')
          let remove = () => {
            let ele = el.querySelector('.el-table__body-wrapper').querySelector('.tableloadmoretext')
            if (ele) {
              selectWrap.removeChild(ele)
            }
          }
          if (binding.value.loadEnd) {
            remove()
            let h = document.createElement('div')
            h.innerHTML = `<p>${loadendText}</p>`
            h.style = 'text-align:center;'
            h.className = 'tableloadmoretext'
            h.dataname = 'loaded'
            selectWrap.appendChild(h)
          }
          if (!binding.value.loadEnd) {
            remove()
            let h = document.createElement('div')
            h.innerHTML = `<p>${loadingText}</p>`
            h.style = 'text-align:center;'
            h.className = 'tableloadmoretext'
            h.dataname = 'loading'
            selectWrap.appendChild(h)
          }
        }
      },
      unbind(el) {
        clearInterval(el.timer)
        clearTimeout(el.timeout)
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.removeEventListener('scroll', el._vueScrollEvent)
      },
    })
  }
}

if(typeof window !=='undefined' && window.Vue) {
  window.Vue.use(directive)
}
export default directive