<template>
  <!-- Main container for the bid calculator component -->
  <div class="bid-calculator">
    <!-- Title for the component -->
    <h1 class="bid-calculator__title">Vehicle Bid Calculator</h1>
    
    <!-- Input group for entering vehicle price -->
    <div class="bid-calculator__input-group">
      <label for="base-price" class="bid-calculator__label">Vehicle Price:</label>
      <!-- Input field bound to 'basePrice' for vehicle price -->
      <input type="number" id="base-price" v-model="basePrice" class="bid-calculator__input">
      <!-- Error message shown if 'basePrice' is empty or zero -->
      <span v-if="!isValid && (basePrice === 0 || basePrice === '')" class="bid-calculator__error">Please enter a base price greater than 0.</span>
    </div>
    
    <div></div>

    <!-- Input group for selecting vehicle type -->
    <div class="bid-calculator__input-group">
      <label for="vehicle-type" class="bid-calculator__label">Vehicle Type:</label>
      <!-- Dropdown for selecting vehicle type, bound to 'vehicleType' -->
      <select id="vehicle-type" v-model="vehicleType" class="bid-calculator__input">
        <option value="Common">Common</option>
        <option value="Luxury">Luxury</option>
      </select>
      <!-- Error message shown if 'vehicleType' is not selected -->
      <span v-if="!vehicleTypeValid" class="bid-calculator__error">Please select a vehicle type.</span>
    </div>
    <br>
    
    <!-- Display list for calculated fees -->
    <ul class="bid-calculator__fee-list">
      <li>Basic Fee: {{ basicFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</li>
      <li>Special Fee: {{ sellerFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</li>
      <li>Association Fee: {{ associationFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</li>
      <li>Storage Fee: {{ storageFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</li>
      <!-- Total cost displayed in bold -->
      <li><b>Total Cost: {{ totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</b></li>
    </ul>
    
    <!-- Button to trigger the total cost calculation -->
    <button @click="calculateTotalCost" class="bid-calculator__button">Calculate</button>
  </div>

  <!-- Error message container for network or API issues -->
  <div class="bid-calculator__error">
    {{ error }}
  </div>
</template>

<script>
// Importing the associated CSS file for styles
import '../../styles/BidCalculator.css';

export default {
  data() {
    return {
      basePrice: 0,         // User-entered vehicle base price
      basicFee: 0,          // Calculated basic buyer fee
      sellerFee: 0,         // Calculated seller special fee
      associationFee: 0,    // Calculated association fee
      storageFee: 0,        // Fixed storage fee
      totalCost: 0,         // Final total cost including fees
      vehicleTypeValid: true, // Validation for vehicle type selection
      isValid: true,        // Validation for base price
      error: '',            // Error message holder for network errors
    };
  },
  methods: {
    // Function to calculate the total cost based on user inputs
    calculateTotalCost() {
      this.isValid = true;

      // Check if vehicleType is empty; if so, set error flag and stop execution
      if (!this.vehicleType) { 
        this.vehicleTypeValid = false;
        return;
      } else {
        this.vehicleTypeValid = true;
      }

      // Check if basePrice is zero or empty; if so, set error flag and stop execution
      if (this.basePrice === 0 || this.basePrice === "") {
        this.isValid = false;
        return;
      }

      // Make an API call to fetch calculated fees based on vehicle type and base price
      fetch("http://127.0.0.1:8000/api/calculate-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basePrice: this.basePrice,
          vehicleType: this.vehicleType,
        }),
      })
        .then((response) => {
          // Check if the response is valid, else throw an error
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse JSON data from response
        })
        .then((data) => {
          // Update fee data from the API response
          console.log(data);  // Log data for debugging purposes
          this.basicFee = data.fees.basicBuyerFee;
          this.sellerFee = data.fees.sellerSpecialFee;
          this.associationFee = data.fees.associationFee;
          this.totalCost = data.total;
          this.storageFee = data.fees.storageFee;
        })
        .catch((error) => {
          // Set the error message if API call fails
          this.error = "Error fetching data: " + error.message;
          console.error("Error fetching data:", error); // Log error for debugging
        });
    },
  },
};
</script>
