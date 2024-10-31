import { createApp } from 'vue'
import App from './App.vue' // Import App.vue if you have it

// Import your BidCalculator component
import BidCalculator from './components/BidCalculator.vue';

const app = createApp(App || BidCalculator); // Use App if available, otherwise fallback to BidCalculator

if (!App) {
  app.component('bid-calculator', BidCalculator);
}

app.mount('#app')
