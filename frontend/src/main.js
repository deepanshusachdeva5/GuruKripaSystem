import { createApp } from 'vue';
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

// /* import font awesome icon component */
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import { faThin, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
// library.add(faThin)
// library.add(faCircleArrowRight)

const app = createApp(App);
app.mount('#app')
