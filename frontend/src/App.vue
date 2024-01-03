<template>
  <div class="container">
    <ul class="nav">
      <li ><a @click="setActivePage('home')"  :class="{ active: activePage === 'home' }" href="#home">Home</a></li>
      <li ><a @click="setActivePage('bill')" :class="{ active: activePage === 'bill' }" href="#bill">Bill</a></li>
    </ul>


    <div class="form-wrapper">
      <form class="form">
        <label for="bno">Bill Number</label>
        <input type="text" id="bno" name="BillNumber" placeholder="Enter the bill number here" required>


        <label for="Bill_To">Bill To</label>
        <select id="Bill_To" name="Bill_To" v-model="selectedPartyGST">
          <option value="">Select Party...</option>
          <option v-for="party in parties" :value="party.GST">{{ party.Name }}</option>
        </select>


        <label for="date">Date of Bill</label>
        <input type="date" id="date">


        <div class="container_bill_details py-4">
          <h2 class="text-center mb-4">Bill Details</h2>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>

                  <th class="text-end">
                    <button class="btn btn-primary" @click.prevent="addRow">
                      <i class="bi bi-plus-lg"></i> Add Row
                    </button>
                  </th>
                  <th >Particulars</th>
                  <th>HSN Code</th>
                  <th>Quantity</th>
                  <th>QOM</th>
                  <th>Price</th>
                  <th>Taxable Amount</th>
                  <th>SGST</th>
                  <th>SGST Amount</th>
                  <th>CGST</th>
                  <th>CGST Amount</th>
                  <th>Total Tax</th>
                  <th>Total</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in rows" :key="index">

                  <td class="border text-end">
                    <button class="btn btn-danger" @click.prevent="deleteRow(index)">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </td>
                  <td class="border">
                    <input v-model="row.particulars" class="form-control" />
                  </td>

                  <td class="border">
                    <select v-model="row.hsn" class="form-control" name="HSN" id="HSN" style="width:70px">
                        <option v-for="option in hsnOptions" :value="option.value">{{ option.label }}</option>
                    </select>
                  </td>

                  <td class="border">
                    <input v-model.number="row.quantity" class="form-control" />
                  </td>
                  <td class="border">   
                    <select v-model="row.qom" class="form-control" name="QOM" id="QOM" style="width:70px">
                        <option v-for="option in qomOptions" :value="option.value">{{ option.label }}</option>
                    </select>
                  </td>
                  <td class="border">
                    <div class="input-group">
                      <input v-model.number="row.price" class="form-control" />
                    </div>
                  </td>

                   <td class="border">
                    <span class="fw-bold">
                      {{ row.taxableAmount | currency }}
                    </span>
                   </td>

                  <td class="border">
                    <select v-model.number="row.sgst" class="form-control" name="SGST" id="SGST" style="width:70px">
                        <option v-for="option in sgstOptions" :value="option.value">{{ option.label }}</option>
                    </select>
                  </td>

                  <td class="border">
                    <span class="fw-bold">
                      {{ row.sgstAmount | currency }}
                    </span>
                  </td>

                  <td class="border">
                    <select v-model.number="row.cgst" class="form-control" name="CGST" id="CGST" style="width:70px">
                        <option v-for="option in cgstOptions" :value="option.value">{{ option.label }}</option>
                    </select>
                  </td>

                  <td class="border">
                    <span class="fw-bold">
                      {{ row.cgstAmount | currency }}
                    </span>
                  </td>

                  <td class="border">
                    <span class="fw-bold">
                      {{ row.totalTax | currency }}
                    </span>
                  </td>

                  <td class="border">
                    <span class="fw-bold">
                      {{ row.total| currency }}
                    </span>
                  </td>

                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="12" class="text-end">
                    <span class="fw-bold">Grand Total:</span>
                  </td>
                  <td class="fw-bold">
                    {{ grandTotal | currency }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>


      <div style="display: flex; justify-content: center;">
        <button id="submit-button" type="button" @click=displayForm><b> Generate</b></button>
      </div>
      </form>
    </div>
  </div>
</template>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Arial, sans-serif;
    font-size: 16px;
  }

  .container {
    width: 100%;
    max-width: 50%;
    margin: 0 auto;
    padding-top: 5%;
    padding-bottom: 10%;
  }
  .container_bill_details{
    width:100%;
    max-width: 100%;
    align-items: center;
    overflow-x: auto;

  }
  .nav {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 10px;
  }

  .nav li {
    margin: 0 10px;
  }

  .nav a {
    text-decoration: none;
    color: #333;
    padding: 5px;
    border-radius: 5px;
  }
  .nav a.active {
    background-color: #333;
    color: #FFF;
  }

  .form-wrapper {
    background-color: #FFF;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .form input,
  .form select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #CCC;
    margin-bottom: 20px;
  }

  .form input:focus,
  .form select:focus {
    outline: none;
  }

  #submit-button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  #submit-button:hover {
    background-color: #3e8e41;
  }

  th, td {
    vertical-align: middle;
  }
  .table thead th {
    font-weight: 500;
  }
  .table tbody tr:hover {
    background-color: #f5f5f5;
  }
  .input-group-text {
    background-color: #fff;
    border-color: #ced4da;
  }
  .btn {
    border-radius: 0;
  }

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding:8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}

tfoot td {
  background-color: #f2f2f2;
}
</style>




<script>
  export default {
      data(){
        return {
            name:'GuruKripaEnterprises',
            selectedPartyGST: '',
            parties: [],
            qomOptions: [
                    { label: 'PCS', value: 'PCS' },
                    { label: 'SET', value: 'SET' },
                    { label: 'MTR', value: 'MTR' },
                  ],

            hsnOptions: [
                    { label: '6307', value: '6307' },
                    { label: '8714', value: '8714' },
                    { label: '3926', value: '3926' },
                  ],

            sgstOptions: [
                    { label: '2.5', value: 2.5 },
                    { label: '6', value: 6 },
                    { label: '9', value: 9 },
                    { label: '12', value: 12 },
                    { label: '14', value: 14 },
                    { label: '18', value: 18 },
                  ],
            cgstOptions: [
                    { label: '2.5', value: 2.5 },
                    { label: '6', value: 6 },
                    { label: '9', value: 9 },
                    { label: '12', value: 12 },
                    { label: '14', value: 14 },
                    { label: '18', value: 18 },
                  ],
            rows: [
                    { particulars: "", hsn:"", quantity: "", qom: "", price: "", sgst: "",  cgst: "" },
            ],
            activePage: 'home',
            billNumber: '',
            billTo: '',
            date: '',
            items: [
              {
                description: '',
                quantity: '',
                rate: '',
              },
            ],
        }
      },
      created(){
        this.fetchParties();
      },
      computed: {
          grandTotal() {
            return this.rows.reduce((total, row) => {
              return total + row.total;
            }, 0);
          },
        },
        filters: {
          currency(value) {
            return `$${value.toFixed(2)}`;
          },
        },
        watch: {
          rows: {
            deep: true,
            handler() {
              this.rows.forEach((row) => {
                row.taxableAmount = row.price * row.quantity;
                if(row.sgst === ""){
                  row.sgstAmount = 0;
                }
                else{
                  row.sgstAmount = (row.sgst * row.taxableAmount)/100;
                }
                if(row.cgst === ""){
                  row.cgstAmount = 0;
                }
                else{
                  row.cgstAmount = (row.cgst * row.taxableAmount)/100;
                }   
                row.totalTax = row.cgstAmount + row.sgstAmount;
                row.total = row.totalTax + row.taxableAmount
              });
            },
          },
        },
    methods: {

      fetchParties() {
      // Make your API call here to fetch the parties data
      // Replace the API_URL with your actual API endpoint
        fetch('http://127.0.0.1:3000/admin/party/all',{
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
          // Update the parties array with the data from the API response
          
          this.parties = data;
          console.log(this.parties)
        })
        .catch(error => {
          console.error('Error fetching parties:', error);
        });
    },
      addRow() {
        this.rows.push({ particulars: "", quantity: "", qom: "", price: "", sgst: "", cgst: "" });
      },
      deleteRow(index) {
        this.rows.splice(index, 1);
      },
      addItem() {
        this.items.push({
          description: '',
          quantity: '',
          rate: '',
        });
      },
      removeItem(index) {
        this.items.splice(index, 1);
      },
      getTotal() {
        let total = 0;
        this.items.forEach((item) => {
          total += item.quantity * item.rate;
        });
        return total;
      },
        setActivePage(page) {
            this.activePage = page;
        },
        displayForm(){
            const bill_number = document.getElementById('bno').value;
            const hsn = document.getElementById('HSN').value;
            const date = document.getElementById('date').value;
            const gst  = this.selectedPartyGST;
            const query = {billNumber:bill_number, hsn:hsn, gstNo:gst, date:date}
            console.log(query)
            this.registerBill(query)
        },
        convertToProductSchema(){
            
            let products = [];
            this.rows.forEach((row) => {
                var product = []
                const productDict = {prodName: row.particulars, uoc:row.qom, price:row.price, quantity:row.quantity, hsn:row.hsn, cgst:row.cgstAmount, sgst:row.sgstAmount}
                product.push(productDict)
                products.push(product)
            })
            return products
        },

        async downloadBill(bill_number){
          fetch('http://127.0.0.1:3000/admin/bill/generate_bill?' + new URLSearchParams({billNumber:bill_number}),{
                            method:'GET',
          }).then(response => response.blob()).then(blob => {
        // Create a temporary link element to download the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'bill.pdf');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error:', error);
      });

        },
        async registerBill(query){

              const duplicate = await fetch('http://127.0.0.1:3000/admin/bill/check_duplicate?' + new URLSearchParams({billNumber:query.billNumber}), {
                    method: 'GET',
                })

              const exists = await duplicate.json()
              if(exists.exists){
                return alert('Duplicate Bill Exists!')  
              }
              else{
                const response = await fetch('http://127.0.0.1:3000/admin/bill/create?' + new URLSearchParams(query),{
                  method:'POST',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ products: this.convertToProductSchema()})
                })
                await this.downloadBill(query.billNumber);  
              }
            
            // catch(error){ 
            //     alert('Oops! Error Caused')
            // }
  
        },


   

    }
  }

</script>


